import { Meteor } from 'meteor/meteor'

import React from 'react'

export const method = (username, password) => new Promise((resolve, reject) => {
  Meteor.loginWithPassword(username, password, (err, res) => {
    if (err) {
      console.error(err.message)
      return reject(err)
    }
    return resolve(res)
  })
})

export default Component => props => {
  return <Component {...props} loginWithPassword={method} />
}