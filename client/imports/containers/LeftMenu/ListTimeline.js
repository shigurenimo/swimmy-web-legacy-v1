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
@inject('accounts', 'router', 'posts', 'timelines') @observer
export default class LeftMenuTimeline extends Component {
  render () {
    const {accounts, classes} = this.props
    return (
      <List>
        {/* threads */}
        <ListItem button dense
          className={classNames({
            [classes.select]: this.props.router.page.includes('thread')
          })}
          component='a'
          href='/thread'>
          <ListItemText primary='threads' />
          <ListItemSecondaryAction>
            <IconButton component='a' href='/thread'>
              <BookmarkBorderIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        {/* timelines */}
        <ListItem button dense
          className={classNames({
            [classes.select]: this.props.router.page === 'timeline' && (
              this.props.timelines.unique === 'default' ||
              this.props.timelines.unique === 'follows' ||
              this.props.timelines.unique === 'self' ||
              this.props.timelines.unique === 'timemachine'
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
          {/* default */}
          <ListItem button dense
            className={classNames({
              [classes.select]: this.props.timelines.unique === 'default'
            })}
            component='a'
            href={'/'}>
            <ListItemText inset primary={'default'} />
          </ListItem>
          {/* follows */}
          {accounts.isLogged &&
          <ListItem button dense
            className={classNames({
              [classes.select]: this.props.timelines.unique === 'follows'
            })}
            component='a'
            href={'/follows'}>
            <ListItemText inset primary={'follows'} />
          </ListItem>}
          {/* self */}
          {accounts.isLogged &&
          <ListItem button dense
            className={classNames({
              [classes.select]: this.props.timelines.unique === 'self'
            })}
            component='a'
            href={'/self'}>
            <ListItemText inset primary={'self'} />
          </ListItem>}
        </Collapse>
        {this.props.timelines.channelIndex.map(item =>
          <ListItem button dense
            key={item.unique}
            className={classNames({
              [classes.select]: this.props.timelines.unique === item.unique
            })}
            component='a'
            href={'/channel/' + item.channelId}>
            <ListItemText primary={item.name} />
          </ListItem>)}
        {accounts.one.profile && accounts.one.profile.channels.map(item =>
          <ListItem button dense
            key={item._id}
            className={classNames({
              [classes.select]: this.props.timelines.channelId === item._id
            })}
            component='a'
            href={'/channel/' + item._id}>
            <ListItemText primary={item.name} />
          </ListItem>
        )}
      </List>
    )
  }

  state = {isExpand: false}

  onExpand () {
    this.setState({isExpand: !this.state.isExpand})
  }

  onExpand = ::this.onExpand
}
