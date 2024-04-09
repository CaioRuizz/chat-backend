import { Schema, model } from 'mongoose';

export interface IUser {
    email: String,
    username: String,
    usernameChanged: Boolean,
}

const messageSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
    },
    usernameChanged: {
        type: Boolean,
        required: true,
    }
});

const User = model('User', messageSchema);

export default User;