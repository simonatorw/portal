angular.module('faveMod')
	.controller('faveCtrl', ['$scope', 'faveSrv', '$window', function($scope, faveSrv, $window) {
		$scope.fave = {
			//selected: faveSrv.isFave($window.location.hash)
		};

		$scope.$watch(function() {
			return $window.location.hash;
		}, function(n) {
			if (n) {
				var url = decodeURIComponent(n);
				
				$scope.fave.selected = faveSrv.isFave(url.split('/')[2]);
			}
		});
		
		$scope.saveFave = function(isSave) {
			faveSrv.save(isSave, $window.location.hash, $scope.main.selectedLabel, $scope.main.selectedPillLabel);
		};
		
		$scope.saveQuery = function(isSave, queryForm, fave, grid) {
		};
	}]);