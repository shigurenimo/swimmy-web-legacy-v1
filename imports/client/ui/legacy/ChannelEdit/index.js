import propTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Layout from '/imports/client/ui/components/Layout'
import Sheet from '/imports/client/ui/components/Sheet'
import SheetActions from '/imports/client/ui/components/SheetActions'
import SheetContent from '/imports/client/ui/components/SheetContent'

@inject('accounts', 'channels', 'snackbar', 'routes')
@observer
export default class ChannelEdit extends Component {
  render () {
    const {channels: {one: channel}} = this.props
    return (
      <Layout>
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
            <TextField fullWidth multiline
              label='チャンネルの説明'
              value={this.state.description}
              maxLength='100'
              onChange={this.onInputDescription}
              onBlur={this.onSubmitDescription} />
          </SheetActions>
        </Sheet>
        {this.props.accounts.isLogged &&
        this.props.accounts._id === channel.ownerId &&
        <Sheet>
          <SheetActions align='right'>
            <Button onClick={this.onRemove}>
              このチャンネルを削除する
            </Button>
          </SheetActions>
        </Sheet>}
      </Layout>
    )
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
    .then(this.props.snackbar.setMessage)
    .catch(this.props.snackbar.setError)
  }

  onSubmitName = ::this.onSubmitName

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
    .then(this.props.snackbar.setMessage)
    .catch(this.props.snackbar.setError)
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

  onRemove () {
    const confirm = window.confirm('削除してもいいですか？')
    if (!confirm) return
    const channelId = this.props.channels.one._id
    this.props.channels.remove(channelId)
    .then(res => {
      this.props.routes.go('/ch')
      this.props.snackbar.setMessage(res)
    })
    .catch(this.props.snackbar.setError)
  }

  onRemove = ::this.onRemove

  componentDidMount () { this.context.onScrollTop() }

  static get contextTypes () { return {onScrollTop: propTypes.any} }
}
