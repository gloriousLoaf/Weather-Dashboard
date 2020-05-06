/* On first load or refresh */
$(document).ready(function () {

    // if localStorage is not empty, call fillFromStorage()
    if (localStorage.getItem("cities")) {
        fillFromStorage();
    }
    // otherwise, empty storage means nothing happens until user generates a search

    // fillFromStorage fills sidebar with anthything in localStorage
    function fillFromStorage() {
        // grab data, parse and push into searchHistory[], see                  line 176??
        searchHistory = localStorage.getItem("cities", JSON.stringify(searchHistory));
        searchHistory = JSON.parse(searchHistory);
        // iterate through searchHistory, displaying in HTML
        for (i = 0; i <= searchHistory.length; i++) {
            $("#Recent-" + i).text(searchHistory[i]);
        }

        // with sidebar populated, use highest index in searchHistory
        // to display weather from last city typed into search bar
        // similar method to searchPast(), see line                              198?
        // var to hold last index value
        let lastIndex = (searchHistory.length - 1);
        // concat a jQuery selector & click listener that calls searchPast()
        $("#Recent-" + lastIndex).on("click", searchPast);
        // .trigger() method that creates a click on that #Recent-x
        $("#Recent-" + lastIndex).trigger("click");
    }
});

// Today's Date in #current-view card
let $cityDate = moment().format("l");
$("#city-date").text($cityDate);

/* City Search Functions */

// click listener calls searchCity() and soon a function related to the .search-history sidebar
let $clicked = $(".search-button");
$clicked.on("click", searchCity);
$clicked.on("click", searchSave);

// searchCity() fills the Main View sections - #current-view card & #five-day cards
function searchCity() {
    // value for new search from input is from a sibling of .btn's parent
    let $city = (($(this).parent()).siblings("#city-search")).val();

    // empty search bar with setTimeout()
    // we're also capturing this value in searchSave()                                  line xxx
    // so we need it to not clear so fast that it doesn't get captured there
    function clear() {
        $("#city-search").val("");
    }
    setTimeout(clear, 600);

    /* Query for Current Weather (#current-view) */
    let firstQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + $city + "&units=imperial&appid=c3632a824cb9d8b82f74d0ec35c2639b";
    $.ajax({
        url: firstQueryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        // vars to hold city-stats, current temp, humidity, wind & icon
        let $currentTemp = parseInt(response.main.temp) + "°F";
        let $currentHum = response.main.humidity + "%";
        let $currentWind = parseInt(response.wind.speed) + "mph";
        let $currentIcon = response.weather[0].icon;
        let $currentIconURL = "http://openweathermap.org/img/w/" + $currentIcon + ".png";

        // display in html
        $("#city-name").text($city);
        $("#temp").text("Temperature: " + $currentTemp);
        $("#humidity").text("Humidity: " + $currentHum);
        $("#wind").text("Wind Speed: " + $currentWind);
        $("#current-icon").attr({ "src": $currentIconURL, "alt": "Current Weather Icon" });

        // lat & lon for secondQueryURL below
        let lat = response.coord.lat;
        let lon = response.coord.lon;

        /* Query for One Call API - this will give us our info for 5 Day Forecast cards */
        let secondQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly&units=imperial&appid=c3632a824cb9d8b82f74d0ec35c2639b";
        $.ajax({
            url: secondQueryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            // UV Index is in this response, but we're assigning it to the #current-view area
            // both value and btn classes will update to diplay UV index color per:
            // https://www.weather.gov/rah/uv
            let $uv = response.current.uvi;
            // var for displaying in html & grabbing the right color class
            let $uvIndex = $("#uv-index");
            $uvIndex.text($uv);
            // if conditionals to add / remove btn classes, changing color
            if ($uv <= 2) {
                $uvIndex.addClass("btn-success").removeClass("btn-warning btn-hazard btn-danger");
            }
            else if ($uv <= 5) {
                $uvIndex.addClass("btn-warning").removeClass("btn-success btn-hazard btn-danger");
            }
            // .btn-hazard is a custom class, riffing on Bootsrap, see style.css
            else if ($uv <= 7) {
                $uvIndex.addClass("btn-hazard").removeClass("btn-success btn-warning btn-danger");
            }
            else if ($uv <= 10) {
                $uvIndex.addClass("btn-danger").removeClass("btn-success btn-warning btn-hazard");
            }

            /* THe NEXT 90 LINES LOOK CRAZY! for-loops to clean it up some?
            see loop in searchDisplay() var */

            // Date Assignment - converting UNIX times in response 
            // to human readable w/ moment.js
            // get UNIX dt from response
            let $day1 = response.daily[1].dt;
            // convert to moment Obj
            $day1 = moment.unix($day1);
            // extract just the MM/DD/YYYY human readable date
            $day1 = $day1.format("l");
            // repeat for the rest of the 5 Day cards
            let $day2 = response.daily[2].dt;
            $day2 = moment.unix($day2);
            $day2 = $day2.format("l");
            let $day3 = response.daily[3].dt;
            $day3 = moment.unix($day3);
            $day3 = $day3.format("l");
            let $day4 = response.daily[4].dt;
            $day4 = moment.unix($day4);
            $day4 = $day4.format("l");
            let $day5 = response.daily[5].dt;
            $day5 = moment.unix($day5);
            $day5 = $day5.format("l");

            // display dates in HTML
            $("#day-1").text($day1);
            $("#day-2").text($day2);
            $("#day-3").text($day3);
            $("#day-4").text($day4);
            $("#day-5").text($day5);

            // vars for highTemps on cards
            let $highTemp1 = parseInt(response.daily[1].temp.max) + "°F";
            let $highTemp2 = parseInt(response.daily[2].temp.max) + "°F";
            let $highTemp3 = parseInt(response.daily[3].temp.max) + "°F";
            let $highTemp4 = parseInt(response.daily[4].temp.max) + "°F";
            let $highTemp5 = parseInt(response.daily[5].temp.max) + "°F";
            // display in HTML
            $("#high1").text("High: " + $highTemp1);
            $("#high2").text("High: " + $highTemp2);
            $("#high3").text("High: " + $highTemp3);
            $("#high4").text("High: " + $highTemp4);
            $("#high5").text("High: " + $highTemp5);

            // vars for lowTemps
            let $lowTemp1 = parseInt(response.daily[1].temp.min) + "°F";
            let $lowTemp2 = parseInt(response.daily[2].temp.min) + "°F";
            let $lowTemp3 = parseInt(response.daily[3].temp.min) + "°F";
            let $lowTemp4 = parseInt(response.daily[4].temp.min) + "°F";
            let $lowTemp5 = parseInt(response.daily[5].temp.min) + "°F";
            //display
            $("#low1").text("Low: " + $lowTemp1);
            $("#low2").text("Low: " + $lowTemp2);
            $("#low3").text("Low: " + $lowTemp3);
            $("#low4").text("Low: " + $lowTemp4);
            $("#low5").text("Low: " + $lowTemp5);

            // vars for humidity
            let $hum1 = response.daily[1].humidity + "%";
            let $hum2 = response.daily[2].humidity + "%";
            let $hum3 = response.daily[3].humidity + "%";
            let $hum4 = response.daily[4].humidity + "%";
            let $hum5 = response.daily[5].humidity + "%";
            // display
            $("#hum1").text("Humidity: " + $hum1);
            $("#hum2").text("Humidity: " + $hum2);
            $("#hum3").text("Humidity: " + $hum3);
            $("#hum4").text("Humidity: " + $hum4);
            $("#hum5").text("Humidity: " + $hum5);

            // vars for weather icons
            let $icon1 = response.daily[1].weather[0].icon;
            let $icon2 = response.daily[2].weather[0].icon;
            let $icon3 = response.daily[3].weather[0].icon;
            let $icon4 = response.daily[4].weather[0].icon;
            let $icon5 = response.daily[5].weather[0].icon;
            // get icons from website
            let $icon1URL = "http://openweathermap.org/img/w/" + $icon1 + ".png";
            let $icon2URL = "http://openweathermap.org/img/w/" + $icon2 + ".png";
            let $icon3URL = "http://openweathermap.org/img/w/" + $icon3 + ".png";
            let $icon4URL = "http://openweathermap.org/img/w/" + $icon4 + ".png";
            let $icon5URL = "http://openweathermap.org/img/w/" + $icon5 + ".png";
            // display in HTML
            $("#icon1").attr({ "src": $icon1URL, "alt": "Day 1 Icon" });
            $("#icon2").attr({ "src": $icon2URL, "alt": "Day 2 Icon" });
            $("#icon3").attr({ "src": $icon3URL, "alt": "Day 3 Icon" });
            $("#icon4").attr({ "src": $icon4URL, "alt": "Day 4 Icon" });
            $("#icon5").attr({ "src": $icon5URL, "alt": "Day 5 Icon" });
        });
    });
}

// array to use in searchSave() & searchDisplay()
let searchHistory = [];

// searchSave() uses localStorage to manage recently searched cities in sidebar
function searchSave() {
    // same jQuery selector from searchCity() puts value into $newCity
    let $newCity = (($(this).parent()).siblings("#city-search")).val();
    // push $newCity into searchHistory, but it may be a dupe so...
    searchHistory.push($newCity);
    // new Set to keep only unique values, spread operator to make that an array
    // thanks to youtuber Techsith for the tutorial: https://www.youtube.com/watch?v=dvPybpgk5Y4
    searchHistory = [...new Set(searchHistory)];
    // put in localStorage
    localStorage.setItem("cities", JSON.stringify(searchHistory));
    // display in HTML, see below
    searchDisplay();
}

// called by searchSave() after click listener, adds cities to sidebar
function searchDisplay() {
    // for loop to create new vars & concat them into jQuery selectors
    for (i = 0; i <= searchHistory.length; i++) {
        // iterate through, displaying in HTML
        $("#Recent-" + i).text(searchHistory[i]);
    }
}

// add listeners for loading weather from history
let $pastClick = $(".past");
$pastClick.on("click", searchPast);

// searchPast() copies text value of the clicked button,
// puts in the input bar, then runs searchCity() via triggered click
function searchPast() {
    // var for text of past city
    let $oldCity = $(this).text();
    // put it in the input field
    $("#city-search").val($oldCity);
    // this triggers the original click listener, above searchCity()
    $clicked.trigger("click");
}


/* CODE GRAVEYARD */
// empty for now... wait 'til i start trying to loop the ajax stuff