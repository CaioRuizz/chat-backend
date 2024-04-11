import { Schema, model } from 'mongoose';

export interface IToken {
    user: String,
}

const tokenSchema = new Schema<IToken>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

const Token = model('Token', tokenSchema);

export default Token;