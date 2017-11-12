import { Meteor } from 'meteor/meteor'

export default theme => ({
  content: {
    color: 'rgba(0, 0, 0, 0.8)'
  },
  textContent: {
    padding: '15px 10px 15px'
  },
  imageContent: {
    padding: '10px 10px'
  },
  embedContent: {
    padding: '10px 10px'
  },
  embedTitleContent: {
    padding: '10px 10px'
  },
  replyContent: {
    padding: '10px 10px'
  },
  tagAction: {
    padding: '5px 5px'
  },
  replyInnerContent: {
    padding: '5px 5px'
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
  image: {
    maxWidth: '500px'
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
  }
})
