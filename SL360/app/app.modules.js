'use strict';
angular.module('modules', []).factory('panoramas', ['$http', function($http) {
    return {
        all: function(successCallback, errorCallback) {
            $http({
                method: 'GET',
                url: 'assets/resources/panoramas.json'
            }).success(function(data, status, headers, config) {
                successCallback(data);
            }).error(function(data, status, headers, config) {
                errorCallback(status);
            });
        }
    };
}]);