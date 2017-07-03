import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import classNames from 'classnames'
import BookmarkBorderIcon from 'material-ui-icons/BookmarkBorder'
import Collapse from 'material-ui/transitions/Collapse'
import { withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import IconButton from 'material-ui/IconButton'
import IconButtonMoreExpand from '../../components/UI-IconButtonMoreExpand'
import styleSheet from './ListDefault.style'

@withStyles(styleSheet)
@inject('router', 'posts', 'accounts', 'timelines') @observer
export default class LeftMenuTimeline extends Component {
  render () {
    const {accounts, classes} = this.props
    return (
      <List>
        <ListItem button dense
          className={classNames({
            [classes.select]: this.props.router.page.includes('thread')
          })}
          component='a'
          href='/thread'>
          <ListItemText primary='thread' />
          <ListItemSecondaryAction>
            <IconButton component='a' href='/thread'>
              <BookmarkBorderIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem button dense
          className={classNames({
            [classes.select]: this.props.router.page === 'timeline' && (
              this.props.timelines.one.unique === 'default' ||
              this.props.timelines.one.unique === 'follows' ||
              this.props.timelines.one.unique === 'self' ||
              this.props.timelines.one.unique === 'timemachine'
            )
          })}
          component='a'
          href={'/'}>
          <ListItemText primary={'timeline'} />
          <ListItemSecondaryAction>
            <IconButtonMoreExpand isExpand={this.state.isExpand} onClick={this.onExpand} />
          </ListItemSecondaryAction>
        </ListItem>
        <Collapse in={this.state.isExpand} transitionDuration='auto' unmountOnExit>
          {accounts.isLogged &&
          <ListItem button dense
            className={classNames({
              [classes.select]: this.props.router.page === 'timeline' &&
              this.props.timelines.one.unique === 'follows'
            })}
            component='a'
            href={'/follows'}>
            <ListItemText inset primary={'follows'} />
          </ListItem>}
          {accounts.isLogged &&
          <ListItem button dense
            className={classNames({
              [classes.select]: this.props.router.page === 'timeline' &&
              this.props.timelines.one.unique === 'self'
            })}
            component='a'
            href={'/self'}>
            <ListItemText inset primary={'self'} />
          </ListItem>}
          <ListItem button dense
            className={classNames({
              [classes.select]: this.props.router.page === 'timemachine'
            })}
            component='a'
            href={'/logs'}>
            <ListItemText inset primary='logs' />
          </ListItem>
        </Collapse>
        {this.props.timelines.networkIndex.map(item =>
          <ListItem button dense
            key={item.unique}
            className={classNames({
              [classes.select]: this.props.router.page === 'timeline' &&
              this.props.timelines.one.unique === item.unique
            })}
            component='a'
            href={'/room/' + item.networkId}>
            <ListItemText primary={item.name} />
          </ListItem>)}
      </List>
    )
  }

  state = {isExpand: false}

  onExpand () {
    this.setState({isExpand: !this.state.isExpand})
  }

  onExpand = ::this.onExpand
}
