import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import React from 'react'

export default theme => Component => props =>
  <MuiThemeProvider theme={theme}>
    <Component {...props} />
  </MuiThemeProvider>
