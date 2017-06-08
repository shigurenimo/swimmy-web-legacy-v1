import { observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Layout from '../components/ui-layout'
import Sheet from '../components/ui-sheet'
import releases from '../assets/release'

@observer
export default class Release extends Component {
  render () {
    return (
      <Layout>
        {releases.map(item =>
          <Sheet hover key={item.version}>
            <Typography type='display1'>{item.version}</Typography>
            <Typography dangerouslySetInnerHTML={{__html: item.content.join('</br>')}} />
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
