import { Posts } from '/imports/collection'

export default {
  test (root, args, context) {
    return {
      hello: 'hello'
    }
  },
  post (root, args, context) {
    const node = Posts.findOne({}, {sort: {createdAt: -1}})
    return node
  },
  posts (root, args, context) {
    const nodes = Posts.find({}, {limit: 4, sort: {createdAt: -1}}).fetch()
    return {
      nodes
    }
  },
  user (root, args, context) {
    return context.user
  }
}
