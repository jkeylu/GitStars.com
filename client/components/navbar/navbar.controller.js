'use strict';

angular.module('gitStarsApp')
  .controller('NavbarCtrl', function ($scope, $location, $window, Auth) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/login/' + provider;
    };
  });
