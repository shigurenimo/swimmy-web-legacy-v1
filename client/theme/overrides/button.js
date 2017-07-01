import { Meteor } from 'meteor/meteor'

export default {
  root: {
    height: '30px',
    padding: '0px 10px',
    verticalAlign: 'top',
    color: Meteor.settings.public.color.primary,
    textTransform: 'default',
    letterSpacing: '1px'
  },
  dense: {
    fontSize: '12px',
    minWidth: '32px',
    minHeight: '30px'
  }
}
