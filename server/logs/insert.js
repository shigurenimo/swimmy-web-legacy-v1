import { Meteor } from 'meteor/meteor'
import collections from '/lib/collections'

Meteor.methods({
  'logs.insert' (req) {
    if (!req.type) return
    if (!req.content) return

    console.log(req.type, req.content)

    collections.logs.insert({
      type: req.type,
      content: req.content,
      createdAt: new Date()
    })
  }
})
