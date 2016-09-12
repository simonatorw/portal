angular.module('tableMod')
	.controller('tableCtrl', ['$scope', '$sce', function($scope, $sce) {
		
		$scope.table = {
			list: []
		};
		var tableData = $scope.pills.data[$scope.page.id];
		
		if (tableData) {
			if (angular.isArray(tableData)) {
				var list = tableData;
			} else {
				var list = [tableData];
			}
			//console.log(list.length)
			for (var k = 0, max2 = list.length; k < max2; k++) {
				var obj = {
					title: list[k].table_title,
					report: list[k].report
				};
				
				var pillsData = list[k].data;
				if (angular.isArray(pillsData)) {
					pillsData = pillsData[0];
				}

				obj.data = pillsData;
				$scope.table.list.push(obj);
			}
		}
		$scope.parseLinks = function(value) {
			return $sce.trustAsHtml(value);
		};
		
	}]);