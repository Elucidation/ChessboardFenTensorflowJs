# Tensorflow Chessboard Prediction from Screenshots in HTML5

Given a screenshot which has an online chessboard in it somewhere, it finds the chessboard and predicts the layout of the pieces on it. 

This uses a frozen model generated from [tensorflow_chessbot](https://github.com/Elucidation/tensorflow_chessbot/tree/chessfenbot). Unlike that repo this runs completely online and client-side.

There are two parts:

1. Finds and separates out the chessboard into a 256x256 px image containing the 32x32 tiles of the chessboard. (TODO)

2. Given 256x256px aligned chessboard image, run TensorflowJs model to predict pieces on it.


## Running locally

A web server of some sort is needed to allow cross-origin sharing when running locally.

For example, one can use `http-server`.

```
http-server -o --cors -c-1 -a localhost
```