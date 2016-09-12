angular.module('portalMod')
	.provider('stateInitSrv', function() {
		this.getConfig = function(state, params) {
			params = params || '';
			
			if (params && params.length) {
				var str = '';
				for (var i = 0, max = params.length; i < max; i++) {
					str = str + '/{' + params[i] + '}';
				}
				params = str;
			}
	
			var obj = {
				url: '/' + state + params,
				templateUrl: 'bin/' + (state.indexOf('.') >= 0 ? state.split('.')[0] : state) + '/' + state + '.html',
				controller: state + 'Ctrl'
			};
			
			return obj;
		};
		
		this.$get = function() {
			return {
			};
		};
	})
	.factory('mainSrv', ['$http', 'APP', '$window', '$state', 'STATES', '$rootScope', function($http, APP, $window, $state, STATES, $rootScope) {
		
		function getUser() {
			return $http.get(APP.DATA_PATH.USER, { cache: true });
		}

		function getMenu() {
			return $http.get(APP.DATA_PATH.MENU, { cache: true });
		}

		function getMenuServ() {
			return $http.get(APP.DATA_PATH.MENU_SERV, { cache: true });
		}
		
		function logout() {
			$http.get(APP.LOGOUT).then(function() {
				$window.location.reload();
			});
		}
		
		function routeTo(menu) {
			if (menu.page_type === STATES.PILLS) {
				//console.debug(menu, menu.hasOwnProperty('pid') && menu.pid !== undefined)
				$state.go(menu.page_type + '.content', { id: menu.data_id + ',,' + menu.param_value, label: menu.label, cache: menu.cache, pid: menu.hasOwnProperty('pid') && menu.pid !== undefined ? menu.pid : 0 });
			} else if (menu.page_type === STATES.REPORT) {
				var url = APP.DATA_PATH.REPORT.replace('{id}', menu.data_id);
				url = url.replace('{value}', menu.param_value);
				$http.get(url).then(function() {
					$rootScope.app.showSuccess = true;
					$rootScope.app.reportName = menu.label;
				});
			} else {
				$state.go(menu.page_type, { id: menu.data_id + ',,' + menu.param_value, label: menu.label, cache: menu.cache });
			}
		}

		function doPost(url, data) {
			if (url) {
				return $http.post(url, $.param(data), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
			}
		}
		
		function doMultiForm(url, data) {
			if (url) {
				var fd = new FormData();
				fd.append('file', data);
				 return $http.post(url, fd, {
					transformRequest: angular.identity,
					headers: { 'Content-Type': undefined }
				});	
			}
		}
		
		function getSearchResults(term) {
			var url = APP.DATA_PATH.SEARCH.replace('{term}', term);
			return $http.get(url);
		}
		
		function getFooter() {
			return $http.get(APP.DATA_PATH.FOOTER, { cache: true });
		}
		
		return {
			getUser: getUser,
			getMenu: getMenu,
			getMenuServ: getMenuServ,			
			logout: logout,
			routeTo: routeTo,
			doPost: doPost,
			getSearchResults: getSearchResults,
			getFooter: getFooter,
			doMultiForm: doMultiForm
		};
	}])
	.factory('utilSrv', [function() {
		function setLocalData(isLocal, list) {
			if (isLocal && list && list.length) {
				for (var i = list.length; i--;) {
					var pathList = list[i].DATA_PATH;
					var keys = Object.keys(pathList);
					for (var j = keys.length; j--;) {
						if (keys[j].indexOf('_LOCAL') < 0) {
							pathList[keys[j]] = pathList[keys[j] + '_LOCAL'];
						}
					}
				}
			}
		}
		return {
			setLocalData: setLocalData
		};
	}])
	.factory('httpInterceptor', ['$q', '$rootScope', '$log', function($q, $rootScope, $log) {

		var numLoadings = 0;

		return {
			request: function(config) {

				numLoadings++;

				// Show loader
				$rootScope.app.loading = true;
				return config || $q.when(config)
			},
			response: function(response) {

				if ((--numLoadings) === 0) {
					// Hide loader
					$rootScope.app.loading = false;
				}
				return response || $q.when(response);
			},
			responseError: function(response) {

				if (!(--numLoadings)) {
					// Hide loader
					$rootScope.app.loading = false;
				}
				return $q.reject(response);
			}
		};
	}]);