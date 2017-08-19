import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import classNames from 'classnames'
import Swipeable from 'react-swipeable'
import { withStyles } from 'material-ui/styles'
import Content from '../Content'
import InputAction from '../InputAction'
import LeftMenu from '../LeftMenu'
import styles from './index.style'

@withStyles(styles)
@inject('drawer')
@observer
export default class Layout extends Component {
  render () {
    const {classes, drawer} = this.props
    return (
      <div
        className={classNames(classes.root, {
          [classes.left]: drawer.isOpen,
          [classes.right]: !drawer.isOpen
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
      this.props.drawer.open()
    } else if (deltaX > 50) {
      this.props.drawer.close()
    }
  }

  onSwiped = ::this.onSwiped
}
