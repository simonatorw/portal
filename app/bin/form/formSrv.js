angular.module('formMod')
	.factory('formSrv', ['$http', 'FORM', 'mainSrv', function($http, FORM, mainSrv) {
		function getData(id, value) {
			var obj = {};
			obj[id] = value;
			return mainSrv.doPost(FORM.DATA_PATH.FORM, obj);
		}

		function getSearchResults(id, term) {
			var url = FORM.DATA_PATH.SEARCH.replace('{value}', term);
			url = url.replace('{id}', id);
			return $http.get(url);
		}
		
		function setReview(reqForm) {
			var keys = Object.keys(reqForm.review);
			
			for (var i = 0, max = keys.length; i < max; i++) {
				var obj = reqForm.review[keys[i]];
				var mod = reqForm.fields[obj.name];
				if (obj.type === 'selectlist') {
					obj.sel = obj.list[mod];
				} else if (obj.type === 'radio') {
					if (obj.value === mod) {
						obj.sel = 'Yes';
					} else {
						obj.sel = 'No';
					}
				} else if (obj.type === 'timepicker') {
					obj.sel = (mod.h < 10 ? '0' + mod.h : mod.h) + ':' +
						(mod.m < 10 ? '0' + mod.m : mod.m);
				} else {
					obj.sel = mod;
				}
			}
			console.log(reqForm.review)
		}
		
		return {
			getData: getData,
			getSearchResults: getSearchResults,
			setReview: setReview
		};
	}])
