angular.module('gridMod')
	.factory('gridSrv', ['$http', 'GRID', function($http, GRID) {
		function getGridData(id, value, isCached) {
			//console.log(isCached)
			var url = GRID.DATA_PATH.GRID.replace('{id}', id);
			url = url.replace('{value}', value);

			return $http.get(url, { cache: !!isCached });
		}
		
		return {
			getGridData: getGridData
		};
	}])
