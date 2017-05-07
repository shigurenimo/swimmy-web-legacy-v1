import { Meteor } from 'meteor/meteor'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'

@inject('artworks', 'layout', 'networks', 'router', 'posts', 'postsSocket', 'snackbar', 'user')
@observer
class LeftMenuDefault extends Component {
  render () {
    return <div className='container:left-menu-default'>
      <div className='block:app-logo'>
        <img src='/images/logo.png'/>
        <div className='text:version'>{Meteor.settings.public.version}</div>
      </div>
      {/* アートワーク */}
      <div className='block:menu-artwork'>
        {this.props.artworks.timelines.map(item =>
          <a className={`input:list-item ${
          this.props.router.page === 'artwork' &&
          this.props.artworks.timeline.unique === item.unique}`}
            key={item.unique} href={'/artwork/' + item.unique}>{item.name}</a>)}
        {this.props.user.isLogged &&
        <a
          className={`input:list-item ${this.props.router.page.includes('artwork-new')}`}
          href='/artwork/new'>+ 新しいアートワーク</a>}
      </div>
      {/* 既存のネットワーク */}
      <div className='block:menu-network'>
        <a className={`input:list-item ${this.props.router.page.includes('thread')}`}
          href='/thread'>スレッド</a>
        <a className={`input:list-item ${this.props.router.page === 'timemachine'}`}
          href={'/timemachine'}>タイムマシーン</a>
        {this.props.posts.timelines.map(item =>
          <a className={`input:list-item ${
          this.props.router.page === 'timeline' &&
          this.props.posts.timeline.unique === item.unique}`}
            key={item.unique} href={'/' + item.unique}>{item.name}</a>)}
        {this.props.posts.networkTimelines.map(item =>
          <a className={`input:list-item ${
          this.props.router.page === 'timeline' &&
          this.props.posts.timeline.unique === item.unique}`}
            key={item.unique} href={'/room/' + item.network}>{item.name}</a>)}
      </div>
      {/* リスト */}
      <div className='block:menu-network'>
        {this.props.networks.timelines.map(item =>
          <a className={`input:list-item ${
          this.props.router.page === 'network-list' &&
          this.props.networks.timeline.unique === item.unique}`}
            key={item.unique} href={'/network/' + item.unique}>{item.name}</a>)}
        {this.props.user.isLogged &&
        !this.props.router.page.includes('network/new') &&
        <a className='input:list-item' href='/network/new'>+ 新しいリスト</a>}
      </div>
      {/* マイページ */}
      <div className='block:menu-config'>
        <a className={`input:list-item ${this.props.router.page.includes('admin')}`} href='/admin'>
          {this.props.user.isLogged ? 'マイページ' : 'ログイン'}
        </a>
        {this.props.user.isLogged &&
        <a className={`input:list-item ${this.props.router.page.includes('config')}`} href='/config'>
          アカウント設定
        </a>}
        <a className={`input:list-item ${this.props.router.page.includes('release')}`} href='/release'>
          リリースノート
        </a>
        <a className={`input:list-item ${this.props.router.page.includes('report')}`} href='/report'>
          レポート
        </a>
        {this.props.user.isLogged &&
        <div className='input:list-item' onTouchTap={this.onLogout.bind(this)}>
          ログアウト</div>}
      </div>
      <div className='block:copyright'>
        <div className='text:copyright'>
          © 2016 - 2017 swimmy.io
        </div>
      </div>
    </div>
  }

  // ログアウトする
  onLogout () {
    this.props.user.logout()
    .then(() => {
      this.props.snackbar.show('ログアウトしました')
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
  }
}

export { LeftMenuDefault }
