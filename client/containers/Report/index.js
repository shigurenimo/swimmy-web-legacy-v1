import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Layout from '/client/components/UI-Layout'
import Sheet from '/client/components/UI-Sheet'
import SheetContent from '/client/components/UI-SheetContent'
import styles from './index.style'

@withStyles(styles)
@inject('reports')
@observer
export default class Report extends Component {
  render () {
    const {classes} = this.props
    return (
      <Layout>
        <Sheet hover>
          <SheetContent>
            <Typography className={classes.number} type='display1'>
              {this.props.reports.one.total.users}
            </Typography>
          </SheetContent>
          <SheetContent>
            <Typography>ユーザ数</Typography>
          </SheetContent>
        </Sheet>
        <Sheet hover>
          <SheetContent>
            <Typography className={classes.number} type='display1'>
              {this.props.reports.one.total.posts}
            </Typography>
          </SheetContent>
          <SheetContent>
            <Typography>書き込み</Typography>
          </SheetContent>
        </Sheet>
        {this.props.reports.one.user &&
        <Sheet hover>
          <SheetContent>
            <Typography className={classes.number} type='display1'>
              {this.props.reports.one.user.posts}
            </Typography>
          </SheetContent>
          <SheetContent>
            <Typography>あなたの書き込み</Typography>
          </SheetContent>
        </Sheet>}
      </Layout>
    )
  }

  static get contextTypes () {
    return {onScrollTop: propTypes.any}
  }

  componentDidMount () {
    this.context.onScrollTop()
  }
}
