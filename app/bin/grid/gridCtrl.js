angular.module('gridMod')
	.controller('gridCtrl', ['$scope', 'gridSrv', '$stateParams', '$state', 'mainSrv', '$timeout', 'GRID', '$cacheFactory', 
		function($scope, gridSrv, $stateParams, $state, mainSrv, $timeout, GRID, $cacheFactory) {
			
		if ($scope.grid) {
			return;
		}
	
		$scope.grid = {};
		$scope.grid.EXPORT_VIEW = GRID.VIEW_PATH.EXPORT;
		$scope.grid.IMPORT_VIEW = GRID.VIEW_PATH.IMPORT;
		$scope.main.state = $state.current.name;
		$scope.main.home = false;
		if (!$scope.pill && !$scope.reqForm) {
			var idParams = $stateParams.id.split(',,');
			var val = idParams[1];
			$scope.main.currentId = $stateParams.id;
		}

		$scope.gridOptions = {
			rowSelection: 'single',
			angularCompileRows: false,
			enableColResize: true,
			enableSorting: true,
			enableFilter: true,
			onModelUpdated: onUpdated,
			suppressLoadingOverlay: true,
			gridReady: function(api) {
				api.sizeColumnsToFit();
			}
		};
		
		if (!$scope.pill && !$scope.reqForm) {
			gridSrv.getGridData(idParams[0], val, $stateParams.cache).then(function(response) {
				setUpGrid(response, $scope.gridOptions);
				//var cache = $cacheFactory.get('$http');
				//console.log(cache.get('../angds.php?sla_all=now'));
			});
		} else if ($scope.pill) {
			$scope.grid.title = $scope.pills.data[$scope.page.id].table_title;
			setUpGrid({ data: $scope.pills.data[$scope.page.id] });
		} else if ($scope.reqForm) {
			setUpGrid({ data: $scope.reqForm.content.fieldset[0] });
		}
	
		$scope.setFilter = function(value) {
			var cnt = 0;
			$scope.gridOptions.api.setQuickFilter(value);
			$scope.gridOptions.api.forEachNodeAfterFilter(function() {
				cnt++;
			});
			$scope.grid.count = cnt;
		};
		
		$scope.addRow = function(e, dataId) {
			e.preventDefault();
			
			console.log(dataId);
			var obj = {};
			obj[dataId] = 1;
			mainSrv.doPost(GRID.DATA_PATH.EDIT, obj).then(function(response) {
				$state.go($state.current, $stateParams, { reload: true });
			});
			
		};
		
		function setUpGrid(response) {
			//console.log(response)
			if (response.data.fields) {
				var headers = response.data.fields;
			} else {
				var headers = response.data.header;
				$scope.grid.report = response.data.report;
			}
			
			if (response.data.insert) {
				$scope.grid.insert = response.data.insert;
			}
			
			if (response.data.import) {
				$scope.grid.import = response.data.import;
			}
			
			if (headers) {
				var max = headers.length;
				for (var i = 0; i < max; i++) {
					headers[i].headerName = headers[i].header_name;
					if (headers[i].editable) {
						headers[i].onCellValueChanged = function(val) {
							console.debug($scope.gridOptions.api.getFocusedCell(), val.node);
							var obj = val.api.focusedCellController.focusedCell;
							console.debug(val.colDef.field, val.data.vc_id, val.newValue, val);
							mainSrv.doPost(GRID.DATA_PATH.EDIT, {
								edit_vcenter_etl: val.data.vc_id,
								field: val.colDef.field,
								value: val.newValue
							});
						};
					}
					if (headers[i].drilldown) {
						//var pageType = headers[i].drilldown.page_type;
						//var pageId = headers[i].drilldown.data_id;
			
						headers[i].cellRenderer = function(params) {
							var pageType = params.colDef.drilldown.page_type;
							var urlEnd = '';
							if (pageType === 'pills') {
								urlEnd = '/' + pageType + '.content/0';
							}
							//return '<a href="#/' + pageType + '/' + params.colDef.drilldown.data_id + ',,' + params.value + '/' + params.value + urlEnd + '" class="drilldown" data-page-id="' + params.colDef.drilldown.data_id + '" data-page-type="' + pageType + '">' + params.value + '</a>';
							return '<a href="#" class="drilldown" data-page-id="' + params.colDef.drilldown.data_id + '" data-page-type="' + pageType + '">' + params.value + '</a>';					
						};
					} else if (headers[i].buttons) {
						headers[i].cellRenderer = function(params) {
							var btnList = angular.copy(params.colDef.buttons);
							var buttons = '';
							var configName = params.data.config_name;
							for (var i = btnList.length; i--;) {
								var label = btnList[i].label;
								if (configName) {
									btnList[i].param_value = params.value;
									btnList[i].label = label + ': ' + configName;
								} else {
									btnList[i].param_value = params.data[btnList[i].param_value];
								}
								var menu = encodeURIComponent(angular.toJson(btnList[i]));
								buttons = buttons + '<button class="btn btn-default action" data-menu="' + menu + '">' + label + '</button>';
							}
							return buttons;
						};
					} else if (headers[i].is_link) {
						var title = headers[i].headerName;
						headers[i].cellRenderer = function(params) {
							return '<a href="#" class="detail" data-title="' + title + '">' + params.value + '</a>';
						};					
					}
				}
			}
			if (response.data.fields && !$scope.reqForm) {
				$scope.gridOptions.api.setColumnDefs(headers);
				$scope.gridOptions.api.setRowData(response.data.data);
			} else {
				$scope.gridOptions.columnDefs = headers;
				$scope.gridOptions.rowData = response.data.data;
			}
		
		}
		
		function onUpdated() {
			var cnt = 0;
			$scope.gridOptions.api.sizeColumnsToFit();
			$scope.gridOptions.api.forEachNode(function() {
				cnt++;
			});
			$scope.grid.count = cnt;
			
			//if (!$scope.pill && !$scope.reqForm && idParams[0] === 'edit_vcenter_etl') {
				//$scope.gridOptions.api.setFocusedCell(0, 'vc_name', null);
			//}
		}
		
	}]);