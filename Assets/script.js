
var searchHistory = [];

function fetchData(cityName) {
  var units = 'metric';
  var lang = 'en';
  var key = '46d308181a9f1f5e721c826c25c5e5ab'; 

  var apiWeather = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${key}&units=${units}&lang=${lang}`;

  fetch(apiWeather)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      console.log(data);

      var currentWeather = data.list[0];

      document.getElementById("currentDate").textContent = new Date(currentWeather.dt * 1000).toLocaleDateString();
      document.getElementById("currentIcon").src = `http://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`;
      document.getElementById("currentTemp").textContent = `Temperature: ${currentWeather.main.temp} °C`;
      document.getElementById("currentHumidity").textContent = `Humidity: ${currentWeather.main.humidity}%`;
      document.getElementById("currentWindSpeed").textContent = `Wind Speed: ${currentWeather.wind.speed} m/s`;

      for (var i = 1; i <= 4; i++) {
        var forecastData = data.list[i * 8]; // Get data for every 24 hours (i * 8)
        document.getElementById("day" + i).textContent = new Date(forecastData.dt * 1000).toLocaleDateString();
        document.getElementById("img" + i).src = `http://openweathermap.org/img/w/${forecastData.weather[0].icon}.png`;
        document.getElementById("temp" + i).textContent = `Temperature: ${forecastData.main.temp} °C`;
        document.getElementById("humidity" + i).textContent = `Humidity: ${forecastData.main.humidity}%`;
        document.getElementById("windSpeed" + i).textContent = `Wind Speed: ${forecastData.wind.speed} m/s`;
      }

      saveToLocalStorage(cityName);

      if (!searchHistory.includes(cityName)) {
        searchHistory.push(cityName);
        updateSearchHistoryUI();
      }
    })
    .catch(function (error) {
      console.error('Error fetching weather data:', error);
    });
}

function saveToLocalStorage(cityName) {

  var existingHistory = localStorage.getItem('searchHistory');

  if (existingHistory) {

    var parsedHistory = JSON.parse(existingHistory);
    parsedHistory.push(cityName);
    localStorage.setItem('searchHistory', JSON.stringify(parsedHistory));
  } else {

    var newHistory = [cityName];
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  }
}

function GetInfo() {
  var newName = document.getElementById("cityInput").value;
  var cityName = document.getElementById("cityName");

  cityName.textContent = "--" + newName + "--";

  fetchData(newName);
}

var mySearch = document.getElementById('myBtn');
mySearch.addEventListener('click', function () {
  document.getElementById("cityInput").defaultValue = "London";
  GetInfo();
});

function updateSearchHistoryUI() {
  var searchHistoryDiv = document.getElementById("searchHistory");
  searchHistoryDiv.innerHTML = "";

  for (var i = 0; i < searchHistory.length; i++) {
    var city = searchHistory[i];
    var historyItem = document.createElement("p");
    historyItem.textContent = city;
    historyItem.classList.add("history-item");

    historyItem.addEventListener("click", function () {
      var cityName = this.textContent;
      document.getElementById("cityInput").value = cityName;
      GetInfo();
    });

    searchHistoryDiv.appendChild(historyItem);
  }
}

updateSearchHistoryUI();



