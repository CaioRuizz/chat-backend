import { Request, Response } from "express";
import Message from "../models/message";
import User from "../models/user";
import Token from "../models/token";

export const enviaMensagem = async (req: Request, res: Response) => {
    const fromUserId: string | undefined = req.headers.token?.toString();
    const toUsername: string | undefined = req.body.toUsername?.toString();
    const message: string | undefined = req.body.message?.toString();

    if (!fromUserId) {
        return res.status(403).json({
            message: 'faltando header de token',
        });
    }

    if(!toUsername || !message) {
        return res.status(400).json({
            message: 'Campos message e toUsername obrigatórios',
        });
    }

    const validaToken = await Token.findById(fromUserId);

    if (!validaToken) {
        return res.status(403).json({
            message: 'não autorizado',
        });
    }

    const fromUser = await User.findById(validaToken.user)

    if (!fromUser) {
        return res.status(403).json({
            message: 'não autorizado',
        });
    }

    const toUser = await User.findOne({ username: toUsername });

    if (!toUser) {
        return res.status(404).json({
            message: 'toUsername fornecido não representa nenhum usuário'
        });
    }

    const newMessage = new Message({
        fromUser: fromUser._id.toString(),
        toUser: toUser._id.toString(),
        message,
        sentAt: new Date(),
    });
    
    await newMessage.save();

    res.json({
        message: 'mensagem enviada',
    });
}

export const listarConversas = async (req: Request, res: Response) => {
    const token: string | undefined= req.headers.token?.toString();

    if (!token) {
        return res.status(403).json({
            message: 'não autorizado',
        });
    }

    const validaToken = await Token.findById(token);

    if (!validaToken) {
        return res.status(403).json({
            message: 'não autorizado',
        });
    }

    const fromUser = await User.findById(validaToken.user)

    if (!fromUser) {
        return res.status(403).json({
            message: 'não autorizado',
        });
    }

    const messages = await Message.find({ fromUser })
    const toUsersId = messages
        .map(m => m.toUser)
        .filter((value, index, array) => array.indexOf(value) === index); //deduplica
    
    const toUsernames: string[] = [];

    await Promise.all(toUsersId.map((id) => {
        return new Promise(resolve => {
            User.findById(id).then(r => {
                if (r) {
                    toUsernames.push(r.username);
                    resolve(r);
                }
            })
        });
    }));

    return res.json({
        chatsUsername: toUsernames,
    })
}