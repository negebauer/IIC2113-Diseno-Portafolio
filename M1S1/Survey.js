import React, { Component } from 'react'
import token from '../utils/token'
import { devlog } from '../utils/log'

import Answered from './Answered'
import Loading from './Loading'
import NotFound from './NotFound'

import QIndex from './Questions/QIndex'
import QEmoji from './Questions/QEmoji'
import QAlternative from './Questions/QAlternative'
import QText from './Questions/QText'

const baseUrl = process.env.REACT_APP_API || 'http://localhost:3000/api'
const api = async (path, config) =>
  fetch(`${baseUrl}${path}`, {
    ...{
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-type': 'application/json',
      },
    },
    ...config,
  })

const QuestionComponentForType = {
  emoji: QEmoji,
  alternative: QAlternative,
  text: QText,
}

class Survey extends Component {
  constructor() {
    super()
    this.state = {
      survey: null,
      question: -1,
      token: token(),
      answered: false,
      error: '',
    }
  }

  componentDidMount() {
    this.surveyLoad() // Commented until api is working
    // const surveyTest = require('./surveyTest.json')
    // this.setState({ survey: surveyTest }) // For debug
  }

  surveyLoad = async () => {
    const survey = await (await api(`/answers/${this.state.token}`)).json()
    devlog('surveyLoad', survey)
    this.setState({
      survey: survey.survey,
      answered: survey.answered,
      error: survey.errors,
    })
  }

  surveySendIfCompleted = () => this.surveyAnswered() && this.surveySend()

  surveySend = async () => {
    const answer = {}
    this.state.survey.questions.forEach(q => (answer[q.id] = q.answer))
    const body = { answer: { answer } }
    return this.surveySendAnswer(body)
  }

  surveySendAnswer = async body => {
    devlog('surveySendAnswer', body)
    const response = await api(`/answers/${this.state.token}`, {
      method: 'put',
      body: JSON.stringify(body),
    })
    devlog('surveySendAnswer response', response)
    this.setState({ answered: response.ok })
    return response
  }

  surveyStart = () => this.setState({ question: 0 })

  surveyStarted = () => this.state.question !== -1

  surveyAnswered = () =>
    this.state.answered ||
    this.state.question >= this.state.survey.questions.length

  questionAnswer = (index, answer) => {
    const question = this.state.question + 1
    const questions = this.state.survey.questions
    questions[index].answer = answer
    this.setState(
      { survey: { ...this.state.survey, questions }, question },
      this.surveySendIfCompleted
    )
  }

  noAssistance = async () => this.surveySendAnswer({ answer: { absent: true } })

  noClass = async () => this.surveySendAnswer({ answer: { no_class: true } })

  render() {
    devlog('Survey', this.state)
    if (!this.state.token || this.state.error) {
      return <NotFound />
    }
    if (!this.state.survey) {
      return <Loading />
    }
    if (this.surveyAnswered()) {
      return <Answered />
    }
    if (!this.surveyStarted()) {
      return (
        <QIndex
          title={this.state.survey.title}
          noAssistance={this.noAssistance}
          noClass={this.noClass}
          surveyStart={this.surveyStart}
        />
      )
    }
    const index = this.state.question
    const question = this.state.survey.questions[index]
    const QuestionComponent = QuestionComponentForType[question.qtype]
    if (!QuestionComponent) {
      this.setState({ question: this.state.question + 1 })
      return null
    }
    const answer = answer => this.questionAnswer(index, answer)
    const data = { answer, question }
    return <QuestionComponent {...data} />
  }
}

export default Survey
