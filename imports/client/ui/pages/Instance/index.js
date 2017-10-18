import withStyles from 'material-ui/styles/withStyles'
import Typography from 'material-ui/Typography'
import compose from 'ramda/src/compose'
import React from 'react'
import lifecycle from 'recompose/lifecycle'

import Layout from '/imports/client/ui/components/UI-Layout'
import Sheet from '/imports/client/ui/components/UI-Sheet'
import SheetContent from '/imports/client/ui/components/UI-SheetContent'
import withMethod from '/imports/client/ui/hocs/withMethod'
import withScrollTop from '/imports/client/ui/hocs/withScrollTop'

import styles from './index.style'

export const Instance = props => {
  return <div>hello</div>
  return <Layout>
    <Sheet hover>
      <SheetContent>
        <Typography className={classes.number} type='display1'>
          {props.reports.one.total.users}
        </Typography>
      </SheetContent>
      <SheetContent>
        <Typography>ユーザ数</Typography>
      </SheetContent>
    </Sheet>
    <Sheet hover>
      <SheetContent>
        <Typography className={classes.number} type='display1'>
          {props.reports.one.total.posts}
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
          {props.reports.one.user.posts}
        </Typography>
      </SheetContent>
      <SheetContent>
        <Typography>あなたの書き込み</Typography>
      </SheetContent>
    </Sheet>}
  </Layout>
}

export const withLifecycle = lifecycle({
  componentWillMount () {
    console.log(this.props)
  }
})

export default compose(
  withStyles(styles),
  withScrollTop,
  withMethod('findReport'),
  withLifecycle
)(Instance)
