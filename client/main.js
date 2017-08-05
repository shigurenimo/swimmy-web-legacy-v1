import { Provider } from 'mobx-react'
import React from 'react'
import { render } from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import App from './containers/App'
import theme from './theme'
import stores from './stores'

render(
  <MuiThemeProvider theme={theme}>
    <Provider {...stores}>
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.querySelector('div')
)
