(function() {
	"use strict";

	angular
		.module("app")
			.controller("CurrentWeatherController", CurrentWeatherController);

	function CurrentWeatherController( $scope, WeatherService, WeatherClassService ) {
		/*jshint validthis:true */
		var vm = this;
		$scope.$watch('time', refreshData);

		function refreshData(){
			vm.desc = WeatherService.getWeatherDesc( $scope.time );
			vm.main = WeatherService.getWeatherState( $scope.time );
			vm.mainImageClass = WeatherClassService.getWeatherIconClass( $scope.time );
		}
	}
})();
