angular.module('advSearchMod')
	.factory('advSearchSrv', ['$http', 'SEARCH', function($http, SEARCH) {
		function getView() {
			var url = SEARCH.DATA_PATH.SEARCH;

			return $http.get(url, { cache: true });
		}
		
		return {
			getView: getView
		};
	}])
