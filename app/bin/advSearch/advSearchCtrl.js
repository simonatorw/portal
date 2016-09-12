angular.module('advSearchMod')
	.controller('advSearchCtrl', ['$scope', '$state', '$window', 'SHARED', 'advSearchSrv', '$stateParams', 
		function($scope, $state, $window, SHARED, advSearchSrv, $stateParams) {
		var panelIndex;
		$scope.advSearch = {};
		$scope.reqForm = {
			fields: {},
			VIEW_PATH: {
				FORM_ELEM: SHARED.VIEW_PATH.FORM_ELEM
			}
		};
		$scope.main.home = false;
		$scope.main.state = $state.current.name;
		$scope.advSearch['grp' + $stateParams.panel] = true;

		advSearchSrv.getView().then(function(response) {
			console.log(response.data);
			$scope.advSearch.content = response.data;
		});
		
		$scope.goBack = function(e) {
			e.preventDefault();
			
			$window.history.back();
		};
		
		$scope.togglePanel = function(advSearch, num, max) {
			if (!advSearch['grp' + num]) {
				for (var i = 1; i <= max; i++) {
					advSearch['grp' + i] = false;
				}
				advSearch['grp' + num] = true;
			} else {
				advSearch['grp' + num] = false;
			}
		};
		
		$scope.isCollapsed = function(advSearch) {
			if (advSearch.content) {
				for (var i = 1, max = advSearch.content.length; i <= max; i++) {
					if (advSearch['grp' + i]) {
						panelIndex = i;
						return false;
					}
				}
				return true;
			}
		};
		
		$scope.search = function(isValid, advSearch, reqForm) {
			if (isValid && reqForm.fields) {
				var menu = advSearch.content[panelIndex - 1].nav_button.get.params.static;
				var dynamic = advSearch.content[panelIndex - 1].nav_button.get.params.dymanic;
				if (dynamic.length) {
					var obj = {};
					for (var i = dynamic.length; i--;) {
						obj[dynamic[i].key] = reqForm.fields[dynamic[i].name];
					}
					menu = angular.extend(menu, obj);
				}
				if (!menu.label) {
					menu.label = 'Search: ' + menu.param_value.substring(0,10);
				}
				// Trim param_value to max 2000 characters
				menu.param_value = menu.param_value.substring(0,2000);
				// Replace any double commas for correct routing
				menu.param_value = menu.param_value.replace(/,,/g, ',');
				console.log(menu);
				$scope.routeTo(null, menu);
			}
		};
	}]);