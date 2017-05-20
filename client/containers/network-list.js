import { Meteor } from 'meteor/meteor'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { utils } from '../../imports/utils'

@inject('networks', 'user')
@observer
class NetworkList extends Component {
  render () {
    return <div className='container:network-list'>
      <div className='block:network-list'>
        {this.forNetworks()}
      </div>
    </div>
  }

  forNetworks () {
    const index = this.props.networks.index.slice()
    const isFetching = this.props.networks.isFetching
    if (index.length < 1) {
      return <div className='block:no-post'>
        <div className='text:no-post'>
          {isFetching ? '読み込み中 ..' : 'データが見つかりませんでした'}
        </div>
      </div>
    }
    return index.map(item =>
      <div className='block:network-item' key={item._id}>
        <a className='block:layout' href={'/room/' + item._id + '/?preview=true'}>
          <div className='block:network-name'>
            {/* 大学名 */}
            {item.univ &&
            <div className='text:univ'>
              {utils.regions[item.channel].name.jp}・{item.univ}
            </div>}
            {/* リスト名 */}
            <h2 className='text:network-name'>
              {item.name}
            </h2>
            {/* リストイメージ */}
            {item.header &&
            <div className='image:network-name'
              style={{
                backgroundImage: item.header
                  ? 'url(' + Meteor.settings.public.assets.network.root + item._id + '/' + item.header + ')'
                  : 'url()'
              }}>
            </div>}
          </div>
          {/* コンテンツ */}
          <div className='block:network-description'>
            <div className='text:network-description'>
              {item.description}
            </div>
          </div>
        </a>
      </div>)
  }

  componentDidMount () {
    this.context.onScrollTop()
  }

  static get contextTypes () {
    return {
      onScrollTop: propTypes.any
    }
  }
}

export { NetworkList }
