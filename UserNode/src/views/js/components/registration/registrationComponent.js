'use strict';

angular.module('socialApp')

    .component('registrationComponent', {

        bindings: {},

        controller: ['$http', '$location', '$cookies', '$state', function ($http, $location, $cookies, $state) {
            this.register = function () {
                console.log("Username: " + this.form.username);
                console.log("Approver: " + this.form.approver);
                // TODO Very bad hack, this should be in configuration but for easier testing we read the port in node.js from console.
                // Should be read only once on home controller and saved in module constants
                let apiEndpoint = $location.absUrl().split('/#')[0];
                let port = $location.port();
                $http.post(apiEndpoint + "/register/", {
                    username: this.form.username,
                    approver: this.form.approver
                }).then(function (data) {
                    console.log("Response from server:" + data.data.message);
                    $cookies.put("username_" + port, data.data.username);
                    $state.go('home', {msg: "Registered. Wait for approbal"});
                });
            }
        }],

        controllerAs: 'regCtr',

        templateUrl: './registration-form.html'

    });
