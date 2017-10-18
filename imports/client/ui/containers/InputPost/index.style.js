export default theme => ({
  root: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: 'auto',
    overflowX: 'hidden',
    backgroundColor: '#F8F7F8',
    boxSizing: 'border-box',
    zIndex: 140,
    [theme.breakpoints.up('sm')]: {
      top: 0,
      right: 0,
      width: 'calc(100% - 250px)',
      padding: '10px 10px 0 10px'
    },
    [theme.breakpoints.down('sm')]: {
      top: 0,
      right: 0,
      width: '50%'
    }
  },
  inner: {
    [theme.breakpoints.down('sm')]: {
      padding: '10px 10px 0 10px'
    }
  },
  tools: {
    overflow: 'hidden',
    textAlign: 'right',
    paddingBottom: '5px'
  },
  message: {
    position: 'relative',
    paddingBottom: '5px'
  },
  postContent: {
    width: '100%',
    height: 'auto',
    margin: 0,
    padding: 0,
    lineHeight: '20px',
    verticalAlign: 'top',
    fontSize: '14px',
    border: 0,
    borderRadius: 0,
    appearance: 'none',
    outline: 0,
    '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    resize: 'none',
    letterSpacing: '1px'
  },
  imagePreview: {
    padding: '10px 0 0 0',
    height: 'auto'
  },
  image: {
    height: '100%',
    width: 'auto'
  },
  postPublic: {
    width: 'auto',
    display: 'block',
    marginRight: '0',
    paddingBottom: '10px',
    textAlign: 'right'
  },
  openImage: {
    display: 'inline-block'
  },
  spacing: {
    marginTop: 0,
    marginBottom: 0
  }
})
