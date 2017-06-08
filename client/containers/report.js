import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Layout from '../components/ui-layout'
import Sheet from '../components/ui-sheet'
import SheetContent from '../components/ui-sheet-content'

@inject('reports')
@observer
export default class Report extends Component {
  render () {
    return (
      <Layout>
        <Sheet hover>
          <SheetContent>
            <Typography type='display1'>{this.props.reports.index.total.users}</Typography>
          </SheetContent>
          <SheetContent>
            <Typography>ユーザ数</Typography>
          </SheetContent>
        </Sheet>
        <Sheet hover>
          <SheetContent>
            <Typography type='display1'>{this.props.reports.index.total.posts}</Typography>
          </SheetContent>
          <SheetContent>
            <Typography>書き込み</Typography>
          </SheetContent>
        </Sheet>
        <Sheet hover>
          <SheetContent>
            <Typography type='display1'>{this.props.reports.index.total.artworks}</Typography>
          </SheetContent>
          <SheetContent>
            <Typography>アートワーク</Typography>
          </SheetContent>
        </Sheet>
        {this.props.reports.index.user &&
        <Sheet hover>
          <SheetContent>
            <Typography type='display1'>{this.props.reports.index.user.posts}</Typography>
          </SheetContent>
          <SheetContent>
            <Typography>あなたの書き込み</Typography>
          </SheetContent>
        </Sheet>}
        {this.props.reports.index.user &&
        <Sheet hover>
          <SheetContent>
            <Typography type='display1'>{this.props.reports.index.user.artworks}</Typography>
          </SheetContent>
          <SheetContent>
            <Typography>あなたのアートワーク</Typography>
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
