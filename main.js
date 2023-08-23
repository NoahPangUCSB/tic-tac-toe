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

    return {displayBoard};
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