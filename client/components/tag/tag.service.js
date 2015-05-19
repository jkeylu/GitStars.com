'use strict';

angular.module('gitStarsApp')
  .factory('Tag', ['$resource', function ($resource) {
    return $resource('/api/tags');
  }]);
