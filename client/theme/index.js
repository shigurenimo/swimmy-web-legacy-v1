import { createMuiTheme } from 'material-ui/styles'
import overrides from './overrides'
import palette from './palette'
import shadows from './shadows'
import typography from './typography'

export default createMuiTheme({
  palette,
  overrides,
  shadows,
  typography: typography(palette)
})
