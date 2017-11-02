'use strict';

angular.module('socialApp')
    .component('registrationComponent', {

        bindings:{

        },

        controller: function($http){
            this.register = function(){
                console.log("Username: " + this.form.username);
                console.log("Approver: " + this.form.approver);

                $http.post("http://localhost:8000/register/", {
                    username: this.form.username,
                    approver: this.form.approver
                }).then(function (data) {
                    console.log("Response from server:" + data.data);
                });
            }
        },

        controllerAs: 'regCtr',

        templateUrl: './registration-form.html'

});
