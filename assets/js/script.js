// Local time for searched City. This won't work yet, just displays user's local time
let $cityTime = moment().format("LT dddd l");
$("#city-time").text($cityTime);

/* City Search Functions */

// click listener calls searchCity() and soon a function related to the .search-history sidebar
let $clicked = $(".btn");
$clicked.on("click", searchCity);

// searchCity()
function searchCity() {
    let $city = (($(this).parent()).siblings("#city-search")).val();
    console.log($city);
    let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + $city + "&appid=c3632a824cb9d8b82f74d0ec35c2639b";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
    });
}
