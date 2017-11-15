'use strict';

angular.module('socialApp')
    .component('chatComponent', {

        bindings: {},

        controller: function ($http, $location, AuthService) {

            this.$onInit = function () {

            };

            this.sendMsg = function(){

            };

        },

        controllerAs: 'chatCtr',
        templateUrl: './chat.html',


    });