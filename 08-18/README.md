Adaptador
Alta cohseion
bajo acomplamiento
alta extensibilidad

### Sistema de notificaciones en API

En el contexto del desarrollo de una API se necesitaba un sistema de notificaciones.
El sistema funciona con dispositivos iOS y Android, por lo que debe ser capaz de enviar notificaciones a ambos.
Para ello se usaron las librerías [node-apn](https://github.com/node-apn/node-apn) y [node-gcm](https://github.com/ToothlessGear/node-gcm).
Ellas permiten comunicarse con el proveedor de notificaciones de Apple y Google respectivamente.



```js
const apn = require('apn')
const gcm = require('node-gcm')

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
```
