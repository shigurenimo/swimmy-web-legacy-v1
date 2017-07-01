/* eslint-disable no-undef */

Package.describe({
  name: 'uufish:mobx-route-provider',
  summary: 'MobX plugin',
  version: '0.1.0',
  documentation: 'README.md',
  git: 'https://github.com/uufish/mobx-route-provider'
})

Package.onUse(function (api) {
  api.versionsFrom('1.5')
  api.use('ecmascript')
  api.mainModule('client/index.js', 'client')
})

Npm.depends({
  'page': '1.7.1'
})
