angular.module('gitStarsApp')
  .controller('StarsCtrl',
    ['$scope', 'Tag', 'Star', 'socket', '$http', '$timeout', '$location', 'Auth',
    function ($scope, Tag, Star, socket, $http, $timeout, $location, Auth) {
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

      // pull stars button
      $scope.pullState = 'Pull Stars';
      $scope.pullStars = function() {
        var t1 = new Date();
        $scope.pullState = 'Pulling';
        var done = function() {
          var t2 = new Date();
          var delay = 1500 - (t2 - t1);
          if (delay < 0) {
            delay = 0;
          }
          $timeout(function() {
            $scope.pullState = 'Pull Stars';
          }, delay);
        };
        Star.sync(done, done);
      };


      $scope.tags = [];

      Auth.isLoggedInAsync(function(loggedIn) {
        if (!loggedIn) {
          $location.path('/login');
          return;
        }

        $scope.pullStars();
        fetch(1);

        // socket
        socket.syncUpdates('star', $scope.repos);
        $scope.$on('$destroy', function () {
          socket.unsyncUpdates('star');
        });

        // fetch all tags
        $scope.tags = Tag.query();
      });


      // sidebar filter
      var filters = {
        search: '',
        taggedState: 'All',
        starredState: 'All',
        sortField: 'created_at',
        languages: [],
        tags: [],
        sortReverse: true, // DESC
        tagsFilterLogic: 'AND'
      };
      $scope.filters = filters;

      $scope.filterBySearch = function(repo) {
       if (!filters.search) return true;
       var search = filters.search.toLowerCase()
         , fullName = repo.full_name.toLowerCase()
         , description = repo.description;
       if (fullName.indexOf(search) >= 0) return true;
       if (description && description.toLowerCase().indexOf(search) >= 0) return true;
       return false;
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
        if (!repo.readme) {
          $http.get('/api/repos/' + repo.full_name + '/readme').success(function(data) {
            repo.readme = data;
          });
        }
      };
    }]
  );
