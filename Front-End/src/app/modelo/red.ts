import { servidor } from "./servidor";
import { aluno } from "./aluno";

export interface red{
idRED: number,
dataInicioProcesso: Date;
dataPrevisaoTermino: Date;
motivoAfastamento: String;
situacao: String;
coordenador: servidor;
aluno_id: aluno;
observacao: String;
inicioAfastamento: Date;
tempoAfastamento: number;
semestreOuAnoAluno: number;
}