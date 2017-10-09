import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Block from '/imports/ui/components/UI-Block'
import Layout from '/imports/ui/components/UI-Layout'
import Sheet from '/imports/ui/components/UI-Sheet'
import SheetContent from '/imports/ui/components/UI-SheetContent'
import styles from './index.style'

@withStyles(styles)
@inject('channels')
@observer
export default class ChannelList extends Component {
  render () {
    return (
      <Layout>
        {this.forChannels}
      </Layout>
    )
  }

  get channels () { return this.props.channels.model.get('root') }

  get forChannels () {
    const {classes} = this.props
    if (this.channels.isEmpty) {
      return (
        <Sheet>
          <SheetContent>
            <Typography>
              {this.channels.fetchState ? '読み込み中 ..' : 'データが見つかりませんでした'}
            </Typography>
          </SheetContent>
        </Sheet>
      )
    }
    return this.channels.index.map(item =>
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

  componentDidMount () { this.context.onScrollTop() }

  static get contextTypes () { return {onScrollTop: propTypes.any} }
}
