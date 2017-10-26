'use strict';

angular.module('socialApp')
    .component('registrationComponent', {

        bindings:{

        },

        controller: function(){
            this.register = function(){
                console.log("Username: " + this.form.username);
            }
        },

        controllerAs: 'regCtr',

        templateUrl: './registration-form.html'

});
