var city = {
    name: "",
    lat: "",
    lon: ""
}

var searchHistory = {};

function getHistory() {
    searchHistory = JSON.parse(localStorage.getItem("history"));
    console.log(searchHistory);
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

    for (i = 0; i < searchHistory.city.length; i++) {
        if (searchHistory.city[i].length === 3) {
            var historyEl = $("<button>").addClass("history-btn col-12 p-1 m-2").text(searchHistory.city[i][0]);
            $("#history").append(historyEl);
        }
    }
}

function formSubmitHandler(event) {
    event.preventDefault();
    city.name = $("#city").val().trim();
    locate();
}

function locate() {
    var geoLoc = "http://api.openweathermap.org/geo/1.0/direct?q=" + city.name + "&limit=5&appid=8d88d70ec92bd345dbcf4b9c1eea0ec4";

    fetch(geoLoc).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                if (data[0].name != undefined) {
                    city.name = data[0].name;
                    city.lat = data[0].lat.toString();
                    city.lon = data[0].lon.toString();
                    search();
                }
                else {
                    alert("No location found for " + city.name);
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

function search() {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        city.lat + "&lon=" + city.lon + "&exclude=minutely,hourly&appid=8d88d70ec92bd345dbcf4b9c1eea0ec4";

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    searchHistory.city.pop();
                    searchHistory.city.unshift([
                        city.name,
                        city.lat,
                        city.lon
                    ]);
                    localStorage.setItem("history", JSON.stringify(searchHistory));
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

getHistory();

$("form").on("submit", formSubmitHandler);