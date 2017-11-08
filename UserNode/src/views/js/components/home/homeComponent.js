'use strict';

angular.module('socialApp')
    .component('homeComponent', {

        bindings: {},

        controller: function ($http, $location) {
            this.login = function () {
                setErrorText("");

                let apiEndpoint = $location.absUrl().split('/#!')[0];
                $http.post(apiEndpoint + "/login/", {
                    username: this.form.username,
                }).then(function (data) {
                        console.log("Response from server:" + data.data);
                    },
                    function (error) {
                        setErrorText(error.data);
                        console.log(error.data);
                    });
            };

            function setErrorText(txt) {
                document.getElementById("errorMsg").innerText = txt;
            }
        },

        controllerAs: 'homeCtr',
        templateUrl: './home.html',
        params:{
            msg: ''
        }

    });