// app.js
let app = angular.module('socialApp', ['ui.router', 'ngCookies']);

app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/');
    $locationProvider.hashPrefix('');

    $stateProvider
        .state('home', {
            url: "/",
            component: 'homeComponent',
            authenticate: false
        })

        .state('registration', {
            url: '/register',
            component: 'registrationComponent',
            authenticate: false
        })

        .state('start', {
            url: '/startpage',
            component: 'startPageComponent',
            authenticate: true
        })

        .state('ack', {
            url: '/ack',
            component: 'ackComponent',
            authenticate: true
        })
});

app.run(function ($transitions, $location) {
    $transitions.onStart({to: '**'}, function (trans) {
        let auth = trans.injector().get('AuthService');
        if (trans.entering()[0].authenticate && !auth.isAuthenticated()) {
            $location.path('/');
        } else if ((trans.entering()[0].name === 'home' || trans.entering()[0].name === 'registration') && auth.isAuthenticated()) {
            $location.path('/startpage');
        }
    });
});