import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Block from '../../components/UI-Block'
import Layout from '../../components/UI-Layout'
import Sheet from '../../components/UI-Sheet'
import SheetContent from '../../components/UI-SheetContent'
import styleSheet from './index.style'

@withStyles(styleSheet)
@inject('channels', 'accounts') @observer
export default class ChannelList extends Component {
  render () {
    return (
      <Layout>
        {this.forChannels()}
      </Layout>
    )
  }

  forChannels () {
    const {classes} = this.props
    if (this.props.channels.index.length === 0) {
      return (
        <Sheet>
          <SheetContent>
            <Typography>
              {this.props.channels.fetchState ? '読み込み中 ..' : 'データが見つかりませんでした'}
            </Typography>
          </SheetContent>
        </Sheet>
      )
    }
    return this.props.channels.index.map(item =>
      <Sheet hover key={item._id} href={'/ch/' + item._id + '/?preview=true'}>
        <SheetContent>
          <Typography type='subheading'>
            {item.name}
          </Typography>
        </SheetContent>
        <Block width={600}>
          <SheetContent>
            <Typography className={classes.content}>
              {item.description || 'このチャンネルには説明がありません'}
            </Typography>
          </SheetContent>
        </Block>
      </Sheet>)
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
