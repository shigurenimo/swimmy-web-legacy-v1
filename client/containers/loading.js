import { Meteor } from 'meteor/meteor'
import { observer } from 'mobx-react'
import React, { Component } from 'react'

@observer
class Loading extends Component {
  animation = null

  render () {
    return <div className='container:loading'>
      <div className='block:squares'>
        {Array.from(new Array(25).keys())
        .map(() => (Math.random() < 0.1) ? 2 : (Math.random() < 0.5) ? 1 : 0)
        .map((i, index) =>
          <div
            className='block:square'
            key={index}
            style={{
              opacity: i === 0 ? 0 : 1,
              backgroundColor: i === 1
                ? Meteor.settings.public.color.primary
                : i === 2 ? Meteor.settings.public.color.secondary : 'rgb(0 0 0)'
            }}/>)}
      </div>
    </div>
  }

  componentDidMount () {
    this.animation = setInterval(() => {
      const isMounted = this.updater.isMounted(this)
      if (isMounted) {
        this.updater.enqueueForceUpdate(this)
      }
    }, 300)
  }

  componentWillUnmount () {
    clearInterval(this.animation)
  }
}

export { Loading }
