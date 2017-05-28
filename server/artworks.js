import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { HTTP } from 'meteor/http'
import { Random } from 'meteor/random'
import collections from '../imports/collections'
import utils from '../imports/utils'

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
  self.onStop(() => {
    cursor.stop()
  })
})
Meteor.methods({
  'artworks:fetch' (selector, options) {
    const userId = this.userId
    if (selector.owner) {
      if (selector.owner !== userId) {
        selector.public = {$exists: true}
      }
    }
    const posts = collections.artworks.find(selector, options).fetch()
    .map(post => {
      if (post.reply) {
        const reply = collections.posts.findOne(post.reply)
        if (reply) {
          post.reply = reply
        } else {
          post.reply = {
            content: 'この投稿は既に削除されています'
          }
        }
      }
      post.note = utils.replace.link(post.note)
      post.note = utils.replace.tags(post.note)
      if (userId !== post.owner) delete post.owner
      post.unique = Random.createWithSeeds(post.addr).id()
      delete post.addr
      return post
    })
    return posts
  },
  'artworks:fetchOne' (selector, options) {
    const userId = this.userId
    const users = {}
    const post = collections.artworks.findOne(selector, options)
    if (!post) return null
    if (post.replies[0]) {
      post.replies = post.replies.map(reply => {
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
        reply.content = utils.replace.link(reply.content)
        reply.content = utils.replace.tags(reply.content)
        if (userId !== reply.owner) delete reply.owner
        delete reply.addr
        return reply
      })
    }
    post.note = utils.replace.link(post.note)
    post.note = utils.replace.tags(post.note)
    if (userId !== post.owner) delete post.owner
    post.unique = Random.createWithSeeds(post.addr).id()
    delete post.addr
    return post
  },
  // 投稿を挿入する
  'artworks:insert' (req) {
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
  },
  // 投稿を削除する
  'artworks:remove' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')
    const post = collections.artworks.findOne(req.postId)
    if (post.owner !== this.userId) return 409
    collections.artworks.remove(req.postId)
    // ↓ ハッシュタグの削除
    post.tags.filter(tag => tag !== '').forEach(hashtag => {
      const tag = collections.tags.findOne({name: hashtag})
      if (tag) {
        if (tag.count < 2) {
          collections.tags.remove(tag._id)
        } else {
          collections.tags.update({name: hashtag}, {$inc: {count: -1}})
        }
      }
    })
    // ↓ 画像の削除
    if (post.image) {
      const image = post.image.full
      const imageMin = post.image.min
      if (image) {
        HTTP.del(Meteor.settings.public.api.work.image, {
          params: {
            name: image.replace(/\?.*$/, ''),
            name_min: imageMin.replace(/\?.*$/, ''),
            imageDate: post.imageDate,
            unique: 'DdcHJM68ksFbUA'
          }
        }, (err) => {
          if (err) throw new Meteor.Error(err)
        })
      }
    }
    return req.postId
  },
  // 投稿を更新する
  'artworks:update' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')
    const post = collections.artworks.findOne(req.postId)
    if (post.owner !== this.userId) return 409
    const set = {}
    const unset = {}
    if (req.isPublic) {
      const user = Meteor.users.findOne(this.userId)
      set.public = {
        username: user.username,
        name: user.profile.name,
        icon: ''
      }
    } else {
      unset.public = ''
    }
    if (req.isSecret !== undefined) {
      check(req.isSecret, Boolean)
      set.secret = req.isSecret
    }
    if (req.title !== undefined) {
      check(req.title, String)
      set.title = req.title
    }
    if (req.note !== undefined) {
      check(req.note, String)
      set.note = req.note
    }
    if (req.colors !== undefined) {
      check(req.colors, Array)
      set.colors = req.colors
    }
    const modifier = {}
    if (Object.keys(set).length > 0) modifier.$set = set
    if (Object.keys(unset).length > 0) modifier.$unset = unset
    collections.artworks.update(req.postId, modifier)
    return collections.artworks.findOne(req.postId)
  },
  // リアクションを更新する
  'artworks:updateReaction' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')
    check(req.postId, String)
    check(req.name, String)
    if (req.name.includes('.')) return
    const post = collections.artworks.findOne(req.postId)
    // ↓ 更新
    if (post.reactions[req.name] === undefined) {
      const reactions = Object.keys(post.reactions)
      const nReactions = reactions.length
      if (nReactions === 1 && post.reactions[reactions[0]].length === 0) {
        collections.artworks.update(req.postId, {
          $unset: {['reactions.' + reactions[0]]: ''},
          $set: {['reactions.' + req.name]: [this.userId]}
        })
      } else {
        collections.artworks.update(req.postId, {
          $set: {['reactions.' + req.name]: [this.userId]}
        })
      }
    } else if (post.reactions[req.name].indexOf(this.userId) !== -1) {
      const nReactions = Object.keys(post.reactions).length
      if (nReactions > 1 && post.reactions[req.name].length === 1) {
        collections.artworks.update(req.postId, {
          $unset: {['reactions.' + req.name]: ''}
        })
      } else {
        if (post.reactions[req.name].length === 1 && req.name !== 'スキ') {
          collections.artworks.update(req.postId, {
            $set: {['reactions.' + 'スキ']: []},
            $unset: {['reactions.' + req.name]: ''}
          })
        } else {
          collections.artworks.update(req.postId, {
            $pull: {['reactions.' + req.name]: this.userId}
          })
        }
      }
    } else {
      collections.artworks.update(req.postId, {
        $push: {['reactions.' + req.name]: this.userId}
      })
    }
    return collections.artworks.findOne(req.postId)
  },
  // リプライを挿入する
  'artworks:insertReply' (req) {
    const address = this.connection.clientAddress
    check(req.postId, String)
    check(req.content, String)
    const reply = {
      _id: Random.id(),
      owner: this.userId,
      addr: address,
      public: req.isPublic,
      content: req.content,
      reactions: {'スキ': []},
      createdAt: new Date()
    }
    // ↓ 更新
    collections.artworks.update(req.postId, {$push: {replies: reply}})
    if (req.isPublic) {
      const user = Meteor.users.findOne(this.userId)
      reply.public = {
        username: user.username,
        name: user.profile.name
      }
    }
    return reply
  },
  // リプライを削除する
  'artworks:removeReply' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')
    check(req.postId, String)
    check(req.replyId, String)
    const post = collections.artworks.findOne(req.postId)
    const replies = post.replies
    let reply = null
    for (let i = 0, len = replies.length; i < len; ++i) {
      if (replies[i]._id === req.replyId) {
        reply = replies[i]
      }
    }
    if (reply && reply.owner !== this.userId) {
      throw new Meteor.Error('not-authorized')
    }
    collections.artworks.update(req.postId, {
      $pull: {
        replies: reply
      }
    })
    return collections.artworks.findOne(req.postId)
  },
  // リアクションを更新する
  'artworks:updateReplyReaction' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')
    check(req.postId, String)
    check(req.replyId, String)
    check(req.name, String)
    if (req.name.includes('.')) return
    const post = collections.artworks.findOne(req.postId)
    for (let i = 0, len = post.replies.length; i < len; ++i) {
      if (post.replies[i]._id !== req.replyId) continue
      const reactions = post.replies[i].reactions
      const path = 'replies.' + i + '.reactions.'
      // ↓ 更新
      if (reactions[req.name] === undefined) {
        const names = Object.keys(reactions)
        const nReactions = names.length
        if (nReactions === 1 && reactions[names[0]].length === 0) {
          collections.artworks.update(req.postId, {
            $unset: {[path + names[0]]: ''},
            $set: {[path + req.name]: [this.userId]}
          })
        } else {
          collections.artworks.update(req.postId, {
            $set: {[path + req.name]: [this.userId]}
          })
        }
      } else if (reactions[req.name].indexOf(this.userId) !== -1) {
        const nReactions = Object.keys(reactions).length
        if (nReactions > 1 && reactions[req.name].length === 1) {
          collections.artworks.update(req.postId, {
            $unset: {[path + req.name]: ''}
          })
        } else {
          if (reactions[req.name].length === 1 && req.name !== 'スキ') {
            collections.artworks.update(req.postId, {
              $set: {[path + 'スキ']: []},
              $unset: {[path + req.name]: ''}
            })
          } else {
            collections.artworks.update(req.postId, {
              $pull: {[path + req.name]: this.userId}
            })
          }
        }
      } else {
        collections.artworks.update(req.postId, {
          $push: {[path + req.name]: this.userId}
        })
      }
      break
    }
    return collections.artworks.findOne(req.postId)
  }
})
