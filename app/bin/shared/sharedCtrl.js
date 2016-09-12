angular.module('sharedMod')
	.controller('sharedCtrl', ['$scope', function($scope) {
		
		$scope.setSelected = function(val, key, reqForm, io) {
			if (key) {
				if (key === val.value) {
					reqForm.fields[io.name] = key;
				}
			} else {
				if (io.type === 'spinbox') {
					reqForm.fields[io.name] = parseInt(val, 10);
				} else if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
					//console.log(val)
					reqForm.fields[io.name] = val;						
				}
			}
			if (reqForm.review) {
				reqForm.review[io.label] = io;
			}
		};
		
	}]);