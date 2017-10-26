// app.js
var routerApp = angular.module('routerApp', ['ui.router']);

routerApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/register');

    $stateProvider

    // HOME STATES AND NESTED VIEWS ========================================
        .state('registration', {
            url: '/register',
            templateUrl: 'registration-form.html'
        })

        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('about', {
            // we'll get to this in a bit
        });

});