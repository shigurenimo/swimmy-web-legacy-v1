import { Meteor } from 'meteor/meteor'

import React from 'react'

const createMethod = method => (...arg) => new Promise((resolve, reject) => {
  Meteor.call(method, ...arg, (err, res) => {
    if (err) {
      console.error(err.message)
      return reject(err)
    }
    return resolve(res)
  })
})

export default (name, method) => Component => props => {
  const extension = {[name]: createMethod(method || name)}
  return <Component {...props} {...extension} />
}
