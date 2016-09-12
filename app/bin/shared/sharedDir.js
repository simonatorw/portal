angular.module('sharedMod')
	.directive('sapDatepicker', [function() {
		return {
			link: function(scope, elem, attrs) {
				setTimeout(function() {
					elem.datepicker();
				});
			}
		};
	}]);