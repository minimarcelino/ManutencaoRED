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


const PORT = process.env.BACKEND_PORT || 3333;
const app = express();

const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use('/api/aluno', alunoRoutes);
app.use('/api/servidor', servidorRoutes);
app.use('/api/curso', cursoRoutes);
app.use('/api/red', redRoutes);
app.use('/api/disciplina',disciplinaRoutes);
app.use('/api/pee', peeRoutes);
app.use('/api/usuario', usuarioNaoAutenticado); // Verificar, da acesso a atividades do pee
app.use('/api/login', loginRoutes);
app.use('/api/coordenador', coordenadorRoutes);

app.listen(PORT as number, () => console.log(`Listening on all interfaces:${PORT}`));

