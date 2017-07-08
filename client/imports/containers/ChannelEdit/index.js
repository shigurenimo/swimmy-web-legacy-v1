import { Meteor } from 'meteor/meteor'
import { HTTP } from 'meteor/http'
import { Random } from 'meteor/random'
import propTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import Button from 'material-ui/Button'
import TextField from '../../components/TextField'
import Layout from '../../components/UI-Layout'
import Sheet from '../../components/UI-Sheet'
import SheetActions from '../../components/UI-SheetActions'
import SheetContent from '../../components/UI-SheetContent'
import Typograhy from '../../components/Typography'

@inject('accounts', 'channels', 'snackbar')
@observer
export default class ChannelEdit extends Component {
  render () {
    const {channels: {one: channel}} = this.props
    try {
      return (
        <Layout>
          <Sheet>
            <SheetActions align='right'>
              <Button component='a' href={'/ch/' + channel._id}>
                もどる
              </Button>
            </SheetActions>
          </Sheet>
          {/* name */}
          <Sheet>
            <SheetContent>
              <TextField fullWidth
                label='チャンネルの名前'
                value={this.state.name}
                maxLength={50}
                onChange={this.onChangeName}
                onBlur={this.onSubmitName} />
            </SheetContent>
          </Sheet>
          {/* description */}
          <Sheet>
            <SheetActions>
              <TextField multiline fullWidth
                label='チャンネルの説明'
                value={this.state.description}
                maxLength='100'
                onChange={this.onInputDescription}
                onBlur={this.onSubmitDescription} />
            </SheetActions>
          </Sheet>
          {this.props.accounts.isLogged &&
          this.props.accounts.one._id === channel.ownerId &&
          <Sheet>
            <SheetActions align='right'>
              <Button onClick={this.onRemoveList}>
                このチャンネルを削除する
              </Button>
            </SheetActions>
          </Sheet>}
        </Layout>
      )
    } catch (err) {
      console.error(err)
      return <Typograhy>エラーが発生しました</Typograhy>
    }
  }

  state = {
    name: this.props.channels.one.name,
    header: this.props.channels.one.header,
    description: this.props.channels.one.description || '',
    region: this.props.channels.one.region,
    errorImageHeader: null
  }

  // チャンネルの名前を更新する
  onChangeName (event) {
    event.persist()
    const value = event.target.value
    if (value > 20) return
    if (value < 0) return
    this.setState({name: value})
  }

  onChangeName = ::this.onChangeName

  // チャンネルの名前の更新をサーバーに送信する
  onSubmitName () {
    if (this.props.channels.one.name === this.state.name) return
    const channelId = this.props.channels.one._id
    const next = this.state.name
    this.props.channels.updateBasic(channelId, 'name', next)
    .then(data => {
      this.props.channels.replaceOne(data)
      this.props.snackbar.show('更新しました')
    })
    .catch(err => this.props.snackbar.error(err.reason))
  }

  onSubmitName = ::this.onSubmitName

  // 画像をアップロードしてサーバーに送信する
  onDropHeader (acceptedFiles) {
    const file = acceptedFiles[0]
    const type = file.type
    const nameArray = file.name.split('.')
    const extension = nameArray[nameArray.length - 1].toLowerCase()
    if (type.indexOf('image') === -1) {
      this.setState({errorImageHeader: 'アップロードできるのはイメージデータのみです'})
      setTimeout(() => {
        this.setState({errorImageHeader: null})
      }, 4000)
      return
    }
    if (file.size > 5000000) {
      this.setState({errorImageHeader: 'サイズが5MBを超えています'})
      setTimeout(() => {
        this.setState({errorImageHeader: null})
      }, 4000)
      return
    }
    const imageName = 'header.' + extension
    const imageNameCache = imageName + '?uuid=' + Random.id()
    const formdata = new FormData()
    formdata.append('file', file)
    formdata.append('name_min', imageName)
    formdata.append('id', this.props.channels.one._id)
    if (Meteor.isDevelopment) {
      if (!Meteor.settings.public.api || !Meteor.settings.public.api.unique) {
        this.props.snackbar.errorMessage('開発環境では画像のアップロードは利用できません')
        this.process = false
        return
      }
      formdata.append('unique', Meteor.settings.public.api.unique)
    }
    this.setState({errorImageHeader: null})
    new Promise((resolve, reject) => {
      HTTP.post(Meteor.settings.public.api.channel.header, {content: formdata}, err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
    .then(() => {
      const channelId = this.props.channels.one._id
      return this.props.channels.updateBasic(channelId, 'header', imageNameCache)
    })
    .then(data => {
      this.props.channels.replaceOne(data)
      this.props.snackbar.show('更新しました')
      this.setState({header: imageNameCache})
    })
    .catch(err => {
      this.props.snackbar.error(err)
      this.process = false
    })
  }

  onDropHeader = ::this.onDropHeader

  // チャンネルの説明を更新する
  onInputDescription (event) {
    event.persist()
    const value = event.target.value
    if (value > 100) return
    if (value < 0) return
    this.setState({description: value})
  }

  onInputDescription = ::this.onInputDescription

  // チャンネルの説明の更新をサーバーに送信する
  onSubmitDescription () {
    const channelId = this.props.channels.one._id
    const next = this.state.description
    if (this.props.channels.one.description === this.state.description) return
    this.props.channels.updateBasic(channelId, 'description', next)
    .then(data => {
      this.props.channels.replaceOne(data)
      this.props.snackbar.show('更新しました')
    })
    .catch(err => this.props.snackbar.error(err.reason))
  }

  onSubmitDescription = ::this.onSubmitDescription

  // テキストを入力する
  onInputSocial (name, event) {
    event.persist()
    const value = event.target.value
    const object = {}
    object[name] = value
    this.setState(object)
  }

  onRemoveList () {
    const confirm = window.confirm('削除してもいいですか？')
    if (!confirm) return
    const channelId = this.props.channels.one._id
    this.props.channels.remove(channelId)
    .then(data => {
      this.props.channels.pullIndex(channelId)
      this.props.router.go('/channel')
      this.props.timelines.resetTemp()
      this.props.timelines.resetIndex()
      this.props.snackbar.show('チャンネルを削除しました')
    })
    .catch(err => this.props.snackbar.error(err.reason))
  }

  onRemoveList = ::this.onRemoveList

  componentDidMount () {
    this.context.onScrollTop()
  }

  static get contextTypes () {
    return {
      onScrollTop: propTypes.any
    }
  }
}
