import React from 'react'
import { Provider } from 'mobx-react'
import createBrowserHistory from 'history/createBrowserHistory'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'

export const router = new RouterStore()

export const browserHistory = createBrowserHistory()

export const history = syncHistoryWithStore(browserHistory, router)

export default Components => props =>
  <Provider router={router}>
    <Components {...props} history={history} />
  </Provider>
