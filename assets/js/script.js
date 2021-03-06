/* On first load or refresh */
$(document).ready(function () {

    // if localStorage is not empty, call fillFromStorage()
    if (localStorage.getItem("cities")) {
        fillFromStorage();
    }
    // otherwise, empty storage means nothing happens until user generates a search

    // fillFromStorage fills sidebar with anthything in localStorage
    function fillFromStorage() {
        // grab data, parse and push into searchHistory[], see line 206
        searchHistory = localStorage.getItem("cities", JSON.stringify(searchHistory));
        searchHistory = JSON.parse(searchHistory);
        // iterate through searchHistory, displaying in HTML
        for (i = 0; i <= searchHistory.length - 1; i++) {
            $("#Recent-" + i).text(searchHistory[i]);
        }

        // with sidebar populated, use highest index in searchHistory
        // to display weather from last city typed into search bar
        // similar method to searchPast(), see line 243
        // var to hold last index value
        let lastIndex = (searchHistory.length - 1);
        // concat a jQuery selector & click listener that calls searchPast()
        $("#Recent-" + lastIndex).on("click", searchPast);
        // .trigger() method that 'clicks' on that #Recent-x
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
// add Enter key for searching as well
$("input").keyup(function () {
    if (event.key === "Enter") {
        $clicked.click();
    }
})

// searchCity() fills the Main View sections - #current-view card & #five-day cards
function searchCity() {
    // value for new search from input is from a sibling of .btn's parent
    // making it lowercase to help check for dupes later, see line 217
    let $city = (($(this).parent()).siblings("#city-search")).val().toLowerCase();
    console.log($city);

    // empty search bar with setTimeout()
    // we're also capturing this value in searchSave() line 209
    // so we need it to not clear so fast that it doesn't get captured there
    function clear() {
        $("#city-search").val("");
    }
    setTimeout(clear, 300);

    /* Query for Current Weather (#current-view) */
    let firstQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
        $city + "&units=imperial&appid=c3632a824cb9d8b82f74d0ec35c2639b";
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

        // lat & lon for secondQueryURL, directly below
        let lat = response.coord.lat;
        let lon = response.coord.lon;

        /* Query for One Call API - info for 5 Day Forecast cards */
        let secondQueryURL =
            "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon +
            "&exclude=hourly&units=imperial&appid=c3632a824cb9d8b82f74d0ec35c2639b";
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
            // originally one line like $uvIndex.addClass().removeClass() but just too long
            if ($uv <= 2) {
                $uvIndex.addClass("btn-success");
                $uvIndex.removeClass("btn-warning btn-hazard btn-danger btn-climate-change");
            }
            else if ($uv <= 5) {
                $uvIndex.addClass("btn-warning");
                $uvIndex.removeClass("btn-success btn-hazard btn-danger btn-climate-change");
            }
            // .btn-hazard is a custom class, riffing on Bootsrap, see style.css
            else if ($uv <= 7) {
                $uvIndex.addClass("btn-hazard");
                $uvIndex.removeClass("btn-success btn-warning btn-danger btn-climate-change");
            }
            else if ($uv <= 10.99) {
                $uvIndex.addClass("btn-danger");
                $uvIndex.removeClass("btn-success btn-warning btn-hazard btn-climate-change");
            }
            // .btn-climate-change, like .btn-hazard, is custom
            // and it's cheeky because it is sad :(
            else if ($uv >= 11) {
                $uvIndex.addClass("btn-climate-change");
                $uvIndex.removeClass("btn-success btn-warning btn-hazard btn-danger");
            }

            // Date Assignment - convert UNIX response to human readable
            // array to hold timestamps
            let days = [];
            // get UNIX dt from response, skipping [0] as it is current day
            for (i = 1; i < 6; i++) {
                days[i] = response.daily[i].dt;
            }
            // filter out that empty index 0, thanks to Dominik
            // https://stackoverflow.com/users/9251185/dominik
            days = days.filter(item => item);
            // convert, extract, display:
            for (i = 0; i < days.length; i++) {
                // first convert each index to moment Obj w/ .unix()
                days[i] = moment.unix(days[i]);
                // then extract just the MM/DD/YYYY human readable date
                days[i] = days[i].format("l");
                // display dates in HTML
                $("#day-" + i).text(days[i]);
            }

            // array for highTemps on cards, parsed off decimals
            let highTemps = [];
            // same method for skipping and removing current day info as above
            for (i = 1; i < 6; i++) {
                highTemps[i] = parseInt(response.daily[i].temp.max) + "°F";
            }
            highTemps = highTemps.filter(item => item);
            // loop through and display
            for (i = 0; i < highTemps.length; i++) {
                $("#high" + i).text("High: " + highTemps[i]);
            }

            // same process for lows as with highs
            let lowTemps = [];
            for (i = 1; i < 6; i++) {
                lowTemps[i] = parseInt(response.daily[i].temp.min) + "°F";
            }
            lowTemps = lowTemps.filter(item => item);
            for (i = 0; i < lowTemps.length; i++) {
                $("#low" + i).text("Low: " + lowTemps[i]);
            }

            // and again for humidity
            let hums = [];
            for (i = 1; i < 6; i++) {
                hums[i] = response.daily[i].humidity + "%";
            }
            hums = hums.filter(item => item);
            for (i = 0; i < hums.length; i++) {
                $("#hum" + i).text("Humidity: " + hums[i]);
            }

            // and again for icons, w/ extra step
            let icons = [];
            // each icon will need its own concatenated URL
            let iconsURL = [];
            for (i = 1; i < 6; i++) {
                icons[i] = response.daily[i].weather[0].icon;
            }
            icons = icons.filter(item => item);
            // filling iconsURL[] w/ unique URLs using icons[] indices
            for (i = 0; i < icons.length; i++) {
                iconsURL[i] = "https://openweathermap.org/img/w/" + icons[i] + ".png";
            }
            for (i = 0; i < iconsURL.length; i++) {
                $("#icon" + i).attr({ "src": iconsURL[i], "alt": "Daily Weather Icon" });
            }
        });
    });
}

// array to use in searchSave(), searchDisplay() & clearHistory()
let searchHistory = [];

// searchSave() uses localStorage to manage recently searched cities in sidebar
function searchSave() {
    // same jQuery selector from searchCity() puts value into $newCity
    let $newCity = (($(this).parent()).siblings("#city-search")).val().toLowerCase();
    // push $newCity into searchHistory, but it may be a dupe so...
    searchHistory.push($newCity);
    // new Set to keep only unique values, spread operator to make that an array
    // thanks to youtuber Techsith for the tutorial:
    // https://www.youtube.com/watch?v=dvPybpgk5Y4
    searchHistory = [...new Set(searchHistory)];
    // put in localStorage
    localStorage.setItem("cities", JSON.stringify(searchHistory));
    // display in HTML, see direcly below
    searchDisplay();
}

// called by searchSave() after click listener, adds cities to sidebar
function searchDisplay() {
    // for loop to create new vars & concat them into jQuery selectors
    for (i = 0; i <= searchHistory.length - 1; i++) {
        // iterate through, displaying in HTML
        $("#Recent-" + i).text(searchHistory[i]);
        // add .past class to create listener (below),
        // hover effect & styles, see styles.css
        $("#Recent-" + i).addClass("past");
    }
}

// add listeners for loading weather from history
// wrapped a <section> around search history, since the .past 
// classes are added after document is fully loaded. bubble up!
$("section").on("click", ".past", searchPast);

// searchPast() copies text value of the clicked button,
// puts it in the input bar, then runs searchCity() via triggered click
function searchPast() {
    // var for text of past city
    let $oldCity = $(this).text();
    // put it in the input field
    $("#city-search").val($oldCity);
    // this triggers the original click listener, above searchCity()
    $clicked.trigger("click");
}

// Clearing the sidebar

// clearHistory() clears local storage, empties sidebar history
function clearHistory() {
    localStorage.clear();
    // empty main array
    searchHistory = [];
    // set first spot to default text & remove .past
    $("#Recent-0").text("Your Search History").removeClass("past");

    // loop to put reinsert blankspace to keep size correct
    for (i = 1; i < 7; i++) {
        $("#Recent-" + i).html("&nbsp;");
        // remove .past clears listener, hover effect & styling
        $("#Recent-" + i).removeClass("past");
    }
}

// .clear-schedule listener calls clearSchedule()
let $clear = $("#clear-history");
$clear.on("click", clearHistory);