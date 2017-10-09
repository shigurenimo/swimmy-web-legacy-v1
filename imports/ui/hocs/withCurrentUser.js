import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'

export default withTracker(() => {
  return {
    loggingIn: Meteor.loggingIn(),
    loggingOut: Meteor.loggingOut(),
    userId: Meteor.userId(),
    currentUser: Meteor.user()
  }
})
