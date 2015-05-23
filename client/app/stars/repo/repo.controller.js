angular.module('gitStarsApp')
  .controller('StarsRepoCtrl', function ($scope) {
    $scope.filterTag = function(tag) {
      $scope.filters.tags = [tag];
    };
  });
