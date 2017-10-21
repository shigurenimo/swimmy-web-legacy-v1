import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

Meteor.methods({
  updateUserFollow (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')

    check(req.userId, String)

    const user = Meteor.users.findOne(this.userId)
    const other = Meteor.users.findOne(req.userId)

    const isExist = user.profile.follows.filter(item => item._id === req.userId)[0]
    if (isExist) {
      Meteor.users.update(this.userId, {
        $pull: {
          'profile.follows': {
            _id: other._id,
            username: other.username
          }
        }
      })
    } else {
      Meteor.users.update(this.userId, {
        $push: {
          'profile.follows': {
            _id: other._id,
            username: other.username,
            name: other.profile.name,
            code: other.profile.code,
            icon: other.profile.icon
          }
        }
      })
    }
    return 200
  }
})
