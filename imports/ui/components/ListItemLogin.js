import { ListItem, ListItemText } from 'material-ui/List'
import React from 'react'

export const Component = props =>
  <ListItem
    button
    dense
    href='/admin'>
    <ListItemText primary='login' />
  </ListItem>

export default Component
