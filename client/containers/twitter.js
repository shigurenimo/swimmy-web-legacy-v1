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
          services: {twitter}
        }
      },
      classes
    } = this.props
    return (
      <Layout>
        <Sheet>
          <SheetContent>
            <Block>
              <img
                className={classes.icon}
                src={twitter.profile_image_url_https.replace('_normal', '')} />
            </Block>
          </SheetContent>
          <SheetContent>
            <Block>
              <Typography type='title' align='center'>
                {twitter.screenName}
              </Typography>
            </Block>
          </SheetContent>
          <SheetActions>
            <FormGroup row>
              <LabelCheckbox label='アイコンを使用する' />
            </FormGroup>
          </SheetActions>
          <SheetActions align='right'>
            <Block>
              <Button onClick={this.onUpdateTwitter}>
                update
              </Button>
            </Block>
          </SheetActions>
        </Sheet>
      </Layout>
    )
  }

  onUpdateTwitter () {
    this.props.users.updateServicesTwitter()
    .then(() => {
      this.props.snackbar.show('アップデートに成功しました')
    })
    .catch(this.props.snackbar.error)
  }

  onUpdateTwitter = ::this.onUpdateTwitter
}
