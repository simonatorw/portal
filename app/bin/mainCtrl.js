angular.module('portalMod')
	.controller('mainCtrl', ['$scope', 'mainSrv', 'tabsSrv', '$state', 'faveSrv', 'STATES', '$q', 
		function($scope, mainSrv, tabsSrv, $state, faveSrv, STATES, $q) {
		$scope.main = {
			searchResults: []
		};

		$q.all([mainSrv.getMenu(), faveSrv.getFaves()]).then(function(response) {
			var data = response[0].data;
		
			data = angular.extend(data, { Favorites: response[1] });
			$scope.main.menuItems = data;
		});
		
		mainSrv.getMenuServ().then(function(response) {
			$scope.main.menuServItems = response.data;
		});

		mainSrv.getUser().then(function(response) {
			var user = response.data;
			$scope.main.user = user.first_name + ' ' + user.last_name;
		});
		
		mainSrv.getFooter().then(function(response) {
			$scope.main.footerItems = response.data.links;
			//console.log($scope.main.footerItems)
		});
		
		$scope.logout = function(e) {
			e.preventDefault();
			mainSrv.logout();
		};
		
		var savedMenu;
		
		$scope.routeTo = function(e, menu) {
			if (e) {
				e.preventDefault();
			}
			
			if (!menu.bigdata || (menu.bigdata && tabsSrv.isOpen(menu))) {
				//console.log(menu)
				mainSrv.routeTo(menu);
				if (menu.page_type !== STATES.REPORT) {
					tabsSrv.setTabs(menu);
				}
			} else {
				$scope.app.showWarning = true;
				savedMenu = menu;
			}
		};
		
		$scope.routeToFromDialog = function() {
			var menu = savedMenu;
			mainSrv.routeTo(menu);
			tabsSrv.setTabs(menu);
			$scope.app.showWarning = false;			
		}
		
		$scope.getLabel = function(category, menu) {
			if (category !== 'Favorites') {
				return menu.label;
			} else if (menu.faveLabel) {
				return menu.faveLabel;
			}
		};
		
		$scope.search = function(main) {
			if (main.searchTerm) {
				mainSrv.getSearchResults(main.searchTerm).then(function(response) {
					//var list = response.data;
					$scope.main.showSearchResults = true;
					$scope.main.searchResults = response.data;
				});
			}
		};
	
	}]);