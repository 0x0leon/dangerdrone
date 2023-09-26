const express = require('express')
const Tello = require("tello-drone");
const cors = require("cors")
const app = express()

app.use(cors)
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server({
    cors: {
        origin: "http://localhost:3000"
    }
});

const socketIOPort = 5001
const expressPort = 3001



console.log("test")
// All option parameters are optional, default values shown
const drone = new Tello({
    host: "192.168.10.1",     // manually set the host.
    port: "8889",             // manually set the port.
    statePort: "8890",        // manually set the state port.
    skipOK: false,            // dont send the OK message.
})

// Sends a command to the drone

// socke io 

var battery = 0

drone.on("connection", () => {
    console.log("Connected to drone");
});

var stateX = ""
drone.on("state", state => {
    // console.log("Recieved State > ", state);
    io.emit("droneData", state)
    stateX = state
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on("dataX", (data) => {
        console.log(data)

        
    })

    socket.on("up", (data) => {
        drone.send("up", 10)
    })

    socket.on("down", (data) => {
        drone.send("down", 10)
    })

    socket.on("emergency", (data) => {
        drone.send("emergency")
    })


});




app.get('/', (req, res) => {
    drone.send("battery?")

    res.json({ batteryy: battery })
})



app.get('/command/:command', function () {

})




io.listen(socketIOPort, () => {
    console.log(`listening on *: ${socketIOPort}`);
});

app.listen(expressPort, () => {
    console.log(`Example app listening on port ${expressPort}`)
})