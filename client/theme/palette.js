import createPalette from 'material-ui/styles/palette'
import { blue, red } from 'material-ui/colors'

const palette = createPalette({
  primary: blue,
  accent: red,
  type: 'light'
})

palette.text.secondary = 'rgba(0, 0, 0, 0.6)'
palette.text.primary = 'rgba(0, 0, 0, 0.7)'

export default palette
