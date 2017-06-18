import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'
import Divider from 'material-ui/Divider'
import List, { ListItem, ListItemText } from 'material-ui/List'
import Typography from 'material-ui/Typography'
import Sheet from '../components/ui-sheet'
import SheetContent from '../components/ui-sheet-content'
import LeftMenuTimeline from './left-menu-timeline'
import LeftMenuArtworks from './left-menu-artworks'
import LeftMenuNetworks from './left-menu-networks'
import styleSheet from './left-menu-default.style'

@withStyles(styleSheet)
@inject('artworks', 'layout', 'networks', 'router', 'posts', 'postsSocket', 'snackbar', 'users')
@observer
export default class LeftMenuDefault extends Component {
  render () {
    const {classes} = this.props
    return (
      <div>
        <LeftMenuTimeline />
        <Divider light />
        <LeftMenuArtworks />
        <Divider light />
        <LeftMenuNetworks />
        <Divider light />
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
