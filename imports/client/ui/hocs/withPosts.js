import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { withTracker } from 'meteor/react-meteor-data'

export const mongo = new Map()

export default (selectors = {}, options = {}, scope = '') => withTracker(props => {
  const name = scope ? 'posts.' + scope : 'posts'

  if (!mongo.get(name)) {
    const collection = new Mongo.Collection(name)
    mongo.set(name, collection)
  }

  const Post = mongo.get(name)

  const handle = Meteor.subscribe('posts', selectors, options, scope)

  return {
    posts: {
      stop: () => { handle.stop() },
      loading: !handle.ready(),
      data: Post.find({}, {sort: {createdAt: -1}}).fetch()
    }
  }
})
