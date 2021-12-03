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
    var city = $("#city").val().trim();
    locate(city);
}

function locate(city) {
    var geoLoc = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=8d88d70ec92bd345dbcf4b9c1eea0ec4";

    fetch(geoLoc).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                if (data[0].name != undefined) {
                    var name = data[0].name;
                    var lat = data[0].lat.toString();
                    var lon = data[0].lon.toString();
                    search(name, lat, lon);
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

function search(name, lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=8d88d70ec92bd345dbcf4b9c1eea0ec4";

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    var cityStored = {
                        index: "",
                    };
                    for (i = 0; i < searchHistory.city.length && !cityStored.index; i++) {
                        if (name === searchHistory.city[i][0]) {
                            cityStored.index = i;
                        }
                    }

                    if (!cityStored.index) {
                        searchHistory.city.pop();
                    }
                    
                    else {
                        searchHistory.city.splice(cityStored.index, 1);
                    }

                    searchHistory.city.unshift([
                        name,
                        lat,
                        lon
                    ]);
                    localStorage.setItem("history", JSON.stringify(searchHistory));
                    getHistory();
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
$("history").on("click", function(event) {
    console.log(event);
})