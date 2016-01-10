angular.module('mayFormApp', ['ui.router', 'ngAnimate', 'ngTouch', 'ngCookies'])
    
    .run(function($rootScope){
      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      $rootScope.stateName =toState.name;

   })
     
    })


    .config(['$stateProvider',
             '$urlRouterProvider',
             '$locationProvider',
             function($stateProvider,
                      $urlRouterProvider,
                      $locationProvider) {
                $locationProvider.html5Mode({
                enable: false,
                requireBase: false,
                rewriteLinks: false
              });

              $stateProvider
                  .state('welcome', {
                    url: '',

                    templateUrl: 'index1.html',
                    
                    controller: ['$cookies', '$state', '$scope', function($cookies, $state, $scope){
                    $scope.swipeLeft = function() {
                      $state.go('register');
                    }

                    $cookies.putObject('mars_user', undefined);
                    }]
                  })

              $stateProvider
                    .state('register', {
                    url: '/register',

                    templateUrl: 'index2.html',
                    controller: 'RegisterFormCtrl',

                  resolve:{
                    user: ['$cookies',function($cookies){
                      if($cookies.getObject('mars_user')){
                        $state.go('encounter');
                      }
                  }]
                }
                  })


                $stateProvider
                  .state('encounter', {
                    url: '/encounter',
                   
                    controller: ['$scope', '$http', '$state', function($scope, $http, $state){
                    var ENCOUNTERS_API_URL = 'https://red-wdp-api.herokuapp.com/api/mars/encounters';

                        $http.get(ENCOUNTERS_API_URL).then(function(response){

                         $scope.encounters = response.data.encounters;

                         $scope.swipeLeft = function() {
                         $state.go('report');
                    }

                 });
                    
                    }],

                    templateUrl: 'index4.html'
                  })

                  $stateProvider
                  .state('report', {
                    url: '/report',

                    templateUrl: 'index3.html',
                    controller: 'ReportFormCtrl'
                  })


    }])


   
 
 .controller('RegisterFormCtrl', ['$scope','$state','$http', '$cookies', function($scope, $state, $http, $cookies){

            $scope.showValidation = false;
            var API_URL_GET_JOBS = "https://red-wdp-api.herokuapp.com/api/mars/jobs";
            var API_URL_CREATE_COLONIST = "https://red-wdp-api.herokuapp.com/api/mars/colonists";
            $scope.colonist={};

            $http.get(API_URL_GET_JOBS).then(function(response){

              $scope.jobs = response.data.jobs;

          });

    $scope.enter = function(e) {
        e.preventDefault();

        if ($scope.myForm.$invalid) {
            $scope.showValidation = true;
        } else{

          
          
            $http({
              method: 'POST',
              url: API_URL_CREATE_COLONIST,
              data: {colonist: $scope.colonist }
            }).then(function(response){

          $cookies.putObject('mars_user', response.data.colonist);
          $state.go('encounter');

          

        })
    }
  }

 }])

   .controller('ReportFormCtrl', ['$scope', '$http', '$cookies', '$state', function($scope, $http, $cookies, $state){
    
            $scope.showValidation = false;

            var API_URL_GET_ALIENS ="https://red-wdp-api.herokuapp.com/api/mars/aliens"
            var ENCOUNTERS_API_URL = 'https://red-wdp-api.herokuapp.com/api/mars/encounters';

            $scope.encounter = {date: '2015-10-24', colonist_id: $cookies.getObject('mars_user').id};

            $http.get(API_URL_GET_ALIENS).then(function(response){

              $scope.aliens = response.data.aliens;

          });
           

     $scope.submitReport = function(e){
       e.preventDefault();
       
       if ($scope.myForm.$invalid) {
            $scope.showValidation = true;
        } else{


            $http({
              method: 'POST',
              url: ENCOUNTERS_API_URL,
              data: {encounter: $scope.encounter}
            }).then(function(response){

         
          $state.go('encounter');

          //debugger;

        })

          
        }

     }
   }])

