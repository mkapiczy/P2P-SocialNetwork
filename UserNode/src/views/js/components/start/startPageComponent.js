'use strict';

angular.module('socialApp')
    .component('startPageComponent', {

        bindings:{

        },

        controller: ['$http', 'ngCookies', function($http, $cookies){
            this.numberOfMessages = 0;
            this.$onInit = function() {
                $http.get("http://localhost:8000/data/ack/pendingMessages", {
                    //username: $cookies.get("username"),
                }).then(function (data) {
                    console.log("Response from server:" + data.data.messages.length);
                    this.numberOfMessages = data.data;
                });
              };
        }],

        controllerAs: 'startCtr',

        templateUrl: './start-page.html'

});
