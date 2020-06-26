const mailgun = require('mailgun-js')
const path = require('path')

const api_key = process.env.MAILGUN_API
const DOMAIN = process.env.MAILGUN_DOMAIN

const mg = mailgun({ apiKey: api_key, domain: DOMAIN })
const BASE_URL = 'http://sigiapp.serra.ifes.edu.br'
// const DEV_URL = 'http://localhost:3000'

class MailController {
  async sendDelegationAskMail (user, name, committe, token) {
    const data = {
      from: 'SiGI App <sigiappifes@gmail.com>',
      to: 'sigiappifes@gmail.com',
      subject: 'Solicitação de Delegação',
      html: `<b>${
        user.login
      }</b> pediu que a delegação ${name} fosse adicionada ao comitê ${
        committe.title
      } <${
        committe._id
      }>.<br><br>Após adicionar a delegação, clique no link abaixo para liberar a criação dos usuários ao comitê:<br>${BASE_URL}/resolve/${token}`
    }
    mg.messages().send(data, (error, body) => {
      console.log(body)
    })
  }
}

module.exports = new MailController()
