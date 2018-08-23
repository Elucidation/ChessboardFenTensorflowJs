# TensorflowJs Chessboard Prediction from Screenshots in HTML5

Given a screenshot which has an online chessboard in it somewhere, it finds the chessboard and predicts the layout of the pieces on it. Everything runs client-side live using [TensorflowJs](https://js.tensorflow.org/)

<img src="readme_input.png" width=300px> <img src="readme_prediction.png" width=300px>

## [Live Demo](http://tetration.xyz/ChessboardFenTensorflowJs/)

## How it works

This uses a frozen [Tensorflow Chessbot](https://github.com/Elucidation/tensorflow_chessbot/tree/chessfenbot) model. Unlike that repo this runs completely in javascript using TensorflowJs, all client-side.

There are two parts:

1. Finds and separates out the chessboard into a 256x256 px image containing the 32x32 tiles of the chessboard.
A very simplified chessboard detector is implemented. It requires the board to mostly fill up the image, be very well aligned and centered. In comparison chessfenbot can find aligned chessboards all around the image. [Issue #2](https://github.com/Elucidation/ChessboardScreenshotHtml5/issues/2)

The image is blurred and then the sobel gradients X and Y are used to find strong vertical and horizontal edges in the image corresponding to the chessboard. This is used to guess the bounds of the chessboard, and then generate a 256x256 px grayscale image as input for the tensorflow model.

<img src="readme_gradient_find.png" width=300px>

2. Given 256x256px aligned chessboard image, run TensorflowJs model to predict pieces on it.
We freeze a model graph and weights from [Tensorflow Chessbot](https://github.com/Elucidation/tensorflow_chessbot/tree/chessfenbot), and load it up in Javascript using [TensorflowJs](https://js.tensorflow.org/), allowing everything to run locally client-side.

<img src="readme_cropped_input.png" width=300px> <img src="readme_prediction.png" width=300px>

## Running locally

A web server of some sort is needed to allow cross-origin sharing when running locally.

For example, one can use `http-server`.

```
http-server -o --cors -c-1 -a localhost
```
