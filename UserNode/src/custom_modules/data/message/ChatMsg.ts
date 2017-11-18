export class ChatMsg {
    id: String;
    toUsername: String;
    fromUsername: String;
    timestamp: Date;
    message: String;

    constructor(id: String, fromUsername: String, toUsername: String, message: String) {
        this.id = id;
        this.fromUsername = fromUsername;
        this.toUsername = toUsername;
        this.timestamp = new Date();
        this.message = message;
    }
}