const express = require('express')
const cors = require('cors')
const app = express()
const { Server } = require('socket.io')
const http = require('http')
const server = http.createServer(app)
const io = new Server(server)
const ioClient = require('./socket-app')
const HandleErrors = require('./utils/error-handler')
const { DB_URL } = require('./config')
const { MongoClient } = require('mongodb')
const client = new MongoClient(DB_URL)

module.exports = async () => {
  app.use(express.json({ limit: '1mb' }))
  app.use(express.urlencoded({ extended: true, limit: '5mb' }))
  app.options('*', cors())
  app.use(express.static('public'))

  app.get('/', (req, res) => {
    res.sendFile(__dirname + 'public')
  })

  app.use(HandleErrors)
  ioClient(io, client)
  server.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`)
  })
}
