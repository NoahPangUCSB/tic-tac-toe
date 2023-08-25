const BOARD_SIZE = 3;

const displayController = (() => {
  const _createGrid = (() => {
    const gameboard = document.querySelector(".gameboard");
    for (let i = 0; i < BOARD_SIZE ** 2; i++) {
      const gbSquare = document.createElement("div");
      gbSquare.classList.add("gameboard-square");

      gameboard.appendChild(gbSquare);
    }
  })();

  const displayPlayerName = (playerDiv, playerName, formInput) => {
    formInput.style.display = "none";
    const playerNameDiv = document.createElement("div");
    playerNameDiv.classList.add("player-name");
    playerNameDiv.textContent = playerName;
    playerDiv.appendChild(playerNameDiv);
  };

  const displayCurrPlayer = (currPlayer, player1) => {
    const player1Div = document.querySelector(".player1-div");
    const player2Div = document.querySelector(".player2-div");
    if (currPlayer === player1) {
      player1Div.classList.remove("curr-player");
      player2Div.classList.add("curr-player");
    } else {
      player2Div.classList.remove("curr-player");
      player1Div.classList.add("curr-player");
    }
  };

  const displayBoard = () => {
    const board_display = document.querySelector(".gameboard");
    const board_squares = board_display.children;
    const board = Gameboard.getBoard();
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[0].length; col++) {
        const nthChild = row * BOARD_SIZE + col;
        const thisSquare = board_squares.item(nthChild);
        if (board[row][col] === null || thisSquare.children.length !== 0) {
          continue;
        }
        const player = board[row][col];
        const type = player.getType();

        const fillElem = document.createElement("div");
        if (type.toLowerCase() === "x") {
          fillElem.classList.add("x");
        } else {
          fillElem.classList.add("o");
        }

        thisSquare.appendChild(fillElem);
      }
    }
  };

  const displayWinner = (winner, player1, player2) => {
    const playersDiv = document.querySelector(".player-names");
    const player1Div = document.querySelector(".player1-div");
    const player2Div = document.querySelector(".player2-div");
    const endGameDiv = document.createElement("div");
    endGameDiv.classList.add("end-game-msg");
    const player1WinMsg = `${player1.getName()} (Player 1 (X)) wins!`
    const player2WinMsg = `${player2.getName()} (Player 2 (O)) wins!`
    const tieMsg = `It's a tie!`
    player1Div.classList.remove("curr-player");
    player2Div.classList.remove("curr-player");

    if(winner === player1) {
        player1Div.classList.add("winner");
        endGameDiv.textContent = player1WinMsg;
    } else if(winner === player2) {
        player2Div.classList.add("winner");
        endGameDiv.textContent = player2WinMsg;
    } else {
        endGameDiv.textContent = tieMsg;
    }   
    playersDiv.appendChild(endGameDiv);
  }

  return { displayBoard, displayPlayerName, displayCurrPlayer, displayWinner };
})();

const Game = (() => {
  let _player1 = null;
  let _player2 = null;
  let _currPlayer = null;
  let _winner = null;

  const getPlayer1 = () => _player1;
  const getPlayer2 = () => _player2;

  const _setCurrPlayer = () => {
    displayController.displayCurrPlayer(_currPlayer, _player1);
    _currPlayer = _currPlayer === _player1 ? _player2 : _player1;
  };

  const _submitPlayerName = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.srcElement.blur();
      const playerName = e.srcElement.value;
      const playerDiv = e.srcElement.parentNode.parentNode;
      if (playerDiv.className === "player1-div") {
        _player1 = Player(playerName, "x");
      } else {
        _player2 = Player(playerName, "o");
      }

      displayController.displayPlayerName(playerDiv, playerName, e.srcElement);

      if (_player1 !== null && _player2 !== null) {
        _setCurrPlayer();

        const boardSquares = document.querySelectorAll(".gameboard-square");
        boardSquares.forEach((element) => {
          element.addEventListener("click", _placeTile);
        });
      }
      
    }
  };

  const _determineWinner = () => {
    let allFilled = true;
    const gameboard = Gameboard.getBoard();

    // Check rows
    for(let row = 0; row < BOARD_SIZE; row++) {
        let haveWinner = true;
        for(let col = 1; col < BOARD_SIZE; col++) {
            if(gameboard[row][col-1] !== gameboard[row][col]) {
                haveWinner = false;
            }
            if(gameboard[row][col] === null || gameboard[row][col-1] === null) {
                allFilled = false;
            }
        }
        if(haveWinner) {
            return gameboard[row][0];
        }
    }

    // Check cols
    for(let col = 0; col < BOARD_SIZE; col++) {
        let haveWinner = true;
        for(let row = 1; row < BOARD_SIZE; row++) {
            if(gameboard[row-1][col] !== gameboard[row][col]) {
                haveWinner = false;
                break;
            }
        }
        if(haveWinner) {
            return gameboard[0][col];
        }
    }

    // Check diagonals
    let haveWinner = true;
    for(let row = 1; row < BOARD_SIZE; row++) {
        if(gameboard[row-1][row-1] !== gameboard[row][row]) {
            haveWinner = false;
            break
        }
    }
    if(haveWinner) {
        return gameboard[0][0];
    }
    haveWinner = true;
    for(let row = 1; row < BOARD_SIZE; row++) {
        if(gameboard[row-1][BOARD_SIZE-row] !== gameboard[row][BOARD_SIZE-row-1]) {
            haveWinner = false;
        }
    }
    if(haveWinner) {
        return gameboard[0][BOARD_SIZE-1];
    }

    if(allFilled) {
        return Player("allFilled", "xo");
    }

    return null;
  }

  const _placeTile = (e) => {
    if(_winner) {
        return false;
    }

    const thisSquare = e.srcElement;
    const squareIndex = [...thisSquare.parentElement.children].indexOf(
      thisSquare
    );
    const row = Math.floor(squareIndex / BOARD_SIZE);
    const col = squareIndex % BOARD_SIZE;
    _currPlayer.playMove(Gameboard, row, col, _currPlayer);

    _setCurrPlayer();
    _winner = _determineWinner();
    if(_winner !== null) {
        displayController.displayWinner(_winner, _player1, _player2);
    } 

    return true;
  };

  const _player1Form = document.getElementById("player1-name");
  const _player2Form = document.getElementById("player2-name");
  _player1Form.addEventListener("keypress", _submitPlayerName);
  _player2Form.addEventListener("keypress", _submitPlayerName);

  return { getPlayer1, getPlayer2 };
})();

const Gameboard = (() => {
  const _board = [];
  const _setBoard = (() => {
    for (let i = 0; i < BOARD_SIZE; i++) {
      _board.push([]);
      for (let j = 0; j < BOARD_SIZE; j++) {
        _board[i].push(null);
      }
    }
  })();

  const resetBoard = () => {
    _board.length = 0;
    _setBoard();
  };

  const placeTile = (row, col, player) => {
    if (_board[row][col] !== null) {
      return false;
    }
    _board[row][col] = player;
    displayController.displayBoard();
    return true;
  };

  const getBoard = () => _board;

  return { getBoard, placeTile, resetBoard };
})();

const Player = (name, type) => {
  const getName = () => name;
  const getType = () => type;

  const playMove = (board, row, col, player) => {
    return board.placeTile(row, col, player);
  };

  return { getName, getType, playMove };
};
