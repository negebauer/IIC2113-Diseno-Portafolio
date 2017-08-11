import React from 'react'

import Container from '../components/Container'
import Title from '../components/Title'
import Body, { BodyText } from '../components/Body'

const NotFound = () => (
  <Container>
    <Title>No encontrada</Title>
    <Body>
      <BodyText>La encuesta no pudo ser encontrada</BodyText>
      <BodyText>Revisa que estes usando un link correcto</BodyText>
      <BodyText>O consulta con tu profesor</BodyText>
    </Body>
  </Container>
)

export default NotFound
