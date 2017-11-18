'use strict';

angular
    .module('socialApp')
    .factory('ChatService', ChatService);

ChatService.$inject = ['$http', '$cookies', '$rootScope', '$location'];

function ChatService($http, $cookies, $rootScope, $location) {
    let service = {};

    service.getMessages = getMessages;
    service.sendMessage = sendMessage;
    service.getUsers = getUsers;

    let apiEndpoint = $location.absUrl().split('/#')[0];

    function getMessages(username, callback) {
        $http.get(apiEndpoint + "/data/chat/messages", {
            params: {username: username}
        }).then(function (response) {
                console.log(response.data.messages);
                callback(response.data.messages);
            },
            (error_response) => {
                callback(error_response);
            });
    }

    function sendMessage(username, text) {
        $http.post(apiEndpoint + "/data/chat/message", {
            username: username,
            message: text
        }).then(function (response) {
                console.log(response);
            },
            (error_response) => {
            });
    }

    function getUsers(callback) {
        $http.get(apiEndpoint + "/data/chat/users", {}).then(function (response) {
                console.log(response.data.users);
                callback(response.data.users);
            },
            (error_response) => {
                callback(error_response);
            });
    }


    return service;
}