import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Layout from '/imports/ui/components/UI-Layout'
import Sheet from '/imports/ui/components/UI-Sheet'
import SheetContent from '/imports/ui/components/UI-SheetContent'
import ChannelInfo from '../ChannelInfo'
import PostRes from '../CardPost/CardRes'

@inject('posts', 'info')
@observer
export default class Thread extends Component {
  render () {
    return (
      <Layout>
        {this.props.info.channel && <ChannelInfo />}
        {this.forPosts}
      </Layout>
    )
  }

  get posts () { return this.props.posts.model.get('thread') }

  get forPosts () {
    if (this.posts.isEmpty) {
      return (
        <Sheet>
          <SheetContent>
            <Typography>
              {this.posts.fetchState ? '読み込み中 ..' : ''}
            </Typography>
          </SheetContent>
        </Sheet>
      )
    }
    return this.posts.index.map(item => <PostRes key={item._id} {...item} />)
  }

  componentDidMount () { this.context.onScrollTop() }

  static get contextTypes () { return {onScrollTop: propTypes.any} }
}
