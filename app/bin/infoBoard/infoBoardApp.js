angular.module('infoBoardMod', [])
	.constant('INFO_BOARD', {
		DATA_PATH: {
			INFO_BOARD: '../angds.php?info_board=now',
			INFO_BOARD_LOCAL: 'resource/info_board.json'
		},
		VIEW_PATH: {
			INFO_BOARD: 'bin/infoBoard/infoBoard.html'
		}
	});
