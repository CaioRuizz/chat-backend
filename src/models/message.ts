import { Schema, model } from 'mongoose';

export interface IMessage {
    fromUser: String,
    toUser: String,
    message: String,
    sentAt: String,
    all: Boolean
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
        required: false,
    },
    message: {
        type: String,
        required: true,
    },
    sentAt: {
        type: Date,
        required: true,
    },
    all: {
        type: Boolean,
        required: false,
        default: false,
    }
});

const Message = model('Message', messageSchema);

export default Message;