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
        lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly&appid=8d88d70ec92bd345dbcf4b9c1eea0ec4";

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    searchedCity.conditions = data;

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

                    if(cityStoredAt || cityStoredAt === 0) {
                        searchHistory.city.splice(cityStoredAt, 1);
                    }

                    else {  
                        searchHistory.city.pop();
                    }

                    // Places most recent city at front of array
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
    var boxEl = $("#conditions").addClass("p-1 m-1").css("border", "1px black solid");
    boxEl.empty();
    var nameText = $("<h1>").text(searchedCity.name + " add date here");
    var tempText = $("<h2>").text("Temp: " + searchedCity.conditions.current.temp);
    var windText = $("<h2>").text("Wind: " + searchedCity.conditions.current.wind_speed);
    var humidityText = $("<h2>").text("Humidity: " + searchedCity.conditions.current.humidity);
    var UVindexText = $("<h2>").text("UV Index: " + searchedCity.conditions.current.uvi);
    boxEl.append(nameText, tempText, windText, humidityText, UVindexText);
}

getHistory();

$("form").on("submit", formSubmitHandler);
$("history").on("click", function (event) {
})