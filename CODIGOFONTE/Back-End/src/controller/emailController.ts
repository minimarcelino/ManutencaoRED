import { sendEmail } from "../service/email";
import { alunoService } from '../service/alunoService';
import { servidorService } from '../service/servidorService';
import { Request, Response } from "express";
import { StatusCodes } from 'http-status-codes';

const alunoservice = new alunoService();
const servidorservice = new servidorService();
const EMAIL_URL = process.env.EMAIL_URL;

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
               const coordenadorNome = coordenador.nome;
               const aluno = await alunoservice.findById(response.data.aluno_id);
               if (aluno.data != null && typeof aluno.data == 'object' && 'prontuario' in aluno.data) {
                  const aluno_prontuario = aluno.data.prontuario;
                  const aluno_nome = aluno.data.nome;
                  const aluno_email = aluno.data.email;
                  const html = `
                  <html>
                  <head>
                    <title>Início do Processo RED</title>
                  </head>
                  <body>
                    <p>Prezado(a) ${coordenadorNome},</p>
                    <p>Informamos que o processo RED do aluno ${aluno_nome} (${aluno_prontuario}) foi criado.</p>
                    <p>Por favor, <a href="${EMAIL_URL}">clique aqui</a> para acessar o site e confirmar a abertura do Processo RED.</p>
                    <p>Se precisar de mais informações sobre o aluno, você pode entrar em contato com ele pelo e-mail: ${aluno_email}.</p>
                    <p>Atenciosamente,<br />Equipe de Suporte do RED.</p>
                  </body>
                  </html>`;
                  sendEmail(coordenadorEmail, 'Sistema RED - Inicio do Processo RED', html);
                  console.log('Email Enviado');
               }
            }
         }
      }
   }

   async SendEmailCoordenadorAssocieProfessor(redResponse: any) {
      if (redResponse.ok && redResponse.data != null) {
         if (typeof redResponse.data === 'object' && 'coordenador' in redResponse.data && 'aluno_id' in redResponse.data) {
            const coordenadorResponse = await servidorservice.findByIdCoordenador(redResponse.data.coordenador);
            const alunoResponse = await alunoservice.findById(redResponse.data.aluno_id);
            if (coordenadorResponse.ok && alunoResponse.ok && alunoResponse.data != null) {
               const coordenador = coordenadorResponse.data;
               if (typeof coordenador !== 'string' && coordenador) {
                  const coordenadorEmail = coordenador.email;
                  const coordenadorNome = coordenador.nome;
                  if (typeof alunoResponse.data === 'object' && 'prontuario' in alunoResponse.data) {
                     const aluno_prontuario = alunoResponse.data.prontuario;
                     const aluno_nome = alunoResponse.data.nome;
                     const aluno_email = alunoResponse.data.email;
                     const html = `
                     <html>
                     <head>
                       <title>Processo RED</title>
                     </head>
                     <body>
                       <p>Prezado(a) ${coordenadorNome},</p>
                       <p>Informamos que o processo RED do aluno ${aluno_nome} (${aluno_prontuario}) possui novas disciplinas adicionadas.</p>
                       <p>Por favor, <a href="${EMAIL_URL}login">clique aqui</a> para entrar no sistema e associar os professores responsáveis.</p>
                       <p>Se precisar de mais informações sobre o aluno, você pode entrar em contato com ele pelo e-mail: ${aluno_email}.</p>
                       <p>Atenciosamente,<br/>Equipe de Suporte do RED.</p>
                     </body>
                     </html>
                `;
                     sendEmail(coordenadorEmail, "Sistema RED - Processo RED", html);
                     console.log("Email Enviado Associe Professor");
                     return 'Email Enviado';
                  }
               }
            }
         }
      }
      return 'Error';
   }

   async SendEmailCoordenadorFinalizandoRed(redResponse: any) {
      if (redResponse.ok && redResponse.data != null) {
         if (typeof redResponse.data === 'object' && 'coordenador' in redResponse.data && 'aluno_id' in redResponse.data) {
            const coordenadorResponse = await servidorservice.findByIdCoordenador(redResponse.data.coordenador);
            const alunoResponse = await alunoservice.findById(redResponse.data.aluno_id);
            if (coordenadorResponse.ok && alunoResponse.ok && alunoResponse.data != null) {
               const coordenador = coordenadorResponse.data;
               if (typeof coordenador !== 'string' && coordenador) {
                  const coordenadorEmail = coordenador.email;
                  const coordenadorNome = coordenador.nome;
                  if (typeof alunoResponse.data === 'object' && 'prontuario' in alunoResponse.data) {
                     const aluno_prontuario = alunoResponse.data.prontuario;
                     const aluno_nome = alunoResponse.data.nome;
                     const html = `
                     <html>
                     <head>
                     <title>Finalização do Processo RED</title>
                     </head>
                     <body>
                     <p>Prezado(a) ${coordenadorNome},</p>
                     <p>Informamos que o processo RED do aluno ${aluno_nome} (${aluno_prontuario}) foi finalizado.</p>
                     <p>Atenciosamente,<br />Equipe de suporte do RED.</p>
                     </body>
                     </html>`;
                     sendEmail(coordenadorEmail, "Sistema RED - Finalização do Processo RED", html);
                     console.log("Email Enviado Finalizando RED");
                  }
               }
            }
         }
      }
   }


   //EMAILS PROFESSOR
   async SendEmailProfesorIniciandoPEE(response: any) {
      console.log(response)
      if (typeof response.data === 'object' && Array.isArray(response.data.pee_servidor)) {
         const pee_servidor = response.data.pee_servidor;
         console.log(pee_servidor)
         for (let servidor of pee_servidor) {
            if (servidor && servidor.email) {
               const servidorEmail = servidor.email;
               const html = `
                 <html>
                 <head>
                   <title>Inicio do Processo PEE</title>
                 </head>
                 <body>
                   <p>Existe uma nova PEE associada a você.</p>
                   <p>Por favor, <a href="${EMAIL_URL}">clique aqui</a> para entrar no sistema e preencher a PEE.</p>
                   <p>Atenciosamente,<br />Equipe de suporte do RED.</p>
                 </body>
                 </html>`;
               sendEmail(servidorEmail, "Sistema RED - Início do Processo PEE", html);
               console.log("Email Enviado Iniciando PEE");
               console.log(html)
            }
         }
      }
   }

   async SendEmailProfessorDesassociadoPEE(idPee: number, email: string) {
      const servidorEmail = email;
      const html = `
                 <html>
                 <head>
                   <title>Desassociado do Processo PEE</title>
                 </head>
                 <body>
                   <p>Informamos que você foi desassociado do processo PEE ${idPee}.</p>
                   <p>Atenciosamente,<br />Equipe de suporte do RED.</p>
                 </body>
                 </html>`;
      sendEmail(servidorEmail, "Sistema RED - Início do Processo PEE", html);
      console.log("Email Enviado Iniciando PEE");
      console.log(html)
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
                              <p>Porfavor, <a href="${EMAIL_URL}login">clique aqui</a> para acessar o sistema e preencher ou avaliar a PEE com ID = ${idPee}.</p>

                              <p>Atenciosamente,<br />Equipe de suporte do RED.</p>
                            </body>
                          </html>
        `;
         console.log(texto)
         sendEmail(emailProfessor, 'Sistema RED - Pendências PEE', texto);
         console.log("Email enviado Preencher PEE");
      }
   }

   // EMAILS ALUNO
   async sendEmailAluno(redAluno: any, req: Request) {
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

                             <p>Por favor, <a href="${EMAIL_URL}usuario/${hashPEE}">clique aqui</a> para ser redirecionado à página do exercício.</p>

                             <p>Atenciosamente,<br />Equipe de suporte do RED.</p>
                           </body>
                         </html>

             `;
            console.log("Email Enviado");
            console.log(texto)
            sendEmail(alunoEmail, 'Sistema RED - Inicio das atividades', texto);
         } else {
            console.log('Detalhes do aluno não encontrados ou erro na busca.');
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
          <p>Por favor, <a href="${EMAIL_URL}usuario/${token}">clique aqui</a> para definir sua senha</p>
          <p>Atenciosamente,<br />Equipe de suporte do RED.</p>
          </body>
          </html>
          `;
            sendEmail(email, 'Sistema RED - Trocar senha', texto);
            console.log('Email Enviado Trocar Senha/Primeiro Acesso');
            return res.status(StatusCodes.OK).send(response.data);
         }
      }
      return res.status(StatusCodes.BAD_REQUEST).send(response);
   }

   //EMAILS CSP
   async sendEmailCSP(response: any) {
      console.log(response)
      if ('aluno_id' in response.data) {
         const aluno = await alunoservice.findById(response.data.aluno_id);
         if (aluno.data != null && typeof aluno.data == 'object' && 'nome' in aluno.data) {
            const nome = aluno.data.nome;
            const texto = `<html>
            <head>
            <title>Sistema RED - Associe Disciplinas</title>
            </head>
            <body>
            <p>A RED do aluno ${nome} foi aceita.
            <p>Por favor, <a href="${EMAIL_URL}">clique aqui</a> para associar as disciplinas</p>
            <p>Atenciosamente,<br />Equipe de suporte do RED.</p>
            </body>
            </html>
            `;
            sendEmail('gerenciared.ifsp@gmail.com', 'Sistema RED - Associe Disciplinas', texto);
            console.log('Email Enviado CSP');
         }

      }
   }

}
