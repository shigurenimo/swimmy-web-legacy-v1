import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import classNames from 'classnames'
import AddIcon from 'material-ui-icons/Add'
import ExploreIcon from 'material-ui-icons/Explore'
import PublicIcon from 'material-ui-icons/Public'
import SchoolIcon from 'material-ui-icons/School'
import Collapse from 'material-ui/transitions/Collapse'
import { withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import IconButton from 'material-ui/IconButton'
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
            [classes.select]:
            this.props.router.page === 'network' && (
              this.props.artworks.timeline.unique === 'net' ||
              this.props.artworks.timeline.unique === 'univ' ||
              this.props.artworks.timeline.unique === 'channel'
            )
          })}
          component='a'
          href={'/network/default'}>
          <ListItemText primary={'lists'} />
          <ListItemSecondaryAction>
            <IconButtonMoreExpand isExpand={this.state.isExpand} onClick={this.onExpand} />
          </ListItemSecondaryAction>
        </ListItem>
        <Collapse in={this.state.isExpand} transitionDuration='auto' unmountOnExit>
          <ListItem button dense
            className={classNames({
              [classes.select]:
              this.props.router.page === 'network' &&
              this.props.networks.timeline.unique === 'net'
            })}
            component='a'
            href={'/network/net'}>
            <ListItemText inset primary={'internet'} />
            <ListItemSecondaryAction>
              <IconButton component='a' href='/network/net'>
                <ExploreIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem button dense
            className={classNames({
              [classes.select]:
              this.props.router.page === 'network' &&
              this.props.networks.timeline.unique === 'univ'
            })}
            component='a'
            href={'/network/univ'}>
            <ListItemText inset primary={'univ'} />
            <ListItemSecondaryAction>
              <IconButton component='a' href='/network/univ'>
                <SchoolIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </Collapse>
        {this.props.users.isLogged &&
        <ListItem button dense
          className={classNames({
            [classes.select]: this.props.router.page.includes('network-new')
          })}
          component='a'
          href='/network/new'>
          <ListItemText primary='new list' />
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
