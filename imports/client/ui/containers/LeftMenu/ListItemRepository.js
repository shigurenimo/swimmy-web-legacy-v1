import React from 'react'
import ListItem from 'material-ui/List/ListItem'
import ListItemText from 'material-ui/List/ListItemText'

export const Component = props =>
  <ListItem
    button
    dense
    component='a'
    target='_blank'
    href='https://github.com/uufish/Sw'>
    <ListItemText primary='リポジトリ' />
  </ListItem>

export default Component
