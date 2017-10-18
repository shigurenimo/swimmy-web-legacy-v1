import { inject, observer } from 'mobx-react'
import compose from 'ramda/src/compose'
import React, { Component } from 'react'
import Swipeable from 'react-swipeable'

class Layout extends Component {
  render () {
    const {children} = this.props
    return (
      <Swipeable onSwiped={this.onSwiped}>
        {children}
      </Swipeable>
    )
  }

  onSwiped = (event, deltaX, deltaY) => {
    event.preventDefault()
    if (deltaY < -80 || deltaY > 30) return
    if (deltaX < -20) {
      this.props.drawer.open()
    } else if (deltaX > 50) {
      this.props.drawer.close()
    }
  }
}

export default compose(
  inject(stores => ({drawer: stores.drawer})),
  observer
)(Layout)
