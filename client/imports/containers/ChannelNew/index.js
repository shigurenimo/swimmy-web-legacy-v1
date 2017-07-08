import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { isNumeric } from 'validator'
import Button from 'material-ui/Button'
import TextField from '../../components/TextField'
import Block from '../../components/UI-Block'
import Layout from '../../components/UI-Layout'
import Sheet from '../../components/UI-Sheet'
import SheetContent from '../../components/UI-SheetContent'
import TypographyError from '../../components/UI-TypographyError'

@inject('channels', 'router', 'snackbar', 'timelines')
@observer
export default class ChannelNew extends Component {
  render () {
    return (
      <Layout>
        <Block width={400}>
          {/* name */}
          <Sheet>
            <SheetContent>
              <TextField required fullWidth
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
                <TextField multiline fullWidth
                  value={this.state.description}
                  label='チャンネルの説明'
                  maxLength={400}
                  onChange={this.onInputDescription} />
              </Block>
            </SheetContent>
          </Sheet>
          {this.state.isDetail &&
          <div>
            <Sheet>
              {/* SNS:Webサイト */}
              <SheetContent>
                <TextField fullWidth
                  value={this.state.site}
                  label='サイトのURL'
                  InputProps={{placeholder: 'https://swimmy.io'}}
                  maxLength='20'
                  onChange={this.onInputSite} />
              </SheetContent>
            </Sheet>
            <Sheet>
              {/* 大学 */}
              <SheetContent>
                <TextField fullWidth
                  value={this.state.university}
                  label='関係する学校'
                  helperText='サークルなどの場合'
                  maxLength='40'
                  onChange={this.onInputUniversity} />
              </SheetContent>
            </Sheet>
          </div>}
          {/* エラー */}
          {this.state.submitError &&
          <Sheet>
            <SheetContent>
              <TypographyError>
                {this.state.submitError}
              </TypographyError>
            </SheetContent>
          </Sheet>}
          {/* 送信 */}
          <Sheet>
            <SheetContent align='right'>
              {!this.state.isDetail &&
              <Button onClick={this.onOpenDetail}>
                more
              </Button>}
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
    isDetail: false,
    name: '',
    description: '',
    university: '',
    tags: [],
    region: 'tokyo',
    site: '',
    twitter: '',
    facebook: '',
    submitError: ''
  }

  process = false

  onOpenDetail () {
    this.setState({isDetail: true})
  }

  onOpenDetail = ::this.onOpenDetail

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

  // チャンネルの大学名を入力する
  onInputUniversity (event) {
    event.persist()
    const value = event.target.value
    this.setState({university: value})
  }

  onInputUniversity = ::this.onInputUniversity

  // チャンネルのサイトを入力する
  onInputSite (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 100) return
    this.setState({site: value})
  }

  onInputSite = ::this.onInputSite

  // チャンネルを送信する
  onSubmit () {
    if (this.process) return
    this.process = true
    if (!this.state.name) {
      this.setState({submitError: 'サークルの名前を入力してください'})
      this.process = false
      return
    }
    this.setState({submitError: null})
    const next = {
      name: this.state.name,
      description: this.state.description,
      university: this.state.university,
      region: this.state.region,
      tags: this.state.tags,
      sns: {
        site: this.state.site,
      }
    }
    this.props.channels.insert(next)
    .then(data => {
      this.props.router.go('/channel')
      this.props.timelines.resetIndex()
      this.props.snackbar.show('新しいチャンネルを作成しました')
      this.process = false
    })
    .catch(err => {
      this.props.snackbar.error(err)
      this.process = false
    })
  }

  onSubmit = ::this.onSubmit

  componentDidMount () {
    this.context.onScrollTop()
  }

  static get contextTypes () {
    return {
      onScrollTop: propTypes.any
    }
  }
}
