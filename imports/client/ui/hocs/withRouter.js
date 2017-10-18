import { inject } from 'mobx-react'
import compose from 'ramda/src/compose'
import React from 'react'

export default compose(inject(stores => ({router: stores.router})))
