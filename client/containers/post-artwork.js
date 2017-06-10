import { Meteor } from 'meteor/meteor'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import Typography from 'material-ui/Typography'
import InputButton from '../components/ui-input-button'
import Sheet from '../components/ui-sheet'
import SheetContent from '../components/ui-sheet-content'
import SheetImage from '../components/ui-sheet-image'

@inject('artworks', 'snackbar', 'user')
@observer
export default class PostArtwork extends Component {
  render () {
    return (
      <Sheet>
        {/* ユーザ */}
        {this.props.public &&
        <SheetContent>
          <Typography>
            {this.props.public.name} @{this.props.public.username}
          </Typography>
        </SheetContent>}
        {/* イメージ */}
        <SheetImage href={'/uuid/' + this.props._id} src={this.src} />
        {/* タイトル */}
        {this.props.title &&
        <SheetContent>
          <Typography>{this.props.title}</Typography>
        </SheetContent>}
        {/* ノート */}
        {this.props.note &&
        <SheetContent>
          <Typography dangerouslySetInnerHTML={{__html: this.props.note}} />
        </SheetContent>}
        {/* リアクションボタン */}
        <SheetContent>
          {Object.keys(this.props.reactions).map(name =>
            <InputButton
              className={'input:reaction'}
              key={name}
              primary={!!this.props.user.isLogged && this.props.reactions[name].includes(this.props.user._id)}
              onClick={this.onUpdateReaction.bind(this, this.props._id, name)}>
              {name + (this.props.reactions[name].length > 0 ? ' ' + this.props.reactions[name].length : '')}
            </InputButton>)}
        </SheetContent>
      </Sheet>
    )
  }

  get src () {
    return Meteor.settings.public.assets.work.root +
      this.props.type + '/' +
      this.props.imageDate + '/' +
      this.props.image.min
  }

  // リアクションを更新する
  onUpdateReaction (postId, name) {
    if (!this.props.user.isLogged) {
      this.props.snackbar.requireLogin()
      return
    }
    this.props.artworks.updateReaction(postId, name)
    .then(post => {
      this.props.artworks.updateIndex(post._id, post)
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
  }
}
