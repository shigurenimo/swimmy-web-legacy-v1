import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'

Meteor.methods({
  'users.findAddress' () {
    const address = this.connection.clientAddress
    const unique = Random.createWithSeeds(address).id()
    return {unique: unique, address: address}
  }
})
