import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'

export default withTracker(() => {
  Meteor.subscribe('userData')

  return {
    isLogged: !!Meteor.user(),
    isLoggingIn: Meteor.loggingIn(),
    isLoggingOut: Meteor.loggingOut(),
    userId: Meteor.userId(),
    currentUser: Meteor.user()
  }
})
