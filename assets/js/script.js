var innerTodayContent = "";
function  citySearch(){
    var searchEl = document.getElementById("cityContainer");
    var cityVal = document.getElementById("searchCity").value;
    console.log(cityVal);
    if(cityVal.length ===  0){
        alert("Please enter a valid city");
    }

    var todayEl = document.getElementById("todayWeather");
    var todayDate = moment().format('l');
    document.getElementById("searchCity").value = "";
    var cityEl = document.createElement("div");
    cityEl.className = "card pt-2 pb-2 pl-2";
    cityEl.innerHTML = cityVal;
    searchEl.appendChild(cityEl);
    //todayEl.innerHTML = "<h2>"+cityVal+ " ("+todayDate+")</h2>";
    
    fetch(
        'https://api.openweathermap.org/data/2.5/weather?q=' + cityVal + '&appid=0d3489588c8dc1cc4818f8f7817f20e1&units=imperial'
    )
    .then(function(response){
        console.log(response);
        return response.json();
    })
    .then(function(response){
        console.log(response.weather[0].icon);
        var weatherIcon = response.weather[0].icon;
        innerTodayContent = "<h2>"+cityVal+ " ("+todayDate+")" + '<img src="http://openweathermap.org/img/w/'+ weatherIcon + '.png" /></h2>';
        var tempVal = response.main.temp;
        innerTodayContent += "<p>Temperature: " + tempVal + "°F</p>";
        var humidityVal = response.main.humidity;
        innerTodayContent += "<p>Humidity: " + humidityVal + "%</p>";
        var windSpVal = response.wind.speed;
        innerTodayContent +="<p>Wind Speed: " + windSpVal + " MPH</p>";
        todayEl.innerHTML = innerTodayContent;

    })
}

function savedSearch(){

}