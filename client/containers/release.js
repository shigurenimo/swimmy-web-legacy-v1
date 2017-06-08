import { observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Layout from '../components/ui-layout'
import Sheet from '../components/ui-sheet'
import SheetContent from '../components/ui-sheet-content'
import releases from '../assets/release'

@observer
export default class Release extends Component {
  render () {
    return (
      <Layout>
        {releases.map(item =>
          <Sheet hover key={item.version}>
            <SheetContent>
              <Typography type='display1'>{item.version}</Typography>
            </SheetContent>
            <SheetContent>
              <Typography dangerouslySetInnerHTML={{__html: item.content.join('</br>')}} />
            </SheetContent>
          </Sheet>
        )}
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
