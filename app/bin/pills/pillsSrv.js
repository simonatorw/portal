angular.module('pillsMod')
	.factory('pillsSrv', ['$http', 'PILLS', function($http, PILLS) {
		function getData(id, value, label, isCached) {
			var url = PILLS.DATA_PATH.PILLS;
		
			url = url.replace('{id}', id);
			url = url.replace('{value}', value);
			if (label) {
				url = url + '&label=' + label;
			}
			return $http.get(url, { cache: !!isCached });
		}
		
		return {
			getData: getData
		};
	}])
