angular.module('pillsMod', [])
	.constant('PILLS', {
		DATA_PATH: {
			PILLS: '../angds.php?{id}={value}',
			PILLS_LOCAL: 'resource/pills-{value}.json'
		}
	})
