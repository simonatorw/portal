angular.module('previewMod')
	.controller('previewCtrl', ['$scope', '$state', '$stateParams', 'previewSrv', '$sce', function($scope, $state, $stateParams, previewSrv, $sce) {
		
		$scope.preview = {};
		$scope.main.home = false;
		$scope.main.state = $state.current.name;
		$scope.main.currentId = $stateParams.id;
		var idParams = $stateParams.id.split(',,');

		previewSrv.getData(idParams[0], idParams[1], $stateParams.cache).then(function(response) {
			$scope.preview.data = response.data;
		});
		
		$scope.parseLinks = function(answer) {
			return $sce.trustAsHtml(answer);
		};
	}]);