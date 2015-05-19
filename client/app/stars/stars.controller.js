angular.module('gitStarsApp')
  .controller('StarsCtrl',
    ['$scope', 'Tag', 'Star', 'socket',
    function ($scope, Tag, Star, socket) {
      // fetch all repos
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

      // fetch all tags
      $scope.tags = Tag.query();


      // sidebar filter
      var filters = {
        search: '',
        taggedState: 'All',
        starredState: 'All',
        sortField: 'created_at',
        languages: [],
        tags: [],
        sortReverse: false,
        tagsFilterLogic: 'AND'
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
      $scope.filterByTags = function(repo) {
        if (filters.tags.length == 0) {
          return true;
        }
        if (filters.tagsFilterLogic == 'AND') {
          return _.difference(filters.tags, repo.tags).length == 0;
        } else {
          return _.intersection(filters.tags, repo.tags).length > 0;
        }
      };


      $scope.activedRepo = null;
      $scope.activeRepo = function(repo) {
        $scope.activedRepo = repo;
        $scope.activedRepo.objTags = _.map(repo.tags, function(tag) {
          return { name: tag };
        });
      };
    }]
  );
