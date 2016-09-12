angular.module('faveMod')
	.factory('faveSrv', ['$http', 'FAVE', 'mainSrv', 'STATES', function($http, FAVE, mainSrv, STATES) {
		var faves = [];
		
		function save(isSave, url, label, pillLabel) {
			url = decodeURIComponent(url);
			var params = url.split('/');
			var id = params[2];

			if (isSave) {
				for (var i = faves.length; i--;) {
					if (id === faves[i].fid) {
						return;
					}
				}
				
				var page = {
					fid: id,
					page_type: params[1],
					data_id: params[2].split(',,')[0],
					param_value: params[2].split(',,')[1],
					cache: params[4],
					pid: params[6],
					label: label,
					faveLabel: label + (params[1] === STATES.PILLS ? (' / ' + (pillLabel ? pillLabel : '')) : '')
				};
				console.log(page)
				faves.push(page);
			} else {
				for (var i = faves.length; i--;) {
					if (id === faves[i].fid) {
						faves.splice(i, 1);
						break;
					}
				}
			}
			localStorage.sap_faves = angular.toJson(faves);
			//faves = [];
			mainSrv.doPost(FAVE.DATA_PATH.FAVE_SAVE, {  fave_data: angular.toJson(faves) });

		}
		
		function isFave(id) {
			//id = decodeURIComponent(id);
			for (var i = faves.length; i--;) {
				if (id === faves[i].fid) {
					return true;
				}
			}
			return false;
		}
		
		function getFaves() {
			return $http.get(FAVE.DATA_PATH.FAVE).then(function(response) {
				if (response.data.fav_data && response.data.fav_data.length && response.data.fav_data[0] !== null) {
					faves = angular.fromJson(response.data.fav_data[0]);
					return faves;
				} else {
					return getFavesFromStorage();
				}
			}, function(response) {
				return getFavesFromStorage();
			});
		}
		
		function getFavesFromStorage() {
			if (!faves.length && localStorage.sap_faves) {
				faves = angular.fromJson(localStorage.sap_faves);
			}
			return faves;
		}
		
		return {
			save: save,
			isFave: isFave,
			getFaves: getFaves,
			getFavesFromStorage: getFavesFromStorage
		};
	}])
