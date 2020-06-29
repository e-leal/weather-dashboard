$("#cityList").on("click", "li", function(){
    console.log("listen to on click event")
    displayWeather($(this).text());
});
var savedCities = JSON.parse(localStorage.getItem('cities')) || [];
loadCities();

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

function saveCities(){
    localStorage.setItem("cities", JSON.stringify(savedCities));
}

function  citySearch(){
    var searchEl = document.getElementById("cityList");
    var cityVal = document.getElementById("searchCity").value;
    cityVal = cityVal.toLowerCase();
    var upper = cityVal.charAt(0).toUpperCase();
    cityVal = cityVal.slice(1);
    cityVal = upper+cityVal;
    console.log(cityVal)
    var weekEl = document.getElementById("weekWeather");
    clearResults();
    if(cityVal === ""){
        alert("Please enter a valid city");
    }
    else{
        var todayEl = document.getElementById("todayWeather");
        var todayDate = moment().format('l');
        document.getElementById("searchCity").value = "";
        var exist = false;
        for (var i =0; i < searchEl.childNodes.length; i++){
            console.log(searchEl.childNodes[i].innerHTML);
            if( cityVal === searchEl.childNodes[i].innerHTML){
                exist = true;
            }
        }
        console.log(searchEl);
        if(!exist){
            var cityEl = document.createElement("li");
            cityEl.className = "searchedCity list-group-item";
            cityEl.innerHTML = cityVal;
            searchEl.appendChild(cityEl);
            savedCities.push(cityVal);
            saveCities();
        }       
        //todayEl.innerHTML = "<h2>"+cityVal+ " ("+todayDate+")</h2>";
        displayWeather(cityVal);
    }
    
}

function clearResults(){
    var weekEl = document.getElementById("weekWeather");
    weekEl.innerHTML = "";
    var todayEl = document.getElementById("todayWeather");
    todayEl.innerHTML = "";
}

function displayWeather(selectedCity){
    clearResults();
    var innerTodayContent = "";
    var innerWeekContent = "";
    var uv = "";
    var todayDate = moment().format('l');
    var weekEl = document.getElementById("weekWeather");
    var todayEl = document.getElementById("todayWeather");
    

    console.log("uvVal is ", uv)
    fetch(
        'https://api.openweathermap.org/data/2.5/weather?q=' + selectedCity + '&appid=0d3489588c8dc1cc4818f8f7817f20e1&units=imperial'
    )
    .then(function(todayResponse){
        return todayResponse.json();
    })
    .then(function(todayResponse){
        
        var weatherIcon = todayResponse.weather[0].icon;
        innerTodayContent = "<h2>"+selectedCity+ " ("+todayDate+")" + '<img src="http://openweathermap.org/img/w/'+ weatherIcon + '.png" /></h2>';
        var tempVal = todayResponse.main.temp;
        innerTodayContent += "<p>Temperature: " + tempVal + "°F</p>";
        var humidityVal = todayResponse.main.humidity;
        innerTodayContent += "<p>Humidity: " + humidityVal + "%</p>";
        var windSpVal = todayResponse.wind.speed;
        innerTodayContent +="<p>Wind Speed: " + windSpVal + " MPH</p>";
    
        //todayEl.innerHTML = innerTodayContent;

        return fetch(
            'https://api.openweathermap.org/data/2.5/forecast?q='+ selectedCity+'&appid=0d3489588c8dc1cc4818f8f7817f20e1&units=imperial'
        )
    })
    .then(function(response){
       // console.log(response);
        return response.json();
    })
    .then(function(response){
        //console.log("Where our temp is supposed to be read: " + response.list[0].main.temp);
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

    fetch(
        'https://api.openweathermap.org/data/2.5/weather?q=' + selectedCity + '&appid=0d3489588c8dc1cc4818f8f7817f20e1&units=imperial'
    )
    .then(function(locationResponse){
        return locationResponse.json();
    })
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
    .then(function(uvResponse){
        console.log(uvResponse.value)
        var uv = uvResponse.value;
        innerTodayContent += "<p>UV Index: "
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