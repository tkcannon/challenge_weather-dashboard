var searchHistory = {};

var searchedCity = {
    name: '',
    conditions: ''
}

var day = dayjs();

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
            var historyEl = $("<button>").addClass("history-btn col-12 p-1 mb-3").text(searchHistory.city[i][0]);
            $("#history").append(historyEl);
        }
    }
}

function formSubmitHandler(event) {
    event.preventDefault();
    searchedCity.name = $("#form-input").val().trim();
    $("#form-input").val("");
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
                        if (searchedCity.name === searchHistory.city[i][0]) {
                            cityStoredAt = i;
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
    var conditions = searchedCity.conditions.current;
    var boxEl = $("#conditions").addClass("p-2 mt-2 mb-3").css("border", "1px black solid");
    boxEl.empty();
    var iconEl = $("<img>").attr("src", getIconSrc(conditions.weather[0].icon));
    var nameText = $("<h2>").text(searchedCity.name + " (" + day.format("MM/DD/YYYY") + ")");
    nameText.append(iconEl);
    var tempText = $("<p>").text("Temp: " + conditions.temp + " \u00b0F");
    var windText = $("<p>").text("Wind: " + conditions.wind_speed + " MPH");
    var humidityText = $("<p>").text("Humidity: " + conditions.humidity + " %");
    var UVindexText = $("<p>").text("UV Index: " + conditions.uvi);
    boxEl.append(nameText, tempText, windText, humidityText, UVindexText);
    displayForecast();
}

function displayForecast() {
    var forecastEL = $("#forecast");
    forecastEL.empty();
    var headerEl = $("<h3>").text("5-Day Forecast");
    var cardsEl = $("<div>").addClass("d-flex justify-content-between")

    var daysEl = [];
    for (i = 0; i < 5; i++) {
        day = day.add(1, "day");
        daysEl[i] = $("<div>").addClass("forecast-card col-2 p-2");
        var dateText = $("<h4>").text(day.format("MM/DD/YYYY"));
        var iconEl = $("<img>").attr("src", getIconSrc(searchedCity.conditions.daily[i].weather[0].icon));
        var tempText = ($("<p>")).text("Temp: " + searchedCity.conditions.daily[i].temp.day + " \u00b0F");
        var windText = ($("<p>")).text("Wind: " + searchedCity.conditions.daily[i].wind_speed + " MPH");
        var humidityText = ($("<p>")).text("Humidity: " + searchedCity.conditions.daily[i].humidity + " %");
        daysEl[i].append(dateText, iconEl, tempText, windText, humidityText);
        cardsEl.append(daysEl[i]);
    }
    forecastEL.append(headerEl, cardsEl);
}

function getIconSrc(id) {
    return "http://openweathermap.org/img/wn/" + id + ".png"
}

getHistory();

$("form").on("submit", formSubmitHandler);

$("#history").on("click", function (event) {
    var cityName = event.target.textContent;
    for (let i = 0; i < searchHistory.city.length; i++) {
        if (searchHistory.city[i][0] === cityName) {
            searchedCity.name = cityName;
            search(searchHistory.city[i][1], searchHistory.city[i][2]);
            break;
        }
    }
})