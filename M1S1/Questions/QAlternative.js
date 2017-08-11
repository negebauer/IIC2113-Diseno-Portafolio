import React from 'react'
import styled from 'styled-components'

import Container from '../../components/Container'
import Title from '../../components/Title'
import CardOptions, { CardOption } from '../../components/CardOptions'

/*
  Alternative question component
  Renders an alternative question
*/

/* Question body
{
  id: 2,
  qtype: 'alternative',
  content: 'Este es enunciado de alternativa',
  fields: {
    options: ['alternativa1', 'alternativa2', 'alternativa3'],
  },
},
*/

const AlternativeOption = styled(CardOption)`
  font-size: 5vh;
  margin: 4px;
  padding: 4px;
`

const Alternative = ({ answer, question }) => (
  <Container>
    <Title>{question.content}</Title>
    <CardOptions>
      {question.fields.options.map((alternative, index) => (
        <AlternativeOption key={index} onClick={() => answer(alternative)}>
          {alternative}
        </AlternativeOption>
      ))}
    </CardOptions>
  </Container>
)

export default Alternative
