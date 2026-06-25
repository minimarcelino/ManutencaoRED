import { sendEmail } from "../service/email";
import { alunoService } from '../service/alunoService';
import { servidorService } from '../service/servidorService';
import { Request, Response } from "express";
import { StatusCodes } from 'http-status-codes';
import { redService } from "../service/redService";
import { cursoService } from "../service/cursoService";

const alunoservice = new alunoService();
const servidorservice = new servidorService();
const redservice = new redService()
const cursoservice = new cursoService()
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

   console.log("SendEmailProfesorIniciandoPEE: ", response);

   const pee = response.pees;

   const id_red = pee.RED_idRED;

   const pee_servidor = pee.pee_servidor.map(
      (item:any) => item.servidor
   );

   const red: any = await redservice.findById(id_red);

   const aluno: any = await alunoservice.findById(
      red.data.aluno_id
   );

   const aluno_nome = aluno.data.nome;
   const aluno_email = aluno.data.email;
   const aluno_prontuario = aluno.data.prontuario;

   const aluno_curso = aluno.data.curso_idcurso;

   const curso: any = await cursoservice.findById(aluno_curso);

   const nome_curso = curso.data.nomeCurso;


   for (let servidor of pee_servidor) {

      console.log("Email servidor:", servidor.email);

      if (servidor && servidor.email) {

         const servidorEmail = servidor.email;
         const servidorNome = servidor.nome;


         const html = `
         <html>
         <body>

            <p>Prezado(a) Prof. ${servidorNome},</p>

            <p>
            Informamos que um novo PEE foi associado a você.
            </p>

            <p>
            Aluno: ${aluno_nome} (${aluno_prontuario})
            </p>

            <p>
            Curso: ${nome_curso}
            </p>

            <p>
            Para acessar o sistema e preencher a PEE:
            <a href="${EMAIL_URL}">
            clique aqui
            </a>
            </p>

            <p>
            Se precisar de informações, entre em contato com o aluno:
            ${aluno_email}
            </p>


            <p>
            Atenciosamente,<br>
            Equipe de Suporte do RED
            </p>

         </body>
         </html>
         `;


         sendEmail(
            servidorEmail,
            "Sistema RED - Início do Processo PEE",
            html
         );


         console.log(
            "Email Enviado Iniciando PEE"
         );
      }
   }
}

   async SendEmailProfessorDesassociadoPEE(pee: any, email: string) {
      const servidorEmail = email;
      const red: any = await redservice.findById(pee.RED_idRED);
      console.log(red)
      const aluno: any = await alunoservice.findById(red.data.aluno_id);
      const aluno_nome = aluno.data.nome;
      const aluno_prontuario = aluno.data.prontuario;
      const aluno_curso = aluno.data.curso_idcurso;
      console.log(aluno)
      const curso: any = await cursoservice.findById(aluno_curso);
      console.log(curso)
      const nome_curso = curso.data.nomeCurso;
      const html = `
      <html>
      <head>
         <title>Desassociação do Processo PEE</title>
      </head>
      <body>
         <p>Prezado(a) Professor(a),</p>
         <p>Informamos que você foi desassociado do PEE.</p>
         <p>Aluno: ${aluno_nome} (${aluno_prontuario})</p>
         <p>Curso: ${nome_curso}</p>
         <p>Se tiver alguma dúvida ou necessitar de mais informações, por favor, entre em contato com a equipe de suporte.</p>
         <p>Atenciosamente,</p>
         <p>Equipe de Suporte do RED</p>
      </body>
      </html>`;
      sendEmail(servidorEmail, "Sistema RED - Desassociação do Processo PEE", html);
      console.log(html)
   }


   async sendEmailProfessorPreencherPEE(req: Request, res: Response) {
      try {
         const idProfessor = req.body.idProfessor;
         const idPee = req.body.idPee;

         const professorResponse = await servidorservice.findByid(idProfessor);

         if (
            typeof professorResponse.data === 'object' &&
            'email' in professorResponse.data
         ) {
            const emailProfessor = professorResponse.data.email;
            console.log('Email destino:', emailProfessor);

            const texto = `
           <html>
             <body>
               <p>
                 Por favor,
                 <a href="${EMAIL_URL}login">clique aqui</a>
                 para acessar o sistema e preencher ou avaliar a PEE com ID = ${idPee}.
               </p>

               <p>
                 Atenciosamente,<br />
                 Equipe de suporte do RED.
               </p>
             </body>
           </html>
         `;

            await sendEmail(
               emailProfessor,
               'Sistema RED - Pendências PEE',
               texto
            );

            console.log("Email enviado Preencher PEE");

            return res.status(200).json({
               success: true,
               message: 'Email enviado com sucesso'
            });
         }

         return res.status(404).json({
            success: false,
            message: 'Professor não encontrado'
         });

      } catch (error) {
         console.error(error);

         return res.status(500).json({
            success: false,
            message: 'Erro ao enviar email'
         });
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
                             <p>As atividades do professor foram enviadas.</p>

                             <p>Por favor, <a href="${EMAIL_URL}usuario/${hashPEE}">clique aqui</a> para ser redirecionado à página do exercício.</p>

                             <p>Atenciosamente,<br />Equipe de suporte do RED.</p>
                           </body>
                         </html>

             `;
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
          <p>Por favor, <a href="${EMAIL_URL}usuario/trocar-senha/${token}">clique aqui</a> para definir sua senha</p>
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
      if ('aluno_id' in response.data) {
         const aluno = await alunoservice.findById(response.data.aluno_id);
         if (aluno.data != null && typeof aluno.data == 'object' && 'nome' in aluno.data) {
            const nome = aluno.data.nome;
            const aluno_prontuario = aluno.data.prontuario;
            const aluno_email = aluno.data.email;
            const texto = `<html>
            <head>
             <title>Sistema RED - Associe Disciplinas</title>
            </head>
            <body>
            <p>Prezado(a),</p>
            <p>Informamos que o processo RED do aluno ${nome} (${aluno_prontuario}) foi aceita.</p>
            <p>Por favor, <a href="${EMAIL_URL}login">clique aqui</a> para entrar no sistema e associar associar as disciplinas.</p>
            <p>Se precisar de mais informações sobre o aluno, você pode entrar em contato com ele pelo e-mail: ${aluno_email}.</p>
            <p>Atenciosamente,<br/>Equipe de Suporte do RED.</p>
            </body>
            </html>
            `;
            sendEmail('csp.pep@ifsp.edu.br', 'Sistema RED - Associe Disciplinas', texto);
            console.log('Email Enviado CSP');
         }

      }
   }

}
