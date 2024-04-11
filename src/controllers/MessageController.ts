import { Request, Response } from "express";
import Message from "../models/message";
import User from "../models/user";

export const enviaMensagem = async (req: Request, res: Response) => {
    const fromUserId: string | undefined = req.headers.token?.toString();
    const toUsername: string | undefined = req.body.toUsername?.toString();
    const message: string | undefined = req.body.message?.toString();

    if (!fromUserId) {
        return res.status(403).json({
            message: 'faltando header de token',
        });
    }

    console.log(toUsername)
    console.log(message)

    if(!toUsername || !message) {
        return res.status(400).json({
            message: 'Campos message e toUsername obrigatórios',
        });
    }

    const toUser = await User.findOne({ username: toUsername });

    if (!toUser) {
        return res.status(404).json({
            message: 'toUsername fornecido não representa nenhum usuário'
        });
    }

    const newMessage = new Message({
        fromUser: fromUserId,
        toUser: toUser._id.toString(),
        message,
        sentAt: new Date(),
    });
    
    await newMessage.save();

    res.json({
        message: 'mensagem enviada',
    });
}

const listarConversas = async (req: Request, res: Response) => {
    
}