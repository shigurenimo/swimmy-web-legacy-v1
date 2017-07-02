import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import classNames from 'classnames'
import Collapse from 'material-ui/transitions/Collapse'
import { withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import IconButtonMoreExpand from '../../components/UI-IconButtonMoreExpand'
import styleSheet from './ListDefault.style'

@withStyles(styleSheet)
@inject('router', 'posts', 'accounts') @observer
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
        </ListItem>
        <ListItem button dense
          className={classNames({
            [classes.select]: this.props.router.page === 'timeline' && (
              this.props.posts.timeline.unique === 'default' ||
              this.props.posts.timeline.unique === 'follows' ||
              this.props.posts.timeline.unique === 'self' ||
              this.props.posts.timeline.unique === 'timemachine'
            )
          })}
          component='a'
          href={'/default'}>
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
              this.props.posts.timeline.unique === 'follows'
            })}
            component='a'
            href={'/follows'}>
            <ListItemText inset primary={'follows'} />
          </ListItem>}
          {accounts.isLogged &&
          <ListItem button dense
            className={classNames({
              [classes.select]: this.props.router.page === 'timeline' &&
              this.props.posts.timeline.unique === 'self'
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
            href={'/timemachine'}>
            <ListItemText inset primary='logs' />
          </ListItem>
        </Collapse>
        {this.props.posts.networkTimelines.map(item =>
          <ListItem button dense
            key={item.unique}
            className={classNames({
              [classes.select]: this.props.router.page === 'timeline' &&
              this.props.posts.timeline.unique === item.unique
            })}
            component='a'
            href={'/room/' + item.network}>
            <ListItemText primary={item.name} />
          </ListItem>)}
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
