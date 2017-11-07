'use strict';

angular.module('socialApp')
    .component('homeComponent', {

        bindings: {},

        controller: function ($http) {
            this.login = function(){
                console.log("Username: " + this.form.username);

                $http.post("http://localhost:8000/login/", {
                    username: this.form.username,
                }).then(function (data) {
                    console.log("Response from server:" + data.data);
                });
            };
        },

        controllerAs: 'homeCtr',
        templateUrl: './home.html'

    });