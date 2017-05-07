import { Provider } from 'mobx-react'
import React from 'react'
import { render } from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { App } from './containers/app'
import { injections } from './injections'
import './router'
import './styles/main'

injectTapEventPlugin()

render(
  <Provider {...injections}>
    <MuiThemeProvider>
      <App/>
    </MuiThemeProvider>
  </Provider>,
  document.querySelector('.root\\:app')
)

// ↓ ダブルタップの禁止

let tapFlag = false
let timer = false

document.body.addEventListener('touchstart', function (event) {
  if (tapFlag) event.preventDefault()
}, true)

document.body.addEventListener('touchend', function () {
  tapFlag = true
  clearTimeout(timer)
  timer = setTimeout(function () {
    tapFlag = false
  }, 150)
}, true)
