import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import Token, {IToken} from "../models/token";
import token from "../models/token";

export const login = async (req: Request, res: Response) => {
    const username: string | undefined = req.body.username?.toString();

    console.log(username)

    if (!username) {
        return res
            .status(400)
            .json({message: 'É necessário informar o username no body'});
    }

    let user = await User.findOne({ username });

    if (!user) {
        user = new User({
            username,
        });

        await user.save();
    }

    const newToken = new Token({
        user: user._id.toString(),
    });

    const inserted = await newToken.save();

    return res.status(201).json({
        username: user.username,
        token: inserted._id,
        message: 'OK',
    });
}

export const listaUsuarios = async (req: Request, res: Response) =>  {
    const users = await User.find({})
    return res.status(200).json(users.map(u => ({username: u.username})))
}