import { Router, Request, Response } from "express"
import { alteraUsername, login } from "./controllers/UserController";
import { enviaMensagem, listarConversas } from "./controllers/MessageController";

const router = Router();

router.post('/login', login);

router.post('/altera-username', alteraUsername);

router.post('/envia-mensagem', enviaMensagem);

router.get('/lista-conversas', listarConversas);

router.get('/', (req: Request, res: Response) => {
    res.json({message: 'Hello World'});
})

export default router;