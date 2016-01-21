'use strict';
angular.module('SL360', ['routes', 'modules', 'components']).config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);