import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Layout from '../../components/UI-Layout'
import Center from '../../components/UI-Center'
import styleSheet from './index.style'

@withStyles(styleSheet)
@observer
export default class NotFound extends Component {
  render () {
    return (
      <Layout>
        <Center width={200} height={100}>
          <Typography type='display2'>404</Typography>
        </Center>
      </Layout>
    )
  }
}
