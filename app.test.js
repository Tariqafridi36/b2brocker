const databaseCofig = require('./database/connection')
const { DB_URL } = require('./config')
import { createServer } from 'http'
import { io as Client } from 'socket.io-client'
import { Server } from 'socket.io'
import { assert } from 'chai'

test('Database connection status', async () => {
  const val = await databaseCofig.getConnection(
    'mongodb://localhost:27017/db_subscribe',
  )
  expect(val.toString()).toBe('Db Connected')
})

describe('Test Socket.io events', () => {
  let io, serverSocket, clientSocket

  before((done) => {
    const httpServer = createServer()
    io = new Server(httpServer)
    httpServer.listen(() => {
      const port = httpServer.address().port
      io.on('connection', (socket) => {
        serverSocket = socket
      })
      clientSocket = new Client(`http://localhost:${port}`)
      clientSocket.on('connect', done)
    })
  })

  after(() => {
    io.close()
    clientSocket.close()
  })

  it('should work', (done) => {
    clientSocket.on('hello', (arg) => {
      assert.equal(arg, 'world')
      done()
    })
    serverSocket.emit('hello', 'world')
  })

  it('should work (with ack)', (done) => {
    serverSocket.on('hi', (cb) => {
      cb('hola')
    })
    clientSocket.emit('hi', (arg) => {
      assert.equal(arg, 'hola')
      done()
    })
  })
})
