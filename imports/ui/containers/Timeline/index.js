import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Layout from '/imports/ui/components/UI-Layout'
import Sheet from '/imports/ui/components/UI-Sheet'
import SheetContent from '/imports/ui/components/UI-SheetContent'
import ChannelInfo from '/imports/ui/containers/ChannelInfo'
import CardPost from '/imports/ui/containers/CardPost'
import withPosts from '/imports/ui/hocs/withPosts'

@inject('posts', 'timeline', 'info')
@observer
@withPosts({scope: ''})
export default class Timeline extends Component {
  render () {
    return (
      <Layout>
        {this.props.info.isOpen && <ChannelInfo />}
        {this.forPosts}
      </Layout>
    )
  }

  get forPosts () {
    if (this.props.posts.data.length === 0) {
      return (
        <Sheet>
          <SheetContent>
            <Typography>
              {this.props.posts.loading ? '読み込み中 ..' : ''}
            </Typography>
          </SheetContent>
        </Sheet>
      )
    }
    return this.props.posts.data.map(item => <CardPost key={item._id} {...item} />)
  }

  componentDidMount () { this.context.onScrollTop() }

  static get contextTypes () { return {onScrollTop: propTypes.any} }
}
