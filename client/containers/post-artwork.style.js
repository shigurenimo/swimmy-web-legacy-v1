import { createStyleSheet } from 'material-ui/styles'

export default createStyleSheet('post-artwork', theme => {
  return {
    imageLink: {
      display: 'inline-block',
      border: 'none'
    },
    image: {
      display: 'block',
      width: '100%',
      maxWidth: '600px',
      minHeight: '100px',
      borderRadius: '1px',
      '&:hover': {
        opacity: 0.8
      }
    }
  }
})
