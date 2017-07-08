import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Layout from '../../components/UI-Layout'
import Sheet from '../../components/UI-Sheet'
import SheetContent from '../../components/UI-SheetContent'
import ChannelInfo from '../ChannelInfo'
import Post from '../CardPost'

@inject('channels', 'posts', 'timelines', 'info')
@observer
export default class Timeline extends Component {
  render () {
    return (
      <Layout>
        {this.props.info.channel && <ChannelInfo />}
        {this.forPosts()}
      </Layout>
    )
  }

  forPosts () {
    const unique = this.props.timelines.unique
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
