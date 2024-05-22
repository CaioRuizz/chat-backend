import { Router, Request, Response } from "express"
import {listaUsuarios, login} from "./controllers/UserController";
import { enviaMensagem, lerConversa, listarConversas } from "./controllers/MessageController";

const router = Router();

router.post('/login', login);

router.get('/lista-usuarios', listaUsuarios);

router.post('/envia-mensagem', enviaMensagem);


router.get('/lista-conversas', listarConversas);

router.get('/ler-conversa/', lerConversa);

router.get('/ler-conversa/:username', lerConversa);

router.get('/', (req: Request, res: Response) => {
    res.json({message: 'Hello World'});
})

export default router;