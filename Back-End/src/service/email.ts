import { createTransport } from 'nodemailer';


const transporter = createTransport({
  host: 'nao-responda.ifsp.edu.br',
  port: 587,
  secure: false,
  auth: {
    user: "eventos.pep@nao-responda.ifsp.edu.br",
    pass: "#9zoXO"
  }
});

export const sendEmail = (para:string, assunto:string, texto:string)=> {
transporter.sendMail({
  from: "eventos.pep@nao-responda.ifsp.edu.br",
  to: para,
  subject: assunto,
  html: texto,

})
  .then(() => console.log('Email enviado! '))
  .catch((err) => console.log('erro ao enviar email: ', err));

}
