import express from "express"
import http from "http"
import { ExpressPeerServer } from "peer"
import cors from "cors"
import { corsHeader } from "./serve.js"
import { Server } from "socket.io"
import { Worker } from "node:worker_threads"

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
  },
})
const peerServer = ExpressPeerServer(server, {
  debug: true,
  allow_discovery: true,
})
const PORT = process.env.PORT || 443

//console.log(Date.now())

app.use(cors(corsHeader))
app.use("/peerjs", peerServer)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/", (req, res) => {
  res.sendStatus(200)
})

let roomPresentations = {}
const connectedUsers = new Map()
const roomDurations = new Map()
const kickedUsers = new Map()

io.on("connection", (socket) => {
  //console.log("New User: " + socket.id)
  //const recordId = socket.handshake.query.recordId
  //socket.id = recordId

  socket.on("start", (userId, instructorId, time) => {
    if (Date.now() < parseInt(time)) {
      const tUDate = Date.now()
      //const old = 1718017835476 + 6 * 60 * 1000

      const diffInMilliseconds = time - tUDate

      // Convert the difference to hours, minutes, and seconds
      const diffInSeconds = Math.floor(diffInMilliseconds / 1000)
      const hours =
        Math.floor(diffInSeconds / 3600) <= 0
          ? 0
          : Math.floor(diffInSeconds / 3600)
      const minutes =
        Math.floor((diffInSeconds % 3600) / 60) <= 0
          ? 0
          : Math.floor((diffInSeconds % 3600) / 60)
      const seconds = diffInSeconds % 60 <= 0 ? 0 : diffInSeconds % 60

      socket.emit(
        "occupied",
        true,
        `Meeting would begin in ${hours}hrs ${minutes}mins ${seconds}secs`
      )
      return
    }

    if (userId === instructorId && connectedUsers.has(userId)) {
      socket.emit("occupied", true, "Someone has joined as instructor already")
      return
    }

    if (userId === instructorId && !connectedUsers.has(userId)) {
      socket.emit("occupied", false)
      connectedUsers.set(userId, socket.id)
      return
    }

    /*if (!connectedUsers.has(instructorId)) {
      socket.emit(
        "occupied",
        true,
        "Please wait for instructor to join the meeting!"
      )
      return
    }*/

    if (connectedUsers.has(userId)) {
      socket.emit("occupied", true, "A User with this ID already exists")
      returnuserId
    }

    if (kickedUsers.has(userId)) {
      socket.emit(
        "occupied",
        true,
        "You've been restricted from joining this meeting!"
      )
      return
    }

    socket.emit("occupied", false)
    connectedUsers.set(userId, socket.id)
  })

  socket.on("join-room", (roomId, userId, duration) => {
    socket.join(roomId)
    connectedUsers.set(userId, socket.id)

    const worker = new Worker("./worker.js")
    const room = io.sockets.adapter.rooms.get(roomId)
    const numberOfMembers = room ? room.size : 0

    socket.broadcast.to(roomId).emit("user-connected", socket.id)
    io.to(roomId).emit("nom", numberOfMembers)
    //let duration = 7200 // 2hrs
    /*const timerInterval = setInterval(() => {
      if (duration <= 0) {
        clearInterval(timerInterval)
        io.to(roomId).emit("timer", -1)
      } else {
        io.to(roomId).emit("timer", duration--)
      }
    }, 1000)*/

    duration = parseInt(duration) <= 0 ? 7200 : parseInt(duration)
    if (!roomDurations.has(roomId)) {
      worker.postMessage(duration)
      roomDurations.set(roomId, duration)
    }

    worker.on("message", (duration) => {
      if (duration <= 0) {
        roomDurations.delete(roomId)
        for (let [key, id] of kickedUsers.entries()) {
          if (id === roomId) {
            kickedUsers.delete(key)
          }
        }
        io.to(roomId).emit("timer", -1)
      } else {
        io.to(roomId).emit("timer", duration)
      }
    })

    socket.on("check-presentation", () => {
      if (
        roomPresentations[roomId] !== null &&
        roomPresentations[roomId] !== undefined
      ) {
        socket.emit("room-board-on", roomPresentations[roomId])
      }
    })

    socket.on("kick", (userId) => {
      for (let [key, id] of connectedUsers.entries()) {
        if (id === userId) {
          kickedUsers.set(key, roomId)
        }
      }
      socket.broadcast.to(roomId).emit("kick", userId)
    })

    socket.on("mute-all", (value) => {
      socket.broadcast.to(roomId).emit("mute-all", value)
    })

    socket.on("mute-me", (value) => {
      socket.broadcast.to(roomId).emit("mute-me", value)
    })

    socket.on("hide-me", (value) => {
      socket.broadcast.to(roomId).emit("hide-me", value)
    })

    socket.on("user-record", (id, data) => {
      io.to(id).emit("user-record", data)
    })

    socket.on("room-board-on", (roomId, userId) => {
      roomPresentations[roomId] = userId
      socket.broadcast
        .to(roomId)
        .emit("room-board-on", roomPresentations[roomId])
    })

    const closeBoard = (roomId, userId) => {
      if (roomPresentations[roomId] === userId) {
        roomPresentations[roomId] = null
        socket.broadcast.to(roomId).emit("room-board-off", userId)
      }
    }

    socket.on("room-board-off", (roomId, userId) => {
      closeBoard(roomId, userId)
    })

    socket.on("message", (data) => {
      const obj = {
        msg: data.msg,
        username: data.username,
        img: data.img,
        userId: socket.id,
        date: new Date().toLocaleDateString("en-us", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
          timeZone: "Africa/Lagos",
        }),
        utc: Date.now(),
      }
      io.to(roomId).emit("message", obj)
    })

    socket.on("disconnect", () => {
      const num = numberOfMembers > 1 ? numberOfMembers - 1 : numberOfMembers
      socket.broadcast.to(roomId).emit("nom", num)
      socket.broadcast.to(roomId).emit("user-disconnected", socket.id)
      closeBoard(roomId, userId)

      for (let [key, id] of connectedUsers.entries()) {
        if (id === socket.id) {
          connectedUsers.delete(key)
        }
      }
    })

    socket.on("share", () => {
      socket.broadcast.to(roomId).emit("screen-share", userId)
    })
  })
})

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
