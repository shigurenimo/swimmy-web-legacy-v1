import { createStyleSheet } from 'material-ui/styles'

export default createStyleSheet('Admin', theme => {
  return {
    container: {
      position: 'relative',
      paddingBottom: 50
    },
    userIcon: {},
    squares: {
      margin: '0 auto',
      width: '140px',
      height: '140px',
      borderEadius: '2px'
    },
    square: {
      display: 'inline-block',
      verticalAlign: 'top',
      width: '20%',
      height: '20%'
    },
    name: {
      marginTop: 20
    },
    usernameText: {
      fontSize: '1rem',
      lineHeight: '30px',
      textAlign: 'center'
    },
    nameText: {
      fontSize: '2rem',
      fontWeight: 'bold',
      textAlign: 'center',
      lineHeight: '50px'
    },
    fllowList: {
      marginTop: '10px'
    },
    followListName: {
      display: 'inline-block',
      verticalAlign: 'top',
      lineHeight: '30px',
      fontSize: '1rem',
      fontWeight: 'bold',
      border: 'none'
    },
    followListUsername: {
      display: 'inline-block',
      verticalAlign: 'top',
      paddingLeft: '10px',
      lineHeight: '30px',
      opacity: 0.8,
      border: 'none'
    }
  }
})
