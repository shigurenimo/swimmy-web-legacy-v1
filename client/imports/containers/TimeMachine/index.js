import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import IconNext from 'material-ui-icons/NavigateNext'
import IconBefore from 'material-ui-icons/NavigateBefore'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import Typography from 'material-ui/Typography'
import Block from '../../components/UI-Block'
import Layout from '../../components/UI-Layout'
import Sheet from '../../components/UI-Sheet'
import SheetContent from '../../components/UI-SheetContent'
import InlineTypography from '../../components/UI-InlineTypography'
import Post from '../CardPost'
import styleSheet from './index.style'

@withStyles(styleSheet)
@inject('channels', 'posts', 'timelines')
@observer
export default class TimeMachine extends Component {
  render () {
    const {classes} = this.props
    return (
      <Layout>
        <Sheet>
          <SheetContent align='center'>
            <Block width={300} align='center'>
              <InlineTypography>{this.state.currentYear}</InlineTypography>
              <InlineTypography type='display1'>{'・'}</InlineTypography>
              <InlineTypography type='display1'>{this.state.currentMonth}</InlineTypography>
              <IconButton className={classes.prev} onClick={this.onBeforeMonth}>
                <IconBefore className={classes.icon} />
              </IconButton>
              <IconButton className={classes.next} onClick={this.onNextMonth}>
                <IconNext className={classes.icon} /></IconButton>
            </Block>
          </SheetContent>
        </Sheet>
        <Sheet>
          <SheetContent align='center'>
            <Block width={300} align='center'>
              <Typography type='title'>
                {this.state.currentDay}
              </Typography>
              <IconButton className={classes.prev} onClick={this.onBeforeDay}>
                <IconBefore className={classes.icon} />
              </IconButton>
              <IconButton className={classes.next} onClick={this.onNextDay}>
                <IconNext className={classes.icon} />
              </IconButton>
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

  get href () {
    return '/logs/' +
      this.state.currentYear + '/' +
      this.state.currentMonth + '/' +
      this.state.currentDay
  }

  state = {
    currentYear: this.props.timelines.one.other.y,
    currentMonth: this.props.timelines.one.other.m,
    currentDay: this.props.timelines.one.other.d
  }

  onBeforeMonth (event) {
    if (event) event.preventDefault()
    if (this.state.currentMonth < 1) {
      this.setState({currentMonth: 12, currentDay: 1})
    } else {
      this.setState({currentMonth: this.state.currentMonth - 1, currentDay: 1})
    }
  }

  onBeforeMonth = ::this.onBeforeMonth

  onNextMonth (event) {
    if (event) event.preventDefault()
    if (this.state.currentMonth > 11) {
      this.setState({currentMonth: 1, currentDay: 1})
    } else {
      this.setState({currentMonth: this.state.currentMonth + 1, currentDay: 1})
    }
  }

  onNextMonth = ::this.onNextMonth

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

  onBeforeDay = ::this.onBeforeDay

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

  onNextDay = ::this.onNextDay

  forPosts () {
    if (this.props.posts.isEmpty) {
      return (
        <Sheet>
          <SheetContent>
            <Typography>
              {this.props.posts.fetchState ? '読み込み中 ..' : 'この日の書き込みはありません'}
            </Typography>
          </SheetContent>
        </Sheet>
      )
    }
    return this.props.posts.index.map(item => <Post key={item._id} {...item} />)
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
