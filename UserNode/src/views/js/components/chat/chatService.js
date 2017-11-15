'use strict';

angular
    .module('socialApp')
    .factory('ChatService', ChatService);

ChatService.$inject = ['$http', '$cookies', '$rootScope', '$location'];

function ChatService($http, $cookies, $rootScope, $location) {
    let service = {};


    return service;
}