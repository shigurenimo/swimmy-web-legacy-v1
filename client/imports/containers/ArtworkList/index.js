import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Layout from '../../components/UI-Layout'
import Sheet from '../../components/UI-Sheet'
import SheetContent from '../../components/UI-SheetContent'
import PostArtwork from '../CardArtwork'

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
    const {index, isFetching} = this.props.artworks
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
