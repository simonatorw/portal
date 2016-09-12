angular.module('infoBoardMod')
	.factory('infoBoardSrv', ['$http', 'INFO_BOARD', function($http, INFO_BOARD) {
		function getData(id) {
			var url = INFO_BOARD.DATA_PATH.INFO_BOARD;
			return $http.get(url, { cache: false });
		}
		
		return {
			getData: getData
		};
	}])
