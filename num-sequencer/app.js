var app = angular.module('numApp', []);


app.directive('ngBlur', function(){
  return function(scope, elem, attrs){
    elem.bind('blur', function(){
      scope.$apply(attrs.ngBlur);
    });
  };
});


function NumController($scope){
	$scope.numStart = 1000;
	$scope.numEnd = 2013;
	$scope.numRepeat = false;

	$scope.max = 100000;
	$scope.min = 1;

	// Computed object
	$scope.numData = {};
	$scope.numOutput = {}
	$scope.outputMessage = "Please enter a start and end number range."

	// Force numStart to always be less than numEnd
	$scope.updateNumStart = function(){
		if ($scope.numEnd < $scope.numStart){
			$scope.numStart = $scope.numEnd - 1;
		}
		if ($scope.numStart > 100000){
			$scope.numStart = 100000

			if($scope.numEnd < $scope.numStart){
				$scope.updateNumEnd()
			}
		}
		else if ($scope.numStart < -100000){
			$scope.numStart = -100000

			if($scope.numEnd < $scope.numStart){
				$scope.updateNumEnd()
			}
		}
	}

	// Force numEnd to always be more than numStart
	$scope.updateNumEnd = function(){
		if ($scope.numStart > $scope.numEnd){
			$scope.numEnd = $scope.numStart + 1;
		}

		if ($scope.numEnd > 100000){
			$scope.numEnd = 100000

			if($scope.numStart > $scope.numEnd){
				$scope.updateNumStart()
			}
		}
		else if ($scope.numEnd < -100000){
			$scope.numEnd = -100000

			if($scope.numStart > $scope.numEnd){
				$scope.updateNumStart()
			}
		}
	}

	// Main compute method
	$scope.compute = function(){
		console.log("Compute!")

		// Force number fixes
		$scope.updateNumStart()
		$scope.updateNumEnd()

		// Get data if numbers are input
		if (!(isNaN(parseInt($scope.numStart))) && !(isNaN(parseInt($scope.numEnd)))){
			$scope.numData = getLongestRun($scope.numStart, $scope.numEnd, $scope.numRepeat);
			$scope.output();
		}
	};

	$scope.output = function(){
		var hasData = Object.getOwnPropertyNames($scope.numData).length > 0;
		if (hasData){

			// Store length info before messing up the array
			$scope.numOutput.longest = $scope.numData[Object.keys($scope.numData)[0]].items.length
			$scope.numOutput.ranges = Object.keys($scope.numData).length

			// Tidy up output strings for page
			// for (key in $scope.numData){
			// 	$scope.numData[key].range = "[" + $scope.numData[key].range[0] + ", " + $scope.numData[key].range[1] + "]"
			// 	$scope.numData[key].items = $scope.numData[key].items.join(", ")
			// }

			

			if ($scope.numRepeat){
				$scope.updateOutputMessage("Found " + $scope.numOutput.ranges + " range(s) of repeating numbers with a length of " + $scope.numOutput.longest + ".");
			}
			else{
				$scope.updateOutputMessage("Found " + $scope.numOutput.ranges + " range(s) of non-repeating numbers with a length of " + $scope.numOutput.longest + ".");	
			}
		}
		else{
			if ($scope.numRepeat){
				$scope.updateOutputMessage("No repeating number(s) found between " + $scope.numStart + " " + $scope.numEnd + ".");
			}
			else{
				$scope.updateOutputMessage("No non-repeating number(s) found between " + $scope.numStart + " " + $scope.numEnd + ".");	
			}
		}
	}

	$scope.updateOutputMessage = function(msg){
		$scope.outputMessage = msg;
	}
	
}

