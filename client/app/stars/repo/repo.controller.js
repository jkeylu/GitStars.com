angular.module('gitStarsApp')
  .controller('StarsRepoCtrl', function ($scope, $http, $location, $window) {
    $scope.activedRepo = null;
    $scope.activeRepo = function(repo) {
      $scope.activedRepo = repo;
    };
  });
