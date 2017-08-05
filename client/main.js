import { Provider } from 'mobx-react'
import React from 'react'
import { render } from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Snackbar from './containers/Snackbar'
import DrawerButton from './containers/DrawerButton'
import Layout from './containers/Layout'
import stores from './stores'
import theme from './theme'

render(
  <Provider {...stores}>
    <MuiThemeProvider theme={theme}>
      <div>
        <DrawerButton />
        <Layout />
        <Snackbar />
      </div>
    </MuiThemeProvider>
  </Provider>,
  document.querySelector('div')
)
