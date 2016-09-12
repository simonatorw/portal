angular.module('infoBoardMod')
	.controller('infoBoardCtrl', ['$scope', 'infoBoardSrv', function($scope, infoBoardSrv) {
		$scope.infoBoard = {};

		infoBoardSrv.getData().then(function(response) {
			$scope.infoBoard.data = response.data;
		});
	
	}]);