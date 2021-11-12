// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Require Express to run server and routes
const express = require("express");

// Start up an instance of app
const app = express();

/* Dependencies */
const bodyParser = require('body-parser');

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());
// Initialize the main project folder
app.use(express.static('website'));


/* Server port */
const port = 8000;

// Start the server 
const server = app.listen(port, () => {
	console.log(`running on localhost: ${port}`);
})

// Post request
app.post("/addData", (req, res) => {
	// add the req.body to project data.
	const newEnt = {
		city: req.body.city,
		date: req.body.date,
		temp: req.body.temp,
		feeling: req.body.feeling
	}
	projectData = newEnt;
	res.send(projectData);
}) 

// Route to get request
app.get("/getData", (req, res) => {
	// Check if there are entries
	console.log("OK!");
	if (Object.keys(projectData).length !== 0) {
		res.send(projectData);
	} else {
		res.send('false');
	}
})

