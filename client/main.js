import compose from 'ramda/src/compose'
import React from 'react'
import { render } from 'react-dom'

import withProvider from '/imports/ui/hocs/withProvider'
import withMuiThemeProvider from '/imports/ui/hocs/withMuiThemeProvider'
import DrawerButton from '/imports/ui/containers/DrawerButton'
import Layout from '/imports/ui/containers/Layout'
import Snackbar from '/imports/ui/containers/Snackbar'
import stores from '/imports/stores'
import theme from '/imports/theme'

export const root = document.querySelector('div')

export const composer = compose(
  withProvider(stores),
  withMuiThemeProvider(theme)
)

export const App = () =>
  <div>
    <DrawerButton />
    <Layout />
    <Snackbar />
  </div>

render(composer(App)(), root)
