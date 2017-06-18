import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import classNames from 'classnames'
import Collapse from 'material-ui/transitions/Collapse'
import { withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import IconButtonMoreExpand from '../components/ui-icon-button-more-expand'
import styleSheet from './left-menu-default.style'

@withStyles(styleSheet)
@inject('router', 'posts', 'users')
@observer
export default class LeftMenuNetworks extends Component {
  render () {
    const {users, classes} = this.props
    return (
      <List>
        <ListItem button dense
          className={classNames({
            [classes.select]: this.props.router.page.includes('admin')
          })}
          component='a'
          href='/admin'>
          <ListItemText primary={this.props.users.isLogged ? users.one.username : 'login'} />
          {this.props.users.isLogged &&
          <ListItemSecondaryAction>
            <IconButtonMoreExpand isExpand={this.state.isExpand} onClick={this.onExpand} />
          </ListItemSecondaryAction>}
        </ListItem>
        <Collapse in={this.state.isExpand} transitionDuration='auto' unmountOnExit>
          {this.props.users.isLogged &&
          <ListItem button dense component='a' href='/twitter'>
            <ListItemText inset primary='twitter' />
          </ListItem>}
          {this.props.users.isLogged &&
          <ListItem button dense
            className={classNames({
              [classes.select]: this.props.router.page.includes('config')
            })}
            component='a'
            href='/config'>
            <ListItemText inset primary='config' />
          </ListItem>}
          {this.props.users.isLogged &&
          <ListItem button dense onClick={this.onLogout}>
            <ListItemText inset primary='logout' />
          </ListItem>}
        </Collapse>
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
    this.props.users.logout()
    .then(() => {
      this.props.snackbar.show('ログアウトしました')
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
  }

  onLogout = ::this.onLogout
}
