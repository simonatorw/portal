angular.module('formMod')
	.controller('formCtrl', ['$scope', '$state', 'formSrv', '$stateParams', 'mainSrv', 'FORM', 'SHARED', 
		function($scope, $state, formSrv, $stateParams, mainSrv, FORM, SHARED) {
		$scope.reqForm = {
			fields: {},
			review: {},
			VIEW_PATH: {
				FORM_ELEM: SHARED.VIEW_PATH.FORM_ELEM
			}
		};

		$scope.main.home = false;
		$scope.main.state = $state.current.name;
	
		var idParams = $stateParams.id.split(',,');
		var paramsCache = [];
		var initParam = {};
		
		initParam[idParams[0]] = idParams[1];
		paramsCache.push(initParam);
		$scope.main.currentId = $stateParams.id;
		
		formSrv.getData(idParams[0], idParams[1]).then(function(response) {
			//console.log(response.data);
			$scope.reqForm.steps = response.data.steps_container;
			$scope.reqForm.sel = 1;
			$scope.reqForm.content = response.data.step_content[0];
		});
		
		$scope.next = function(reqForm, ind, requestForm, post) {
			if (requestForm.$valid) {
				//console.log(reqForm.fields);
				var params = post.params.static;
				if ( !params.new_rec  ){
					reqForm.sel = ind + 1;
				}
				
				if (post.params.dymanic.length) {
					var list = post.params.dymanic;
					console.log(list)
					var obj = {};
					for (var i = list.length; i--;) {
						if (reqForm.fields[list[i].name].h) {
							obj[list[i].key] = (reqForm.fields[list[i].name].h < 10 ? '0' + reqForm.fields[list[i].name].h : reqForm.fields[list[i].name].h) + ':' + 
							(reqForm.fields[list[i].name].m < 10 ? '0' + reqForm.fields[list[i].name].m : reqForm.fields[list[i].name].m);
						} else {
							obj[list[i].key] = reqForm.fields[list[i].name];
						}
					}
					params = angular.extend(params, obj);
				}
				if (params.confirm && params.request_type == 'delete') {
					console.log('del form');
					paramsCache.push(params);
					goPost(params);
					formSrv.setReview(reqForm);
				} else if (params.confirm) {
					formSrv.setReview(reqForm);
				}
				paramsCache.push(params);
				console.log(params)
				goPost(params);
			}
		};
		
		$scope.prev = function(reqForm, ind) {
			if (reqForm.sel >= ind) {
				reqForm.sel = ind;
				goPost(paramsCache[ind - 1]);
			}
		};

		$scope.search = function(term, reqForm, io) {
			if (io.data_id && term) {
				formSrv.getSearchResults(io.data_id, term).then(function(response) {
					$scope.reqForm.searchResults = response.data;
					//console.log(response.data);
					if ($scope.reqForm.searchResults.length) {
						$scope.reqForm.showSearchResults = true;
					}
				});
			}
		};
		
		$scope.reload = function(e) {
			e.preventDefault();
			
			$state.go($state.current, { id: $stateParams.id }, { reload: true });
		};
		
		function goPost(params) {
			console.log(FORM.DATA_PATH.FORM);
			console.log(params);
			mainSrv.doPost(FORM.DATA_PATH.FORM, params).then(function(response) {
				console.log(response.data.step_content[0]);
				$scope.reqForm.content = response.data.step_content[0];
			});			
		}
	}]);