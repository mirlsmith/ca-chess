'use strict'

// Pieces Types
const PAWN_BLACK = '♟'
const ROOK_BLACK = '♜'
const KNIGHT_BLACK = '♞'
const BISHOP_BLACK = '♝'
const QUEEN_BLACK = '♛'
const KING_BLACK = '♚'
const PAWN_WHITE = '♙'
const ROOK_WHITE = '♖'
const KNIGHT_WHITE = '♘'
const BISHOP_WHITE = '♗'
const QUEEN_WHITE = '♕'
const KING_WHITE = '♔'

// The Chess Board
var gBoard
var gSelectedElCell = null

function onRestartGame() {
    gBoard = buildBoard()
    renderBoard(gBoard)
}

function buildBoard() {
    // build the board 8 * 8
    var board = []
    for (var i = 0; i < 8; i++) {
        board[i] = []
        for (var j = 0; j < 8; j++) {
            board[i][j] = ''
            if (i === 1) board[i][j] = PAWN_BLACK
            else if (i === 6) board[i][j] = PAWN_WHITE
        }
    }

    board[0][0] = board[0][7] = ROOK_BLACK
    board[0][1] = board[0][6] = KNIGHT_BLACK
    board[0][2] = board[0][5] = BISHOP_BLACK
    board[0][3] = QUEEN_BLACK
    board[0][4] = KING_BLACK

    board[7][0] = board[7][7] = ROOK_WHITE
    board[7][1] = board[7][6] = KNIGHT_WHITE
    board[7][2] = board[7][5] = BISHOP_WHITE
    board[7][3] = QUEEN_WHITE
    board[7][4] = KING_WHITE

    // console.table(board)
    console.log(board)
    return board

}

function renderBoard(board) {
    var strHtml = ''
    for (var i = 0; i < board.length; i++) {
        var row = board[i]
        strHtml += '<tr>'
        for (var j = 0; j < row.length; j++) {
            var cell = row[j]
            // figure class name
            var className = ((i + j) % 2 === 0) ? 'white' : 'black'
            var tdId = `cell-${i}-${j}`
            strHtml += `<td id="${tdId}" onclick="cellClicked(this)"
            class="${className}">${cell}</td>`
        }
        strHtml += '</tr>'
    }
    var elMat = document.querySelector('.game-board')
    elMat.innerHTML = strHtml
}

function cellClicked(elCell) {

    // if the target is marked - move the piece!
    if (elCell.classList.contains('mark')) {
        movePiece(gSelectedElCell, elCell)
        cleanBoard()
        return
    }

    cleanBoard()

    elCell.classList.add('selected')
    gSelectedElCell = elCell

    // console.log('elCell.id: ', elCell.id)
    var cellCoord = getCellCoord(elCell.id)
    // console.log('cellCoord', cellCoord)
    var piece = gBoard[cellCoord.i][cellCoord.j]
    // console.log('piece', piece)

    var possibleCoords = []
    switch (piece) {
        case ROOK_BLACK:
        case ROOK_WHITE:
            possibleCoords = getAllPossibleCoordsRook(cellCoord)
            break
        case BISHOP_BLACK:
        case BISHOP_WHITE:
            possibleCoords = getAllPossibleCoordsBishop(cellCoord)
            break
        case KNIGHT_BLACK:
        case KNIGHT_WHITE:
            possibleCoords = getAllPossibleCoordsKnight(cellCoord)
            break
        case KING_BLACK:
        case KING_WHITE:
            possibleCoords = getAllPossibleCoordsKing(cellCoord)
            break
        case QUEEN_BLACK:
        case QUEEN_WHITE:
            possibleCoords = getAllPossibleCoordsQueen(cellCoord)
            break
        case PAWN_BLACK:
        case PAWN_WHITE:
            possibleCoords = getAllPossibleCoordsPawn(cellCoord, piece === PAWN_WHITE)
            break

    }
    markCells(possibleCoords)
}

function movePiece(elFromCell, elToCell) {
    // console.log('elFromCell', elFromCell)
    // console.log('elToCell', elToCell)
    // use: getCellCoord to get the coords, move the piece
    var fromCoord = getCellCoord(elFromCell.id)
    var toCoord = getCellCoord(elToCell.id)
    // console.log('fromCoord', fromCoord)
    // console.log('toCoord', toCoord)
    // update the MODEl
    var piece = gBoard[fromCoord.i][fromCoord.j]
    gBoard[toCoord.i][toCoord.j] = piece
    gBoard[fromCoord.i][fromCoord.j] = ''

    // update the DOM
    elToCell.innerText = piece
    elFromCell.innerText = ''
}

function markCells(coords) {
    // console.log('coords', coords)
    // query select them one by one and add mark 
    for (var i = 0; i < coords.length; i++) {
        var coord = coords[i] // {i: 5, j: 2}
        // console.log('coord', coord)
        var selector = getSelector(coord) // #cell-5-2
        // console.log('selector', selector)
        var elCell = document.querySelector(selector)
        // console.log('elCell', elCell)
        elCell.classList.add('mark')
    }
}

// Gets a string such as: 'cell-2-7' and returns {i:2, j:7}
function getCellCoord(strCellId) {
    var coord = {}
    var parts = strCellId.split('-') // ['cell' , '2' , '7']
    coord.i = +parts[1] // 2
    coord.j = +parts[2] // 7
    return coord // {i:2, j:7}
}

function cleanBoard() {
    var elTds = document.querySelectorAll('.mark, .selected')
    for (var i = 0; i < elTds.length; i++) {
        elTds[i].classList.remove('mark', 'selected')
    }
}

function getSelector(coord) {
    return `#cell-${coord.i}-${coord.j}`
}

function isEmptyCell(coord) {
    return !gBoard[coord.i][coord.j]
}

function getAllPossibleCoordsPawn(pieceCoord, isWhite) {
    // console.log('pieceCoord', pieceCoord)
    // console.log('isWhite', isWhite)
    var res = []
    // handle PAWN find the nextCoord use isEmptyCell()
    var diff = isWhite ? -1 : 1
    var nextCoord = { i: pieceCoord.i + diff, j: pieceCoord.j }
    // console.log('nextCoord', nextCoord)
    if (isEmptyCell(nextCoord)) res.push(nextCoord)
    else return res

    if (pieceCoord.i === 1 && !isWhite || pieceCoord.i === 6 && isWhite) {
        diff *= 2
        nextCoord = { i: pieceCoord.i + diff, j: pieceCoord.j }
        if (isEmptyCell(nextCoord)) res.push(nextCoord)
    }
    return res
}

function getAllPossibleCoordsRook(pieceCoord) {
    var res = []
    //to the right of the rook
    for (var nxtIdx = pieceCoord.j + 1; nxtIdx < gBoard.length; nxtIdx++) {
        var nextCoord = { i: pieceCoord.i, j: nxtIdx }
        if (!isEmptyCell(nextCoord)) break
        res.push(nextCoord)
    }

    //to the left of the rook
    for (var nxtIdx = pieceCoord.j - 1; nxtIdx >= 0; nxtIdx--) {
        var nextCoord = { i: pieceCoord.i, j: nxtIdx }
        if (!isEmptyCell(nextCoord)) break
        res.push(nextCoord)
    }

    //on top of the rook
    for (var nxtIdx = pieceCoord.i + 1; nxtIdx < gBoard[0].length; nxtIdx++) {
        var nextCoord = { i: nxtIdx, j: pieceCoord.j }
        if (!isEmptyCell(nextCoord)) break
        res.push(nextCoord)
    }

    //to the left of the rook
    for (var nxtIdx = pieceCoord.i - 1; nxtIdx >= 0; nxtIdx--) {
        var nextCoord = { i: nxtIdx, j: pieceCoord.j }
        if (!isEmptyCell(nextCoord)) break
        res.push(nextCoord)
    }

    return res
}

function getAllPossibleCoordsBishop(pieceCoord) {
    var res = []
    var i = pieceCoord.i - 1
    //above and to right
    for (var idx = pieceCoord.j + 1; i >= 0 && idx < 8; idx++) {
        var coord = { i: i--, j: idx }
        if (!isEmptyCell(coord)) break
        res.push(coord)
    }
    //above and to left
    i = pieceCoord.i - 1
    for (var idx = pieceCoord.j - 1; i >= 0 && idx >= 0; idx--) {
        var coord = { i: i--, j: idx }
        if (!isEmptyCell(coord)) break
        res.push(coord)
    }
    //below and to left
    var j = pieceCoord.j - 1
    for (var idx = pieceCoord.i + 1; j >= 0 && idx < 8; idx++) {
        var coord = { i: idx, j: j-- }
        if (!isEmptyCell(coord)) break
        res.push(coord)
    }
    //below and to right
    j = pieceCoord.j + 1
    for (var idx = pieceCoord.i + 1; j < 8 && idx < 8; idx++) {
        var coord = { i: idx, j: j++ }
        if (!isEmptyCell(coord)) break
        res.push(coord)
    }

    // TODO: 3 more directions - the Bishop
    return res
}

function getAllPossibleCoordsKing(pieceCoord) {
    var res = []
    var rowIdx = pieceCoord.i
    var colIdx = pieceCoord.j
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= gBoard[0].length) continue
            var coord = { i: i, j: j }
            // console.log('i,j', coord);
            if (isEmptyCell(coord)) res.push(coord)
            // console.log('res', res);
        }
    }

    return res
}

function getAllPossibleCoordsQueen(pieceCoord) {
    var res = []
    res.push(...getAllPossibleCoordsBishop(pieceCoord))
    res.push(...getAllPossibleCoordsRook(pieceCoord))
    return res
}

function getAllPossibleCoordsKnight(pieceCoord) {
    var res = []

    var rowIdx = pieceCoord.i
    var colIdx = pieceCoord.j
    for (var i = rowIdx - 2; i <= rowIdx + 2; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 2; j <= colIdx + 2; j++) {
            if (j < 0 || j >= gBoard[0].length) continue//out of board
            if (i === rowIdx && j === colIdx) continue //itself
            if (i === rowIdx || j === colIdx) continue//in same row or same column
            if (rowIdx - colIdx === i - j) continue //in its primary diagonal
            if (i + j === rowIdx + colIdx) continue //in its secondary diagonal

            var coord = { i: i, j: j }
            // console.log('current idx', pieceCoord);
            // console.log('i,j', coord);
            if (isEmptyCell(coord)) res.push(coord)
            // console.log('res', res);
        }
    }

    return res
}
