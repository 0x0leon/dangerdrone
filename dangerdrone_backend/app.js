const express = require('express')
const Tello = require("tello-drone");
const cors = require("cors")
const app = express()
const http = require('http')
const { Server } = require("socket.io")

const server = http.createServer(app)
app.use(cors)

// io object for events 
const io = new Server({
    cors: {
        origin: "http://localhost:3000"
    }
});

// port socket server
const socketIOPort = 5001

// port express server
const expressPort = 3001

// All option parameters are optional, default values shown
const drone = new Tello({
    host: "192.168.10.1",     // manually set the host.
    port: "8889",             // manually set the port.
    statePort: "8890",        // manually set the state port.
    skipOK: false,            // dont send the OK message.
})



drone.on("connection", () => {
    console.log("Connected to drone");
});

var stateX = ""
drone.on("state", state => {
    // console.log("Recieved State > ", state);

    // emit state
    io.emit("droneData", state)
    // stateX = state
});

// get if there is connection to frontend 
io.on('connection', (socket) => {

    // print when user connected
    console.log('a user connected');

    // check on dataX receive
    socket.on("dataX", (data) => {
        console.log(data)
    })
    socket.on("up", (data) => {
        // console.log("takeoff")
        drone.send("command")
        drone.send("takeoff")
    })

    socket.on("down", (data) => {
        console.log("down")
        drone.send("down", 10)
    })

    socket.on("land", (data) => {
        drone.send("command")
        drone.send("land")
    })

    socket.on("emergency", (data) => {
        drone.send("command")
        drone.send("emergency")
    })


});

// socketio server
io.listen(socketIOPort, () => {
    console.log(`listening on *: ${socketIOPort}`);
});


// express server
app.listen(expressPort, () => {
    console.log(`Example app listening on port ${expressPort}`)
})