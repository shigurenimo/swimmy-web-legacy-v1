import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import { FormGroup } from 'material-ui/Form'
import { LabelCheckbox } from 'material-ui/CheckBox'
import Block from '../../components/UI-Block'
import Button from '../../components/Button'
import Layout from '../../components/UI-Layout'
import Sheet from '../../components/UI-Sheet'
import SheetActions from '../../components/UI-SheetActions'
import SheetContent from '../../components/UI-SheetContent'
import styleSheet from './index.style'

@withStyles(styleSheet)
@inject('snackbar', 'accounts') @observer
export default class Twitter extends Component {
  render () {
    const {accounts: {one: {config, services: {twitter}}}, classes} = this.props
    return (
      <Layout>
        <Sheet>
          <SheetContent>
            <img
              className={classes.icon}
              src={twitter.profile_image_url_https.replace('_normal', '')} />
          </SheetContent>
          <SheetContent>
            <Typography type='title' align='center'>
              {twitter.screenName}
            </Typography>
          </SheetContent>
          <SheetActions>
            <Block align='center'>
              <FormGroup>
                <LabelCheckbox
                  checked={
                    config &&
                    config.twitter &&
                    config.twitter.useIcon
                  }
                  label='アイコンを使用する'
                  value='useIcon'
                  onChange={this.onSelectOption} />
                <LabelCheckbox
                  checked={
                    config &&
                    config.twitter &&
                    config.twitter.publicAccount
                  }
                  label='アカウントを表示する'
                  value='publicAccount'
                  onChange={this.onSelectOption} />
              </FormGroup>
            </Block>
          </SheetActions>
          <SheetActions align='right'>
            <Block align='center'>
              <Button onClick={this.onUpdateRemoveTwitter}>
                disconnect
              </Button>
              <Button onClick={this.onUpdateTwitter}>
                update
              </Button>
            </Block>
          </SheetActions>
        </Sheet>
      </Layout>
    )
  }

  onSelectOption (event, checked) {
    const {value: name} = event.target
    this.props.accounts.updateConfigTwitter(name, checked)
    .catch(this.props.snackbar.error)
  }

  onSelectOption = ::this.onSelectOption

  onUpdateTwitter () {
    this.props.accounts.updateServicesTwitter()
    .then(() => {
      this.props.snackbar.show('アップデートに成功しました')
    })
    .catch(this.props.snackbar.error)
  }

  onUpdateTwitter = ::this.onUpdateTwitter

  onUpdateRemoveTwitter () {
    if (!window.confirm('解除してもいいですか？')) return
    this.props.accounts.updateRemoveServicesTwitter()
    .then(() => {
      this.props.snackbar.show('関連付けを解除しました')
    })
    .catch(this.props.snackbar.error)
  }

  onUpdateRemoveTwitter = ::this.onUpdateRemoveTwitter
}
