import { createRouter, RoutesProvider } from 'meteor/uufish:mobx-route-provider'
import React, { Component } from 'react'
import Snackbar from '../Snackbar'
import Layout from '../Layout'
import paths from '../../router'

const routes = createRouter(paths)

export default class App extends Component {
  render () {
    return (
      <RoutesProvider routes={routes}>
        <Layout />
        <Snackbar />
      </RoutesProvider>
    )
  }
}
