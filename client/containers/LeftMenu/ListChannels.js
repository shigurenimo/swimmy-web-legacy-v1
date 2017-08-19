import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import classNames from 'classnames'
import AddIcon from 'material-ui-icons/Add'
import { withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import IconButton from 'material-ui/IconButton'
import styleSheet from './ListDefault.style'

@withStyles(styleSheet)
@inject('routes', 'posts', 'accounts')
@observer
export default class LeftMenuChannels extends Component {
  render () {
    const {classes} = this.props
    return (
      <List>
        <ListItem button dense
          className={classNames({
            [classes.select]: this.props.routes.page === 'channel'
          })}
          component='a'
          href={'/ch'}>
          <ListItemText primary={'channels'} />
        </ListItem>
        {this.props.accounts.isLogged &&
        <ListItem button dense
          className={classNames({
            [classes.select]: this.props.routes.page.includes('channel-new')
          })}
          component={'a'}
          href={'/ch/new'}>
          <ListItemText primary={'new channel'} />
          <ListItemSecondaryAction>
            <IconButton component={'a'} href={'/ch/new'}>
              <AddIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>}
      </List>
    )
  }

  state = {isExpand: false}

  onExpand () { this.setState({isExpand: !this.state.isExpand}) }

  onExpand = ::this.onExpand
}
