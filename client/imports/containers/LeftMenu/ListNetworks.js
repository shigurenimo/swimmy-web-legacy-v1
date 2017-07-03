import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import classNames from 'classnames'
import AddIcon from 'material-ui-icons/Add'
import SearchIcon from 'material-ui-icons/Search'
import { withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import IconButton from 'material-ui/IconButton'
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
            [classes.select]: this.props.router.page === 'network'
          })}
          component='a'
          href={'/network/default'}>
          <ListItemText primary={'explore'} />
          <ListItemSecondaryAction>
            <IconButton component='a' href='/network/default'>
              <SearchIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        {this.props.accounts.isLogged &&
        <ListItem button dense
          className={classNames({
            [classes.select]: this.props.router.page.includes('network-new')
          })}
          component='a'
          href='/network/new'>
          <ListItemText primary='create new list' />
          <ListItemSecondaryAction>
            <IconButton component='a' href='/network/new'>
              <AddIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>}
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
}
