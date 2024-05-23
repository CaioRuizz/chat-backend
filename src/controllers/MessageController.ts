import { Request, Response } from "express";
import Message from "../models/message";
import User from "../models/user";
import Token from "../models/token";

export const enviaMensagem = async (req: Request, res: Response) => {
    const fromUserId: string | undefined = req.headers.token?.toString();
    const toUsername: string | undefined = req.body.toUsername?.toString();
    const message: string | undefined = req.body.message?.toString();
    const all: boolean = req.body.all ?? false;


    if (!fromUserId) {
        return res.status(403).json({
            message: 'faltando header de token',
        });
    }

    if(toUsername == undefined || !message) {
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

    if (!toUser && !all) {
        return res.status(404).json({
            message: 'toUsername fornecido não representa nenhum usuário'
        });
    }

    const newMessage = new Message({
        fromUser: fromUser._id.toString(),
        toUser: toUser?._id.toString(),
        message,
        sentAt: new Date(),
        all,
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

    const messages = await Message.find({ fromUser });
    const receivedMessages = await Message.find({ toUser: fromUser })

    // console.log(receivedMessages)

    const toUsersId = messages
        .map(m => m.toUser);

    const fromUsersId = receivedMessages
        .map(m => m.fromUser);
    
    const toUsernames: string[] = [];

    await Promise.all([...toUsersId, ...fromUsersId].map(async id => {
        const r = await User.findById(id);
        if (r) toUsernames.push(r.username);
    }));

    return res.json({
        chatsUsername: [...new Set(toUsernames)],
    });
}

export const lerConversa = async (req: Request, res: Response) => {
    const token: string | undefined = req.headers.token?.toString();

    const toUsername: string | undefined = req.params.username?.toString();

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

    // console.log(fromUser._id.toString())

    if (!toUsername) {
        const data = await Message.find({ all: true }).populate('fromUser').exec();

        const sentMessages = (data
            .map(m => ({
                message: m.message,
                sentAt: m.sentAt,
                // @ts-ignore
                sentBy: m.fromUser.username,
                // @ts-ignore
                sent: (m.fromUser.username == fromUser.username),
                // @ts-ignore
                received: !(m.fromUser.username == fromUser.username)
            })));


        return res.status(200).json(sentMessages)
    }


    const toUser = await User.findOne({ username: toUsername });

    if (!toUser) {
        return res.status(404).json({
            message: `Nenhum usuário encontrado com o nome ${toUsername}`
        })
    }

    const sentMessages = (await Message.find({ fromUser, toUser }))
        .map(m => ({ message: m.message, sentAt: m.sentAt, sent: true, received: false, all: m.all }))
        .filter(m => !m.all);

    const receivedMessages = (await Message.find({ toUser: fromUser, fromUser: toUser }))
        .map(m => ({ message: m.message, sentAt: m.sentAt, sent: false, received: true, all: m.all }))
        .filter(m => !m.all);

    const messages = [...sentMessages, ...receivedMessages]

    const result = messages.sort((a, b) => Number.parseInt(a.sentAt.valueOf()) -  Number.parseInt(b.sentAt.valueOf()));

    return res.json(result);
}

