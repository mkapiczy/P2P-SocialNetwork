// app.js
let app = angular.module('socialApp', ['ui.router', 'ngCookies']);

app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/');
    $locationProvider.hashPrefix('');

    $stateProvider
        .state('home', {
            url: "/",
            component: 'homeComponent'
        })

        .state('registration', {
            url: '/register',
            component: 'registrationComponent'
        })

        .state('start', {
            url: '/startpage',
            component: 'startPageComponent'
        })

        .state('ack', {
            url: '/ack',
            component: 'ackComponent'
        })
});