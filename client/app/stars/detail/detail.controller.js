angular.module('gitStarsApp')
  .controller('StarsDetailCtrl', function ($scope, Star) {
    $scope.starringOrUnstarring = false;
    $scope.starOrUnstar = function() {
      var activedRepo = $scope.activedRepo;
      if (!activedRepo) {
        return;
      }

      $scope.starringOrUnstarring = true;
      var data;
      if (!activedRepo.gs_unstarred_at) {
        var arr = activedRepo.full_name.split('/');
        data = {
          owner: arr[0],
          repo: arr[1]
        };
        Star.unstar(null, data, function() {
          $scope.activedRepo = null;
          $scope.starringOrUnstarring = false;
        }, function() {
          $scope.starringOrUnstarring = false;
        });
      } else {
        data = { full_name: activedRepo.full_name };
        Star.star(data, function() {
          activedRepo.gs_unstarred_at = null;
          $scope.starringOrUnstarring = false;
        }, function() {
          $scope.starringOrUnstarring = false;
        });
      }
    };
    $scope.tagTransform = function(tag) {
      return {
        name: tag
      };
    };
    $scope.tagOnSelect = function(item, model) {
      var activedRepo = $scope.activedRepo;
      if (!activedRepo) {
        return;
      }
      activedRepo.tags.push(item.name);
      var params = { id: activedRepo.id };
      var tags = _.map(activedRepo.objTags, function(tag) { return tag.name; });
      Star.updateTags(params, tags);
      if (_.findIndex($scope.tags, function(t) { return t.name == item.name; }) < 0) {
        $scope.tags.push(item);
      }
    };
    $scope.tagOnRemove = function(item, model) {
      var activedRepo = $scope.activedRepo;
      if (!activedRepo) {
        return;
      }
      _.pull(activedRepo.tags, item.name);
      activedRepo.$removeTag({ tag: item.name });
    };
  });
