# Weather-Journal App Project

## Client side:

The generate button is disabled by default.

Clicking the generate button with an invalid zip code triggers an alert notifying the user that
his input is incorrect.

If a valid input is generated chain() function is called and the promise chain starts.

- getWeather 
- postData 
- fetchData

If the user didn't provide feelings only date and temprature elements will be added.


## Server side:

post route adds the data to the array.

get route sends the last entry as a response.

UPDATE:
Added city entry
Retrieve most recent entry from server if page is refreshed.
"No entries" text is shown if user hasn't entered any entries yet.