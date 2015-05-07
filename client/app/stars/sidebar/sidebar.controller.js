angular.module('gitStarsApp')
  .controller('StarsSidebarCtrl', function ($scope, $http, $location, $window) {
    $scope.filter = {};
    $scope.filter.show = 'All';
    $scope.filter.sort = 'Created';
    $scope.filter.languages = [];
    $scope.filter.tags = [];
  });
