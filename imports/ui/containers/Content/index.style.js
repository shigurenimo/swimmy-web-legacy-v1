export default theme => {
  return {
    root: {
      position: 'absolute',
      top: 0,
      height: '100%',
      boxSizing: 'border-box',
      overflowY: 'auto',
      overflowX: 'hidden',
      transition: 'padding-top 300ms, width 0ms',
      '-webkit-overflow-scrolling': 'touch',
      [theme.breakpoints.down('sm')]: {
        right: '-20px',
        width: 'calc(50% + 20px)',
        paddingRight: '20px',
        paddingLeft: 0
      },
      [theme.breakpoints.up('sm')]: {
        right: '-20px',
        paddingRight: (0 + 20) + 'px',
        paddingLeft: 0,
        width: 'calc(100% - 250px + 20px)'
      }
    },
    fixHeight: {
      position: 'relative',
      width: '100%',
      height: '101%'
    }
  }
}
