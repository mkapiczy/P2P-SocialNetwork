'use strict';

angular.module('socialApp')
    .component('homeComponent', {

        bindings: {},

        controller: function ($http, $location, AuthService) {
            this.login = function () {
                setErrorText("");

                AuthService.login(this.form.username, (response) => {
                    if (response.status === 200) {
                        $location.path('/startpage');
                    } else {
                        setErrorText(response);
                    }
                });
            };

            this.logOut = function () {
                setErrorText("");

                AuthService.logout((response) => {
                    console.log("Status: " + response.status);
                    if (response.status === 200) {
                        $location.path('/home');
                    } else {
                        setErrorText(response);
                    }
                });
            };

            function setErrorText(txt) {
                document.getElementById("errorMsg").innerText = txt;
            }
        },

        controllerAs: 'homeCtr',
        templateUrl: './home.html',
        params: {
            msg: ''
        }

    });