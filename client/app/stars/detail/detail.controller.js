angular.module('gitStarsApp')
  .controller('StarsDetailCtrl',
    ['$scope', 'Star',
    function ($scope, Star) {
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
