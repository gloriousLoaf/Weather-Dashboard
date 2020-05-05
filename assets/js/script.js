// Local time for searched City. This won't work yet, just displays user's local time
let $cityTime = moment().format("LT dddd l");
$("#city-time").text($cityTime);

/* City Search Functions */

// click listener calls searchCity() and soon a function related to the .search-history sidebar
let $clicked = $(".btn");
$clicked.on("click", searchCity);

// searchCity()
function searchCity() {
    // value we want in $city is from a sibling of .btn's parent
    let $city = (($(this).parent()).siblings("#city-search")).val();

    /* Query for Current Weather (#current-view) */
    let firstQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + $city + "&units=imperial&appid=c3632a824cb9d8b82f74d0ec35c2639b";
    $.ajax({
        url: firstQueryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        // vars to hold city-stats values
        let $currentTemp = parseInt(response.main.temp) + "°F";
        let $currentHum = response.main.humidity + "%";
        let $currentWind = parseInt(response.wind.speed) + "mph";

        // display in html
        $("#city-name").text($city);
        $("#temp").text("Temperature: " + $currentTemp);
        $("#humidity").text("Humidity: " + $currentHum);
        $("#wind").text("Wind Speed: " + $currentWind);

        // lat & lon for secondQueryURL below
        let lat = response.coord.lat;
        let lon = response.coord.lon;
        console.log(lat, lon);

        /* Query for One Call API - this will give us our info for 5 Day Forecast cards */
        let secondQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly&units=imperial&appid=c3632a824cb9d8b82f74d0ec35c2639b";
        $.ajax({
            url: secondQueryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            // UV Index is in this response, but we're assigning it to the #current-view area
            let $uv = response.current.uvi;
            $("#uv-index").text("UV Index: " + $uv);

            /* for loop to clean up some of this var assignment and/or .text() methods? */
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
            $("#icon1").attr("src", $icon1URL);
            $("#icon2").attr("src", $icon2URL);
            $("#icon3").attr("src", $icon3URL);
            $("#icon4").attr("src", $icon4URL);
            $("#icon5").attr("src", $icon5URL);

        });
    });

}