import { Meteor } from 'meteor/meteor'
import { createStyleSheet } from 'material-ui/styles'

export default createStyleSheet('Post', theme => {
  return {
    container: {
      overflow: 'hidden'
    },
    sheet: {
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
    },
    content: {
      color: 'rgba(0, 0, 0, 0.8)'
    },
    more: {
      position: 'absolute',
      bottom: '4px',
      right: '4px',
      width: '30px',
      height: '30px',
      zIndex: 10
    },
    username: {
      color: Meteor.settings.public.color.primary
    },
    photoImage: {
      display: 'block',
      height: 'auto',
      maxHeight: '400px',
      maxWidth: '500px',
      borderRadius: '2px',
      overflow: 'hidden',
      cursor: 'pointer',
      transitionDuration: '150ms'
    },
    photoImageOpen: {
      maxHeight: '100%'
    },
    oEmbed: {
      maxWidth: '500px',
      '& iframe': {
        width: '100%',
        height: 'auto'
      }
    },
    oEmbedIframe: {
      paddingBottom: '100%',
      width: '100%',
      position: 'relative',
      '& iframe': {
        width: '100%',
        height: '100%',
        border: 0,
        margin: 0,
        padding: 0,
        position: 'absolute',
        top: 0,
        left: 0
      }
    },
    reactionList: {
      width: 'calc(100% - 50px)',
      display: 'flex',
      flexWrap: 'wrap'
    },
    reaction: {
      marginBottom: '5px'
    },
    icon: {
      width: '30px',
      height: '30px',
      color: Meteor.settings.public.color.primary
    },
    reply: {
      width: 'calc(100% - 30px)'
    },
    colorChip: {
      background: theme.palette.primary[100]
    }
  }
})
