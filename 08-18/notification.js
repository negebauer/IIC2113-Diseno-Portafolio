const apn = require('apn')
const gcm = require('node-gcm')
const moment = require('moment')
const gcmKey = require('../certificates/gcm.json').key
const ObjectId = require('mongoose').Types.ObjectId
const User = require('./models/user')

const env = process.env.NODE_ENV || 'development'

const optionsApn = {
  cert: 'SECRETO',
  key: 'SECRETO',
  production: env != 'development',
}

const providerApn = new apn.Provider(optionsApn)
const providerGcm = new gcm.Sender(gcmKey)

const notificationApn = (alert = 'Alert_iOS', payload = {}) =>
  new apn.Notification({
    badge: payload.badge || 0,
    sound: 'ping.aiff',
    alert: alert || 'Mooc Space alerta',
    payload: payload,
    topic: 'com.negebauer.moocspace',
    contentAvailable: true,
    priority: 10,
  })

const notificationGcm = (alert = 'Alert_Android', payload = {}) =>
  new gcm.Message({
    priority: 'high',
    contentAvailable: true,
    delayWhileIdle: true,
    restrictedPackageName: 'com.negebauer.moocspace',
    data: { payload },
    notification: {
      title: 'Mooc Space',
      icon: 'ic_launcher',
      body: alert,
    },
  })

const notifyApn = async (token, alert, payload) =>
  providerApn.send(notificationApn(alert, payload), token)

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

const notifyMultiple = async (devices, alert, payload) => {
  payload.sent = moment().format()
  return devices.map(device => notifyDevice(device, alert, payload))
}

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

const notify = async (devices, alert = 'MOOC_ALERT', payload = {}) =>
  Array.isArray(devices)
    ? notifyMultiple(devices, alert, payload)
    : notifyMultiple([devices], alert, payload)

const flatten = array =>
  array.reduce((total, current) => total.concat(current), [])

const getDevices = async uids => {
  let query = { _id: Array.isArray(uids) ? uids : [uids] }
  const users = await User.find(query)
  const devices = users.map(u => u.devices)
  return flatten(devices)
}

const type = {
  courseUpdate: 'COURSE_UPDATE',
  bombForUser: 'BOMB_ASSIGNED_TO_USER',
  advanceModule: 'ADVANCE_MODULE',
}

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

module.exports = Notification
