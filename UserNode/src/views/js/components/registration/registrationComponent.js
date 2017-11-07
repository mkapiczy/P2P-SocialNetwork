'use strict';

angular.module('socialApp')

    .component('registrationComponent', {

        bindings: {},

        },
        
        controller: ['$http', 'ui.router', 'ngCookies', function($http, $stateProvider, $cookies){
            this.register = function(){
                console.log("Username: " + this.form.username);
                console.log("Approver: " + this.form.approver);
                // TODO Very bad hack, this should be in configuration but for easier testing we read the port in node.js from console.
                // Should be read only once on home controller and saved in module constants
                let apiEndpoint = $location.absUrl().split('/#!')[0];
                $http.post(apiEndpoint + "/register/", {
                    username: this.form.username,
                    approver: this.form.approver
                }).then(function (data) {
                    console.log("Response from server:" + data.data);
                    //$cookies.put("username", data.data.Username);
                    //$stateProvider.state.go('start');                    
                });
            }
        }],

        controllerAs: 'regCtr',

        templateUrl: './registration-form.html'

    });
