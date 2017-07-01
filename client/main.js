import { Provider } from 'mobx-react'
import React from 'react'
import { render } from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
import App from './containers/App'
import theme from '/client/theme'
import stores from './stores'

injectTapEventPlugin()

render(
  <MuiThemeProvider theme={theme}>
    <Provider {...stores}>
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.querySelector('.root\\:app')
)

document.body.style.background = '#F8F7F8'
