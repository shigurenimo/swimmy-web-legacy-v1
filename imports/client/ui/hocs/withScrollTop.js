import propTypes from 'prop-types'
import React, { Component } from 'react'

export default ChildComponent => class extends Component {
  render () {
    return <ChildComponent {...this.props} />
  }

  static get contextTypes () {
    return {onScrollTop: propTypes.any}
  }

  componentDidMount () {
    this.context.onScrollTop()
  }
}
