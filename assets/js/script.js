var search = {
    history: []
}

function getHistory () {
   search.history =JSON.parse(localStorage.getItem("search"));
   console.log("history", search.history);
}

function search() {
    weatherApi = 
}

getHistory();