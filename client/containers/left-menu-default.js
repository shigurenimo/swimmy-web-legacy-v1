import { Meteor } from 'meteor/meteor'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemText } from 'material-ui/List'
import Typography from 'material-ui/Typography'
import Sheet from '../components/ui-sheet'
import SheetContent from '../components/ui-sheet-content'
import styleSheet from './left-menu-default.style'

@withStyles(styleSheet)
@inject('artworks', 'layout', 'networks', 'router', 'posts', 'postsSocket', 'snackbar', 'users')
@observer
export default class LeftMenuDefault extends Component {
  render () {
    const {classes} = this.props
    return (
      <div>
        <div className={classes.appLogo}>
          <img className={classes.appLogoImage} src='/images/logo.png' />
          <Typography className={classes.appVersion}>
            {Meteor.settings.public.version}
          </Typography>
        </div>
        {/* 既存のネットワーク */}
        <List>
          <ListItem button dense
            className={classNames({
              [classes.select]: this.props.router.page.includes('thread')
            })}
            component='a'
            href='/thread'>
            <ListItemText primary='スレッド' />
          </ListItem>
          {this.props.posts.timelines.map(item =>
            <ListItem button dense
              key={item.unique}
              className={classNames({
                [classes.select]: this.props.router.page === 'timeline' &&
                this.props.posts.timeline.unique === item.unique
              })}
              component='a'
              href={'/' + item.unique}>
              <ListItemText primary={item.name} />
            </ListItem>)}
          <ListItem button dense
            className={classNames({
              [classes.select]: this.props.router.page === 'timemachine'
            })}
            component='a'
            href={'/timemachine'}>
            <ListItemText primary='過去ログ' />
          </ListItem>
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
        {/* アートワーク */}
        <List>
          {this.props.artworks.timelines.map(item =>
            <ListItem button dense
              key={item.unique}
              className={classNames({
                [classes.select]: this.props.router.page === 'artwork' &&
                this.props.artworks.timeline.unique === item.unique
              })}
              component='a'
              href={'/artwork/' + item.unique}>
              <ListItemText primary={item.name} />
            </ListItem>)}
          {this.props.users.isLogged &&
          <ListItem button dense
            className={classNames({
              [classes.select]: this.props.router.page.includes('artwork-new')
            })}
            component='a'
            href='/artwork/new'>
            <ListItemText primary='+ 新しいアートワーク' />
          </ListItem>}
        </List>
        {/* リスト */}
        <List>
          {this.props.networks.timelines.map(item =>
            <ListItem button dense
              key={item.unique}
              className={classNames({
                [classes.select]: this.props.router.page === 'network-list' &&
                this.props.networks.timeline.unique === item.unique
              })}
              component='a'
              href={'/network/' + item.unique}>
              <ListItemText primary={item.name} />
            </ListItem>)}
          {this.props.users.isLogged &&
          !this.props.router.page.includes('network/new') &&
          <ListItem button dense
            className={classNames({
              [classes.select]: this.props.router.page === 'network-new'
            })}
            component='a'
            href={'/network/new'}>
            <ListItemText primary='+ 新しいリスト' />
          </ListItem>}
        </List>
        {/* マイページ */}
        <List>
          <ListItem button dense
            className={classNames({
              [classes.select]: this.props.router.page.includes('admin')
            })}
            component='a'
            href='/admin'>
            <ListItemText primary={this.props.users.isLogged ? 'マイページ' : 'ログイン'} />
          </ListItem>
          {this.props.users.isLogged &&
          <ListItem button dense
            className={classNames({
              [classes.select]: this.props.router.page.includes('config')
            })}
            component='a'
            href='/config'>
            <ListItemText primary='アカウント設定' />
          </ListItem>}
          <ListItem button dense
            className={classNames({
              [classes.select]: this.props.router.page.includes('release')
            })}
            component='a'
            href='/release'>
            <ListItemText primary='リリースノート' />
          </ListItem>
          <ListItem button dense
            className={classNames({
              [classes.select]: this.props.router.page.includes('report')
            })}
            component='a'
            href='/report'>
            <ListItemText primary='統計データ' />
          </ListItem>
          {this.props.users.isLogged &&
          <ListItem button dense onClick={this.onLogout}>
            <ListItemText primary='ログアウト' />
          </ListItem>}
        </List>
        <Sheet>
          <SheetContent>
            <Typography type='caption'>
              © 2016 - 2017 swimmy.io
            </Typography>
          </SheetContent>
        </Sheet>
      </div>
    )
  }

  // ログアウトする
  onLogout () {
    this.props.users.logout()
    .then(() => {
      this.props.snackbar.show('ログアウトしました')
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
  }

  onLogout = ::this.onLogout
}
