'use strict';

angular.module('socialApp')
    .component('ackComponent', {

        bindings: {},

        controller: ['$http', '$cookies', '$location','$rootScope', function ($http, $cookies, $location, $rootScope) {
            const self = this;
            this.messages = [];

            this.$onInit = function () {
                let apiEndpoint = $location.absUrl().split('/#')[0];
                let port = $location.port();
                let username = $cookies.get("username_" + port);
                $http.get(apiEndpoint + "/data/ack/pending/messages", {
                    params: {username: $rootScope.globals.currentUser.username}
                }).then(function (response) {
                    console.log("Response from server:" + response.data.messages);
                    self.messages = response.data.messages;
                });
            };

            this.processMessage = function (username, index, isConfirmed) {
                let apiEndpoint = $location.absUrl().split('/#')[0];
                console.log(username);
                $http.post(apiEndpoint + "/data/ack/process", {
                    username: username,
                    myUsername: $rootScope.globals.currentUser.username,
                    isConfirmed: isConfirmed
                }).then(function (response) {
                    self.messages.splice(index, 1);
                    console.log("Response from server:" + response.data);
                    document.getElementsByClassName("processBtn").disabled = true;
                });
            };
        }],

        controllerAs: 'ackCtr',
        templateUrl: './ack.html',
        params: {
            msg: ''
        }

    });