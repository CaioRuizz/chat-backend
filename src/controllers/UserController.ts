import { Request, Response } from "express";
import User, { IUser } from "../models/user";

export const login = async (req: Request, res: Response) => {
    const email: String | undefined = req.body.email;

    if (!email) {
        return res
            .status(400)
            .json({message: 'fromUser em branco'});
    }

    const user = await User.findOne({ email });

    if (!user) {
        const newUser: IUser = {
            email,
            username: '',
            usernameChanged: false,
        };

        await User.insertMany(newUser);

        return res.status(201).json({
            message: 'Created',
        });
    }

    return res.json({
        message: 'OK',
    });
}