import React, { Component } from 'react'
import Snackbar from '../Snackbar'
import DrawerButton from '../DrawerButton'
import Layout from '../Layout'

export default class App extends Component {
  render () {
    return (
      <div>
        <DrawerButton />
        <Layout />
        <Snackbar />
      </div>
    )
  }
}
