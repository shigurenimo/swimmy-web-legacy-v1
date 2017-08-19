import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Layout from '/client/components/UI-Layout'
import Sheet from '/client/components/UI-Sheet'
import SheetContent from '/client/components/UI-SheetContent'
import CardImage from '../CardImage'

@inject('posts', 'timeline')
@observer
export default class Storage extends Component {
  render () {
    return (
      <Layout>
        {this.forPosts}
      </Layout>
    )
  }

  get posts () { return this.props.posts.model.get('storage') }

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
    return this.posts.index.map(item => <CardImage key={item._id} {...item} />)
  }

  componentDidMount () { this.context.onScrollTop() }

  static get contextTypes () { return {onScrollTop: propTypes.any} }
}
