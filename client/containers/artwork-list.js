import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Layout from '../components/ui-layout'
import Sheet from '../components/ui-sheet'
import SheetContent from '../components/ui-sheet-content'
import PostArtwork from './post-artwork'

@inject('artworks')
@observer
export default class ArtworkList extends Component {
  render () {
    return (
      <Layout>
        {this.forPosts()}
      </Layout>
    )
  }

  forPosts () {
    const index = this.props.artworks.index.slice()
    const isFetching = this.props.artworks.isFetching
    if (index.length < 1) {
      return (
        <Sheet>
          <SheetContent>
            <Typography>
              {isFetching ? '読み込み中 ..' : 'データが見つかりませんでした'}
            </Typography>
          </SheetContent>
        </Sheet>
      )
    }
    return index.map(item => <PostArtwork key={item._id} {...item} />)
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
