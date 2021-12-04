var searchHistory = {};

var searchedCity = {
    name: '',
    conditions: ''
}

function getHistory() {
    searchHistory = JSON.parse(localStorage.getItem("history"));
    if (!searchHistory) {
        searchHistory = {
            city: [
                "placeholder",
                "placeholder",
                "placeholder",
                "placeholder",
                "placeholder",
                "placeholder",
                "placeholder",
                "placeholder"
            ]
        }
    }

    $("#history").empty();
    for (i = 0; i < searchHistory.city.length; i++) {
        if (searchHistory.city[i].length === 3) {
            var historyEl = $("<button>").addClass("history-btn col-12 p-1 m-2").text(searchHistory.city[i][0]);
            $("#history").append(historyEl);
        }
    }
}

function formSubmitHandler(event) {
    event.preventDefault();
    searchedCity.name = $("#city").val().trim();
    locate();
}

function locate() {
    var geoLoc = "http://api.openweathermap.org/geo/1.0/direct?q=" + searchedCity.name + "&limit=5&appid=8d88d70ec92bd345dbcf4b9c1eea0ec4";

    fetch(geoLoc).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                if (data[0].name != undefined) {
                    searchedCity.name = data[0].name;
                    var lat = data[0].lat.toString();
                    var lon = data[0].lon.toString();
                    search(lat, lon);
                }
                else {
                    alert("No location found for " + city);
                }
            })
        }
        else {
            alert("Please enter a city into the search bar");
        }
    })
        .catch(function (error) {
            alert("Could not connect to openweathermap.org");
        });
}

function search(lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly,alerts&appid=8d88d70ec92bd345dbcf4b9c1eea0ec4";

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    searchedCity.conditions = data;
                    console.log(data);
                    // Checks if city already exists in history
                    var cityStoredAt = "";
                    for (i = 0; i < searchHistory.city.length && !cityStoredAt; i++) {
                        console.log(i);
                        console.log(searchHistory.city[i][0]);
                        if (searchedCity.name === searchHistory.city[i][0]) {
                            cityStoredAt = i;
                            console.log(cityStoredAt);
                        }
                    }

                    // if city is already in history, remove it
                    if (cityStoredAt || cityStoredAt === 0) {
                        searchHistory.city.splice(cityStoredAt, 1);
                    }

                    // if city is not in history removes last city in history
                    else {
                        searchHistory.city.pop();
                    }

                    // Places most recent searched city at front of array
                    searchHistory.city.unshift([
                        searchedCity.name,
                        lat,
                        lon
                    ]);

                    localStorage.setItem("history", JSON.stringify(searchHistory));
                    getHistory();
                    displayConditions();
                });
            }
            else {
                alert("Something went wrong");
            }
        })
        .catch(function (error) {
            alert("Could not connect to openweathermap.org");
        });
}

function displayConditions() {
    var boxEl = $("#conditions").addClass("p-1").css("border", "1px black solid");
    boxEl.empty();
    var nameText = $("<h2>").text(searchedCity.name + " add date here");
    var tempText = $("<p>").text("Temp: " + searchedCity.conditions.current.temp + " F");
    var windText = $("<p>").text("Wind: " + searchedCity.conditions.current.wind_speed + " MPH");
    var humidityText = $("<p>").text("Humidity: " + searchedCity.conditions.current.humidity + " %");
    var UVindexText = $("<p>").text("UV Index: " + searchedCity.conditions.current.uvi);
    boxEl.append(nameText, tempText, windText, humidityText, UVindexText);
    displayForecast();
}

function displayForecast() {
    var forecastEL = $("#forecast").addClass("d-flex justify-content-between row p-1");
    var headerEl = $("<h3>").text("5-Day Forecast");

    forecastEL.append(headerEl);

    var daysEl = [];
    for (i = 0; i < 5; i++) {
        daysEl[i] = $("<div>").addClass("forecast-card col-2 p-1 m-1");
        var dateText = $("<h4>").text("add date");
        var tempText = ($("<p>")).text("Temp: " + searchedCity.conditions.daily[i].temp.day + " F");
        var windText = ($("<p>")).text("Wind: " + searchedCity.conditions.daily[i].wind_speed + " MPH");
        var humidityText = ($("<p>")).text("Humidity: " + searchedCity.conditions.daily[i].humidity + " %");
        daysEl[i].append(dateText, tempText, windText, humidityText);
        forecastEL.append(daysEl[i]);
    }
}

getHistory();

$("form").on("submit", formSubmitHandler);
$("history").on("click", function (event) {
})