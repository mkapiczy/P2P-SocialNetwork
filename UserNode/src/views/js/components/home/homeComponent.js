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
                        setErrorText(response.data);
                    }
                });
            };

            this.logOut = function () {
                setErrorText("");
                AuthService.logout((response) => {
                    $location.path('/home');
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