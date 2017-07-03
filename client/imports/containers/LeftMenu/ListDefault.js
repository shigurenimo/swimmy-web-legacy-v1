import React, { Component } from 'react'
import Divider from 'material-ui/Divider'
import Typography from 'material-ui/Typography'
import Sheet from '../../components/UI-Sheet'
import SheetContent from '../../components/UI-SheetContent'
import LeftMenuAdmin from './ListAdmin'
import LeftMenuEtc from './ListEtc'
import LeftMenuNetworks from './ListNetworks'
import LeftMenuTimeline from './ListTimeline'

export default class LeftMenuDefault extends Component {
  render () {
    return (
      <div>
        <LeftMenuAdmin />
        <Divider light />
        <LeftMenuTimeline />
        <Divider light />
        <LeftMenuNetworks />
        <Divider light />
        <LeftMenuEtc />
        <Sheet>
          <SheetContent>
            <Typography type='caption'>
              © 2016 - 2017 Sw I/O
            </Typography>
          </SheetContent>
        </Sheet>
      </div>
    )
  }
}
