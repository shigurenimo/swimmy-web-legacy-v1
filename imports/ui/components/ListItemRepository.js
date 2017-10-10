import React from 'react'
import { ListItem, ListItemText } from 'material-ui/List'

export const Component = props =>
  <ListItem
    button
    dense
    component='a'
    target='_blank'
    href='https://github.com/uufish/Sw'>
    <ListItemText primary='uufish / Sw' />
  </ListItem>

export default Component
