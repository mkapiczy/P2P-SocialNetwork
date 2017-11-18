'use strict';

angular.module('socialApp')
    .component('chatComponent', {

        bindings: {},

        controller: function ($http, $location, $rootScope, ChatService) {
            const self = this;
            this.messages = [];
            this.users = [];
            this.messageText = "";
            this.messageRecipient = {username: ""};

            this.$onInit = function () {
                if (self.users.length === 0) {
                    ChatService.getUsers(users => {
                        self.users = users;
                        self.messageRecipient.username = self.users[0].username;
                        this.refresh();
                    });

                }
            };

            this.refresh = function(){
                if (self.users.length > 0) {
                    self.users.forEach(user=>{
                        this.getMessagePreviewForUsername(user.username);
                    });


                    self.getMessages();
                }
            };

            this.changeUser = function (username) {
                console.log(username);
                self.messageText = "";
                self.messageRecipient.username = username;
                self.getMessages();
            };

            this.getMessages = function () {
                ChatService.getMessages(self.messageRecipient.username, (messages) => {
                    self.messages = messages;
                    if (self.messages.length > 0) {
                        self.users.forEach(usr => {
                            if (usr.username === self.messageRecipient.username) {
                                usr.lastMsgPreview = self.messages[messages.length - 1].message;
                            }
                        })
                    }
                })
            };

            this.getMessagePreviewForUsername = function (username) {
                ChatService.getMessages(username, (messages) => {
                    if (messages.length > 0) {
                        self.users.forEach(usr => {
                            if (usr.username === username) {
                                usr.lastMsgPreview = messages[messages.length - 1].message;
                            }
                        })
                    }
                })
            };

            this.sendMessage = function () {
                console.log("Sending message to " + self.messageRecipient.username + " message " + self.messageText);
                ChatService.sendMessage(self.messageRecipient.username, self.messageText);
                this.refresh();
                self.messageText = "";
            };


        },

        controllerAs: 'chatCtr',
        templateUrl: './chat.html',


    });