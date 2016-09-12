angular.module('carouselMod')
	.directive('sapCarousel', ['CAROUSEL', '$timeout', function(CAROUSEL, $timeout) {
		return {
			templateUrl: CAROUSEL.VIEW_PATH,
			link: function(scope, elem, attrs) {
				$timeout(function() {
					$('.carousel').carousel({
						interval: CAROUSEL.INTERVAL
					})
				});
			}
		};
	}]);