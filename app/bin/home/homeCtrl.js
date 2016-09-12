angular.module('homeMod')
	.controller('homeCtrl', ['$scope', '$state', function($scope, $state) {
		$scope.home = {};
		$scope.main.state = $state.current.name;
		$scope.main.home = true;

	}]);