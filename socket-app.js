const SubModel = require('./database/models').SubModel
const { databaseConfig } = require('./database')
var ObjectId = require('mongodb').ObjectId

module.exports = async (io, client) => {
  const db = await databaseConfig.getDatabase(client)
  const collection = db.collection('subscriptions')

  io.on('connection', (socket) => {
    console.log('a user connected')

    // new Client
    socket.on('create', (req, callBack) => {
      const model = new SubModel({
        type: req.type,
        status: req.status,
        updatedAt: new Date(),
      })

      if (req._id === '') {
        collection.insertOne(model, (err) => {
          if (err) {
            throw err
          }
          callBack(model._id)
        })
      }
    })

    socket.on('Subscribe', (req, callBack) => {
      collection.updateOne(
        { _id: ObjectId(req._id) },
        { $set: { type: req.type, status: req.status, updatedAt: new Date() } },
        () => {
          collection.find({ type: 'Subscription' }).toArray((err, res) => {
            callBack({ count: res.length, message: 'Subscribed' })
          })
        },
      )
    })

    socket.on('UnSubscribe', (req, callBack) => {
      collection.updateOne(
        { _id: ObjectId(req._id) },
        { $set: { type: req.type, status: req.status, updatedAt: new Date() } },
        () => {
          collection.find({ type: 'Subscription' }).toArray((err, res) => {
            callBack({ count: res.length, message: 'Un-subscribed' })
          })
        },
      )
    })

    socket.on('CountSubscriber', (callBack) => {
      collection.find({ type: 'Subscription' }).toArray((err, res) => {
        callBack({ message: '', count: res.length })
      })
    })

    socket.on('otherEvent', (callBack) => {
      callBack({
        type: 'Error',
        error: 'Requested method not implemented',
        updatedAt: new Date(),
      })
    })

    // Delete all collaction
    socket.on('Delete', async () => {
      await collection.deleteMany()
    })

    const heartBeat = () => {
      socket.on('heartbeat', {
        type: 'heartbeat',
        updatedAt: new Date(),
      })
    }

    setInterval(() => {
      heartBeat
    }, 1000)
  })
}
