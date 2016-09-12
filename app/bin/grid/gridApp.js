angular.module('gridMod', [])
	.constant('GRID', {
		DATA_PATH: {
			GRID: '../angds.php?{id}={value}',
			GRID_LOCAL: 'resource/grid-{id}.json',
			EDIT: '../angds.php',
			EDIT_LOCAL: '',
			IMPORT: '../fupload.php?fileupload=csv',
			IMPORT_LOCAL: ''
		},
		VIEW_PATH: {
			EXPORT: 'bin/grid/export.html',
			IMPORT: 'bin/grid/import.html'
		}
	});
