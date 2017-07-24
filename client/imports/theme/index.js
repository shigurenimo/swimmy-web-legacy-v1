import { createMuiTheme } from 'material-ui/styles'
import * as overrides from './overrides/index'
import palette from './palette'
import shadows from './shadows'

export default createMuiTheme({
  palette,
  overrides,
  shadows
})
