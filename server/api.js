import { Restivus } from 'meteor/nimble:restivus'
import collections from '/lib/collections'
import utils from '/lib/imports/utils'

const api = new Restivus({
  version: 'v1',
  defaultHeaders: {
    'Content-Type': 'application/json'
  },
  useDefaultAuth: true,
  prettyJson: true
})

api.addRoute('posts/', {
  // レスを取得する
  get () {
    const userId = this.userId
    const selector = {
      thread: {$exists: false}
    }
    const options = {
      limit: 80,
      sort: {createdAt: -1}
    }
    return collections.posts.find(selector, options).fetch()
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
      if (post.link) post.content = utils.replace.link(post.content)
      if (post.tags) post.content = utils.replace.tags(post.content)
      if (userId !== post.owner) delete post.owner
      delete post.addr
      return post
    })
  }
})
