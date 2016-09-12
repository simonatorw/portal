angular.module('formMod', [])
	.constant('FORM', {
		DATA_PATH: {
			FORM: '../angds.php',
			FORM_LOCAL: 'resource/monitor.json',
			SEARCH: '../angds.php?{id}={value}',
			SEARCH_LOCAL: ''
		}
	});