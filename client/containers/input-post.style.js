import { createStyleSheet } from 'material-ui/styles'

export default createStyleSheet('InputPost', theme => {
  return {
    container: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: '100%',
      height: 'auto',
      overflowX: 'hidden',
      backgroundColor: '#F8F7F8',
      zIndex: 140
    },
    oneColumn: {
      top: 0,
      right: 0,
      padding: '10px 10px 0 10px',
      width: '50%'
    },
    twoColumn: {
      top: 0,
      right: 0,
      width: 'calc(100% - 250px)',
      padding: '10px 10px 0 0'
    },
    timelineName: {
      height: '25px',
      overflow: 'hidden',
      textAlign: 'right'
    },
    message: {
      position: 'relative',
      paddingTop: '5px'
    },
    postContent: {
      width: '100%',
      height: 'auto',
      padding: 0,
      lineHeight: '20px',
      verticalAlign: 'top',
      fontSize: '1rem',
      border: 0,
      borderRadius: 0,
      appearance: 'none',
      outline: 0,
      '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      resize: 'none'
    },
    imagePreview: {
      padding: '10px 10px 10px 10px',
      height: '200px'
    },
    image: {
      height: '100%',
      width: 'auto'
    },
    postPublic: {
      width: 'auto',
      display: 'block',
      paddingTop: '5px',
      paddingBottom: '10px',
      marginRight: '0',
      textAlign: 'right'
    },
    openImage: {
      display: 'inline-block',
      margin: '0 10px 0 auto',
      width: 'auto'
    }
  }
})
