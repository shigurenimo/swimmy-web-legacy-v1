import { Meteor } from 'meteor/meteor'
import collection from '/lib/collection'

Meteor.methods({
  'logs.insert' (req) {
    if (!req.type) return
    if (!req.content) return

    console.log(req.type, req.content)

    collection.logs.insert({
      type: req.type,
      content: req.content,
      createdAt: new Date()
    })
  }
})
