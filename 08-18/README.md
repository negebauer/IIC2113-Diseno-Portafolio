### Sistema de notificaciones en API

Patrones importantes:
 - [Adaptador](https://en.wikipedia.org/wiki/Adapter_pattern): Se convierte la interfaz de las líbrerias de notificación en una interfaz común
 - [Fachada](https://en.wikipedia.org/wiki/Facade_pattern): Interfaz unificada `Notification` a las distintas notificaciones
 - [Estrategia](https://en.wikipedia.org/wiki/Strategy_pattern): Se encapsulan las notificaciones a cada dispositivo en una llamada

En el contexto del desarrollo de una API se necesitaba un sistema de notificaciones.
El sistema funciona con dispositivos iOS y Android, por lo que debe ser capaz de enviar notificaciones a ambos.
Para ello se usaron las librerías [node-apn] y [node-gcm].
Ellas permiten comunicarse con el proveedor de notificaciones de Apple y Google respectivamente.

Dado que se está usando una librería externa se utilizó el patrón adaptador para poder separar la lógica de la aplicación de aquella de las librerías.
Esto permite cambiar de librería sin tener que cambiar el código interno de la aplicación.
Esto se logró a través de funciones de ayuda para crear y enviar las notificaciones correspondientes:

```js
const apn = require('apn')
const gcm = require('node-gcm')

// Configurar una notificación iOS
const notificationApn = (alert = 'Alert_iOS', payload = {}) =>
  new apn.Notification({
    badge: payload.badge || 0,
    sound: 'ping.aiff',
    alert: alert || 'Mensaje',
    payload: payload,
    topic: 'SECRETO',
    contentAvailable: true,
    priority: 10,
  })

// Configurar una notificación Android
const notificationGcm = (alert = 'Alert_Android', payload = {}) =>
  new gcm.Message({
    priority: 'high',
    contentAvailable: true,
    delayWhileIdle: true,
    restrictedPackageName: 'SECRETO',
    data: { payload },
    notification: {
      title: 'Titulo',
      icon: 'ic_launcher',
      body: alert,
    },
})

// Enviar una notificación iOS
const notifyApn = async (token, alert, payload) =>
  providerApn.send(notificationApn(alert, payload), token)

// Enviar una notificación Android
const notifyGcm = async (token, alert, payload) =>
  new Promise((res, rej) =>
    providerGcm.send(
      notificationGcm(alert, payload),
      {
        registrationTokens: Array.isArray(token) ? token : [token],
      },
      (err, response) => (err ? rej(err) : res(response))
    )
  )
```

Sobre ellas se contruyó otra función para enviar notificaciones que permite un uso más directo.
En el sistema los `token` necesarios para enviar notificaciones se guardan en objetos `Device` pertenecientes a los usuarios.
Luego la función de notificación recibe un dispositivo al cual debe enviar la alerta junto con un posible `payload` de datos:

```js
// Enviar notificación a dispositivo {device} con título {alert} y datos {payload}
const notifyDevice = async (device, alert, payload) => {
  if (!device.token) {
    return
  }
  console.log('notify', payload.type, device.token, device.name)
  payload.sent = moment().format()
  return device.OS === 'iOS'
    ? notifyApn(device.token, alert, payload)
    : notifyGcm(device.token, alert, payload)
}
```

Luego otro punto importante es que muchas veces las notificaciones se deben enviar a varios dispositivos.
Por ello se creo otra función que permite hacer eso:

```js
// Enviar notificación a varios dispositivos {devices}
const notify = async (devices, alert = 'Mi alerta', payload = {}) =>
  Array.isArray(devices)
    ? notifyMultiple(devices, alert, payload)
    : notifyMultiple([devices], alert, payload)
```

Teniendo todo esto se facilita el enviar notificaciones desde la API, con llamados a la función `notify`.
Eso si, antes de enviar una notificación se debe configurar la misma.
Esto incluye temas como definir el mensaje de la notificación, los datos para enviar en el `payload`, a quienes enviarlo, etc.
Para separar dicha lógica de la lógica de la API, aumentando la cohesión y reduciendo el acoplamiento, se creó una API de Notificación (una sub API del programa básicamente):

```js
const Notification = {
  courseUpdate: async course => {
    const uids = flatten(course.groups.map(group => group.users))
    const devices = await getDevices(uids)
    const message = `Curso ${course.name} actualizado`
    const payload = {
      type: type.courseUpdate,
      cid: course._id,
    }
    return notify(devices, message, payload)
  },
  bombForUser: async (uid, course, module) => {
    const devices = await getDevices(uid)
    const message = `Bomba recibida módulo ${module.name} curso ${course.name}`
    const payload = {
      type: type.bombForUser,
      cid: course._id,
      mid: module._id,
    }
    return notify(devices, message, payload)
  },
  advanceModule: async (uids, course, module) => {
    const devices = await getDevices(uids)
    const message = `Aprobado módulo ${module.name} curso ${course.name}`
    const payload = {
      type: type.advanceModule,
      cid: course._id,
    }
    return notify(devices, message, payload)
  },
}
```

Con este objeto basta tener un código como el siguiente para poder enviar notificaciones desde cualquier parte del programa:

```js
const Notification = require('../path/to/notifications.js')
const someCourse
Notification.courseUpdate(someCourse)
```

 También ayuda a que el sistema de notificaciones sea más extensible, definiendo un único lugar donde se configuran las mismas.
 Si se quiere tener un nuevo tipo de notificacións basta agregarla a `Notification`

 Se puede ver el código completo en el archivo [notification.js](./notification.js)

<!-- Links -->
[node-apn]:https://github.com/node-apn/node-apn
[node-gcm]:https://github.com/ToothlessGear/node-gcm
