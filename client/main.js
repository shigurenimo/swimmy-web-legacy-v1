import { observer } from 'mobx-react'
import compose from 'ramda/src/compose'
import React from 'react'
import { render } from 'react-dom'
import Route from 'react-router-dom/Route'
import Router from 'react-router-dom/Router'
import Switch from 'react-router-dom/Switch'

import ContentPadding from '/imports/client/ui/containers/ContentPadding'
import DrawerButton from '/imports/client/ui/containers/DrawerButton'
import InputAction from '/imports/client/ui/containers/InputAction'
import LeftMenu from '/imports/client/ui/containers/LeftMenu'
import Snackbar from '/imports/client/ui/containers/Snackbar'
import SplitView from '/imports/client/ui/containers/SplitView'
import Swipeable from '/imports/client/ui/containers/SwipeableView'
import withCurrentUser from '/imports/client/ui/hocs/withCurrentUser'
import withMuiThemeProvider from '/imports/client/ui/hocs/withMuiThemeProvider'
import withProvider from '/imports/client/ui/hocs/withProvider'
import withRouterHistory from '/imports/client/ui/hocs/withRouterHistory'
import Admin from '/imports/client/ui/pages/Admin'
import ConfigPassword from '/imports/client/ui/pages/ConfigPassword'
import ConfigUsername from '/imports/client/ui/pages/ConfigUsername'
import Note from '/imports/client/ui/pages/Note'
import NotFound from '/imports/client/ui/pages/NotFound'
import Login from '/imports/client/ui/pages/Login'
import Thread from '/imports/client/ui/pages/Thread'
import ThreadIndex from '/imports/client/ui/pages/ThreadIndex'
import Timeline from '/imports/client/ui/pages/Timeline'
import stores from '/imports/client/stores'
import theme from '/imports/client/theme'

export const App = props =>
  <div>
    <DrawerButton />
    <Snackbar />
    <SplitView>
      <Swipeable>
        <Router history={props.history}>
          <LeftMenu />
        </Router>
        <ContentPadding>
          <Router history={props.history}>
            {props.userId ? <Switch>
              <Route exact path='/' component={Timeline} />
              <Route exact path='/note' component={Note} />
              <Route exact path='/thread' component={ThreadIndex} />
              <Route exact path='/thread/:postId' component={Thread} />
              <Route exact path='/admin' component={Admin} />
              <Route exact path='/config/password' component={ConfigPassword} />
              <Route exact path='/config/username' component={ConfigUsername} />
              <Route component={NotFound} />
            </Switch> : <Switch>
              <Route exact path='/' component={Timeline} />
              <Route exact path='/note' component={Note} />
              <Route exact path='/thread' component={ThreadIndex} />
              <Route exact path='/thread/:postId' component={Thread} />
              <Route exact path='/admin' component={Login} />
              <Route component={NotFound} />
            </Switch>}
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
