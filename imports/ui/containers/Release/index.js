import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import { observer } from 'mobx-react'
import propTypes from 'prop-types'
import React, { Component } from 'react'

import Layout from '/imports/ui/components/UI-Layout'
import Sheet from '/imports/ui/components/UI-Sheet'
import SheetContent from '/imports/ui/components/UI-SheetContent'
import releases from '/imports/helpers/release'
import styles from './index.style'

@withStyles(styles)
@observer
export default class Release extends Component {
  render () {
    const {classes} = this.props
    return (
      <Layout>
        {releases.map(item =>
          <Sheet hover key={item.version}>
            <SheetContent>
              <Typography className={classes.version} type='display1'>{item.version}</Typography>
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
