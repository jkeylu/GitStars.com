angular.module('gitStarsApp')
  .controller('StarsCtrl',
    ['$scope', '$q', 'Star', 'socket',
    function ($scope, $q, Star, socket) {
      $scope.repos = [];

      function fetch(page) {
        Star.query({ page: page }, function(repos) {
          if (repos.length > 0) {
            if (repos.length == 100) {
              fetch(++page);
            }
            for (var i = 0; i < repos.length; i++) {
              $scope.repos.push(repos[i]);
            }
          }
        });
      }
      fetch(1);

      Star.sync();

      socket.syncUpdates('star', $scope.repos);
      $scope.$on('$destroy', function () {
        socket.unsyncUpdates('star');
      });

      var filters = {
        search: '',
        taggedState: 'All',
        starredState: 'All',
        sortField: 'created_at',
        languages: [],
        tags: [],
        sortReverse: false
      };
      $scope.filters = filters;

      $scope.filterBySearch = function(repo) {
        return !filters.search
          || repo.full_name.indexOf(filters.search) >= 0
          || (repo.description && repo.description.indexOf(filters.search) >= 0);
      };
      $scope.filterByShow = function(repo) {
        var b = false;
        switch (filters.taggedState) {
          case 'All':
            b = true;
            break;
          case 'Tagged':
            b = repo.tags && repo.tags.length > 0;
            break;
          case 'Untagged':
            b = !repo.tags || repo.tags.length == 0;
            break;
        }
        if (!b) return b;
        switch (filters.starredState) {
          case 'All':
            b = true;
            break;
          case 'Starred':
            b = !repo.gs_unstarred_at;
            break;
          case 'Unstarred':
            b = !!repo.gs_unstarred_at;
            break;
        }
        return b;
      };
      $scope.filterByLanguages = function(repo) {
        return filters.languages.length == 0
          || filters.languages.indexOf(repo.language) >= 0;
      };

    }]
  );
