'use strict';

angular.module('socialApp')
    .component('startPageComponent', {

        bindings: {},

        controller: ['$http', '$cookies', '$location', '$rootScope', 'AuthService',
            function ($http, $cookies, $location, $rootScope, AuthService) {
                const self = this;
                this.numberOfMessages = 0;
                console.log($cookies.get("username"));

                this.$onInit = function () {
                    let apiEndpoint = $location.absUrl().split('/#')[0];
                    let port = $location.port();
                    let username = $cookies.get("username_" + port);
                    $http.get(apiEndpoint + "/data/ack/pending/number", {
                        params: {username: $rootScope.globals.currentUser.username}
                    }).then(function (response) {
                        console.log("Response from server:" + response.data.numberOfPendingMessages);
                        self.numberOfMessages = response.data.numberOfPendingMessages;
                    });
                };

                this.logOut = function () {
                    AuthService.logOut((response) => {
                        $location.path('/');
                    });
                };
            }],

        controllerAs: 'startCtr',

        templateUrl: './start-page.html'

    });
