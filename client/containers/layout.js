import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import Swipeable from 'react-swipeable'
import Content from './content'
import InputAction from './input-action'
import LeftMenu from './left-menu'
import NavigationSwipe from './navigatoin-swipe'
import utils from '../../imports/utils'

@inject('layout', 'navigation')
@observer
export default class Layout extends Component {
  render () {
    return <div className={this.className}>
      <Swipeable onSwiped={this.onSwiped.bind(this)}>
        <LeftMenu />
        <Content />
      </Swipeable>
      <InputAction />
      <NavigationSwipe />
    </div>
  }

  get className () {
    return `container:layout
     ${this.props.layout.oneColumnClassName}
     ${this.props.layout.leftClassName}
     ${utils.isSmartphone ? 'smartphone' : 'smartphone-not'}`
  }

  onSwiped (event, deltaX, deltaY) {
    if (deltaY < -80 || deltaY > 30) return
    if (deltaX < -20) {
      this.props.navigation.removeSwipe()
      this.props.layout.toLeft()
    } else if (deltaX > 50) {
      this.props.layout.toMain()
    }
  }
}
