var innerTodayContent = "";
var innerWeekContent = "";
function  citySearch(){
    var searchEl = document.getElementById("cityContainer");
    var cityVal = document.getElementById("searchCity").value;
    var weekEl = document.getElementById("weekWeather");
    innerWeekContent = "";
    weekEl.innerHTML = "";
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
    .then(function(todayResponse){
        console.log(todayResponse);
        return todayResponse.json();
    })
    .then(function(todayResponse){
        console.log(todayResponse.weather[0].icon);
        var weatherIcon = todayResponse.weather[0].icon;
        innerTodayContent = "<h2>"+cityVal+ " ("+todayDate+")" + '<img src="http://openweathermap.org/img/w/'+ weatherIcon + '.png" /></h2>';
        var tempVal = todayResponse.main.temp;
        innerTodayContent += "<p>Temperature: " + tempVal + "°F</p>";
        var humidityVal = todayResponse.main.humidity;
        innerTodayContent += "<p>Humidity: " + humidityVal + "%</p>";
        var windSpVal = todayResponse.wind.speed;
        innerTodayContent +="<p>Wind Speed: " + windSpVal + " MPH</p>";
        todayEl.innerHTML = innerTodayContent;
        return fetch(
            'https://api.openweathermap.org/data/2.5/forecast?q='+ cityVal+'&appid=0d3489588c8dc1cc4818f8f7817f20e1&units=imperial'
        )
    })
    .then(function(response){
       // console.log(response);
        return response.json();
    })
    .then(function(response){
        //console.log("Where our temp is supposed to be read: " + response.list[0].main.temp);
        for(var i = 0; i< 5; i++){
            var date = moment().add(i+1,"day").format("l");
            var temp = response.list[i].main.temp;
            var humidity = response.list[i].main.humidity;
            var wind = response.list[i].wind.speed;
            var icon = response.list[i].weather[0].icon;
            innerWeekContent += '<div class="card ml-3 bg-primary text-white p-2"><h3>'+ date +'</h3>'+
            '<img src="http://openweathermap.org/img/w/'+ icon+'.png" class="w-25" /><p>Temperatue: '+temp+'°F<br/>Humidity: '+
            humidity+'%<br/>Wind Speed: '+ wind +'MPH</p></div>';
        }
        weekEl.innerHTML = innerWeekContent;
    })
}

function savedSearch(){

}