import React from 'react'
import styled from 'styled-components'

import Container from '../../components/Container'
import Title from '../../components/Title'
import Body from '../../components/Body'

/*
  Here we show this options
    - Start survey
    - Report no class
    - Reject survey due to no assistance
*/

const Group = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: row;
`

const GroupGo = styled(Group)`
  background-color: lightgreen;
`

const GroupNoGo = styled(Group)`
  background-color: lightgray;
`

const Option = styled.div`
  font-size: 6vh;
  width: 100%;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`

const Index = ({ title, noAssistance, noClass, surveyStart }) => (
  <Container>
    <Title>{title}</Title>
    <Body>
      <GroupGo>
        <Option onClick={surveyStart}>
          Fui a clases
        </Option>
      </GroupGo>
      <GroupNoGo>
        <Option onClick={noAssistance}>No fui</Option>
        <Option onClick={noClass}>
          No hubo
        </Option>
      </GroupNoGo>
    </Body>
  </Container>
)

export default Index
