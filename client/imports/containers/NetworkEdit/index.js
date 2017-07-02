import { Meteor } from 'meteor/meteor'
import { HTTP } from 'meteor/http'
import { Random } from 'meteor/random'
import propTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import UIDropzone from '../../components/UI-Dropzone'
import Layout from '../../components/UI-Layout'
import Sheet from '../../components/UI-Sheet'
import SheetActions from '../../components/UI-SheetActions'
import SheetContent from '../../components/UI-SheetContent'

@inject('networks', 'snackbar')
@observer
export default class NetworkEdit extends Component {
  render () {
    const {
      networks: {one: network}
    } = this.props
    return (
      <Layout>
        {/* name */}
        <Sheet>
          <SheetContent>
            <TextField
              value={this.state.name}
              maxLength={50}
              onChange={this.onChangeName}
              onBlur={this.onSubmitName} />
          </SheetContent>
        </Sheet>
        {/* header */}
        <Sheet>
          <SheetActions>
            <UIDropzone
              src={Meteor.settings.public.assets.network.root + network._id + '/' + this.state.header}
              onDrop={this.onDropHeader} />
          </SheetActions>
        </Sheet>
        {/* description */}
        <Sheet>
          <SheetActions>
            <TextField multiline
              label='リストの説明'
              placeholder='リストの簡単な説明'
              value={this.state.description}
              maxLength='100'
              onChange={this.onInputDescription}
              onBlur={this.onSubmitDescription} />
          </SheetActions>
        </Sheet>
        {/* sns : web site */}
        <Sheet>
          <SheetContent>
            <TextField
              value={this.state.site || ''}
              label='web site'
              placeholder='https://swimmy.io'
              maxLength='20'
              onChange={this.onInputSocial.bind(this, 'site')}
              onBlur={this.onSubmitSocial} />
          </SheetContent>
        </Sheet>
        {/* sns : twitter */}
        <Sheet>
          <SheetContent>
            <TextField
              value={this.state.twitter || ''}
              label='twitter'
              placeholder='username'
              maxLength='20'
              onChange={this.onInputSocial.bind(this, 'twitter')}
              onBlur={this.onSubmitSocial} />
          </SheetContent>
        </Sheet>
        {/* school */}
        <Sheet>
          <SheetContent>
            <TextField
              value={this.state.univ}
              label='学校名'
              placeholder={'名桜大学'}
              maxLength='40'
              onChange={this.onInputUniv}
              onBlur={this.onSubmitUniv} />
          </SheetContent>
        </Sheet>
      </Layout>
    )
  }

  state = {
    name: this.props.networks.one.name,
    header: this.props.networks.one.header,
    number: this.props.networks.one.number,
    description: this.props.networks.one.description || '',
    channel: this.props.networks.one.channel,
    place: this.props.networks.one.place || '',
    site: this.props.networks.one.sns.site || '',
    twitter: this.props.networks.one.sns.twitter || '',
    email: this.props.networks.one.email || '',
    univ: this.props.networks.one.univ || '',
    tags: [
      this.props.networks.one.tags.slice()[0] || '',
      this.props.networks.one.tags.slice()[1] || '',
      this.props.networks.one.tags.slice()[2] || ''
    ],
    errorImageHeader: null
  }

  // リストの名前を更新する
  onChangeName (event) {
    event.persist()
    const value = event.target.value
    if (value > 20) return
    if (value < 0) return
    this.setState({name: value})
  }

  onChangeName = ::this.onChangeName

  // リストの名前の更新をサーバーに送信する
  onSubmitName () {
    if (this.props.networks.one.name === this.state.name) return
    const networkId = this.props.networks.one._id
    const next = this.state.name
    this.props.networks.updateBasic(networkId, 'name', next)
    .then(data => {
      this.props.networks.replaceOne(data)
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
    formdata.append('id', this.props.networks.one._id)
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
      HTTP.post(Meteor.settings.public.api.network.header, {content: formdata}, err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
    .then(() => {
      const networkId = this.props.networks.one._id
      return this.props.networks.updateBasic(networkId, 'header', imageNameCache)
    })
    .then(data => {
      this.props.networks.replaceOne(data)
      this.props.snackbar.show('更新しました')
      this.setState({header: imageNameCache})
    })
    .catch(err => {
      this.props.snackbar.error(err)
      this.process = false
    })
  }

  onDropHeader = ::this.onDropHeader

  // リストの説明を更新する
  onInputDescription (event) {
    event.persist()
    const value = event.target.value
    if (value > 100) return
    if (value < 0) return
    this.setState({description: value})
  }

  onInputDescription = ::this.onInputDescription

  // リストの説明の更新をサーバーに送信する
  onSubmitDescription () {
    const networkId = this.props.networks.one._id
    const next = this.state.description
    if (this.props.networks.one.description === this.state.description) return
    this.props.networks.updateBasic(networkId, 'description', next)
    .then(data => {
      this.props.networks.replaceOne(data)
      this.props.snackbar.show('更新しました')
    })
    .catch(err => this.props.snackbar.error(err.reason))
  }

  onSubmitDescription = ::this.onSubmitDescription

  // 大学名を更新する
  onInputUniv (event) {
    event.persist()
    const value = event.target.value
    if (value > 100) return
    if (value < 0) return
    this.setState({univ: value})
  }

  onInputUniv = ::this.onInputUniv

  // 大学名の更新をサーバーに送信する
  onSubmitUniv () {
    const networkId = this.props.networks.one._id
    const next = this.state.univ
    if (this.props.networks.one.univ === this.state.univ) return
    this.props.networks.updateBasic(networkId, 'univ', next)
    .then(data => {
      this.props.networks.replaceOne(data)
      this.props.snackbar.show('更新しました')
    })
    .catch(err => this.props.snackbar.error(err.reason))
  }

  onSubmitUniv = ::this.onSubmitUniv

  // テキストを入力する
  onInputSocial (name, event) {
    event.persist()
    const value = event.target.value
    const object = {}
    object[name] = value
    this.setState(object)
  }

  // テキストの更新をサーバーに送信する
  onSubmitSocial () {
    const networkId = this.props.networks.one._id
    const next = {
      site: this.state.site,
      twitter: this.state.twitter,
      facebook: this.state.facebook
    }
    if (this.props.networks.one.sns.site === this.state.site &&
      this.props.networks.one.sns.twitter === this.state.twitter &&
      this.props.networks.one.sns.facebook === this.state.facebook) return
    this.props.networks.updateBasic(networkId, 'sns', next)
    .then(data => {
      this.props.networks.replaceOne(data)
      this.props.snackbar.show('更新しました')
    })
    .catch(err => this.props.snackbar.error(err.reason))
  }

  onSubmitSocial = ::this.onSubmitSocial

  componentDidMount () {
    this.context.onScrollTop()
  }

  static get contextTypes () {
    return {
      onScrollTop: propTypes.any
    }
  }
}
