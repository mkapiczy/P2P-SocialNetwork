import {Request, Response, Router} from 'express';
import {ValueTypeEnum} from "../custom_modules/enum/ValueTypeEnum";

import KademliaValueManager from '../custom_modules/kademlia/KademliaValueManager'
import {ChatMsg} from "../custom_modules/data/message/ChatMsg";

const Kademlia = require("../custom_modules/kademlia/kademlia");
const kademlia = new Kademlia();

class ChatService {

    constructor() {
    }

    public publishChatMsgIntoTheNetwork(recipientUsername: String, message: String, callback) {
        let senderUsername = global.node.username;
        let key = senderUsername + recipientUsername;
        console.log("Publish key " + key);
        KademliaValueManager.getAvailableKey(key, 0, ValueTypeEnum.CHAT_MSG, (availableKey) => {
            console.log("Value stored with the key " + availableKey);
            let chatMessage = new ChatMsg(availableKey, senderUsername, recipientUsername, message);
            kademlia.storeValue(availableKey, chatMessage, ValueTypeEnum.CHAT_MSG, global.ChatMsgManager, () => {
                callback();
            });
        });
    }

    public getChatMsg(contactUsername: String, callback: (result: Array<ChatMsg>) => void) {
        let messages = [];
        this.getChatMessages(contactUsername, global.node.username, messagesToMe => {
            messages = messages.concat(messagesToMe);

            this.getChatMessages(global.node.username, contactUsername, messagesFromMe => {

                messages = messages.concat(messagesFromMe);

                messages = this.uniqueMessagesByTimestamp(messages);

                messages = messages.sort((a, b) => {
                    a = new Date(a.timestamp);
                    b = new Date(b.timestamp);
                    return a - b;
                });

                callback(messages);
            })
        });


    }

    private getChatMessages(fromUsername: String, toUsername: String, callback: (result: Array<ChatMsg>) => void) {
        let messages = [];

        let key = fromUsername + "" + toUsername;
        console.log("Get msg key " + key);
        let localMessages = global.ChatMsgManager.findAllValuesForRelatedKeys(key);
        if (localMessages) {
            console.log("Found local messages " + JSON.stringify(localMessages));
            messages = messages.concat(localMessages);
        }
        KademliaValueManager.getAllValuesForRelatedKeys(key, ValueTypeEnum.CHAT_MSG, (networkmessages) => {
            console.log("Network " + JSON.stringify(networkmessages));
            if (networkmessages) {
                messages = messages.concat(networkmessages);
            }
            messages = this.uniqueMessagesByTimestamp(messages);
            callback(messages);
        });
    }


    private uniqueMessagesByTimestamp(messages) {
        let flags = {};
        return messages.filter(msg => {
            if (flags[msg.id]) {
                return false;
            }
            flags[msg.id] = true;
            return true;
        });
    }


}


export default new ChatService();

