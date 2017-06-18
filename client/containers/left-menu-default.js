import React, { Component } from 'react'
import Divider from 'material-ui/Divider'
import Typography from 'material-ui/Typography'
import Sheet from '../components/ui-sheet'
import SheetContent from '../components/ui-sheet-content'
import LeftMenuAdmin from './left-menu-admin'
import LeftMenuArtworks from './left-menu-artworks'
import LeftMenuEtc from './left-menu-etc'
import LeftMenuNetworks from './left-menu-networks'
import LeftMenuTimeline from './left-menu-timeline'

export default class LeftMenuDefault extends Component {
  render () {
    return (
      <div>
        <LeftMenuAdmin />
        <Divider light />
        <LeftMenuTimeline />
        <Divider light />
        <LeftMenuArtworks />
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
