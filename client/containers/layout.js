import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import Swipeable from 'react-swipeable'
import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'
import Content from './content'
import InputAction from './input-action'
import LeftMenu from './left-menu'
import utils from '/utils'
import styleSheet from './layout.style'

@withStyles(styleSheet)
@inject('layout')
@observer
export default class Layout extends Component {
  render () {
    const {classes, layout} = this.props
    return (
      <div
        className={classNames(classes.container, {
          [classes.oneColumn]: layout.oneColumn,
          [classes.twoColumn]: !layout.oneColumn,
          [classes.left]: layout.left,
          [classes.right]: !layout.left,
          [classes.smartphone]: utils.isSmartphone,
          [classes.smartphoneNot]: !utils.isSmartphone
        })}>
        <Swipeable
          onSwiping={this.onSwiping}
          onSwiped={this.onSwiped}>
          <LeftMenu />
          <Content />
        </Swipeable>
        <InputAction />
      </div>
    )
  }

  onSwiped (event, deltaX, deltaY) {
    event.preventDefault()
    if (deltaY < -80 || deltaY > 30) return
    if (deltaX < -20) {
      this.props.layout.toLeft()
    } else if (deltaX > 50) {
      this.props.layout.toMain()
    }
  }

  onSwiped = ::this.onSwiped
}
