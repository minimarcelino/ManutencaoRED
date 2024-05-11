require("dotenv").config();
import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors";
import alunoRoutes from "./routes/alunoRoutes";
import servidorRoutes from './routes/servidorRoutes';
import cursoRoutes from './routes/cursoRoutes';
import redRoutes from './routes/redRoutes';
import disciplinaRoutes from './routes/disciplinaRoutes';
import peeRoutes from './routes/peeRoutes';
import usuarioNaoAutenticado from './routes/usuarioRoutes';
import coordenadorRoutes from './routes/coordenadorRoutes';
import loginRoutes from './routes/loginRoutes';
import path from "path";


const PORT = process.env.BACKEND_PORT || 3333;
const app = express();

const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use('/servidor/aluno', alunoRoutes);
app.use('/servidor/servidor', servidorRoutes);
app.use('/servidor/curso', cursoRoutes);
app.use('/servidor/red', redRoutes);
app.use('/servidor/disciplina',disciplinaRoutes);
app.use('/servidor/pee', peeRoutes);
app.use('/servidor/usuario', usuarioNaoAutenticado); // Verificar, da acesso a atividades do pee
app.use('/servidor/login', loginRoutes);
app.use('/servidor/coordenador', coordenadorRoutes);
app.use('/servidor/arquivos', express.static(path.join(__dirname, "..", "uploads")));

app.listen(PORT as number, () => console.log(`Listening on all interfaces:${PORT}\n\n\n\n\n\n\n-------------\n\n\n\n\n\n\n`));

