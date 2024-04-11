import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import Token, {IToken} from "../models/token";

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/

export const login = async (req: Request, res: Response) => {
    const email: string | undefined = req.body.email;

    if (!email) {
        return res
            .status(400)
            .json({message: 'email em branco'});
    }

    if (!email.match(emailRegex)) {
        return res
            .status(400)
            .json({message: 'email inválido'});
    }

    const user = await User.findOne({ email });

    if (!user) {
        const newUser: IUser = {
            email,
            username: 'temp',
            usernameChanged: false,
        };

        console.log('newUser', newUser)

        await User.insertMany([newUser]);

        return res.status(201).json({
            message: 'Created',
        });
    }



    if (user.usernameChanged) {
        const newToken: IToken = {
            user: user._id.toString(),
        };
        const inserted = (await Token.insertMany(newToken))[0];
        return res.status(201).json({
            user: user.email,
            username: user.username,
            token: inserted._id,
            message: 'OK',
        });
    }

    return res.status(400).json({
        message: 'Erro, é necessário fornecer um usuário'
    });
}