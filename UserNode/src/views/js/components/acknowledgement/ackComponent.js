'use strict';

angular.module('socialApp')
    .component('ackComponent', {

        bindings: {},

        controller: ['$http', '$cookies', '$location', function ($http, $cookies, $location) {
            const self = this;
            this.messages = [];

            this.$onInit = function () {
                let apiEndpoint = $location.absUrl().split('/#')[0];
                let port = $location.port();
                let username = $cookies.get("username_" + port);
                $http.get(apiEndpoint + "/data/ack/pending/messages", {
                    params: {username: 0}
                }).then(function (response) {
                    console.log("Response from server:" + response.data.messages);
                    self.messages = response.data.messages;
                });
            };

            this.processMessage = function (username) {
                let apiEndpoint = $location.absUrl().split('/#')[0];
                console.log(username);
                $http.post(apiEndpoint + "/data/ack/process", {
                    username: username,
                    myUsername: 0
                }).then(function (response) {
                    console.log("Response from server:" + response.data);
                });
            };
        }],

        controllerAs: 'ackCtr',
        templateUrl: './ack.html',
        params: {
            msg: ''
        }

    });