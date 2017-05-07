import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { Email } from 'meteor/email'

Meteor.methods({
  'email:sendContact' (req) {
    const text = req.message
    const from = req.email
    Email.send({
      to: 'takata@sankaku.io',
      from: 'app@sankaku.io',
      subject: 'from swimmy.io contact',
      text: from + ' : ' + text
    })
  }
})

Meteor.startup(() => {
  process.env.MAIL_URL = Meteor.settings.private.MAIL_URL
})

Accounts.emailTemplates.siteName = 'swimmy.io'

Accounts.emailTemplates.verifyEmail = {
  from () {
    return 'swimmy <app@sankaku.io>'
  },
  subject () {
    return 'Please confirm your account'
  },
  html (user, url) {
    const verifyUrl = url.replace('#/', '')
    return `
    <p>以下のリンクから本人確認してください.</p>
    <p>${verifyUrl}</p>    
    <p>このメールはswimmy（https://swimmy.io）より送信されました.
    身に覚えのない場合はこのメールを破棄してください.</p>
    `
  }
}
