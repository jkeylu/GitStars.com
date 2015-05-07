'use strict';

angular.module('gitStarsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('stars', {
        url: '/stars',
        templateUrl: 'app/stars/stars.html',
        controller: 'StarsCtrl'
      });
  });
