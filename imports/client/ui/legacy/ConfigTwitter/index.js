import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import { FormControlLabel, FormGroup } from 'material-ui/Form'
import Block from '/imports/client/ui/components/Block'
import Button from '/imports/client/ui/components/Button'
import Checkbox from 'material-ui/Checkbox'
import Layout from '/imports/client/ui/components/Layout'
import Sheet from '/imports/client/ui/components/Sheet'
import SheetActions from '/imports/client/ui/components/SheetActions'
import SheetContent from '/imports/client/ui/components/SheetContent'
import styles from './index.style'

@withStyles(styles)
@inject('snackbar', 'accounts')
@observer
export default class ConfigTwitter extends Component {
  render () {
    const {accounts, classes} = this.props
    return (
      <Layout>
        <Sheet>
          <SheetContent>
            <img
              className={classes.icon}
              src={accounts.services.twitter.profile_image_url_https.replace('_normal', '')} />
          </SheetContent>
          <SheetContent>
            <Typography type='title' align='center'>
              {accounts.services.twitter.screenName}
            </Typography>
          </SheetContent>
          <SheetActions>
            <Block align='center'>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={accounts.config.twitter.useIcon}
                      value='useIcon'
                      onChange={this.onSelectOption} />
                  }
                  label='アイコンを使用する' />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={accounts.config.twitter.publicAccount}
                      value='publicAccount'
                      onChange={this.onSelectOption} />
                  }
                  label='アカウントを表示する' />
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
    .catch(this.props.snackbar.setError)
  }

  onSelectOption = ::this.onSelectOption

  onUpdateTwitter () {
    this.props.accounts.updateServicesTwitter()
    .then(this.props.snackbar.setMessage)
    .catch(this.props.snackbar.setError)
  }

  onUpdateTwitter = ::this.onUpdateTwitter

  onUpdateRemoveTwitter () {
    if (!window.confirm('解除してもいいですか？')) return
    this.props.accounts.updateRemoveServicesTwitter()
    .then(this.props.snackbar.setMessage)
    .catch(this.props.snackbar.setError)
  }

  onUpdateRemoveTwitter = ::this.onUpdateRemoveTwitter
}
