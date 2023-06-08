import gpio from 'rpi-gpio'
import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import path from 'path'

const app = express()
const base = path.resolve(__dirname, '../')
app.use('/assets', express.static(base + '/html/assets/'))
app.get('/', (req, res) => res.sendFile(base + '/html/index.html'))
app.use(cors())
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173'
  }
})

io.on('connection', (socket) => {
  console.log('user joined')
  socket.on('disconnected', () => {
    console.log('user left')
  })
})

server.listen(3000, () => {
  console.log('listening on *:3000')
})

let pin18 = false
let pin16 = false

gpio.on('change', (c: number, v: boolean) => {
  let changed = false
  if (c === 16 && v != pin16) {
    pin16 = v
    changed = true
  }
  if (c === 18 && v != pin18) {
    pin18 = v
    changed = true
  }
  if (changed) {
    io.emit('changed', { left: pin18, right: pin16 })
    // console.log(pin16, pin18);
  }
})

gpio.setup(16, gpio.DIR_IN, gpio.EDGE_BOTH)
gpio.setup(18, gpio.DIR_IN, gpio.EDGE_BOTH)
