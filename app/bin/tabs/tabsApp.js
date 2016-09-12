angular.module('tabsMod', [])
	.constant('TABS', {
		DATA_PATH: {
			TABS: '../angds.php?tabs=now',
			TABS_LOCAL: 'resource/tabs.json',
			TABS_SAVE: '../angds.php',
			TABS_SAVE_LOCAL: ''
		},
		PAGE_TYPE: {
			GRID: 'grid',
			PILLS: 'pills'
		},
		PARAM_VALUE: {
			NOW: 'now',
			ALL: 'all'
		}
	});