// Contains functions to find centered + aligned chessboards in uploaded images.
function findMax(arr, a, b) {
  // Assumes arr contains positives values.
  var maxVal = -1;
  var maxIdx = 0;
  for (var i = a; i < b; i++) {
    if (arr[i] > maxVal) {
      maxVal = arr[i];
      maxIdx = i;
    }
  }
  return {max: maxVal, idx: maxIdx};
}

// Sum up all the sobelX along rows and sobelY along colummns into 1D vectors.
function squashSobels(pixels) {
  var w = pixels.width;
  var h = pixels.height;
  var d = pixels.data;
  scoreX = new Int32Array(w);
  scoreY = new Int32Array(h);
  buffer = 0; // only use central bit of image
  for (var y=buffer; y<h-buffer; y++) {
    for (var x=buffer; x<w-buffer; x++) {
      var off = (y*w+x)*4;
      scoreX[x] += d[off];
      scoreY[y] += d[off+1]
    }
  }
  return {x:scoreX, y:scoreY}
}

function findLines(squashed) {
  sX = squashed.x; // vertical lines, along x axis, squashed sum.
  sY = squashed.y; // horizontal lines, along y axis.
  // TODO.
}


// Global ids used: uploadedImage, resultCanvas, sobelCanvas
function processLoadedImage(img) {
  console.log("Processing image...");
  var uploadedImageElement = document.getElementById("uploadedImage"); // NOTE - global id used here.
  var resultCanvasElement = document.getElementById("resultCanvas"); // NOTE - global id used here.
  var sobelCanvas = document.getElementById('sobelCanvas'); // NOTE - global id used here.
  var ctx = sobelCanvas.getContext('2d');

  // Resize the image
  var internalCanvas = document.createElement('canvas');
  var width = 512;
  var height = Math.floor((img.height * width) / img.width);
  var scale_factor = img.width / width;
  internalCanvas.width = width;
  internalCanvas.height = height; // purposefully want a square
  internalCanvas.getContext('2d').drawImage(img, 0, 0, width, height);
  uploadedImageElement.width = width;
  uploadedImageElement.height = height;
  uploadedImageElement.getContext('2d').drawImage(img,0,0, width, height);


  // Blur image, then run sobel filters on it.
  // var box_filter_1d = Filters.getFloat32Array([1/5.,1/5.,1/5.,1/5.,1/5.]);
  // var d = Filters.separableConvolve(Filters.getPixels(internalCanvas), box_filter_1d, box_filter_1d, false);
  var d = Filters.filterImage(Filters.gaussianBlur, internalCanvas, 25); // gaussian
  d = Filters.sobel(d);

  // Visualize sobel image.
  sobelCanvas.width = d.width;
  sobelCanvas.height = d.height;
  // sobelCanvas.getContext('2d').putImageData(d, 0, 0); // Overlay gradient image
  sobelCanvas.getContext('2d').drawImage(img,0,0, width, height); // Overlay original img

  // Get squashed X and Y sobels (by summing along columns and rows respectively).
  squashed = squashSobels(d);
  // Since our image width is forced to 512px, we assume a chessboard is at least half of the image, up to exactly the image
  // This comes out to 32-64 pixels per tile, so we only look for deltas between lines in the range 31-65 pixels.

  // We will non-max supress everything more than 20 pixels away from the strongest lines.

  // Since we also assume that the user has kept the chessboard centered in the image, we can start by looking for the strongest
  // line crossing in the center area, and try and grow out from there.
  var winsize = 30;
  // Find max in center X.
  var ctrX = findMax(squashed.x, Math.floor(width/2)-winsize, Math.floor(width/2)+winsize);
  // Find next max to the right.
  var rightX = findMax(squashed.x, ctrX.idx+31, ctrX.idx+65);

  // Find max in center Y.
  var ctrY = findMax(squashed.y, Math.floor(height/2)-winsize, Math.floor(height/2)+winsize);
  // Find next max to the bottom.
  var botY = findMax(squashed.y, ctrY.idx+31, ctrY.idx+65);

  var deltaX = rightX.idx - ctrX.idx;
  var deltaY = botY.idx - ctrY.idx;

  // Assumes ctrX.idx is the center, there are 4 to the left and 4 to the right.
  positionsX = Array(9).fill(0).map((e,i)=>(i-4) * deltaX + ctrX.idx);
  positionsY = Array(9).fill(0).map((e,i)=>(i-4) * deltaY + ctrY.idx);


  // Overlay lines onto sobel image.
  ctx.beginPath();
  // X
  for (var i = 0; i < positionsX.length; i++) {
    ctx.moveTo(positionsX[i], positionsY[0]);
    ctx.lineTo(positionsX[i], positionsY[positionsY.length-1]);
  }
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#ff0000';
  ctx.stroke();
  ctx.closePath()

  // Y
  ctx.beginPath();
  for (var i = 0; i < positionsY.length; i++) {
    ctx.moveTo(positionsX[0],positionsY[i]);
    ctx.lineTo(positionsX[positionsX.length-1],positionsY[i]);
  }
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#00ff00';
  ctx.stroke();

  bbox = {
    tl: {x: positionsX[0], y: positionsY[0]},
    tr: {x: positionsX[positionsX.length-1], y: positionsY[0]},
    br: {x: positionsX[positionsX.length-1], y: positionsY[positionsY.length-1]},
    bl: {x: positionsX[0], y: positionsY[positionsY.length-1]}
  };

  // Border
  ctx.beginPath();
  ctx.moveTo(bbox.tl.x, bbox.tl.y);
  ctx.lineTo(bbox.tr.x, bbox.tr.y);
  ctx.lineTo(bbox.br.x, bbox.br.y);
  ctx.lineTo(bbox.bl.x, bbox.bl.y);
  ctx.lineTo(bbox.tl.x, bbox.tl.y);
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#ffff00';
  ctx.stroke();

  // Build bounded and aligned grayscale 256x256 px chessboard to result canvas for prediction.
  resultCanvasElement.width = 256;
  resultCanvasElement.height = 256;
  resultCanvasElement.getContext('2d').imageSmoothingQuality="high";

  // Get cropped grayscale of original image as a 256x256px image of just the chessboard.
  var bbox_width = bbox.tr.x - bbox.tl.x;
  var bbox_height = bbox.bl.y - bbox.tl.y;
  resultCanvasElement.getContext('2d').drawImage(
    img, 
    bbox.tl.x * scale_factor, bbox.tl.y * scale_factor,
    bbox_width * scale_factor, bbox_height * scale_factor,
    0, 0, 256, 256);
}