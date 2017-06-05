import createPalette from 'material-ui/styles/palette'
import { deepOrange, cyan } from 'material-ui/styles/colors'

const palette = createPalette({
  primary: cyan,
  accent: deepOrange,
  type: 'light'
})

palette.text.secondary = 'darkturquoise'
palette.text.primary = '#00afcc'

export default palette
