import React from 'react'

import Container from '../components/Container'
import Title from '../components/Title'
import Body, { BodyText } from '../components/Body'

const Loading = () => (
  <Container>
    <Title>Cargando</Title>
    <Body>
      <BodyText>Se está descargando la encuesta</BodyText>
      <BodyText>Por favor espera</BodyText>
    </Body>
  </Container>
)

export default Loading
