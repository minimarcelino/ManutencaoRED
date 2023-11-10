import { servidor } from "./servidor";

export interface curso{
    idcurso: number;
    sigla: string;
    nomeCurso: string;
    coordenador: servidor;
}