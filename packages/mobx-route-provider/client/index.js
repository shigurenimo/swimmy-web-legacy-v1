import { PropTypes, Provider } from 'mobx-react'
import React, { Component } from 'react'
import page from 'page'
import qs from 'qs'
import Model from './model'

let model = null
let mobxStores = null

export class RoutesProvider extends Component {
  render () {
    if (!mobxStores) {
      mobxStores = this.context.mobxStores
      page()
    } else {
      mobxStores = this.context.mobxStores
    }
    return (
      <Provider router={model}>{
        Array.isArray(this.props.children)
          ? <div>{this.props.children}</div>
          : this.props.children
      }
      </Provider>
    )
  }

  static get contextTypes () {
    return {
      mobxStores: PropTypes.objectOrObservableObject
    }
  }
}

export function createRouter (routes) {
  if (!model) {
    model = Model.create()
    const paths = Object.keys(routes)
    paths.forEach(path => {
      page(path, (context, next) => {
        const route = routes[path]
        const query = qs.parse(context.querystring)
        mobxStores.routes = model
        mobxStores.routes.setQuery(query)
        mobxStores.routes.setPath(context.path)
        mobxStores.routes.setParams(context.params)
        context.query = query
        const asyncFuntion = route.action(context, mobxStores, next)
        if (asyncFuntion.then) {
          asyncFuntion
          .then(() => {})
          .catch(err => {
            if (route.catch) {
              route.catch(err)
            } else {
              console.error(err)
            }
          })
        }
      })
    })
  }
  return model
}
