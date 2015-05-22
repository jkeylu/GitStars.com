angular.module('gitStarsApp')
  .controller('StarsDetailCtrl',
    ['$scope', 'Star',
    function ($scope, Star) {
      $scope.starringOrUnstarring = false;
      $scope.starOrUnstar = function() {
        var activedRepo = $scope.activedRepo;
        if (!activedRepo) {
          return;
        }

        $scope.starringOrUnstarring = true;
        if (!activedRepo.gs_unstarred_at) {
          var arr = activedRepo.full_name.split('/');
          var params = {
            owner: arr[0],
            repo: arr[1]
          };
          Star.unstar(null, params, function() {
            $scope.activedRepo = null;
            $scope.starringOrUnstarring = false;
          }, function() {
            $scope.starringOrUnstarring = false;
          });
        } else {
          Star.star({ full_name: activedRepo.full_name }, function() {
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
      };
      $scope.tagOnRemove = function(item, model) {
        var activedRepo = $scope.activedRepo;
        if (!activedRepo) {
          return;
        }
        _.pull(activedRepo.tags, item.name);
        activedRepo.$removeTag({ tag: item.name });
      };
    }]
  );
