import { observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Layout from '/client/components/UI-Layout'
import Sheet from '/client/components/UI-Sheet'
import SheetContent from '/client/components/UI-SheetContent'
import releases from '../../assets/release'
import styleSheet from './index.style'

@withStyles(styleSheet)
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
