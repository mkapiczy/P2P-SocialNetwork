'use strict';

angular.module('socialApp')
    .component('startPageComponent', {

        bindings: {},

        controller: ['$http', '$cookies', '$location', function ($http, $cookies, $location) {
            const self = this;
            this.numberOfMessages = 0;
            console.log($cookies.get("username"));
            this.$onInit = function () {
                let apiEndpoint = $location.absUrl().split('/#')[0];
                let port = $location.port();
                let username = $cookies.get("username_" + port);
                $http.get(apiEndpoint + "/data/ack/pending/number", {
                    params: {username: 0}
                }).then(function (response) {
                    console.log("Response from server:" + response.data.numberOfPendingMessages);
                    self.numberOfMessages = response.data.numberOfPendingMessages;
                });
            };
        }],

        controllerAs: 'startCtr',

        templateUrl: './start-page.html'

    });
