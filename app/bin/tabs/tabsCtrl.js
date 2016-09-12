angular.module('tabsMod')
	.controller('tabsCtrl', ['$scope', 'tabsSrv', '$window', function($scope, tabsSrv, $window) {
		$scope.tabs = {};
		tabsSrv.getTabs().then(function(data) {
			$scope.tabs.list = data;
			
			$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
				var menu = toParams;
				//console.debug(toState.name, toParams)
				if (menu.id) {
					var found = false;
					for (var i = data.length; i--;) {
						if (tabsSrv.isTargetTab(data[i], menu.data_id)) {
							found = true;
							break;
						}
					}
					if (!found) {
						tabsSrv.setTabs({
							data_id: toParams.id.split(',,')[0],
							param_value: toParams.id.split(',,')[1],
							label: toParams.label,
							page_type: toState.name.indexOf('.') >= 0 ? toState.name.split('.')[0] : toState.name
						});
					}
				}
			});
		});

		$scope.isId = function(id, tab) {
			if (tabsSrv.isTargetTab(tab, id)) {
				$scope.main.selectedLabel = tab.label;
				return true;
			}
		};
		
		$scope.removeTab = function(e, currentId, selectedId) {
			e.preventDefault();
	
			tabsSrv.removeTab(currentId, selectedId);
		};
		

	}]);