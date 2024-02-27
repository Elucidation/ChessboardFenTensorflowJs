# TensorflowJs Chessboard Prediction from Screenshots in HTML5

Given a screenshot of a chessboard from lichess.org/chess.com, it tries to find the chessboard and pieces on it, [*Try it yourself*](http://elucidation.github.io/ChessboardFenTensorflowJs/).

![image](https://github.com/Elucidation/ChessboardFenTensorflowJs/assets/434925/1d348bb4-c915-413c-a3e2-cc07c70e7192)

## How it works

This uses a frozen [Tensorflow Chessbot](https://github.com/Elucidation/tensorflow_chessbot/tree/chessfenbot) model. Unlike that repo this runs completely in javascript using [TensorflowJs](https://js.tensorflow.org/), all client-side. 

### Board detection

Finds and separates out the chessboard into a 256x256 px image containing the 32x32 tiles of the chessboard.
A very simplified chessboard detector is implemented. It requires the board to mostly fill up the image, be very well aligned and centered. In comparison chessfenbot can find aligned chessboards all around the image. [Issue #2](https://github.com/Elucidation/ChessboardScreenshotHtml5/issues/2)

The image is blurred and then the sobel gradients X and Y are used to find strong vertical and horizontal edges in the image corresponding to the chessboard. This is used to guess the bounds of the chessboard, and then generate a 256x256 px grayscale image as input for the tensorflow model.

<img src="readme_gradient_find.png" width=300px>

### ML Prediction

Given 256x256px aligned chessboard image, it runs a TensorflowJs model to predict pieces on it.

The model was trained using 32x32 px grayscale tiles of chessboard pieces. For each tile it independently predicts one of 13 classes, 6 white pieces, 6 black pieces, or an empty tile.

We freeze the model graph and weights from [Tensorflow Chessbot](https://github.com/Elucidation/tensorflow_chessbot/tree/chessfenbot), and load it up in Javascript using TensorflowJs, allowing everything to run without a server.

![image](https://github.com/Elucidation/ChessboardFenTensorflowJs/assets/434925/24e1c90b-1f94-4f60-8dcf-bb7f8065b4b3)



## Running locally

A web server of some sort is needed to allow cross-origin sharing when running locally.

For example, one can use 

```python -m http.server```

or

```
http-server -o --cors -c-1 -a localhost
```

