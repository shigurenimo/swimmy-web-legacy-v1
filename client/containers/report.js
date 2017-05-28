import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'

@inject('reports')
@observer
export default class Report extends Component {
  render () {
    return <div className='container:report'>
      <div className='block:report-data'>
        <div className='block:report'>
          <div className='text:number'>{this.props.reports.index.total.users}</div>
          <div className='text:description'>ユーザ数</div>
        </div>
        <div className='block:report'>
          <div className='text:number'>{this.props.reports.index.total.posts}</div>
          <div className='text:description'>書き込み</div>
        </div>
        <div className='block:report'>
          <div className='text:number'>{this.props.reports.index.total.artworks}</div>
          <div className='text:description'>アートワーク</div>
        </div>
      </div>
      {this.props.reports.index.user &&
      <div className='block:report-data'>
        <div className='block:report'>
          <div className='text:number'>{this.props.reports.index.user.posts}</div>
          <div className='text:description'>あなたの書き込み</div>
        </div>
        <div className='block:report'>
          <div className='text:number'>{this.props.reports.index.user.artworks}</div>
          <div className='text:description'>あなたのアートワーク</div>
        </div>
      </div>}
    </div>
  }

  static get contextTypes () {
    return {onScrollTop: propTypes.any}
  }

  componentDidMount () {
    this.context.onScrollTop()
  }
}
