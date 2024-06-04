import { curso } from './curso';

export interface aluno {
    prontuario: String;
    nome: String;
    data_nascimento: Date;
    endereco: String;
    email: String;
    curso: curso;
}