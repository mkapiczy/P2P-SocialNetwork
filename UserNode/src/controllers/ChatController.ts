import {Request, Response, Router} from 'express';
import ChatService from "../service/ChatService";

const util = require("../custom_modules/util");
const constants = require("../config/constants");

const HttpStatus = require("http-status-codes");
const communicator = require("../custom_modules/kademlia/kademliaCommunicator");

class ChatController {
    router: Router = Router();

    constructor() {
        this.router.get("/", this.getChatMessage);
        this.router.get("/messages", this.getChatMessages);
        this.router.post("/message", this.sendMessage);
        this.router.post("/", this.storeChatMsg);
        this.router.get("/users", this.getUsers);
    }


    getChatMessage(request, response) {
        let value = global.ChatMsgManager.findValueByHashedKey(request.body.key);
        response.json({value: value});
    };

    public storeChatMsg(request, response) {
        console.log("Store chat message request received!");
        let key = request.body.key;
        let message = request.body.value;
        console.log("Message from : " + key + " | value: " + message);
        global.ChatMsgManager.storeValue(key, message);
        response.status(HttpStatus.OK);
        response.send("Ack message stored!");
    }

    public getUsers(request, response) {
        let users = [];
        global.BucketManager.buckets.forEach(bucket => {
            if (bucket.nodesList) {
                bucket.nodesList.forEach(node => {
                    users.push({username: node.username});
                })
            }
        });
        response.json({users: users});
    }

    public getChatMessages(request, response) {
        let username = request.query.username;
        console.log("Get chat messages from user " + username);
        ChatService.getChatMsg(username, (messages) => {
            response.json({messages: messages});
        })
    }

    public sendMessage(request, response) {
        let recipientUsername = request.body.username;
        let message = request.body.message;
        console.log("Send message " + message + " to " + recipientUsername);
        ChatService.publishChatMsgIntoTheNetwork(recipientUsername, message, () => {
            console.log("Message sent");
        })
    }

}

export default new ChatController().router;