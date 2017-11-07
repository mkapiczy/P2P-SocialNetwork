// app.js
let app = angular.module('socialApp', ['ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider

        .state('home', {
            url: "/",
            component: 'homeComponent'
        })

        .state('registration', {
            url: '/register',
            component: 'registrationComponent'
        })


});