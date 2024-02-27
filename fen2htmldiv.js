// Function to parse a FEN string to a table of chess piece chars
function parseFEN(fen) {
  const board = [];
  const pieces = {
    P: "♙",
    R: "♖",
    N: "♘",
    B: "♗",
    Q: "♕",
    K: "♔",
    p: "♟︎",
    r: "♜",
    n: "♞",
    b: "♝",
    q: "♛",
    k: "♚",
    " ": " ",
  };

  let row = 0;
  let col = 0;
  const rows = fen.split("/");

  for (const rowStr of rows) {
    board.push([]); // Create a new row
    for (const char of rowStr) {
      if (char in pieces) {
        board[row][col] = pieces[char];
        col++;
      } else if (!isNaN(char)) {
        col += parseInt(char); // Add empty spaces integer indicators
      }
    }
    row++;
    col = 0;
  }

  return board;
}

// Create a new chessboard div element
function generateNewChessboard(
  fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
) {
  // Initialize board from FEN
  const board = parseFEN(fen);

  const boardContainer = document.createElement("div");
  boardContainer.id = "chessboard";

  // Create the board elements
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement("div");
      square.classList.add("square");

      // Alternate background colors
      if ((row + col) % 2 === 0) {
        square.classList.add("light-square");
      } else {
        square.classList.add("dark-square");
      }

      // Add the chess piece emoji
      square.textContent = board[row][col];

      boardContainer.appendChild(square);
    }
  }

  return boardContainer;
}

// Function to rebuild (create or replace) the chessboard
function rebuildChessboardDiv(
  chessboardContainer,
  fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
) {
  // Rebuild the chessboard
  const newChessboard = generateNewChessboard(fen);
  chessboardContainer.parentNode.replaceChild(
    newChessboard,
    chessboardContainer
  );
}
