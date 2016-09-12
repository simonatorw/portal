angular.module('faveMod')
	.directive('sapFocus', ['$timeout', function($timeout) {
		return {
			link: function(scope, elem, attrs) {
				scope.focus = function() {
					$timeout(function() {
					$('.saveQueryDropdown').find('.textBox').focus();
					});
				};
			}
		};
	}]);