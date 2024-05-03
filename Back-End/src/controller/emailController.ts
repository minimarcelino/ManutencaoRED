import { sendEmail } from "../service/email";
import { redController } from './redController';
import { alunoService } from '../service/alunoService';
import { servidorService } from '../service/servidorService';
import { peeService } from '../service/peeService';
import { Request, Response } from "express";
import { StatusCodes } from 'http-status-codes';

const peeservice = new peeService();
const alunoservice = new alunoService();
const redcontroller = new redController();
const servidorservice = new servidorService();

export class emailController {

   //EMAILS COORDENADOR
   async sendEmailCoordenadorInicioRED(response: any) {
      if (typeof response.data === 'object' && 'coordenador' in response.data) {
         const coordenadorResponse = await servidorservice.findByIdCoordenador(
            response.data.coordenador
         );

         if (coordenadorResponse.ok) {
            const coordenador = coordenadorResponse.data;

            if (typeof coordenador !== 'string' && coordenador) {
               const coordenadorEmail = coordenador.email;
               const aluno = await alunoservice.findById(response.data.aluno_id);
               if (aluno.data != null && typeof aluno.data == 'object' && 'prontuario' in aluno.data) {
                  const aluno_prontuario = aluno.data.prontuario;
                  const html = `
                 <html>
                 <head>
                   <title>Inicio do Processo RED</title>
                 </head>
                 <body>
                   <p>O processo RED do aluno ${aluno_prontuario} foi criado.</p>
                   <p>Por favor, <a href="http://red.pep2.ifsp.edu.br/">clique aqui</a> para acessar ao site e confirme a abertura do Processo RED.</p>
                   <p>Atenciosamente,<br />Equipe de suporte do RED.</p>
                 </body>
                 </html>`;
                  sendEmail(coordenadorEmail, 'Inicio do Processo RED', html);
                  console.log('Email Enviado');
               }
            }
         }
      }
   }

   async SendEmailCoordenadorAssocieProfessor(response: any) {
      if (typeof response.data === 'object' && 'RED_idRED' in response.data) {
         const idRed = response.data.RED_idRED;
         const redResponse = await redcontroller.getById(idRed);
         if (redResponse.ok && redResponse.data != null) {
            if (typeof redResponse.data === 'object' && 'coordenador' in redResponse.data && 'aluno_id' in redResponse.data) {
               const coordenadorResponse = await servidorservice.findByIdCoordenador(redResponse.data.coordenador);
               const alunoResponse = await alunoservice.findById(redResponse.data.aluno_id);
               if (coordenadorResponse.ok && alunoResponse.ok && alunoResponse.data != null) {
                  const coordenador = coordenadorResponse.data;
                  if (typeof coordenador !== 'string' && coordenador) {
                     const coordenadorEmail = coordenador.email;
                     if (typeof alunoResponse.data === 'object' && 'prontuario' in alunoResponse.data) {
                        const aluno_prontuario = alunoResponse.data.prontuario;
                        const html = `
                <html>
                  <head>
                    <title>Processo RED</title>
                  </head>
                  <body>
                    <p>O processo RED do aluno <b>${aluno_prontuario}</b> possui novas disciplinas adicionadas.</p>
                    <p>Por favor, <a href="http://red.pep2.ifsp.edu.br/login">clique aqui</a> para entrar no sistema e associe os professores responsaveis.</p>
                    <p>Atenciosamente,<br/>Equipe de suporte do RED.</p>
                  </body>
                </html>
                `;
                        sendEmail(coordenadorEmail, "Processo RED", html);
                        console.log("Email Enviado Associe Professor");
                        return 'Email Enviado';
                     }
                  }
               }
            }
         }
      }
      return 'Error';
   }

   async SendEmailCoordenadorFinalizandoRed(response: any) {
      const idRed = response.data.RED_idRED;
      const redResponse = await redcontroller.getById(idRed);
      if (redResponse.ok && redResponse.data != null) {
         if (typeof redResponse.data === 'object' && 'coordenador' in redResponse.data && 'aluno_id' in redResponse.data) {
            const coordenadorResponse = await servidorservice.findByIdCoordenador(redResponse.data.coordenador);
            const alunoResponse = await alunoservice.findById(redResponse.data.aluno_id);
            if (coordenadorResponse.ok && alunoResponse.ok && alunoResponse.data != null) {
               const coordenador = coordenadorResponse.data;
               if (typeof coordenador !== 'string' && coordenador) {
                  const coordenadorEmail = coordenador.email;
                  if (typeof alunoResponse.data === 'object' && 'prontuario' in alunoResponse.data) {
                     const aluno_prontuario = alunoResponse.data.prontuario;
                     const html = `
               <html>
               <head>
                 <title>Finalização do Processo RED</title>
               </head>
               <body>
                 <p>O processo RED do aluno ${aluno_prontuario} foi finalizado.</p>
                 <p>Atenciosamente,<br />Equipe de suporte do RED.</p>
               </body>
               </html>`;
                     sendEmail(coordenadorEmail, "Finalização do Processo RED", html);
                     console.log("Email Enviado Finalizando RED");
                  }
               }
            }
         }
      }
   }


   //EMAILS PROFESSOR
   async SendEmailProfesorIniciandoPEE(response: any) {
      if (typeof response.data === 'object' && 'servidor_idservidor' in response.data) {
         const servidor_idservidor = response.data.servidor_idservidor;
         if (servidor_idservidor != null) {
            const servidorResponse = await servidorservice.findByid(servidor_idservidor);
            if (servidorResponse.ok && servidorResponse.data != null) {
               if (typeof servidorResponse.data === 'object' && 'email' in servidorResponse.data) {
                  const servidor = servidorResponse.data;
                  if (typeof servidor !== 'string' && servidor) {
                     const servidorEmail = servidor.email;
                     const html = `
                <html>
                <head>
                  <title>Inicio do Processo PEE</title>
                </head>
                <body>
                  <p>Existe uma nova PEE associada a você.</p>
                  <p>Por favor, <a href="http://red.pep2.ifsp.edu.br/">clique aqui</a> para entrar no sistema e preencha a PEE.</p>
                  <p>Atenciosamente,<br />Equipe de suporte do RED.</p>
                </body>
                </html>`;
                     sendEmail(servidorEmail as string, "Inicio do Processo PEE", html);
                     console.log("Email Enviado Iniciando PEE");
                     console.log(html)
                  }
               }
            }
         }
      }
   }

   async sendEmailProfessorPreencherPEE(req: Request, res: Response) {
      const idProfessor = req.body.idProfessor;
      const idPee = req.body.idPee;

      const professorResponse = await servidorservice.findByid(idProfessor);
      if (typeof professorResponse.data === 'object' && 'email' in professorResponse.data) {
         const emailProfessor = professorResponse.data.email;
         const texto = `
                          <html>
                            <body>
                              <p>Porfavor, <a href="http://red.pep2.ifsp.edu.br/login">clique aqui</a> para acessar o sistema e preencher ou avaliar a PEE com ID = ${idPee}.</p>
  
                              <p>Atenciosamente,<br />Equipe de suporte do RED.</p>
                            </body>
                          </html>
        `;
         console.log(texto)
         sendEmail(emailProfessor, 'Pendências PEE', texto);
         console.log("Email enviado Preencher PEE");
      }
   }

   // EMAILS ALUNO
   async sendEmailAluno(response: any, req: Request) {
      if (typeof response.data === 'object' && 'RED_idRED' in response.data) {
         const RED_idRED = response.data.RED_idRED;
         const redAluno = (await redcontroller.getById(RED_idRED)).data;

         if (redAluno && typeof redAluno === 'object' && 'aluno_id' in redAluno) {
            const alunoId = redAluno.aluno_id;
            const alunoDetails = await alunoservice.findById(alunoId);

            if (alunoDetails && alunoDetails.ok && alunoDetails.data && typeof alunoDetails.data === 'object') {
               const alunoData = alunoDetails.data as {
                  prontuario: string;
                  nome: string;
                  dataNascimento: Date;
                  endereco: string;
                  telefone: string;
                  email: string;
                  curso_idcurso: number;
                  id: number;
               };
               const crypto = require('crypto');
               const hash = crypto.createHash('sha256');
               hash.update(req.params.id.toString());
               const hashPEE = hash.digest('hex');
               const alunoEmail = alunoData.email;
               console.log(alunoEmail);
               const texto = `
                         <html>
                           <body>
                             <p>As atividades do professor foram enviadas. 👍</p>
 
                             <p>Por favor, <a href="http://red.pep2.ifsp.edu.br/usuario/${hashPEE}">clique aqui</a> para ser redirecionado à página do exercício.</p>
 
                             <p>Atenciosamente,<br />Equipe de suporte do RED.</p>
                           </body>
                         </html>
               
             `;
               console.log("Email Enviado");
               console.log(texto)
               sendEmail(alunoEmail, 'Inicio das atividades', texto);
            } else {
               console.log('Detalhes do aluno não encontrados ou erro na busca.');
            }
         }
      }
   }

   //EMAIL ESQUECI A SENHA/PRIMEIRO ACESSO
   async sendEmailTrocarSenha(req: Request, res: Response) {
      const { prontuario } = req.body;
      const response = await servidorservice.findByProntuario(prontuario);
      if (response.ok) {
         if (typeof response.data === 'object' && 'email' in response.data && 'nome' in response.data
         ) {
            const email = response.data.email;
            const nome = response.data.nome;
            const id = response.data.idservidor;
            const crypto = require('crypto');
            const hash = crypto.createHash('sha256');
            const data = Date.now();

            hash.update(id.toString() + data.toString());
            const token = hash.digest('hex');
            servidorservice.updateToken(id, token)

            const texto = `
          <html>
          <head>
          <title>Trocar Senha - Sistema RED</title>
          </head>
          <body>
          <p>Olá ${nome}! Recebemos sua solicitação para realizar a troca de senha.</p>
          <p>Por favor, <a href="http://red.pep2.ifsp.edu.br/usuario/${token}">clique aqui</a> para definir sua senha</p>
          <p>Atenciosamente,<br />Equipe de suporte do RED.</p>
          </body>
          </html>
          `;
            sendEmail(email, 'Trocar senha - Sistema RED', texto);
            console.log('Email Enviado');
            return res.status(StatusCodes.OK).send(response.data);
         }
      }
      return res.status(StatusCodes.BAD_REQUEST).send(response);
   }
}