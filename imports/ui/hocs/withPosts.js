import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { withTracker } from 'meteor/react-meteor-data'

export const mongo = new Map()

export default ({scope = '', options = {}, selectors = {}} = {}) => withTracker(props => {
  const name = scope ? 'posts.' + scope : 'posts'

  if (!mongo.get(name)) {
    const collection = new Mongo.Collection(name)
    mongo.set(name, collection)
  }

  const Post = mongo.get('posts')

  const handle = Meteor.subscribe('posts', options, selectors, scope)

  return {
    posts: {
      stop: () => { handle.stop() },
      loading: !handle.ready(),
      data: Post.find({listId: props.id}).fetch()
    }
  }
})
