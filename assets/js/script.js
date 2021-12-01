var city = {
    name: "",
    lat: "",
    lon: ""
}

var history = {
    city: []
}

function getHistory() {
    history = JSON.parse(localStorage.getItem("history"));
    if (!history.city) {
        history.city = [
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
        ]
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
                if (data.name) {
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
                    history.city.pop();
                    history.city.unshift([
                        city.name,
                        city.lat,
                        city.lon
                    ]);
                    console.log(history);
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