'use strict';

angular.module('gitStarsApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $window) {
    $scope.loginOauth = function(provider) {
      $window.location.href = '/login/' + provider;
    };
  });
