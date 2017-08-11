import React from 'react'

import Container from '../../components/Container'
import Title from '../../components/Title'
import CardOptions, { CardOption } from '../../components/CardOptions'

/*
  Emoji question components
  Renders an emoji question
*/

/* Question body
{
  id: 1,
  qtype: 'emoji',
  content: 'Este es enunciado alternativa',
  fields: {
    options: ['verysad', 'sad', 'neutral', 'happy', 'veryhappy'],
  },
},
*/

const emojis = {
  verysad: '😫',
  sad: '😞',
  neutral: '😐',
  happy: '🙂',
  veryhappy: '😀',
}

const Emoji = ({ answer, question }) => (
  <Container>
    <Title>{question.content}</Title>
    <CardOptions>
      {question.fields.options.map((emoji, index) => (
        <CardOption key={index} onClick={() => answer(emoji)}>
          {emojis[emoji]}
        </CardOption>
      ))}
    </CardOptions>
  </Container>
)

export default Emoji
