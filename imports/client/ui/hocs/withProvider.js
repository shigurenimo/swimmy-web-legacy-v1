import { Provider } from 'mobx-react'
import React from 'react'

export default stores => Component => props =>
  <Provider {...stores}>
    <Component {...props} />
  </Provider>
