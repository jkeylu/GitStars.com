angular.module('gitStarsApp')
  .controller('StarsCtrl', function ($scope, $http, $location, $window) {
    $scope.stars = [];

    $http.get('/api/stars').success(function(stars) {
      $scope.stars = stars;
    });
  });
