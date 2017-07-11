import page from 'page'
import Model from './model'
import qs from 'qs'

const Router = {
  create () {
    return new RouterClass()
  }
}

export { Router }

export class RouterClass {
  constructor () {
    this.stores = {}
    this.routes = []
  }

  inject (stores) {
    this.stores = stores
  }

  setStores (stores) {
    this.stores = stores
  }

  setRoute (path, options) {
    this.routes.push({
      path,
      action: options.action,
      exit: options.exit
    })
  }

  setBase (path) {
    if (!path.includes('/')) return
    page.base(path)
  }

  run () {
    const stores = this.stores

    this.routes.forEach(route => {
      page(route.path, (context, next) => {
        context.next = next
        context.query = qs.parse(context.querystring)
        const asyncFuntion = route.action(stores, context, next)
        if (!asyncFuntion.then) return
        asyncFuntion
        .catch(err => {
          if (route.catch) {
            route.catch(err)
          } else {
            console.error(err)
          }
        })
      })
      if (route.exit) {
        page.exit(route.path, (context, next) => {
          context.next = next
          const asyncFuntion = route.exit(stores, context, next)
          if (!asyncFuntion.then) return
          asyncFuntion
          .catch(err => {
            if (route.catch) {
              route.catch(err)
            } else {
              console.error(err)
            }
          })
        })
      }
    })

    page()
  }

  createStore () {
    const routes = Model.create()
    this.stores.routes = routes
    return routes
    // TODO: Model.create({page})
  }
}
