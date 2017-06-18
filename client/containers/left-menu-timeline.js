import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import classNames from 'classnames'
import SubjectIcon from 'material-ui-icons/Subject'
import TimelineIcon from 'material-ui-icons/Timeline'
import UpdateIcon from 'material-ui-icons/Update'
import PersonOutlineIcon from 'material-ui-icons/PersonOutline'
import Collapse from 'material-ui/transitions/Collapse'
import { withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import IconButton from 'material-ui/IconButton'
import IconButtonMoreExpand from '../components/ui-icon-button-more-expand'
import styleSheet from './left-menu-default.style'

@withStyles(styleSheet)
@inject('router', 'posts', 'users')
@observer
export default class LeftMenuTimeline extends Component {
  render () {
    console.log(this.props.posts.timeline.unique )
    const {users, classes} = this.props
    return (
      <List>
        <ListItem button dense
          className={classNames({
            [classes.select]: this.props.router.page.includes('thread')
          })}
          component='a'
          href='/thread'>
          <ListItemText primary='スレッド' />
          <ListItemSecondaryAction>
            <IconButton component='a' href='/thread'>
              <SubjectIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem button dense
          className={classNames({
            [classes.select]:
            this.props.router.page === 'timeline' && (
              this.props.posts.timeline.unique === 'default' ||
              this.props.posts.timeline.unique === 'follows' ||
              this.props.posts.timeline.unique === 'self' ||
              this.props.posts.timeline.unique === 'timemachine'
            )
          })}
          component='a'
          href={'/default'}>
          <ListItemText primary={'タイムライン'} />
          <ListItemSecondaryAction>
            <IconButtonMoreExpand isExpand={this.state.isExpand} onClick={this.onExpand} />
          </ListItemSecondaryAction>
        </ListItem>
        <Collapse in={this.state.isExpand} transitionDuration='auto' unmountOnExit>
          {users.isLogged &&
          <ListItem button dense
            className={classNames({
              [classes.select]:
              this.props.router.page === 'timeline' &&
              this.props.posts.timeline.unique === 'follows'
            })}
            component='a'
            href={'/follows'}>
            <ListItemText inset primary={'フォロー'} />
            <ListItemSecondaryAction>
              <IconButton component='a' href='/follows'>
                <TimelineIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>}
          {users.isLogged &&
          <ListItem button dense
            className={classNames({
              [classes.select]:
              this.props.router.page === 'timeline' &&
              this.props.posts.timeline.unique === 'self'
            })}
            component='a'
            href={'/self'}>
            <ListItemText inset primary={'あなた'} />
            <ListItemSecondaryAction>
              <IconButton component='a' href='/self'>
                <PersonOutlineIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>}
          <ListItem button dense
            className={classNames({
              [classes.select]: this.props.router.page === 'timemachine'
            })}
            component='a'
            href={'/timemachine'}>
            <ListItemText inset primary='過去ログ' />
            <ListItemSecondaryAction>
              <IconButton component='a' href='/timemachine'>
                <UpdateIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </Collapse>
        {this.props.posts.networkTimelines.map(item =>
          <ListItem button dense
            key={item.unique}
            className={classNames({
              [classes.select]:
              this.props.router.page === 'timeline' &&
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
