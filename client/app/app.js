'use strict';

angular.module('gitStarsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'ui.select'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, uiSelectConfig) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');

    uiSelectConfig.theme = 'bootstrap';
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  // fix tooltip not working in angular-bootstrap 0.11.*
  // https://github.com/angular-ui/bootstrap/issues/2828#issuecomment-74919821
  .directive('tooltip', function() {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        attrs.tooltipPlacement = attrs.tooltipPlacement || 'top';
        attrs.tooltipAnimation = attrs.tooltipAnimation || true;
        attrs.tooltipPopupDelay = attrs.tooltipPopupDelay || 0;
        attrs.tooltipTrigger = attrs.tooltipTrigger || 'mouseenter';
        attrs.tooltipAppendToBody = attrs.tooltipAppendToBody || false;
      }
    };
  })

  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });
