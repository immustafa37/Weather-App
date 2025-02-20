const API_KEY = "d5a18a3c540b053a8526ed2bcf2235e7"; // Replace with your OpenWeatherMap API key

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherInfo = document.querySelector(".weather-info");
const errorDiv = document.querySelector(".error");
const cityName = document.getElementById("cityName");
const temperatureEl = document.getElementById("temperature");
const weatherIcon = document.getElementById("weatherIcon");
const descriptionEl = document.getElementById("description");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const unitToggleBtn = document.getElementById("unitToggle");

let currentTempCelsius = null; // to store temperature in Celsius
let isCelsius = true;

// Event Listeners
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if(city !== ""){
    fetchWeather(city);
  }
});

cityInput.addEventListener("keypress", (e) => {
  if(e.key === "Enter"){
    const city = cityInput.value.trim();
    if(city !== ""){
      fetchWeather(city);
    }
  }
});

unitToggleBtn.addEventListener("click", () => {
  if(currentTempCelsius !== null){
    if(isCelsius){
      // convert to Fahrenheit
      const tempF = (currentTempCelsius * 9/5) + 32;
      temperatureEl.textContent = Math.round(tempF) + "°F";
    } else {
      temperatureEl.textContent = Math.round(currentTempCelsius) + "°C";
    }
    isCelsius = !isCelsius;
  }
});

// Fetch Weather Data
function fetchWeather(city){
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  fetch(url)
    .then(response => {
      if(!response.ok){
        throw new Error("City not found");
      }
      return response.json();
    })
    .then(data => {
      displayWeather(data);
    })
    .catch(error => {
      weatherInfo.classList.add("hidden");
      errorDiv.classList.remove("hidden");
      console.error(error);
    });
}

// Display Weather Data
function displayWeather(data){
  errorDiv.classList.add("hidden");
  weatherInfo.classList.remove("hidden");
  // Set city name and country code
  cityName.textContent = `${data.name}, ${data.sys.country}`;
  
  // Save temperature in Celsius
  currentTempCelsius = data.main.temp;
  isCelsius = true;
  temperatureEl.textContent = Math.round(currentTempCelsius) + "°C";

  // Set weather icon
  const iconCode = data.weather[0].icon;
  weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  weatherIcon.alt = data.weather[0].description;

  // Set description, humidity and wind speed
  descriptionEl.textContent = data.weather[0].description;
  humidityEl.textContent = data.main.humidity;
  windEl.textContent = data.wind.speed;
}
