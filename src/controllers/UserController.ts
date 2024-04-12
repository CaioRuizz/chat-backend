import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import Token, {IToken} from "../models/token";

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/

export const login = async (req: Request, res: Response) => {
    const email: string | undefined = req.body.email?.toString();

    if (!email) {
        return res
            .status(400)
            .json({message: 'É necessário informar o email no body'});
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

        await User.insertMany(newUser);

        return res.status(201).json({
            message: 'Usuário criado, altere o nome para conseguir logar',
        });
    }



    if (user.usernameChanged) {
        const newToken: IToken = {
            user: user._id.toString(),
        };
        const inserted = (await Token.insertMany(newToken))[0];
        return res.status(200).json({
            user: user.email,
            username: user.username,
            token: inserted._id,
            message: 'OK',
        });
    }

    return res.status(400).json({
        message: 'Erro, é necessário fornecer um usuário antes de realizar login'
    });
}

export const alteraUsername = async (req: Request, res: Response) => {
    const email: string | undefined = req.body.email?.toString();
    const username: string | undefined = req.body.username?.toString();

    if (!email || !username) {
        return res.status(400).json({
            message: 'É necessário informar o email e o username no body'
        })
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({
            message: 'Nenhum usuário com esse email foi encontrado',
        });
    }

    const usernameJaUtilizado = await User.findOne({ username });

    if (usernameJaUtilizado && usernameJaUtilizado.email !== email) {
        return res.status(400).json({
            message: 'Username já está em uso',
        });
    }

    user.username = username;
    user.usernameChanged = true;

    await user.save();

    return res.json({
        message: 'Username alterado com sucesso!'
    });
}