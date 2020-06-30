// Listener event for any city items in the list to allow for data reading of previously searched cities
$("#cityList").on("click", "li", function(){
    console.log("listen to on click event")
    displayWeather($(this).text());
});
// global variable for array of searched cities saved in local storeage
var savedCities = JSON.parse(localStorage.getItem('cities')) || [];
loadCities();

// Load and previously searched cities that were saved in local storage and display them
function loadCities(){
    var savedCities = JSON.parse(localStorage.getItem('cities')) || [];
    var searchEl = document.getElementById("cityList");
    for(var i = 0; i< savedCities.length; i++){
        var cityEl = document.createElement("li");
        cityEl.className = "searchedCity list-group-item";
        cityEl.innerHTML = savedCities[i];
        searchEl.appendChild(cityEl);
    }
}

// save array of searched cities into local storage
function saveCities(){
    localStorage.setItem("cities", JSON.stringify(savedCities));
}
// function applied only when search bar is used to search for a city's weather conditions
function  citySearch(){
    var searchEl = document.getElementById("cityList");
    var cityVal = document.getElementById("searchCity").value;
    // Check to see if city value was empty when search button was clicked
    if(cityVal === ""){
        alert("Please enter a valid city");
    }
    else{
        //Turn entered city value into all lowercase letters
        cityVal = cityVal.toLowerCase();
        // save initial letter as capital letter
        var upper = cityVal.charAt(0).toUpperCase();
        //Remove initial letter from entered city's value
        cityVal = cityVal.slice(1);
        //concatenate initial capital letter with the remainder of the city's value
        cityVal = upper+cityVal;
        console.log(cityVal)
        var weekEl = document.getElementById("weekWeather");
        // clear any previous results
        clearResults();
        var todayEl = document.getElementById("todayWeather");
        var todayDate = moment().format('l');
        // reset search bar
        document.getElementById("searchCity").value = "";
        var exist = false;
        // Loop through existing list of searched cities to see if new value is a duplicate
        for (var i =0; i < searchEl.childNodes.length; i++){
            console.log(searchEl.childNodes[i].innerHTML);
            if( cityVal === searchEl.childNodes[i].innerHTML){
                exist = true;
            }
        }
        console.log(searchEl);
        // Create new list element for new city entered if it does not exist already
        if(!exist){
            var cityEl = document.createElement("li");
            cityEl.className = "searchedCity list-group-item";
            cityEl.innerHTML = cityVal;
            searchEl.appendChild(cityEl);
            //add new city to local array
            savedCities.push(cityVal);
            // save new array of searched cities
            saveCities();
        }       
        //todayEl.innerHTML = "<h2>"+cityVal+ " ("+todayDate+")</h2>";
        //Run function to display weather for entered city
        displayWeather(cityVal);
    }
    
}
// To be used to reset fields in between different cities being selected so that they replace each other and don't add to each other
function clearResults(){
    var weekEl = document.getElementById("weekWeather");
    weekEl.innerHTML = "";
    var todayEl = document.getElementById("todayWeather");
    todayEl.innerHTML = "";
}

//Display current and forecasted weather for selected city
function displayWeather(selectedCity){
    clearResults();
    var innerTodayContent = "";
    var innerWeekContent = "";
    var uv = "";
    var todayDate = moment().format('l');
    var weekEl = document.getElementById("weekWeather");
    var todayEl = document.getElementById("todayWeather");
    
    // API call for current weather of city
    fetch(
        'https://api.openweathermap.org/data/2.5/weather?q=' + selectedCity + '&appid=0d3489588c8dc1cc4818f8f7817f20e1&units=imperial'
    )
    .then(function(todayResponse){
        return todayResponse.json();
    })
    // Read and organize needed weather data from API call for current weather conditions of city
    .then(function(todayResponse){
        
        var weatherIcon = todayResponse.weather[0].icon;
        innerTodayContent = "<h2>"+selectedCity+ " ("+todayDate+")" + '<img src="http://openweathermap.org/img/w/'+ weatherIcon + '.png" /></h2>';
        var tempVal = todayResponse.main.temp;
        innerTodayContent += "<p>Temperature: " + tempVal + "°F</p>";
        var humidityVal = todayResponse.main.humidity;
        innerTodayContent += "<p>Humidity: " + humidityVal + "%</p>";
        var windSpVal = todayResponse.wind.speed;
        innerTodayContent +="<p>Wind Speed: " + windSpVal + " MPH</p>";
    
        return fetch(
            'https://api.openweathermap.org/data/2.5/forecast?q='+ selectedCity+'&appid=0d3489588c8dc1cc4818f8f7817f20e1&units=imperial'
        )
    })
    .then(function(response){
       // console.log(response);
        return response.json();
    })
    // Organize returned data from API call to display forecasted weather. Creating innerHTML content
    .then(function(response){
        innerWeekContent += '<h2 class="w-100 mt-3">5-Day Forecast:</h2>';
        for(var i = 0; i< 5; i++){
            var date = moment().add(i+1,"day").format("l");
            var temp = response.list[i].main.temp;
            var humidity = response.list[i].main.humidity;
            var wind = response.list[i].wind.speed;
            var icon = response.list[i].weather[0].icon;
            innerWeekContent += '<div class="card mr-2 bg-primary text-white p-2"><h3>'+ date +'</h3>'+
            '<img src="http://openweathermap.org/img/w/'+ icon+'.png" class="w-25" /><p>Temperatue: '+temp+'°F<br/>Humidity: '+
            humidity+'%</p></div>';
        }
        weekEl.innerHTML = innerWeekContent;
    })

    // Run an API call on for the current weather of the city 
    fetch(
        'https://api.openweathermap.org/data/2.5/weather?q=' + selectedCity + '&appid=0d3489588c8dc1cc4818f8f7817f20e1&units=imperial'
    )
    .then(function(locationResponse){
        return locationResponse.json();
    })
    // Gather the lattitude and longitude of the city to use for uv index API call
    .then(function(locationResponse){
        console.log(locationResponse.coord);
        var lon = locationResponse.coord.lon;
        var lat = locationResponse.coord.lat;
        
        return fetch('http://api.openweathermap.org/data/2.5/uvi?&lat='+lat+'&lon='+lon+ '&appid=0d3489588c8dc1cc4818f8f7817f20e1&units=imperial');
    }
    )
    .then(function(uvResponse){
        //console.log(response.json().value)
        return uvResponse.json();
    })
    //Read and add UV Index information to content to be used for today's weather element's innerHTML
    .then(function(uvResponse){
        console.log(uvResponse.value)
        var uv = uvResponse.value;
        innerTodayContent += "<p>UV Index: "
        //This if/else condition will be used to determine the grade of the UV Index
        if(uv <= 3){
            innerTodayContent += '<span class=" btn btn-sm btn-success">' + uv + "</span></p>";
        }
        else if(uv <= 7){
            innerTodayContent += '<span class="btn btn-sm btn-warning">' + uv + "</span></p>";
        }
        else{
            innerTodayContent += '<span class="btn btn-sm btn-danger">' + uv + "</span></p>";
        }
        todayEl.innerHTML = innerTodayContent;
    })
}