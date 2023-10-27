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

export const sendEmail = ()=> {
transporter.sendMail({
  from: "eventos.pep@nao-responda.ifsp.edu.br",
  to: 'igorteixeirapf@hotmail.com',
  subject: 'Utilizando NodeMailer',
  text: 'Testando mensagem',

})
  .then(() => console.log('Email enviado! '))
  .catch((err) => console.log('erro ao enviar email: ', err));

}
