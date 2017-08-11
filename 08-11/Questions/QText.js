import React, { Component } from 'react'
import styled from 'styled-components'

import Container from '../../components/Container'
import Title from '../../components/Title'
import Body from '../../components/Body'

/*
  Text question component
  Renders a text question
*/

/* Question body
{
  id: 3,
  qtype: 'text',
  content: 'Este es enunciado de texto',
  fields: {},
},
*/

const TextInput = styled.textarea`
  height: 90%;
  width: 90%;
  margin: 16px;
  resize: none;
`

const Button = styled.button`
  margin-bottom: 16px;
  padding: 12px;
`

class Text extends Component {
  constructor() {
    super()
    this.state = {
      text: '',
    }
  }

  answer = () => this.props.answer(this.state.text)

  onChange = e => this.setState({ [e.target.name]: e.target.value })

  render() {
    const { content } = this.props.question
    return (
      <Container>
        <Title>{content}</Title>
        <Body>
          <TextInput
            name="text"
            value={this.state.text}
            onChange={this.onChange}
            placeholder="Ingresa tu respuesta aquí"
          />
          <Button onClick={this.answer}>Siguiente</Button>
        </Body>
      </Container>
    )
  }
}

export default Text
