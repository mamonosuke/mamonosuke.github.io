'use strict';
angular.module('routes', ['ngRoute']).config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.otherwise({
            templateUrl: './app/components/panoramaView/panoramaViewCtrl.js',
            controller: 'panoramaViewCtrl'
        });
    }
]);