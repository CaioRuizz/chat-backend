import { Schema, model } from 'mongoose';

export interface IMessage {
    fromUser: String,
    toUser: String,
    message: String,
    sentAt: String,
}

const messageSchema = new Schema<IMessage>({
    fromUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    toUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    sentAt: {
        type: Date,
        required: true,
    },
});

const Message = model('Message', messageSchema);

export default Message;