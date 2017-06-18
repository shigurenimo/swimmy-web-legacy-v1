import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import { FormGroup } from 'material-ui/Form'
import { LabelCheckbox } from 'material-ui/CheckBox'
import Block from '../components/ui-block'
import Button from '../components/ui-button'
import Layout from '../components/ui-layout'
import Sheet from '../components/ui-sheet'
import SheetActions from '../components/ui-sheet-actions'
import SheetContent from '../components/ui-sheet-content'
import styleSheet from './twitter.style'

@withStyles(styleSheet)
@inject('layout', 'snackbar', 'users')
@observer
export default class Twitter extends Component {
  render () {
    const {
      users: {
        one: {
          config,
          services: {twitter}
        }
      },
      classes
    } = this.props
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
              <Button onClick={this.onUpdateTwitter}>
                update twitter-data
              </Button>
            </Block>
          </SheetActions>
        </Sheet>
      </Layout>
    )
  }

  onSelectOption (event, checked) {
    const {value: name} = event.target
    this.props.users.updateConfigTwitter(name, checked)
    .catch(this.props.snackbar.error)
  }

  onSelectOption = ::this.onSelectOption

  onUpdateTwitter () {
    this.props.users.updateServicesTwitter()
    .then(() => {
      this.props.snackbar.show('アップデートに成功しました')
    })
    .catch(this.props.snackbar.error)
  }

  onUpdateTwitter = ::this.onUpdateTwitter
}
