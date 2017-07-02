import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import classNames from 'classnames'
import AddIcon from 'material-ui-icons/Add'
import Collapse from 'material-ui/transitions/Collapse'
import { withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import IconButton from 'material-ui/IconButton'
import IconButtonMoreExpand from '../../components/UI-IconButtonMoreExpand'
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
            [classes.select]: this.props.router.page === 'network' && (
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
        <Collapse in={this.state.isExpand} transitionDuration='auto'>
          <ListItem button dense
            className={classNames({
              [classes.select]: this.props.router.page === 'network' &&
              this.props.networks.timeline.unique === 'net'
            })}
            component='a'
            href={'/network/net'}>
            <ListItemText inset primary={'internet'} />
          </ListItem>
          <ListItem button dense
            className={classNames({
              [classes.select]: this.props.router.page === 'network' &&
              this.props.networks.timeline.unique === 'univ'
            })}
            component='a'
            href={'/network/univ'}>
            <ListItemText inset primary={'univ'} />
          </ListItem>
        </Collapse>
        {this.props.accounts.isLogged &&
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
