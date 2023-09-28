import { useEffect, useState } from 'react';
import { io } from 'socket.io-client'
import { Button, Container } from 'react-bootstrap'
// import 'bootstrap/dist/css/bootstrap.min.css';

const url = "http://localhost:5001"
const socket = io(url)


const App = () => {

	const [connected, setConnected] = useState(false)
	const [droneData, setDroneData] = useState("")

	const sendToDrone = (command) => {
		console.log(command)
		socket.emit("dataX", command)
	}

	useEffect(() => {

		socket.on("connect", (data) => {
			console.log("connected")
			setConnected(true)
		})

		socket.on("droneData", (data) => {
			setDroneData(data)
			// console.log(data)
		})
	})



	return (
		<Container className='m-5'>
			<h1>test</h1>
			<h4>drone battery {droneData['bat']}</h4>
			<h4>drone X {droneData["x"]}</h4>
			<h4>drone Y {droneData["y"]}</h4>
			<h4>drone Z {droneData["z"]}</h4>
			<h4>drone roll {droneData["roll"]}</h4>
			<h4>drone baro {droneData["baro"]}</h4>
			<Button onClick={() => sendToDrone("up")}>up</Button>
			<Button onClick={() => sendToDrone("down")}>down</Button>
			<Button onClick={() => sendToDrone("emergency")}>stop</Button>
		</Container>
	);
}

export default App;
