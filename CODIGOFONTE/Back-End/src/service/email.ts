import { createTransport } from 'nodemailer';

const transporter = createTransport({
  host: process.env.EMAIL_HOTS,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_SENHA
  }
});

export const sendEmail = (para:string, assunto:string, texto:string)=> {
transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: para,
  subject: assunto,
  html: texto,

})
  .then(() => console.log('Email enviado! '))
  .catch((err) => console.log('erro ao enviar email: ', err));

}
