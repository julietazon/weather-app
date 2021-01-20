let tempElement = document.querySelector("#main-temp");
let cityElement = document.querySelector("#city");
let countryElement = document.querySelector("#country");
let descriptionElement = document.querySelector("#description");
let humidityElement = document.querySelector("#humidity");
let windElement = document.querySelector("#wind");
let feelsLikeElement = document.querySelector("#feels-like");
let dateElement = document.querySelector("#main-date");
let timeUpdateElement = document.querySelector("#update-time");
let iconElement = document.querySelector("#main-icon");

let apiEndpoint = "https://api.openweathermap.org";
let apiKey = "5673b1e9ab29a14a350998bfbcaef49f";
let apiQ = "&APPID=" + apiKey + "&units=metric";



function formatDate(timestamp) {
  let date = new Date(timestamp);
  return `${formatWeekDate(date)} ${formatHours(timestamp)}`;
}

function formatDay(dayNumber) {
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[dayNumber];
}

function formatWeekDate(date) {
  let day = formatDay(date.getDay());
  return day;
}

function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

function awsomeHours (timestamp, timezone) {
  let date = new Date(timestamp);
  timestamp =+ 1000*60*60*24;

  let hours = date.getUTCHours() + timezone;

  
  if (hours > 23) {
    hours = hours - 24;
    timestamp;
  }
  if (hours <= 0) {
    hours = 24 + hours;
    timestamp;
  }
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if(hours === 24) {
    hours = `00`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  
  return `${formatWeekDate(date)} ${hours}:${minutes}`;
}


function displayTemperature(response) {
  celsiusTemp = response.data.main.temp;
  tempElement.innerHTML = Math.round(celsiusTemp);
  cityElement.innerHTML = response.data.name;
  countryElement.innerHTML = response.data.sys.country;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  feelsLikeElement.innerHTML = Math.round(response.data.main.feels_like);
  dateElement.innerHTML = awsomeHours(response.data.dt * 1000,response.data.timezone / 3600);
  timeUpdateElement.innerHTML = formatHours(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    "icons/" + response.data.weather[0].icon + ".png"
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  axios
    .get(
      apiEndpoint + 
      "/data/2.5/onecall?lat=" + response.data.coord.lat + 
      "&lon=" + response.data.coord.lon + 
      "&exclude=current,minutely,hourly,alerts" + apiQ
    )
    .then(function (response) {
      document.querySelectorAll(".day-forecast")
        .forEach(function (element, index) {
          let day = new Date(response.data.daily[index + 1].dt * 1000);
          element.querySelector(".forecast-date").innerHTML = formatWeekDate(day);
          element.querySelector(".max-temp").innerHTML = Math.round(response.data.daily[index].temp.max);
          element.querySelector(".min-temp").innerHTML = Math.round(response.data.daily[index].temp.min);
          element
            .querySelector(".forecast-img")
            .setAttribute(
              "src",
              "icons/" + response.data.daily[index].weather[0].icon + ".png"
            );
        });
    });
}


function search(city) {
  axios.get(apiEndpoint + "/data/2.5/weather?q=" + city + apiQ).then(displayTemperature);
}

function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let local = "lat=" + lat + "&lon=" + lon;
  
  axios.get(apiEndpoint + "/data/2.5/weather?" + local + apiQ).then(displayTemperature);
}

//prevent page from reloading
function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

//prevent link from opening new page
function displayFahrenheitTemp(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#main-temp");
  //remove active class of celsius
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  tempElement.innerHTML = Math.round(fahrenheitTemp);
}

function displayCelsiusTemp(event) {
  event.preventDefault();
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  let tempElement = document.querySelector("#main-temp");
  tempElement.innerHTML = Math.round(celsiusTemp);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}


//Global Variables

let celsiusTemp = null;

let form = document.querySelector("#search-form");
form.addEventListener("click", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemp);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemp);


let currentLocation = document.querySelector("#current-location");
currentLocation.addEventListener("click", getCurrentPosition);


//Default search after GV
search("São Paulo");