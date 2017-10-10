import { observer } from 'mobx-react'
import compose from 'ramda/src/compose'
import React from 'react'
import { render } from 'react-dom'
import Route from 'react-router-dom/Route'
import Router from 'react-router-dom/Router'
import Switch from 'react-router-dom/Switch'

import DrawerButton from '/imports/ui/containers/DrawerButton'
import InputAction from '/imports/ui/containers/InputAction'
import LeftMenu from '/imports/ui/containers/LeftMenu'
import ContentPadding from '/imports/ui/components/ContentPadding'
import SplitView from '/imports/ui/components/SplitView'
import Swipeable from '/imports/ui/components/Swipeable'
import withCurrentUser from '/imports/ui/hocs/withCurrentUser'
import withMuiThemeProvider from '/imports/ui/hocs/withMuiThemeProvider'
import withProvider from '/imports/ui/hocs/withProvider'
import withRouterHistory from '/imports/ui/hocs/withRouterHistory'
import Timeline from '/imports/ui/containers/Timeline'
import Snackbar from '/imports/ui/containers/Snackbar'
import stores from '/imports/stores'
import theme from '/imports/theme'

export const App = props =>
  <div>
    <DrawerButton />
    <Snackbar />
    <SplitView>
      <Swipeable>
        <LeftMenu />
        <ContentPadding>
          <Router history={props.history}>
            <Switch>
              <Route exact path='/' component={Timeline} />
            </Switch>
          </Router>
        </ContentPadding>
      </Swipeable>
      <InputAction />
    </SplitView>
  </div>

export const composer = compose(
  withProvider(stores),
  withMuiThemeProvider(theme),
  withRouterHistory,
  withCurrentUser,
  observer
)

render(composer(App)(), document.querySelector('div'))
