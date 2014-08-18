'use strict';


// Declare app level module which depends on filters, and services
var gameApp = angular.module('theGame', [
  'ngResource',
  'ngRoute',
  'theGame.filters',
  'theGame.services',
  'theGame.directives',
  'theGame.controllers',
  'ui.bootstrap'
]).
config(['$routeProvider', '$locationProvider', '$resourceProvider', function($routeProvider, $locationProvider, $resourceProvider) {
  //$locationProvider.html5Mode(true);
  $routeProvider.when('/', {templateUrl: 'partials/home.html', controller: 'HomeController'});
  $routeProvider.when('/game', {templateUrl: 'partials/game.html', controller: 'GameController'});
  $routeProvider.when('/snot', {templateUrl: 'partials/snot.html', controller: 'SnotController'});
  $routeProvider.otherwise({redirectTo: '/whark'});
}]);

var ModalController = function ($scope, $modal) {
  $scope.which = 'bob'
  $scope.open = function(which) {
    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: ModalInstanceController,
      resolve: {
        which: function() {
          return which
        }
      }
    })
  }
};

var ModalInstanceController = function($scope, $modalInstance, which) {

    $scope.which = which;

    $scope.ok = function() {
      $modalInstance.close()
    }

    $scope.cancel = function() {
      $modalInstance.dismiss()
    }
}

