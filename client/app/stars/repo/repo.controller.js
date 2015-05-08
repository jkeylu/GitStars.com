angular.module('gitStarsApp')
  .controller('StarsRepoCtrl', function ($scope, $http, $location, $window) {
    $scope.activedRepo = null;
    $scope.repos = [
      { id: 1, full_name: 'jkeylu/hello', description: 'this is very good example!', stargazers_count: 10, watchers_count: 5, forks_count: 3 },
      { id: 2, full_name: 'jkeylu/world', description: 'it is an hello world', stargazers_count: 1050, watchers_count: 66, forks_count:23 },
      { id: 3, full_name: 'jkeylu/world', description: 'it is an hello world', stargazers_count: 1050, watchers_count: 66, forks_count:23 },
      { id: 4, full_name: 'jkeylu/world', description: 'it is an hello world', stargazers_count: 1050, watchers_count: 66, forks_count:23 },
      { id: 5, full_name: 'jkeylu/world', description: 'it is an hello world', stargazers_count: 1050, watchers_count: 66, forks_count:23 },
      { id: 6, full_name: 'jkeylu/world', description: 'it is an hello world', stargazers_count: 1050, watchers_count: 66, forks_count:23 },
      { id: 7, full_name: 'jkeylu/world', description: 'it is an hello world', stargazers_count: 1050, watchers_count: 66, forks_count:23 },
      { id: 8, full_name: 'jkeylu/verylongverylongverylongverylongverylongverylong', description: 'it is an hello world, it is very long! very long! very long! very long!', stargazers_count: 99, watchers_count: 3, forks_count: 6 }
    ];
    $scope.activeRepo = function(repo) {
      $scope.activedRepo = repo;
    };
  });
