import createBrowserHistory from 'history/createBrowserHistory'
import { Provider } from 'mobx-react'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import React from 'react'

export const router = new RouterStore()

export const browserHistory = createBrowserHistory()

export const history = syncHistoryWithStore(browserHistory, router)

export default Components => props =>
  <Provider router={router}>
    <Components {...props} history={history} />
  </Provider>
