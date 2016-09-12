angular.module('gridMod')
	.directive('sapGridEvents', ['tabsSrv', 'mainSrv', 'GRID', '$state', '$stateParams', function(tabsSrv, mainSrv, GRID, $state, $stateParams) {
		return {
			link: function(scope, elem, attrs) {
				elem.on('click', '.drilldown', function(e) {
					e.preventDefault();
					
					var pageValue = $(this).text();
					var pageType = $(this).data('page-type');
					var pageId = $(this).data('page-id');

					var menu = {
						data_id: pageId,
						page_type: pageType,
						label: pageValue,
						param_value: pageValue,
						cache: true
					};
					mainSrv.routeTo(menu);
					tabsSrv.setTabs(menu);
				});
				
				var win;
				
				elem.on('click', '.detail', function(e) {
					e.preventDefault();
					
					var text = $(this).text();
					var title = $(this).data('title');
					if (!$('#detail-text').length) {
						$('body').append('<div id="detail-text" title="' + title + '"><pre>' + text + '</pre></div>');
					} else {
						$('#detail-text').find('pre').html(text);
						$('#detail-text').attr('title', title)
					}
					$('#detail-text').dialog({
						modal: true,
						width: 800,
						height: 320,
						close: function() {
							$('#detail-text').dialog('destroy');
							$('#detail-text').remove();
						},
						buttons: [{
							text: 'Close',
							click: function() {
								$('#detail-text').dialog('destroy');
								$('#detail-text').remove();
							}
						}]
					});
				});
				
				elem.on('click', '.btn-default.action', function(e) {
					var menu = angular.fromJson(decodeURIComponent($(this).data('menu')));
					console.log(menu);
					var obj = {};
					if (menu.data_id === 'edit_vcenter_etl_del' && menu.label === 'Delete Record') {
						//var obj = {};
						/*
							data_id: menu.data_id,
							param_value: menu.param_value
						};*/
						obj[menu.data_id] = menu.param_value;
						mainSrv.doPost(GRID.DATA_PATH.EDIT, obj).then(function(response) {
							$state.go($state.current, $stateParams, { reload: true });
						});						
					} else if (menu.page_type === 'form' && menu.request_type === 'modify'){
						menu['step'] = '2';
						menu['sla_number_id'] = menu.sla_number_id;
						menu['record_id'] = menu.param_value;
						menu[menu.data_id] = 'all';
						mainSrv.doPost(GRID.DATA_PATH.EDIT, menu).then(function(response) {
							console.log(response.data.step_content[0]);
							scope.reqForm.content = response.data.step_content[0];
							});
					} else if (menu.page_type === 'form' && menu.request_type === 'delete'){
						menu['step'] = '2';
						menu['sla_number_id'] = menu.sla_number_id;
						menu['record_id'] = menu.param_value;
						menu[menu.data_id] = 'all';
						mainSrv.doPost(GRID.DATA_PATH.EDIT, menu).then(function(response) {
							console.log(response.data.step_content[0]);
							scope.reqForm.content = response.data.step_content[0];
							});
					} else {
						scope.routeTo(null, menu);
					}
				});
			}
		};
	}])
	.directive('sapExport', ['$compile', 'GRID', function($compile, GRID) {
		return {
			link: function(scope, elem, attrs) {
				elem.on('click', function(e) {
					e.preventDefault();
					
					if (!$('.exportForm').length) {
						scope.$apply(function() {
							elem.after($compile('<div class="exportForm" title="Export to CSV"><div ng-include="grid.EXPORT_VIEW"></div></div>')(scope));
						});
					}
					$('.exportForm').dialog({
						modal: true,
						width: 600,
						height: 180,
						close: function() {
							$(this).dialog('destroy');
							elem.next('.exportForm').remove();
						},
						buttons: [{
							text: 'Cancel',
							click: function() {
								$(this).dialog('destroy');
								elem.next('.exportForm').remove();
							}
						}, {
							text: 'Export',
							click: function() {
								scope.gridOptions.api.exportDataAsCsv({
									fileName: scope.grid.exportName ? scope.grid.exportName + '.csv' : '',
									columnSeparator: scope.grid.exportSep
								});
								scope.grid.exportName = '';
								scope.grid.exportSep = '';
								$(this).dialog('destroy');
								elem.next('.exportForm').remove();
							}
						}]
					});
				});				
			}
		};
	}])
	.directive('sapImport', ['$compile', 'mainSrv', 'GRID', '$state', '$stateParams', function($compile, mainSrv, GRID, $state, $stateParams) {
		return {
			link: function(scope, elem, attrs) {
				elem.on('click', function(e) {
					e.preventDefault();
					
					if (!$('.importForm').length) {
						scope.$apply(function() {
							elem.after($compile('<div class="importForm" title="Import CSV"><div ng-include="grid.IMPORT_VIEW"></div></div>')(scope));
						});
					}
					$('.importForm').dialog({
						modal: true,
						width: 600,
						height: 180,
						close: function() {
							$(this).dialog('destroy');
							elem.next('.importForm').remove();
						},
						buttons: [{
							text: 'Cancel',
							click: function() {
								$(this).dialog('destroy');
								elem.next('.importForm').remove();
							}
						}, {
							text: 'Import',
							click: function() {
								mainSrv.doMultiForm(GRID.DATA_PATH.IMPORT, scope.grid.csvfile).then(function(response) {
									scope.app.importCsv.show = true;
									scope.app.importCsv.go = response.data.success;
									scope.app.importCsv.status = response.data.status_detail;
									if (scope.app.importCsv.go) {
										$state.go($state.current, $stateParams, { reload: true });
									}
									
								});
								$(this).dialog('destroy');
								elem.next('.importForm').remove();
							}
						}]
					});
				});				
			}
		};
	}])
	.directive('sapFileread', ['$parse', function ($parse) {
		return {
			link: function(scope, elem, attrs) {				
				var model = $parse(attrs.sapFileread);
				var modelSetter = model.assign;

				elem.bind('change', function() {
					scope.$apply(function() {
						modelSetter(scope, elem[0].files[0]);
					});
					console.log(scope.grid.csvfile)
				});
			}
		}
	}]);