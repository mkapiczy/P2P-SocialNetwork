'use strict';

angular.module('socialApp')
    .component('startPageComponent', {

        bindings: {},

        controller: ['$http', '$cookies', '$location', function ($http, $cookies, $location) {
            const self = this;
            this.numberOfMessages = 0;
            console.log($cookies.get("username")),
                this.$onInit = function () {
                    let apiEndpoint = $location.absUrl().split('/#!')[0];
                    let port = $location.port();
                    let username = $cookies.get("username_" + port);

                    $http.get(apiEndpoint + "/data/ack/pending_messages",  {
                        params: { username: 0 } //Todo: 0 is hardcoded for testing with 8000, but we should use username cookies id
                    }).then(function (data) {
                        console.log("Response from server:" + data.data.messages.length);
                        self.numberOfMessages = data.data.messages.length;
                    });
                };
        }],

        controllerAs: 'startCtr',

        templateUrl: './start-page.html'

    });
