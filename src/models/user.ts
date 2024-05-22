import { Schema, model } from 'mongoose';

export interface IUser {
    username: string,
}

const messageSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
    },
});

const User = model('User', messageSchema);

export default User;