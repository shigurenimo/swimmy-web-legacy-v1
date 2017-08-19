import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import classNames from 'classnames'
import BookmarkBorderIcon from 'material-ui-icons/BookmarkBorder'
import SearchIcon from 'material-ui-icons/Search'
import Collapse from 'material-ui/transitions/Collapse'
import { withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import IconButton from 'material-ui/IconButton'
import IconButtonMoreExpand from '/client/components/UI-IconButtonMoreExpand'
import styleSheet from './ListDefault.style'

@withStyles(styles)
@inject('accounts', 'routes', 'posts', 'timeline')
@observer
export default class LeftMenuTimeline extends Component {
  render () {
    const {accounts, classes} = this.props
    return (
      <List>
        {/* timelines */}
        <ListItem button dense
          className={classNames({
            [classes.select]: this.props.routes.page === 'timeline' && (
              this.props.timeline.unique === 'default' ||
              this.props.timeline.unique === 'follows' ||
              this.props.timeline.unique === 'self'
            )
          })}
          component='a'
          href={'/'}>
          <ListItemText primary={'chat'} />
          <ListItemSecondaryAction>
            <IconButtonMoreExpand isExpand={this.state.isExpand} onClick={this.onExpand} />
          </ListItemSecondaryAction>
        </ListItem>
        <Collapse in={this.state.isExpand} transitionDuration='auto' unmountOnExit>
          {/* default */}
          <ListItem button dense
            className={classNames({
              [classes.select]: this.props.timeline.unique === 'default'
            })}
            component='a'
            href={'/'}>
            <ListItemText inset primary={'default'} />
          </ListItem>
          {/* self */}
          {accounts.isLogged &&
          <ListItem button dense
            className={classNames({
              [classes.select]: this.props.timeline.unique === 'self'
            })}
            component='a'
            href={'/self'}>
            <ListItemText inset primary={accounts.username || 'self'} />
          </ListItem>}
        </Collapse>
        {/* threads */}
        <ListItem button dense
          className={classNames({
            [classes.select]: this.props.routes.page.includes('thread')
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
        {/* storage */}
        <ListItem button dense
          className={classNames({
            [classes.select]: this.props.routes.page.includes('storage')
          })}
          component='a'
          href='/storage'>
          <ListItemText primary='storage' />
        </ListItem>
        {/* explore */}
        <ListItem button dense
          className={classNames({
            [classes.select]: this.props.routes.page.includes('explore')
          })}
          component='a'
          href='/explore'>
          <ListItemText primary='explore' />
          <ListItemSecondaryAction>
            <IconButton component={'a'} href={'/explore'}>
              <SearchIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        {accounts.isLogged && accounts.profile.channels.map(item =>
          <ListItem button dense
            key={item._id}
            className={classNames({
              [classes.select]: this.props.timeline.channelId === item._id
            })}
            component='a'
            href={'/ch/' + item._id}>
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
