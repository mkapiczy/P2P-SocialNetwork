'use strict';

angular.module('socialApp')
    .component('registrationComponent', {

        bindings:{

        },
        
        controller: ['$http', 'ui.router', 'ngCookies', function($http, $stateProvider, $cookies){
            this.register = function(){
                console.log("Username: " + this.form.username);
                console.log("Approver: " + this.form.approver);

                $http.post("http://localhost:8000/register/", {
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