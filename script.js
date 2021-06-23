const api = {
  key: "7aff6c64eda554ecb7bc2072b5b4842b",
  base: "https://api.openweathermap.org/data/2.5/",
};

const dailyApi = {
  key: "7aff6c64eda554ecb7bc2072b5b4842b",
  base: "https://api.openweathermap.org/data/2.5/onecall?",
};


const API_KEY = '7aff6c64eda554ecb7bc2072b5b4842b';
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

getWeatherData()
function getWeatherData () {
  navigator.geolocation.getCurrentPosition((success) => {
    let {latitude, longitude } = success.coords;
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=imperial&appid=${API_KEY}`).then(res => res.json()).then(data => {
      console.log(data)
      showWeatherData(data);
    })
  })
}

function showWeatherData (data){
  let {humidity, wind_speed, uvi} = data.current;

  currentWeatherItemsEl.innerHTML =
  `<div class="weather-item">
    <div>Humidity:</div>
    <div>${humidity}</div>
  </div>
  <br></br>
   <div class="weather-item">
      <div>Wind Speed:</div>
      <div>${wind_speed}</div>
  </div>
  <br></br>
  <div class="weather-item">
        <div>UVI:</div>
        <div>${uvi}</div>
  </div>`;


  let otherDayForecast = ''
  data.daily.forEach((day, idx) => {

    if(idx == 0){
      currentTempEl.innerHTML = `
        <div class="day">${window.moment(day.dt*1000).format('ddd')
      }</div>
      <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@2x.png" 
        alt="weather icon" class="w-icon">
        <div class="temp">Night ${day.temp.night}&#176; F</div>
        <div class="temp">Day ${day.temp.day}&#176; F</div>
      </div>
      `
      }else{
        otherDayForecast +=  `
      <div class="weather-forecast-item">
      <div class="day">${window.moment(day.dt*1000).format('ddd')
      }</div>
      <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@2x.png" 
        alt="weather icon" class="w-icon">
      <div class="temp">Night ${day.temp.night}&#176; F</div>
      <div class="temp">Day ${day.temp.day}&#176; F</div>
      </div>
      ` 
      }
})
weatherForecastEl.innerHTML = otherDayForecast;
}
// Searchbox event listener for keypress
const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);


// looking for key 13 keypress which is the enter key or return key on keyboard
function setQuery(evt) {
  if (evt.keyCode == 13) {
    getResults(searchbox.value);
  }
}

// fetch request for the weather in Farenheit / returns weather
function getResults (query) {
  fetch(`${api.base}weather?q=${query}&units=imperial&APPID=${api.key}`)
  .then(weather => {
    return weather.json();
  }).then(displayResults);
}
// Displays weather after search
function displayResults (weather) {
  let city = document.querySelector('.location .city');
  city.innerText = `${weather.name}, ${weather.sys.country}`;

  // creates current date function
  let now = new Date();
  let date = document.querySelector('.location .date');
  date.innerText = dateBuilder(now);

  // displays current temperature
  let temp = document.querySelector('.current .temp');
  temp.innerHTML = `${Math.round(weather.main.temp)}<span>°F</span>`;

// displays current weather
  let weather_el = document.querySelector('.current .weather');
  weather_el.innerText = weather.weather[0].main;

// displays hi-low temeratures
  let hilow = document.querySelector('.hi-low');
  hilow.innerText = `${Math.round(weather.main.temp_min)}°F / ${Math.round 
  (weather.main.temp_max)}°F`;
}
// Creates array of months and days for current date
function dateBuilder (d) {
  let months = ["January", "February","March","April","May","June","July","August","September","October","November","December"];
  let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}