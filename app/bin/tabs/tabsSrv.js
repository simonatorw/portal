angular.module('tabsMod')
	.factory('tabsSrv', ['$state', 'STATES', 'TABS', '$http', 'mainSrv', '$q', '$window', function($state, STATES, TABS, $http, mainSrv, $q, $window) {
		var tabs = [];
		var tabsProm;
		
		function setTabs(tab) {
			var id = tab.data_id;
			var val = tab.param_value;

			if (tabs.length) {
				for (var i = 0, max = tabs.length; i < max; i++) {
					if (isTargetTab(tabs[i], id, val)) {
						return;
					}
				}
			}
			tabs.push(tab);
			saveTabs();
		}

		function isOpen(tab) {
			var id = tab.data_id;
			var val = tab.param_value;

			if (tabs.length) {
				for (var i = 0, max = tabs.length; i < max; i++) {
					if (isTargetTab(tabs[i], id, val)) {
						return true;
					}
				}
			}
			return false;
		}
		
		function getTabs() {
			if (tabs.length) {
				return $q.when(tabs);
			} else {
				return tabsProm.then(function(data) {
					return data;
				});
			}
		}
		
		function saveTabs() {
			localStorage.sap_tabs = angular.toJson(tabs);
			mainSrv.doPost(TABS.DATA_PATH.TABS_SAVE, { tabs: angular.toJson(tabs) });
		}
		
		function initTabs() {
			tabsProm = $http.get(TABS.DATA_PATH.TABS).then(function(response) {
				if (response.data.tabs && response.data.tabs.length && response.data.tabs[0] !== null) {
					tabs = angular.fromJson(response.data.tabs[0]);
					return tabs;
				} else {
					var data = fromLocalStorage('sap_tabs');
			
					if (data) {
						tabs = data;
						return tabs;
					}
				}
			}, function(response) {
				var data = fromLocalStorage('sap_tabs');
			
				if (data) {
					tabs = data;
					return tabs;
				}
			});
		}
	
		function fromLocalStorage(key) {
			if (localStorage.sap_tabs) {
				return angular.fromJson(localStorage[key]);
			}
		}
		
		function removeTab(curId, selTab) {
			for (var i = tabs.length; i--;) {
				if (isTargetTab(selTab, tabs[i].data_id, tabs[i].param_value)) {	
					tabs.splice(i, 1);
					break;
				}
			}
			
			saveTabs();
			
			if (tabs.length) {
				var ind = i - 1;
				if (ind < 0) {
					ind = i;
				}
				if (isTargetTab(selTab, curId)) {
					var menu = tabs[ind];			
					mainSrv.routeTo(menu);
				}
			} else {
				$state.go(STATES.HOME);
			}
		}
		
		function isTargetTab(tab, id, val) {
			/*
			return ((tab.data_id === id && (tab.param_value === TABS.PARAM_VALUE.NOW || tab.param_value === TABS.PARAM_VALUE.ALL)) || 
				(tab.param_value === (val ? val : id) && (tab.page_type === TABS.PAGE_TYPE.PILLS || tab.param_value !== TABS.PARAM_VALUE.NOW)));
			*/
			var tabId = tab.data_id + ',,' + tab.param_value;
			var curTabId = id;
			if (val) {
				curTabId = curTabId + ',,' + val;
			}
			//console.debug(tabId, curTabId, tabId === curTabId)
			return tabId === curTabId;
		}
		
		function urlToMenu(url) {
			var params = url.split('/');
			var params2 = params[2].split(',,');
			var obj = {
				page_type: params[1],
				data_id: params2[0],
				param_value: params2[1],
				label: decodeURIComponent(params[3])
			};
			console.log(obj)
			return obj;
		}
		
		return {
			setTabs: setTabs,
			getTabs: getTabs,
			initTabs: initTabs,
			removeTab: removeTab,
			isTargetTab: isTargetTab,
			isOpen: isOpen,
			urlToMenu: urlToMenu
		};
	}])
