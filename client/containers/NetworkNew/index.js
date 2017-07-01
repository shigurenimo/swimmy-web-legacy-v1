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

@inject('networks', 'posts', 'snackbar')
@observer
export default class NetworkNew extends Component {
  render () {
    return (
      <Layout>
        <Block width={400}>
          {/* name */}
          <Sheet>
            <SheetContent>
              <TextField required fullWidth
                value={this.state.networkName}
                label='リストの名前'
                maxLength='100'
                onChange={this.onInputNetworkName} />
            </SheetContent>
          </Sheet>
          {/* リストの説明 */}
          <Sheet>
            <SheetContent>
              <Block width={400}>
                <TextField multiline fullWidth
                  value={this.state.networkDescription}
                  label='リストの説明'
                  maxLength={400}
                  onChange={this.onInputNetworkDescription} />
              </Block>
            </SheetContent>
          </Sheet>
          {this.state.isDetail &&
          <div>
            <Sheet>
              {/* SNS:Webサイト */}
              <SheetContent>
                <TextField fullWidth
                  value={this.state.networkSite}
                  label='サイトのURL'
                  InputProps={{placeholder: 'https://swimmy.io'}}
                  maxLength='20'
                  onChange={this.onInputNetworkSite} />
              </SheetContent>
            </Sheet>
            <Sheet>
              {/* 大学 */}
              <SheetContent>
                <TextField fullWidth
                  value={this.state.networkUniversity}
                  label='関係する学校'
                  helperText='サークルなどの場合'
                  maxLength='40'
                  onChange={this.onInputNetworkUniversity} />
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
    networkName: '',
    networkDescription: '',
    networkUniversity: '',
    networkTags: [],
    networkPlace: '',
    networkChannel: 'tokyo',
    networkSite: '',
    networkTwitter: '',
    networkFacebook: '',
    submitError: ''
  }

  process = false

  onOpenDetail () {
    this.setState({isDetail: true})
  }

  onOpenDetail = ::this.onOpenDetail

  // リスト名を入力する
  onInputNetworkName (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 100) return
    this.setState({networkName: value})
  }

  onInputNetworkName = ::this.onInputNetworkName

  // リストの説明を入力する
  onInputNetworkDescription (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 400) return
    this.setState({networkDescription: value})
  }

  onInputNetworkDescription = ::this.onInputNetworkDescription

  // リストの大学名を入力する
  onInputNetworkUniversity (event) {
    event.persist()
    const value = event.target.value
    this.setState({networkUniversity: value})
  }

  onInputNetworkUniversity = ::this.onInputNetworkUniversity

  // リストのサイトを入力する
  onInputNetworkSite (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 100) return
    this.setState({networkSite: value})
  }

  onInputNetworkSite = ::this.onInputNetworkSite

  // リストのTwitterアカウントを更新する
  onInputNetworkTwitter (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 100) return
    if (value.indexOf('@') !== -1) return
    this.setState({networkTwitter: value})
  }

  onInputNetworkTwitter = ::this.onInputNetworkTwitter

  // リストのFacebookアカウントを入力する
  onInputNetworkFacebook (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 100) return
    if (!isNumeric(value)) return
    this.setState({networkFacebook: value})
  }

  onInputNetworkFacebook = ::this.onInputNetworkFacebook

  // リストを送信する
  onSubmit () {
    if (this.process) return
    this.process = true
    if (!this.state.networkName) {
      this.setState({submitError: 'サークルの名前を入力してください'})
      this.process = false
      return
    }
    this.setState({submitError: null})
    const next = {
      name: this.state.networkName,
      description: this.state.networkDescription,
      university: this.state.university,
      channel: this.state.networkChannel,
      place: this.state.networkPlace,
      tags: this.state.networkTags,
      sns: {
        site: this.state.networkSite,
        twitter: this.state.networkTwitter,
        facebook: this.state.networkFacebook
      }
    }
    this.props.networks.insert(next)
    .then(() => {
      const {selector, options} = this.props.networks.timeline
      return this.props.networks.find(selector, options)
    })
    .then(data => {
      this.props.networks.pushIndex(data)
      this.props.router.go('/network')
      this.props.posts.resetTimelines()
      this.props.snackbar.show('新しいリストを作成しました')
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
