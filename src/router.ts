import { Router, Request, Response } from "express"
import { login } from "./controllers/UserController";

const router = Router();

router.post('/login', login)

router.get('/', (req: Request, res: Response) => {
    res.json({message: 'Hello World'});
})

export default router;