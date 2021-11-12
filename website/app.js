/* Global Variables */
const baseURL = "http://api.openweathermap.org/data/2.5/weather?zip=";
const apiKey = 'ffa7192acdb020497a7db0dd2ea52e52';
const zip = document.getElementById("zip");
const feelings = document.getElementById("feelings");
const generate = document.getElementById("generate");


/* Helper functions */
const clearIn = (clearFeelings) => {
	zip.value = '';
	feelings.value = clearFeelings ? '' : feelings.value;
	generate.disabled = true;
}

// Get obj out of response
const getObj = async (response) => {
	try {
		const data = await response.json();
		// Get a readable date string
		const city = data.name;
		const time = data.dt;
		const date = new Date(time * 1000).toLocaleString("en-GB");

		// Get temp. in Cel
		const temp = data.main.temp;

		// Return date and temp. from retrieved data
		return {city: city, date: date.slice(0, date.indexOf(',')), temp: temp};
	} catch(error) {
		return error;
	}
}

/* Main functions*/
// getWthr function sends  req to the api
const getWthr = async (url) => {
	const res = await fetch(url);
	return res;
}

// POST data entered by user
const postData = async (url, data) => {
	const res = await fetch(url, {
		method: "POST",
		credentials: "same-origin",
		headers: {
			"content-Type": "application/json",
		},
		body: JSON.stringify(data)
	});
	try {
		const newData = await res.json();
		return newData;
	} catch(error) {
		return error;
	}
}

// Update UI
const update = (city, date, temp, feeling) => {
	// Store elements in var.
	const cityElm = document.getElementById("city");
	const dateElm = document.getElementById("date");
	const tempElm = document.getElementById("temp");
	const contentElm = document.getElementById("content");

	// Add data
	cityElm.innerHTML = `<p>City: ${city}</p>`;
	dateElm.innerHTML = `<p>Date: ${date}</p>`;
	tempElm.innerHTML = `<p>Temprature: ${temp}&deg;</p>`;
	contentElm.innerHTML = feeling === '' ? '' : `<p>Feeling: ${feeling}</p>`;
}

// Retrieve data
const fetchData = async () => {
	const noEntriesElm = document.getElementById("noEntries");
	const res = await fetch("/getData");
	try {
		const data = await res.json();
		if(data) {
			// Hide text
			noEntriesElm.classList.add("hide");

			update(data.city, data.date, data.temp, data.feeling);
		} else {
			// Show no entries text if there are no entries
			noEntriesElm.classList.remove("hide");
		}
	} catch(error) {
		return error;
	}
}

const chain = (url, feeling) => {
	getWthr(url)
	.then((response) => {
		// Check if get request was successful
		if (!response.ok) {
			throw response;
		}
		// return object
		return getObj(response);
	})
	.then((data) => {
		postData('/addData', {...data, feeling});
	})
	.then(() => {
		fetchData();
	})
	.catch((error) => {
		if (error.status === 404) {
			// zip code isn't in the US
			alert("Please enter a US zip code");
		}
		return error;
	})

}

// callback function when the generate button is clicked
const generateClck = () => {
	let zipCodeInput = zip.value;
	const feelingsInput = feelings.value;

	/* validate zipCode*/
	const zepCodeRGEX = /^[0-9]{5}(?:-[0-9]{4})?$/;
	if (zepCodeRGEX.test(zipCodeInput)) {
		// Create url
		const url = baseURL + zipCodeInput + ',us&appid=' + apiKey;

		// Start chain
		chain(url, feelingsInput);

		// Clear user input
		clearIn(true);
	} else {
		// If the input is invalid alert the user and reset zip
		alert("Please enter a valid zip code");
		clearIn(false);
	}
}

// Check if input is empty
zip.addEventListener("input", () => {
	const input = zip.value;
	// enable button by any input except space
	if (generate.disabled && input.trim() !== '') {
		generate.disabled = false;
	} else if (input.trim() === '') {
		generate.disabled = true;
	}
});


// Handle generate button click
generate.addEventListener("click", generateClck);
generate.disabled = true;

// Check if there are any entries to show
fetchData();