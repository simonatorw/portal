angular.module('previewMod')
	.factory('previewSrv', ['$http', 'PREVIEW', function($http, PREVIEW) {
		function getData(id, value, isCached) {
			//console.log(isCached)
			var url = PREVIEW.DATA_PATH.PREVIEW.replace('{id}', id);
			url = url.replace('{value}', value);

			return $http.get(url, { cache: !!isCached });
		}
		
		return {
			getData: getData
		};
	}])
