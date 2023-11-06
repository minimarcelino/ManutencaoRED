require("dotenv").config();
import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors";
import alunoRoutes from "./routes/alunoRoutes";
import servidorRoutes from './routes/servidorRoutes';
import cursoRoutes from './routes/cursoRoutes';
import redRoutes from './routes/redRoutes';
import disciplinaRoutes from './routes/disciplinaRoutes';

const PORT = process.env.BACKEND_PORT || 3333;
const app = express();

const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use('/aluno', alunoRoutes);
app.use('/servidor', servidorRoutes);
app.use('/curso', cursoRoutes);
app.use('/red', redRoutes);
app.use('/disciplina',disciplinaRoutes);

app.listen(PORT as number, () => console.log(`Listening on all interfaces:${PORT}`));

