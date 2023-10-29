import { servidor } from "./servidor";
import { aluno } from "./aluno";

export interface red{
idRED: number,
data_inicio_processo: Date;
dataInicioRed: Date;
dataLimitePee: Date;
dataPrevisaoTermino: Date;
motivoAfastamento: String;
situacao: String;
aluno_prontuario: String;
coordenador: servidor;
id: aluno;

}