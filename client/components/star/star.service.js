'use strict';

angular.module('gitStarsApp')
  .factory('Star', ['$resource', function ($resource) {
    return $resource('/api/stars/:id/:controller/:tag', null, {
      sync: {
        method: 'PUT',
        interceptor: {
          response: function(response) {
            if (response.status != 200) {
              return { waitting: 180 };
            }
            return response.resource;
          }
        }
      },
      star: {
        method: 'POST'
      },
      unstar: {
        method: 'DELETE',
        params: { id: '@owner', controller: '@repo' }
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
