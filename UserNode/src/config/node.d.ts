declare namespace NodeJS {
    interface Global {
        baseNode: any,
        node: any,
        BucketManager: any,
        AcknowledgmentRequestManager: any,
        ChatMsgManager: any,
        SignedKeyManager: any,
        publicKey: any,
        privateKey: any
    }
}