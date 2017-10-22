import withStyles from 'material-ui/styles/withStyles'
import Typography from 'material-ui/Typography'
import compose from 'ramda/src/compose'
import map from 'ramda/src/map'
import React from 'react'

import Layout from '/imports/client/ui/components/Layout'
import Sheet from '/imports/client/ui/components/Sheet'
import SheetContent from '/imports/client/ui/components/SheetContent'
import withScrollTop from '/imports/client/ui/hocs/withScrollTop'
import releases from '/imports/config/release'

import styles from './index.style'

export const Note = props =>
  <Layout>
    {map(mapNote(props), releases)}
  </Layout>

export const mapNote = props => item =>
  <Sheet hover key={item.version}>
    <SheetContent>
      <Typography className={props.classes.version} type='display1'>
        {item.version}
      </Typography>
    </SheetContent>
    <SheetContent>
      <Typography dangerouslySetInnerHTML={{__html: item.content.join('</br>')}} />
    </SheetContent>
  </Sheet>

export default compose(
  withStyles(styles),
  withScrollTop
)(Note)
