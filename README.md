# Weather Dashboard for Travelers

* A weather dashboard to display current weather plus additional 5-day forecasts for travelers.
* Features a sidebar with search field and recent search history.
* Built with Javascript, jQuery, Moment.js, Bootstrap and OpenWeatherMap API.

## Main View 

* After the user searches for a city, the current weather conditions are displayed in a large card, roughly in the center of the viewport.
* The high and low temperatures, humidity, wind speed and UV index are visible, along with OpenWeatherMap's icon .png to add visual appeal.
* Additionally, the UV index is displayed in a Bootstrap button that changes classes dynamically to appear in the corresponding color scheme used by [Weather.gov](https://www.weather.gov/rah/uv).
  * The button has been stripped of mouse hover and inactive states to avoid confusion, as it does not have any click functions.

## 5 Day Forecast

* Five small cards sit below the main view, displaying the key weather info for the upcoming five days.
* These each feature high and low temperatures, humidity and corresponding weather icons.

## Search Sidebar

* The search field sits atop the sidebar, with the clickable search button appended to it. Search icon from [FontAwesome.com](https://fontawesome.com/).
  * A simple tap of the Enter key also triggers a search.

* When a city is searched, two AJAX queries are sent to **OpenWeatherMap**; the **Current Weather** and the **One Call** APIs.
  * The city name itself is sent to Current Weather to fill much of the Main View card, while **latitude and longitude** coordinates from the Current Weather response are used to query One Call.
  * This second query fills the 5 Day cards plus the UV index for Main View.

* Searches are saved in **local storage** until cleared. More on that below.

### Search History

* Below the search field, a list is filled as each new city query is called by the user.
* Javascript methods and loops are used to prevent any duplicate queries from displaying in this area. Duplicate searches will still update the displayed weather, but not affect search history.
* CSS and Javascript conditions are used to account for first letter capitalization, so that "Chicago", "chicago" and "cHicaGo" are all recognized as the same term. Each of those examples will simply display as "Chicago" to the user.
* Classes are dynamically added to the displayed search terms to make them clickable. Once a past search is displayed, a mouse hover effect is applied to make this visually clear.
* Selecting a city from the search history updates the displayed weather conditions just like a new search query would.
* **When the page is refreshed** any previous queries in local storage are displayed in the history, and the last city called will populate the Main View and 5 Day Forecast cards.

### Clear History Button

* A simple Bootstrap button sits at the bottom of the search history. Clicking this button wipe the local storage and clears the search history fields, but leaves the currently displayed weather information intact.

**Thank you for trying this application!**