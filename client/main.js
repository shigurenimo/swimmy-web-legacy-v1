import { Provider } from 'mobx-react'
import React from 'react'
import { render } from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import Snackbar from '/imports/ui/containers/Snackbar'
import DrawerButton from '/imports/ui/containers/DrawerButton'
import Layout from '/imports/ui/containers/Layout'
import stores from '/imports/stores'
import theme from '/imports/theme'

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
