const BOARD_SIZE = 3;

const displayController = (() => {
    
    const _createGrid = (() => {
        const gameboard = document.querySelector(".gameboard");
        for(let i = 0; i < BOARD_SIZE**2; i++) {
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
    }

    const displayCurrPlayer = (currPlayer, player1) => {
        const player1Div = document.querySelector(".player1-div");
        const player2Div = document.querySelector(".player2-div");
        if(currPlayer === player1) {
            player1Div.classList.remove("curr-player");
            player2Div.classList.add("curr-player");
        } else {
            player2Div.classList.remove("curr-player");
            player1Div.classList.add("curr-player");
        }
    }
    

    const displayBoard = () => {
        const board_display = document.querySelector(".gameboard");
        const board_squares = board_display.children;
        const board = Gameboard.getBoard();
        for(let row = 0; row < board.length; row++) {
            for(let col = 0; col < board[0].length; col++) {
                const nthChild = (row)*BOARD_SIZE + col;
                const thisSquare = board_squares.item(nthChild);
                if(board[row][col] === null || thisSquare.children.length !== 0) {
                    continue;
                }
                const player = board[row][col];
                const type = player.getType();

                const fillElem = document.createElement("div");
                if(type.toLowerCase() === "x") {
                    fillElem.classList.add("x");
                } else {
                    fillElem.classList.add("o");
                }
                
                thisSquare.appendChild(fillElem);
            }
        }
    }

    return {displayBoard, displayPlayerName, displayCurrPlayer};
})();

const Game = (() => {
    let _player1 = null;
    let _player2 = null;
    let _currPlayer = null;

    const getPlayer1 = () => _player1;
    const getPlayer2 = () => _player2;

    const _setCurrPlayer = () => {
        displayController.displayCurrPlayer(_currPlayer, _player1);
        _currPlayer === _player1 ? _player2 : _player1;
    }

    const _submitPlayerName = (e) => {
        if(e.key === "Enter") {
            e.preventDefault();
            e.srcElement.blur();
            const playerName = e.srcElement.value;
            const playerDiv = e.srcElement.parentNode.parentNode;
            if(playerDiv.className === "player1-div") {
                _player1 = Player(playerName, "x");
            } else {
                _player2 = Player(playerName, "o");
            }

            displayController.displayPlayerName(playerDiv, playerName, e.srcElement);

            if(_player1 !== null && _player2 !== null) {
                _setCurrPlayer();
            }
        }
    }

    const _player1Form = document.getElementById("player1-name");
    const _player2Form = document.getElementById("player2-name");
    _player1Form.addEventListener("keypress", _submitPlayerName);
    _player2Form.addEventListener("keypress", _submitPlayerName);

    return {getPlayer1, getPlayer2}
})();


const Gameboard = (() => {
    const _board = [];
    const _setBoard = (() => {
        for(let i = 0; i < BOARD_SIZE; i++) {
            _board.push([]);
            for(let j = 0; j < BOARD_SIZE; j++) {
                _board[i].push(null);
            }
        }
    })();
    
    const resetBoard = () => {
        _board.length = 0;
        _setBoard();
    };

    const placeTile = (row, col, player) => {
        if(_board[row][col] !== null) {
            return false;
        }
        _board[row][col] = player;
        displayController.displayBoard();
        return true;
    };

    const getBoard = () => _board;

    return {getBoard, placeTile, resetBoard};
})();

const Player = (name, type) => {
    const getName = () => name;
    const getType = () => type;

    const playMove = (board, row, col, player) => {
        return board.placeTile(row, col, player);
    };

    return {getName, getType, playMove}
};