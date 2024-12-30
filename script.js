var origBoard;
const huPlayer = 'X';
const aiPlayer = 'O';

const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer)
			if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "blue" : "red";
	}

	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "Ви виграли!" : "Ви програли.");
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function checkTie() {

	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Нічия!")
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {

		return {score: -10};

	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}

	var moves = [];
	// перебираем доступные клетки
	for (var i = 0; i < availSpots.length; i++) {
		// переменная для следующего шага
		var move = {};
		// делаем шаг в очередную пустую клетку и получаем новое положение на доске
		move.index = newBoard[availSpots[i]];
		// заполняем эту клетку символом того, чей ход мы рассчитываем
		newBoard[availSpots[i]] = player;

		// если считаем ход для компьютера
		if (player == aiPlayer) {
			// рекурсивно вызываем минимаксную функцию для нового положения и указываем, что следующий ход делает человек
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		// то же самое, но если считаем ход человека
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}
		// запоминаем результат
		newBoard[availSpots[i]] = move.index;
		// добавляем ход в список ходов
		moves.push(move);
	}
	// переменная для лучшего хода
	var bestMove;
	// если считаем ход компьютера
	if(player === aiPlayer) {
		// берём максимально низкое значение
		var bestScore = -10000;
		// перебираем все ходы, что у нас получились
		for(var i = 0; i < moves.length; i++) {
			// если очки текущего хода больше лучшего значения
			if (moves[i].score > bestScore) {
				// запоминаем это как лучшее значение
				bestScore = moves[i].score;
				// запоминаем номер хода
				bestMove = i;
			}
		}
	// то же самое делаем с ходом, если моделируем ход человека
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	// возвращаем лучший ход
	return moves[bestMove];
}