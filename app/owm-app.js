angular.module('OWMApp', ['ngRoute', 'ngAnimate'])
  //Value block for defining owmCities
  .value('owmCities', ['New York', 'Dallas', 'Chicago'])

  //Config block for definitiv the $routeProvder. When first, then first, when second then second etc.
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: './home.html',
        controller: 'HomeCtrl',
        controllerAs: 'vm'
      })
      .when('/cities/:city', {
        templateUrl: 'city.html',
        controller: 'CityCtrl',
        controllerAs: 'vm',
        //Resolve: Code stops until resolved. Only then continues. Thanks to that we have city variable to use in controller
        resolve: {
          //adding a city dependency. This variable can be used in the controller after it is resolved
          city: function(owmCities, $route, $location) {
            var city = $route.current.params.city;
            if (owmCities.indexOf(city) == -1) {
              $location.path('/error');
              return;
            }
            return city;
          }
        }
      })
      .when('/error', {
        template: '<h1>Error Page Not Found</h1><p>Please try another city</p>'
      })
      .otherwise('/error');
  }])
  //Intercepting routing event with $rootScope for when a route is not found or a resolver fails
  // Always same setup: run block with '$rootScope', '$location', '$timeout' services injected, that are beeing used in the function
  .run(function($rootScope, $location, $timeout) {
    // Then using the rootScoop.$on method to see if there was a routeChangeError(created by ngRoute if error in routing)
    $rootScope.$on('$routeChangeError', function() {
      //If there is a $routeChangeError, set the $location services .path function to the /error template
        $location.path("/error");
    });
    // When route Change Starts, set isLoading variable to true
    $rootScope.$on('$routeChangeStart', function() {
        $rootScope.isLoading = true;
    });
    // When route Change successful, wait a second and then set isLoading variable to false
    $rootScope.$on('$routeChangeSuccess', function() {
      //timout function is only needed to simulate a request to the server with a delay. Otherwise you would never see the effect
      $timeout(function() {
        $rootScope.isLoading = false;
      }, 1000);
    });
})
  .controller('HomeCtrl', [function() {
    //empty for now
  }])
  .controller('CityCtrl', ['city', function(city) {
    var vm = this;
    vm.city = city;
  }]);
