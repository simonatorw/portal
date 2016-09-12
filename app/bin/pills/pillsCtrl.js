angular.module('pillsMod')
	.controller('pillsCtrl', ['$scope', 'pillsSrv', '$stateParams', '$state', '$stateParams', 'mainSrv', 
		function($scope, pillsSrv, $stateParams, $state, $stateParams, mainSrv) {
		$scope.pills = {};
		$scope.main.state = $state.current.name;
		$scope.main.home = false;
		var idParams = $stateParams.id.split(',,');
		$scope.main.currentId = $stateParams.id;
		//console.debug($scope.main.currentId)		

		pillsSrv.getData(idParams[0], idParams[1], idParams[0] === 'monitorsnapshot' ? $stateParams.label : '', $stateParams.cache).then(function(response) {
			$scope.pills.data = response.data;

		});
	
		$scope.routeToPill = function(e, pill, ind) {
			e.preventDefault();
			
			$scope.pills.currentIndex = ind;
			$state.go($scope.main.state, { pid: ind });
		};
		
		$scope.getLabel = function(ind, pill, pills) {
			if (ind == pills.currentIndex) {
				$scope.main.selectedPillLabel = pill.label;
				return true;
			}
		};
	}])
	.controller('pills.contentCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {

		$scope.pills.currentIndex = $stateParams.pid;
		$scope.pill = {};
		
		$scope.doPillPage = function(page) {
			return 'bin/' + page.page_type + '/' + page.page_type + '.html';
		};
	}]);