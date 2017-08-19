import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Layout from '/client/components/UI-Layout'
import Sheet from '/client/components/UI-Sheet'
import SheetContent from '/client/components/UI-SheetContent'
import ChannelInfo from '/client/containers/ChannelInfo'
import CardPost from '/client/containers/CardPost'

@inject('posts', 'timeline', 'info')
@observer
export default class Timeline extends Component {
  render () {
    return (
      <Layout>
        {this.props.info.isOpen && <ChannelInfo />}
        {this.forPosts}
      </Layout>
    )
  }

  get posts () { return this.props.posts.model.get(this.props.timeline.unique) }

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
    return this.posts.index.map(item => <CardPost key={item._id} {...item} />)
  }

  componentDidMount () { this.context.onScrollTop() }

  static get contextTypes () { return {onScrollTop: propTypes.any} }
}
