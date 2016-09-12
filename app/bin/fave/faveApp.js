angular.module('faveMod', [])
	.constant('FAVE', {
		DATA_PATH: {
			FAVE: '../angds.php?fave_data=now',
			FAVE_LOCAL: '',
			FAVE_SAVE: '../angds.php',
			FAVE_SAVE_LOCAL: ''
		},
		VIEW_PATH: {
			FAVE: 'bin/fave/fave.html'
		}
	});
