### Interfaz de preguntas en encuesta web

En el contexto del desarrollo del proyecto de desarrollo de software se realizó un sistema para evaluar las clases de los profesores. Para ello, al finalizar cada clase se envia a los alumnos un link a una encuesta sobre la clase misma.

Una de las características de estas encuestas es que sean fáciles y rápidas, dado que se estarán realizando constantemente. Otra es que las preguntas pueden ser de distintos tipo, como por ejemplo elegir un emoji que represente un estado anímico, o elegir una alternativa de texto.

Ello aumenta la dificultad a la hora de mostrar las preguntas. En particular, al tener distintos tipos que pueden ir cambiando en el tiempo se necesita una forma que permita a futuros desarrolladores poder crear nuevos tipos de pregunta o modificar los existentes sin mayores problemas.

Este proyecto fue realizado en React a través de componentes que se encargar de hacer los `render`s correspondientes. En particular, el archivo [Survey.js](./Survey.js) corresponde a la visualización de la encuesta completa. Luego, debe encargarse de poder mostrar cada pregunta, dando la posibilidad de que sea respondida.

Para facilitar esto, se definió un protocolo que permite comunicar al _handler_ de la encuesta con el _handler_ de una pregunta en particular. Se definió un diccionario que asocia un tipo de pregunta a un _handler_ definido.

```js
// Survey.js
// Linea 9 a 12
import QIndex from './Questions/QIndex'
import QEmoji from './Questions/QEmoji'
import QAlternative from './Questions/QAlternative'
import QText from './Questions/QText'

// Linea 26 a 30
const QuestionComponentForType = {
  emoji: QEmoji,
  alternative: QAlternative,
  text: QText,
}
```

Luego, esto permite que cuando se quiera mostrar una pregunta en particular uno pueda elegir el _handler_ correspondiente de manera sencilla

```js
// Survey.js
// Linea 123 a 125
const index = this.state.question
const question = this.state.survey.questions[index]
const QuestionComponent = QuestionComponentForType[question.qtype]
```

Y para separar de manera eficiente la lógica de la encuesta de la correspondiente a la pregunta se cumple con un protocolo. El _handler_ de la pregunta recibe dos parámetros, la pregunta que tiene que mostrar y una función que debe ser llamada con la respuesta

```js
// Survey.js
// Linea 130 a 132
const answer = answer => this.questionAnswer(index, answer)
const data = { answer, question }
return <QuestionComponent {...data} />
```

Gracias a esto, cualquier desarrollador, nuevo en el proyecto o no, puede crear un _handler_ para un nuevo tipo de pregunta sin mayores problemas. Solo se tiene que preocupar de asociar el _handler_ al tipo de pregunta y luego usar los parámetros para mostrar su pregunta y poder responderla.

Los tipos de pregunta que se hicieron pueden verse aqui

- [Questions/QAlternative.js](Questions/QAlternative.js)
- [Questions/QEmoji.js](Questions/QEmoji.js)
- [Questions/QIndex.js](Questions/QIndex.js)
- [Questions/QText.js](Questions/QText.js)
