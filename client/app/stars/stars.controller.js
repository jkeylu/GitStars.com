angular.module('gitStarsApp')
  .controller('StarsCtrl',
    ['$scope', 'Tag', 'Star', 'socket', '$http', '$timeout', '$interval', '$location', 'Auth',
    function ($scope, Tag, Star, socket, $http, $timeout, $interval, $location, Auth) {
      // fetch all repos
      $scope.repos = [];
      function fetch(page, callback) {
        var done = function() {
          callback && callback();
        };
        var success = function(repos) {
          if (repos.length > 0) {
            if (repos.length == 100) {
              fetch(++page, callback);
            } else {
              done();
            }
            for (var i = 0; i < repos.length; i++) {
              $scope.repos.push(repos[i]);
            }
          } else {
            done();
          }
        };
        var error = done;
        Star.query({ page: page }, success, error);
      }

      // pull stars button
      var defaultPullTooltip = 'Click to pull stars from Github';
      $scope.pullState = 'Pull Stars';
      $scope.pullTooltip = defaultPullTooltip;
      $scope.pullBtnDisabled = false;
      function pulling() {
        $scope.pullState = 'Pulling';
        var t1 = new Date();

        return function() {
          var t2 = new Date();
          var delay = 1500 - (t2 - t1);
          if (delay < 0) {
            delay = 0;
          }
          $timeout(function() {
            $scope.pullState = 'Pull Stars';
          }, delay);
        };
      }
      $scope.pullStars = function() {
        if ($scope.pullBtnDisabled) {
          return;
        }
        $scope.pullBtnDisabled = true;
        var done = pulling();

        var success = function(data) {
          if (data && data.waitting) {
            var timesLeft = data.waitting;
            var t = 0;
            $interval(function() {
              if ((--timesLeft) == 0) {
               $scope. pullBtnDisabled = false;
                $scope.pullTooltip = defaultPullTooltip;
              } else {
                $scope.pullTooltip = 'Left ' + timesLeft + 's';
              }
            }, 1000, data.waitting);
          } else {
            $scope.pullBtnDisabled = false;
            $scope.pullTooltip = defaultPullTooltip;
          }
          done();
        };
        var error = function() {
          done();
        };
        Star.sync(success, error);
      };


      $scope.tags = [];

      Auth.isLoggedInAsync(function(loggedIn) {
        if (!loggedIn) {
          $location.path('/login');
          return;
        }

        fetch(1, function() {
          // socket
          socket.syncUpdates('star', $scope.repos);
          $scope.$on('$destroy', function () {
            socket.unsyncUpdates('star');
          });

          // pull stars from github
          $scope.pullStars();
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
