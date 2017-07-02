import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Layout from '../../components/UI-Layout'
import Sheet from '../../components/UI-Sheet'
import SheetContent from '../../components/UI-SheetContent'
import NetworkInfo from '../NetworkInfo'
import Post from '../CardPost'

@inject('networks', 'posts', 'postsSocket', 'timelines')
@observer
export default class Timeline extends Component {
  render () {
    return (
      <Layout>
        {false && <NetworkInfo />}
        {this.forPosts()}
      </Layout>
    )
  }

  forPosts () {
    const timeline = this.props.timelines.one
    const index = timeline.isStatic
      ? this.props.posts.index.slice()
      : this.props.postsSocket.index.slice()
    const fetchState = timeline.isStatic
      ? this.props.posts.fetchState
      : this.props.postsSocket.fetchState
    if (index.length < 1) {
      return (
        <Sheet>
          <SheetContent>
            <Typography>
              {fetchState ? '読み込み中 ..' : ''}
            </Typography>
          </SheetContent>
        </Sheet>
      )
    }
    return index.map(item => <Post key={item._id} {...item} />)
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
