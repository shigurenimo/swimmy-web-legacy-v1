import { Meteor } from 'meteor/meteor'
import { createStyleSheet } from 'material-ui/styles'

export default createStyleSheet('ConfigAccount', theme => {
  return {
    container: {
      position: 'relative',
      paddingBottom: 50
    },
    usernameTitle: {
      fontWeight: 'bold'
    },
    inputUsername: {
      marginTop: 10,
      width: '100%'
    },
    textDescription: {
      marginTop: 10,
      opacity: 0.8,
      color: Meteor.settings.public.color.primary
    },
    textError: {
      marginTop: 5,
      color: Meteor.settings.public.color.primary
    },
    textItemTitle: {
      fontWeight: 'bold'
    },
    blockExistEmail: {
      position: 'relative'
    },
    inputRemoveEmail: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      margin: 'auto',
      height: 30,
      textAlign: 'center',
      lineHeight: 30,
      fontSize: 30,
      cursor: 'pointer'
    }
  }
})
