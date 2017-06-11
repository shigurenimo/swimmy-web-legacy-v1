import { createStyleSheet } from 'material-ui/styles'

export default createStyleSheet('LeftMenuDefault', theme => {
  return {
    select: {
      background: 'rgba(0, 0, 0, 0.05)'
    },
    appLogo: {
      position: 'relative'
    },
    appLogoImage: {
      marginLeft: '10px',
      height: '100px',
      width: 'auto'
    },
    appVersion: {
      position: 'absolute',
      top: '10px',
      left: '100px',
      width: '100px',
      height: '30px',
      lineHeight: '30px',
      fontSize: '1.2rem',
      color: 'tomato'
    }
  }
})
