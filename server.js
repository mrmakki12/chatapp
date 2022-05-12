const express = require("express")
const { createServer } = require("http")
const { Server } = require("socket.io")
const cors = require('cors')
const app = express()
const path = require('path')
const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: 'http://localhost:3000 '}})
const PORT = process.env.PORT || 3001

// render static files from build
app.use(express.static(path.join(__dirname, 'client/build')))

io.on("connection", (socket) => {
    console.log('user connected', socket.id)

    // recieved message from front
    socket.on('message', (data) => {
        // send it back to the proper room
        socket.to(data.room).emit('recieve_message', data)
    })

    // recieved join room request
    socket.on('join_room', (data) => {
        // join room
        socket.join(data)
    })
})


httpServer.listen(PORT, () => {
    console.log('server up on port', PORT)
})