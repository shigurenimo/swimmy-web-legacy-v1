import { observer } from 'mobx-react'
import React, { Component } from 'react'

@observer
export default class NotFound extends Component {
  render () {
    return <div className='container:not-found'>
      <div className='text:number'>404</div>
    </div>
  }
}
