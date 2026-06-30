import { createTransport } from 'nodemailer';

//console.log('EMAIL_HOTS:', process.env.EMAIL_HOTS);
//console.log('EMAIL_USER:', process.env.EMAIL_USER);
//console.log('EMAIL_SENHA:', process.env.EMAIL_SENHA ? 'PREENCHIDA' : 'VAZIA');

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
