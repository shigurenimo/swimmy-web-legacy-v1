import { Accounts } from 'meteor/accounts-base'

Accounts.onCreateUser(function (options, user) {
  const code = Array.from(new Array(25).keys())
  .map(() => (Math.random() < 0.1) ? 2 : (Math.random() < 0.5) ? 1 : 0)
  code[Math.floor(Math.random() * 25)] = 3
  user.config = {}
  user.profile = options.profile || {}
  user.profile.description = ''
  user.profile.icon = null
  user.profile.follows = []
  user.profile.tags = []
  user.profile.code = code.join('')
  user.profile.networks = []
  user.profile.from = 'swimmy'
  return user
})
