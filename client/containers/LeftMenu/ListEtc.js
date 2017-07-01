import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemText } from 'material-ui/List'
import styleSheet from './ListDefault.style'

@withStyles(styleSheet)
@inject('router', 'posts', 'accounts')
@observer
export default class LeftMenuNetworks extends Component {
  render () {
    const {classes} = this.props
    return (
      <List>
        <ListItem button dense
          className={classNames({
            [classes.select]: this.props.router.page.includes('release')
          })}
          component='a'
          href='/release'>
          <ListItemText primary='release' />
        </ListItem>
        <ListItem button dense
          className={classNames({
            [classes.select]: this.props.router.page.includes('report')
          })}
          component='a'
          href='/report'>
          <ListItemText primary='report' />
        </ListItem>
        <ListItem button dense
          component='a'
          target='_blank'
          href='https://github.com/uufish/Sw'>
          <ListItemText primary='uufish / Sw' />
        </ListItem>
      </List>
    )
  }

  state = {
    isExpand: false
  }

  onExpand () {
    this.setState({isExpand: !this.state.isExpand})
  }

  onExpand = ::this.onExpand

  onLogout () {
    this.props.accounts.logout()
    .then(() => {
      this.props.snackbar.show('ログアウトしました')
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
  }

  onLogout = ::this.onLogout
}
