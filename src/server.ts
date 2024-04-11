import express, { Express } from "express"
import { connect } from 'mongoose';
import bodyParser from "body-parser";
import cors from 'cors';

import router from "./router";


const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_URL = process.env.DB_URL;

const connectionString = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_URL}/?retryWrites=true&w=majority&appName=sandbox`

// console.log(connectionString)

if (!DB_USER || !DB_PASSWORD || !DB_URL) {
    console.error("É necessário definir as variáveis de ambiente do banco de dados");
    process.exit(1);
}

connect(connectionString)
    .then(() => console.log('Conectado ao banco de dados'))
    .catch((e) => {
        console.error(e)
        process.exit(1)
    });

const app: Express = express();

app.use(bodyParser.json())

app.use(cors())

app.use(router)

app.listen(3000, () => console.log('Listening on port 3000'));