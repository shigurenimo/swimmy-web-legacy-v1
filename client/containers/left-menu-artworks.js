import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import classNames from 'classnames'
import AddIcon from 'material-ui-icons/Add'
import Collapse from 'material-ui/transitions/Collapse'
import { withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import IconButton from 'material-ui/IconButton'
import IconButtonMoreExpand from '../components/ui-icon-button-more-expand'
import styleSheet from './left-menu-default.style'

@withStyles(styleSheet)
@inject('router', 'artworks', 'accounts') @observer
export default class LeftMenuArtworks extends Component {
  render () {
    const {accounts, classes} = this.props
    return (
      <List>
        <ListItem button dense
          className={classNames({
            [classes.select]:
            this.props.router.page === 'artwork' && (
              this.props.artworks.timeline.unique === 'default' ||
              this.props.artworks.timeline.unique === 'follows' ||
              this.props.artworks.timeline.unique === 'self'
            )
          })}
          component='a'
          href={'/artwork/default'}>
          <ListItemText primary={'artworks'} />
          {this.props.accounts.isLogged &&
          <ListItemSecondaryAction>
            <IconButtonMoreExpand isExpand={this.state.isExpand} onClick={this.onExpand} />
          </ListItemSecondaryAction>}
        </ListItem>
        <Collapse in={this.state.isExpand} transitionDuration='auto' unmountOnExit>
          {accounts.isLogged &&
          <ListItem button dense
            className={classNames({
              [classes.select]:
              this.props.router.page === 'artwork' &&
              this.props.artworks.timeline.unique === 'follows'
            })}
            component='a'
            href={'/artwork/follows'}>
            <ListItemText inset primary={'follows'} />
          </ListItem>}
          {accounts.isLogged &&
          <ListItem button dense
            className={classNames({
              [classes.select]:
              this.props.router.page === 'artwork' &&
              this.props.artworks.timeline.unique === 'self'
            })}
            component='a'
            href={'/artwork/self'}>
            <ListItemText inset primary={'self'} />
          </ListItem>}
        </Collapse>
        {this.props.accounts.isLogged &&
        <ListItem button dense
          className={classNames({
            [classes.select]: this.props.router.page.includes('artwork-new')
          })}
          component='a'
          href='/artwork/new'>
          <ListItemText primary='new artwork' />
          <ListItemSecondaryAction>
            <IconButton component='a' href='/artwork/new'>
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
