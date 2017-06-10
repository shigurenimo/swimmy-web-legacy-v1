import { Meteor } from 'meteor/meteor'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import IconNext from 'material-ui-icons/NavigateNext'
import IconBefore from 'material-ui-icons/NavigateBefore'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import Block from '../components/ui-block'
import Layout from '../components/ui-layout'
import Sheet from '../components/ui-sheet'
import SheetContent from '../components/ui-sheet-content'
import InlineTypography from '../components/ui-inline-typography'
import Post from './post'
import styleSheet from './time-machine.style'

@withStyles(styleSheet)
@inject('networks', 'posts', 'postsSocket')
@observer
export default class TimeMachine extends Component {
  render () {
    const {
      classes
    } = this.props
    return (
      <Layout>
        <Sheet>
          <SheetContent align='center'>
            <Block width={300} align='center'>
              <InlineTypography>{this.state.currentYear}</InlineTypography>
              <InlineTypography type='display1'>{'・'}</InlineTypography>
              <InlineTypography type='display1'>{this.state.currentMonth}</InlineTypography>
              <Button compact className={classes.prev} onClick={this.onBeforeMonth.bind(this)}>
                <IconBefore {...this.iconStyle} />
              </Button>
              <Button compact className={classes.next} onClick={this.onNextMonth.bind(this)}>
                <IconNext {...this.iconStyle} /></Button>
            </Block>
          </SheetContent>
        </Sheet>
        <Sheet>
          <SheetContent align='center'>
            <Block width={300} align='center'>
              <Typography type='title'>
                {this.state.currentDay}
              </Typography>
              <Button compact className={classes.prev} onClick={this.onBeforeDay.bind(this)}>
                <IconBefore {...this.iconStyle} />
              </Button>
              <Button compact className={classes.next} onClick={this.onNextDay.bind(this)}>
                <IconNext {...this.iconStyle} />
              </Button>
            </Block>
          </SheetContent>
        </Sheet>
        <Sheet>
          <SheetContent align='center'>
            <Button component='a' href={this.href}>fetch !</Button>
          </SheetContent>
        </Sheet>
        {this.forPosts()}
      </Layout>
    )
  }

  get iconStyle () {
    return {
      style: {
        display: 'block',
        width: 30,
        height: 30
      },
      color: Meteor.settings.public.color.primary
    }
  }

  get href () {
    return '/timemachine/' +
      this.state.currentYear + '/' +
      this.state.currentMonth + '/' +
      this.state.currentDay
  }

  state = {
    currentYear: this.props.posts.timeline.other.y,
    currentMonth: this.props.posts.timeline.other.m,
    currentDay: this.props.posts.timeline.other.d
  }

  onBeforeMonth (event) {
    if (event) event.preventDefault()
    if (this.state.currentMonth < 1) {
      this.setState({currentMonth: 12, currentDay: 1})
    } else {
      this.setState({currentMonth: this.state.currentMonth - 1, currentDay: 1})
    }
  }

  onNextMonth (event) {
    if (event) event.preventDefault()
    if (this.state.currentMonth > 11) {
      this.setState({currentMonth: 1, currentDay: 1})
    } else {
      this.setState({currentMonth: this.state.currentMonth + 1, currentDay: 1})
    }
  }

  onBeforeDay (event) {
    if (event) event.preventDefault()
    const count = new Date(2017, this.state.currentDay - 1, 0).getDate()
    if (this.state.currentDay < 2) {
      this.setState({currentDay: count})
      this.onBeforeMonth()
    } else {
      this.setState({currentDay: this.state.currentDay - 1})
    }
  }

  onNextDay (event) {
    if (event) event.preventDefault()
    const count = new Date(2017, this.state.currentDay - 1, 0).getDate()
    if (this.state.currentDay > count - 1) {
      this.setState({currentDay: 1})
      this.onNextMonth()
    } else {
      this.setState({currentDay: this.state.currentDay + 1})
    }
  }

  forPosts () {
    const index = this.props.posts.index.slice()
    const isFetching = this.props.posts.isFetching
    if (index.length < 1) {
      return (
        <Sheet>
          <SheetContent>
            <Typography>
              {isFetching ? '読み込み中 ..' : ''}
            </Typography>
          </SheetContent>
        </Sheet>
      )
    }
    return index.map(item => <Post key={item._id} {...item} />)
  }

  componentDidMount () {
    this.context.onScrollTop()
  }

  static get contextTypes () {
    return {
      onScrollTop: propTypes.any
    }
  }
}
