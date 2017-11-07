'use strict';

angular.module('socialApp')
    .component('startPageComponent', {

        bindings:{

        },

        controller: ['$http', '$cookies', function($http, $cookies){
            this.numberOfMessages = 0;
            console.log($cookies.get("username")),
            this.$onInit = function() {
                $http.get("http://localhost:8000/data/ack/pending_messages", {
                    username: $cookies.get("username")
                }).then(function (data) {
                    console.log("Response from server:" + data.data.messages.length);
                    this.numberOfMessages = data.data;
                });
              };
        }],

        controllerAs: 'startCtr',

        templateUrl: './start-page.html'

});
