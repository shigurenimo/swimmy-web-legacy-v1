import createPalette from 'material-ui/styles/palette'
import { deepOrange, cyan } from 'material-ui/styles/colors'

const palette = createPalette({
  primary: cyan,
  accent: deepOrange,
  type: 'light'
})

palette.text.secondary = 'rgba(0, 0, 0, 0.5)'
palette.text.primary = 'rgba(0, 0, 0, 0.6)'

export default palette
