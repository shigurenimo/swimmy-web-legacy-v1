import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import collections from '/lib/collections'
import utils from '/lib/imports/utils'

Meteor.publish('artworks', function (selector, options) {
  const self = this
  const userId = this.userId
  const query = collections.artworks.find(selector, options)
  const users = {}
  const cursor = query.observe({
    addedAt (res) {
      if (res.replies[0]) {
        res.replies = res.replies.map(reply => {
          if (userId !== reply.owner) delete reply.owner
          reply.content = utils.replace.link(reply.content)
          if (reply.public) {
            if (!users[reply.owner]) {
              users[reply.owner] = Meteor.users.findOne(reply.owner)
            }
            const user = users[reply.owner]
            if (user) {
              reply.public = {
                username: user.username,
                name: user.profile.name,
                icon: user.icon
              }
            }
          }
          delete reply.addr
          return reply
        })
      }
      res.note = utils.replace.link(res.note)
      res.note = utils.replace.tags(res.note)
      if (userId !== res.owner) delete res.owner
      res.unique = Random.createWithSeeds(res.addr).id()
      delete res.addr
      self.added('artworks', res._id, res)
    },
    changed (res) {
      if (res.replies[0]) {
        res.replies = res.replies.map(reply => {
          if (userId !== reply.owner) delete reply.owner
          reply.content = utils.replace.link(reply.content)
          if (reply.public) {
            if (!users[reply.owner]) {
              users[reply.owner] = Meteor.users.findOne(reply.owner)
            }
            const user = users[reply.owner]
            if (user) {
              reply.public = {
                username: user.username,
                name: user.profile.name,
                icon: user.icon
              }
            }
          }
          delete reply.addr
          return reply
        })
      }
      res.note = utils.replace.link(res.note)
      res.note = utils.replace.tags(res.note)
      if (userId !== res.owner) delete res.owner
      res.unique = Random.createWithSeeds(res.addr).id()
      delete res.addr
      self.changed('artworks', res._id, res)
    },
    removed (res) {
      self.removed('artworks', res._id)
    }
  })
  self.ready()
  self.onStop(() => { cursor.stop() })
})
