import { createMuiTheme } from 'material-ui/styles'
import * as overrides from './overrides/index'
import palette from './palette'

const theme = createMuiTheme({palette, overrides})

theme.palette.text.secondary = 'rgba(0, 0, 0, 0.6)'
theme.palette.text.primary = 'rgba(0, 0, 0, 0.7)'

export default theme
