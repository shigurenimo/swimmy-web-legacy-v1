export default theme => {
  return {
    root: {
      position: 'fixed',
      top: 0,
      right: 0,
      height: '100%',
      overflowY: 'scroll',
      overflowX: 'hidden',
      [theme.breakpoints.up('sm')]: {
        width: '100%',
        transition: 'translateX 0'
      },
      [theme.breakpoints.down('sm')]: {
        width: '200%',
        transition: 'transform 300ms'
      }
    },
    left: {
      transform: 'translate3d(50%, 0, 0)'
    },
    right: {
      transform: 'translate3d(0, 0, 0)'
    }
  }
}
