import { servidor } from "./servidor";

export interface curso{
    idcurso: number;
    sigla: string;
    nomecurso: string;
    coordenador: servidor;
}