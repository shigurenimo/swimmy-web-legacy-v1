import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import collections from '/collections'

// 挿入する
Meteor.methods({
  'artworks.insert' (req) {
    const userId = this.userId
    const address = this.connection.clientAddress
    check(req.isPublic, Boolean)
    check(req.isSecret, Boolean)
    check(req.title, String)
    check(req.note, String)
    check(req.tags, Array)
    check(req.imageDate, String)
    if (!userId) throw new Meteor.Error('not-authorized')
    const data = {
      owner: userId,
      addr: address,
      secret: req.isSecret,
      type: req.type,
      title: req.title,
      note: req.note,
      colors: req.colors,
      rate: req.rate,
      tags: req.tags,
      image: req.image,
      imageDate: req.imageDate,
      reactions: {'スキ': []},
      replies: [],
      from: 'swimmy',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    if (req.isPublic) {
      if (!userId) throw new Meteor.Error('not-authorized')
      const user = Meteor.users.findOne(userId)
      data.public = {
        username: user.username,
        name: user.profile.name,
        icon: ''
      }
    }
    const postId = collections.artworks.insert(data)
    return collections.artworks.findOne(postId)
  }
})
