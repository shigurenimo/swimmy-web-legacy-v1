import { FlowRouter } from 'meteor/kadira:flow-router'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { isNumeric } from 'validator'
import Button from 'material-ui/Button'
import Input from 'material-ui/Input'
import Typography from 'material-ui/Typography'
import Block from '../components/ui-block'
import Layout from '../components/ui-layout'
import Sheet from '../components/ui-sheet'
import SheetContent from '../components/ui-sheet-content'
import TypographyError from '../components/ui-typography-error'

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
              <Typography>
                リストの名前 ※
              </Typography>
              <Input
                value={this.state.networkName}
                placeholder='ソーシャルゲーム'
                maxLength='100'
                onChange={this.onInputNetworkName.bind(this)} />
            </SheetContent>
          </Sheet>
          {/* リストの説明 */}
          <Sheet>
            <SheetContent>
              <Block width={400}>
                <Typography>簡単な説明</Typography>
                <Input multiline
                  value={this.state.networkDescription}
                  placeholder='ソーシャルゲームの情報交換をするリスト'
                  maxLength={400}
                  onChange={this.onInputNetworkDescription.bind(this)} />
              </Block>
            </SheetContent>
          </Sheet>
          {this.state.isDetail &&
          <div>
            <Sheet>
              {/* SNS:Webサイト */}
              <SheetContent>
                <Typography>Webサイト</Typography>
                <Input
                  value={this.state.networkSite}
                  placeholder='https://swimmy.io'
                  maxLength='20'
                  onChange={this.onInputNetworkSite.bind(this)} />
              </SheetContent>
            </Sheet>
            {/* SNS:Twitter */}
            <Sheet>
              <SheetContent>
                <Typography>Twitter</Typography>
                <Input
                  value={this.state.networkTwitter}
                  placeholder='username'
                  maxLength='20'
                  onChange={this.onInputNetworkTwitter.bind(this)} />
              </SheetContent>
            </Sheet>
            <Sheet>
              {/* 大学 */}
              <SheetContent>
                <Typography>大学名</Typography>
                <Input
                  value={this.state.networkUniversity}
                  placeholder='名桜大学'
                  maxLength='40'
                  onChange={this.onInputNetworkUniversity.bind(this)} />
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
              <Button onClick={this.onOpenDetail.bind(this)}>
                more
              </Button>}
              <Button onClick={this.onSubmit.bind(this)}>
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

  // リスト名を入力する
  onInputNetworkName (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 100) return
    this.setState({networkName: value})
  }

  // リストの説明を入力する
  onInputNetworkDescription (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 400) return
    this.setState({networkDescription: value})
  }

  // リストの大学名を入力する
  onInputNetworkUniversity (event) {
    event.persist()
    const value = event.target.value
    this.setState({networkUniversity: value})
  }

  // リストの活動場所を入力する
  onInputNetworkPlace (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 100) return
    this.setState({networkPlace: value})
  }

  // リストの地域を入力する
  onInputNetworkChannel (event) {
    event.persist()
    const value = event.target.value
    this.setState({networkChannel: value})
  }

  // リストのサイトを入力する
  onInputNetworkSite (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 100) return
    this.setState({networkSite: value})
  }

  // リストのTwitterアカウントを更新する
  onInputNetworkTwitter (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 100) return
    if (value.indexOf('@') !== -1) return
    this.setState({networkTwitter: value})
  }

  // リストのFacebookアカウントを入力する
  onInputNetworkFacebook (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 100) return
    if (!isNumeric(value)) return
    this.setState({networkFacebook: value})
  }

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
      return this.props.networks.fetch(selector, options)
    })
    .then(data => {
      this.props.networks.insertIndex(data)
      FlowRouter.go('/network')
      this.props.posts.resetTimelines()
      this.props.snackbar.show('新しいリストを作成しました')
      this.process = false
    })
    .catch(err => {
      this.props.snackbar.error(err)
      this.process = false
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
