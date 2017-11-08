'use strict';

angular.module('socialApp')
    .component('startPageComponent', {

        bindings: {},

        controller: ['$http', '$cookies', '$location', function ($http, $cookies, $location) {
            this.numberOfMessages = 0;
            console.log($cookies.get("username")),
                this.$onInit = function () {
                    let apiEndpoint = $location.absUrl().split('/#!')[0];
                    let username = $cookies.get("username");
                    $http.get(apiEndpoint + "/data/ack/pending_messages?username=" + username, {}).then(function (data) {
                        console.log("Response from server:" + data.data.messages.length);
                        this.numberOfMessages = data.data;
                    });
                };
        }],

        controllerAs: 'startCtr',

        templateUrl: './start-page.html'

    });
