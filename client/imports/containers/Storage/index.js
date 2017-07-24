import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Layout from '../../components/UI-Layout'
import Sheet from '../../components/UI-Sheet'
import SheetContent from '../../components/UI-SheetContent'
import CardImage from '../CardImage'

@inject('posts', 'timeline')
@observer
export default class Storage extends Component {
  render () {
    return (
      <Layout>
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
      return <CardImage key={item._id} {...item} />
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
