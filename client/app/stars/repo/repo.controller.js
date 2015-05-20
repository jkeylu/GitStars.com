angular.module('gitStarsApp')
  .controller('StarsRepoCtrl', function ($scope, $http, $location, $window) {
    $scope.filterTag = function(tag) {
      $scope.filters.tags = [tag];
    };
  });
