import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Layout from '/client/components/UI-Layout'
import Sheet from '/client/components/UI-Sheet'
import SheetContent from '/client/components/UI-SheetContent'
import ChannelInfo from '../ChannelInfo'
import Post from '../CardPost'

@inject('posts', 'timeline', 'info')
@observer
export default class Timeline extends Component {
  render () {
    return (
      <Layout>
        {this.props.info.isOpen && <ChannelInfo />}
        {this.forPosts()}
      </Layout>
    )
  }

  forPosts () {
    const unique = this.props.timeline.unique
    if (this.props.posts[unique].index.length === 0) {
      return (
        <Sheet>
          <SheetContent>
            <Typography>
              {this.props.posts[unique].fetchState ? '読み込み中 ..' : ''}
            </Typography>
          </SheetContent>
        </Sheet>
      )
    }
    return this.props.posts[unique].index.map(item => {
      return <Post key={item._id} {...item} />
    })
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
