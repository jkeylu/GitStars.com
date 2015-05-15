'use strict';

angular.module('gitStarsApp')
  .factory('Star', ['$resource', function ($resource) {
    return $resource('/api/stars/:id/:controller/:tag', null, {
      sync: {
        method: 'PUT'
      },
      delete: {
        method: 'DELETE',
        params: { id: '@id' }
      },
      updateTags: {
        method: 'PUT',
        params: { id: '@id', controller: 'tags' }
      },
      removeTag: {
        method: 'DELETE',
        params: { id: '@id', controller: 'tags', tag: '@tag' }
      }
    });
  }]);
