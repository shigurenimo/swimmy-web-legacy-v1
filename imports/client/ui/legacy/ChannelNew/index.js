import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Block from '/imports/client/ui/components/UI-Block'
import Layout from '/imports/client/ui/components/UI-Layout'
import Sheet from '/imports/client/ui/components/UI-Sheet'
import SheetContent from '/imports/client/ui/components/UI-SheetContent'

@inject('channels', 'routes', 'snackbar')
@observer
export default class ChannelNew extends Component {
  render () {
    return (
      <Layout>
        <Block width={400}>
          {/* name */}
          <Sheet>
            <SheetContent>
              <TextField fullWidth required
                value={this.state.channelName}
                label='チャンネルの名前'
                maxLength='100'
                onChange={this.onInputName} />
            </SheetContent>
          </Sheet>
          {/* チャンネルの説明 */}
          <Sheet>
            <SheetContent>
              <Block width={400}>
                <TextField fullWidth multiline
                  value={this.state.description}
                  label='チャンネルの説明'
                  maxLength={400}
                  onChange={this.onInputDescription} />
              </Block>
            </SheetContent>
          </Sheet>
          {/* エラー */}
          {this.state.submitError &&
          <Sheet>
            <SheetContent>
              <Typography style={{color: 'tomato'}}>
                {this.state.submitError}
              </Typography>
            </SheetContent>
          </Sheet>}
          {/* 送信 */}
          <Sheet>
            <SheetContent align='right'>
              <Button onClick={this.onSubmit}>
                create
              </Button>
            </SheetContent>
          </Sheet>
        </Block>
      </Layout>
    )
  }

  state = {
    name: '',
    description: '',
    tags: [],
    region: 'tokyo',
    submitError: ''
  }

  process = false

  // チャンネル名を入力する
  onInputName (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 100) return
    this.setState({name: value})
  }

  onInputName = ::this.onInputName

  // チャンネルの説明を入力する
  onInputDescription (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 400) return
    this.setState({description: value})
  }

  onInputDescription = ::this.onInputDescription

  // チャンネルを送信する
  onSubmit () {
    if (this.process) return
    this.process = true
    if (!this.state.name) {
      this.setState({submitError: 'チャンネルの名前を入力してください'})
      this.process = false
      return
    }
    this.setState({submitError: null})
    const next = {
      name: this.state.name,
      description: this.state.description,
      region: this.state.region,
      tags: this.state.tags
    }
    this.props.channels.insert(next)
    .then(data => {
      this.props.routes.go('/ch')
      this.props.snackbar.show('新しいチャンネルを作成しました')
      this.process = false
    })
    .catch(err => {
      this.props.snackbar.setError(err)
      this.process = false
    })
  }

  onSubmit = ::this.onSubmit

  componentDidMount () { this.context.onScrollTop() }

  static get contextTypes () { return {onScrollTop: propTypes.any} }
}
