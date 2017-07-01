import React, { Component } from 'react'
import Snackbar from '../Snackbar'
import Layout from '../Layout'

export default class App extends Component {
  render () {
    return (
      <div>
        <Layout />
        <Snackbar />
      </div>
    )
  }
}
