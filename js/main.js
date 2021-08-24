// https://api.openweathermap.org/data/2.5/onecall?lat=28.6667&lon=77.2167&exclude=current,minutely,hourly,alerts&appid=e779d85cac6aa3685383a114a6e1647b
const API_KEY = "e779d85cac6aa3685383a114a6e1647b";
let currentWeather =
  "api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}";
let historicalWeather =
  "https://api.openweathermap.org/data/2.5/onecall/timemachine?lat={lat}&lon={lon}&dt={time}&appid={API key}";

let arrayMappingForWeather = {
  "11d": "thunder.svg",
  "11n": "thunder.svg",
  "09d": "rainy-6.svg",
  "09n": "rainy-6.svg",
  "10d": "rainy-1.svg",
  "10n": "rainy-5.svg",
  "13d": "snowy-5.svg",
  "13n": "snowy-5.svg",
  "50d": "cloudy.svg",
  "50n": "cloudy.svg",
  "01d": "day.svg",
  "01n": "night.svg",
  "02d": "cloudy-day-2.svg",
  "02n": "cloudy-night-2.svg",
  "03d": "cloudy.svg",
  "03n": "cloudy.svg",
  "04d": "cloudy.svg",
  "04n": "cloudy.svg",
};

let dayToWeekDay = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};
window.onload = () => {
  let submitBtnForCity = document.querySelector(".search-btn-div");

  submitBtnForCity.addEventListener("click", function () {
    document.querySelector(".loading-animation").style.display = "block";
    let inputText = document.querySelector(".city-input-text").value;

    if (inputText) {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${inputText}&appid=${API_KEY}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data["cod"] === "404") {
            document.querySelector(
              ".weather-web-app-api-content"
            ).style.display = "none";
            document.querySelector(".warning-div").style.display = "flex";

            document.querySelector(".enter-a-city").style.color = "#a91e2c";
            document.querySelector(".warning-div span").style.color = "#a91e2c";
            document.querySelector(".enter-a-city").innerText = "Dang!";
            document.querySelector(
              ".warning-div span"
            ).innerText = `"${inputText}" is not a valid city.`;
            document.querySelector(".loading-animation").style.display = "none";
          } else {
            let weatherID = data["weather"][0]["id"];
            let lattitude = data["coord"]["lat"];
            let longitude = data["coord"]["lon"];
            let imagePath = document.querySelector(
              ".weather-live-forecast-icon"
            );
            let liveTemperature = document.querySelector(
              ".live-temperature-div"
            );
            let weatherCondition = document.querySelector(".weather-condition");
            let minTemp = document.querySelector(".minimum-temp");
            let maxTemp = document.querySelector(".maximum-temp");

            imagePath.src =
              "img/animated/" +
              arrayMappingForWeather[data["weather"][0]["icon"]];
            weatherCondition.innerText = data["weather"][0]["main"];

            liveTemperature.innerText =
              kelvinToCelsius(data["main"]["temp"]) + "°c";

            document.querySelector(".warning-div").style.display = "none";
            minTemp.innerText =
              "Min: " + kelvinToCelsius(data["main"]["temp_min"]) + "°c";
            maxTemp.innerText =
              "Max: " + kelvinToCelsius(data["main"]["temp_max"]) + "°c";

            document.querySelector(
              ".weather-web-app-api-content"
            ).style.display = "block";

            getApiResponseForDifferentTime(lattitude, longitude);
          }
        });
    } else {
      document.querySelector(".warning-div").style.display = "block !important";
      document.querySelector(".warning-div span").innerText =
        "City cannot be empty";
      document.querySelector(".loading-animation").style.display = "none";
    }
  });

  function getApiResponseForDifferentTime(lat, long) {
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=current,minutely,hourly,alerts
      &appid=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        let dailyData = data["daily"];
        let next4Days = Array.from(
          document.querySelectorAll(".weather-forecast-for-future")
        );
        for (let i = 1; i < 5; i++) {
          let avgTemp =
            (dailyData[i]["temp"]["day"] +
              dailyData[i]["temp"]["eve"] +
              dailyData[i]["temp"]["morn"] +
              dailyData[i]["temp"]["night"]) /
            4;
          let weatherType = dailyData[i]["weather"][0]["main"];
          let weatherIcon = dailyData[i]["weather"][0]["icon"];
          next4Days[i - 1]["firstElementChild"]["children"][0].src =
            "img/animated/" + arrayMappingForWeather[weatherIcon];
          next4Days[i - 1]["firstElementChild"]["children"][1].innerText =
            weatherType;
          next4Days[i - 1]["lastElementChild"].innerText =
            kelvinToCelsius(avgTemp) + "°c";
          setDateAndDay(data["daily"][0]["dt"]);
          document.querySelector(".loading-animation").style.display = "none";
        }
      });
  }

  function kelvinToCelsius(temp) {
    return Math.round(temp - 273.15);
  }

  function setDateAndDay(time) {
    let today = new Date(time * 1000);
    let day = today.getDay();
    let date =
      (today.getDate() > 9 ? today.getDate() : "0" + today.getDate()) +
      "/" +
      (today.getMonth() + 1 < 10
        ? "0" + (today.getMonth() + 1)
        : today.getMonth() + 1) +
      "/" +
      today.getFullYear();
    document.querySelector(".time").innerText = dayToWeekDay[day];
    document.querySelector(".date").innerText = date;
    Array.from(document.querySelectorAll(".future-forecast-day")).forEach(
      (weekday, idx) => {
        weekday.innerText =
          dayToWeekDay[day + idx + 1 > 6 ? day + idx + 1 - 7 : day + idx + 1];
      }
    );
  }
};
