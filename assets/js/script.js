function init() {
    //Elements
    var searchBtnEl = document.getElementById('search-btn');
    var clearBtn = document.getElementById('clear-history');
    var cityInputEl = $('#city-input');
    var cityDateDisplayEl = $('#city-date');
    var mainDisplayEl = $('#display-column');
    var tempDisplayEl = $('#temp');
    var windDisplayEl = $('#wind');
    var humidityDisplayEl = $('#humidity');
    var currentWeatherIcon = $('#current-icon');
    var searchHistoryEl = document.getElementById('recent-search-container');
    var cityId;
    var currentDate = dayjs().format('M/D/YYYY')
    var historyStorage = JSON.parse(localStorage.getItem("search")) || [];
    var APIKey = '44839524461ff1bdfaaa3b54fb9d4978';

    //Functions
    function fetchWeatherData(city) {
        var requestURLCurrent = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + APIKey + '&units=imperial';
        // current weather information
        fetch(requestURLCurrent)
        .then(function (response) {
            return response.json();
        })
        
        .then(function (data) {
            mainDisplayEl.removeClass("d-none");
            cityDateDisplayEl.text(data.name + ' (' + currentDate + ')');
            var weatherIcon = data.weather[0].icon;
            currentWeatherIcon.attr('src', 'https://openweathermap.org/img/wn/' + weatherIcon + '@2x.png');
            currentWeatherIcon.attr('alt', data.weather[0].description);
            tempDisplayEl.text('Temp: ' + data.main.temp + ' \u2109');
            windDisplayEl.text('Wind: ' + data.wind.speed + ' MPH');
            humidityDisplayEl.text('Humidity: ' + data.main.humidity + ' %');
            //Variable pulls ID
            cityId = data.id;
            //Get 5-day forecast weather data
            fetch('https://api.openweathermap.org/data/2.5/forecast?id=' + cityId + '&appid=' + APIKey + '&units=imperial')
                .then(function (response) {
                    return response.json();
                })
                
                .then(function (data) {
                    $('#forecast-header').removeClass('d-none');
                    var fiveDayEls = document.querySelectorAll("#day");
                    for (var i = 0; i < fiveDayEls.length; i++) {
                        fiveDayEls[i].innerHTML = '';
                        var forecastLoop = i * 8 + 4;
                        var dateIndex = new Date(data.list[forecastLoop].dt * 1000);
                        var forecastDay = dateIndex.getDate();
                        var forecastMonth = dateIndex.getMonth() + 1;
                        var forecastYear = dateIndex.getFullYear();
                        var forecastDateEl = document.createElement('h5');
                        forecastDateEl.innerHTML = forecastMonth + '/' + forecastDay + '/' + forecastYear;
                        fiveDayEls[i].append(forecastDateEl);
                        //HTML element to add weather icons
                        var forecastWeatherIcon = document.createElement('img');
                        forecastWeatherIcon.setAttribute('src', 'https://openweathermap.org/img/wn/' + data.list[forecastLoop].weather[0].icon + '@2x.png');
                        forecastWeatherIcon.setAttribute('alt', data.list[forecastLoop].weather[0].description);
                        fiveDayEls[i].append(forecastWeatherIcon);
                        //HTML element to add forecast temp data
                        var forecastTemp = document.createElement('p');
                        forecastTemp.innerHTML = 'Temp: ' + data.list[forecastLoop].main.temp + ' \u2109';
                        fiveDayEls[i].append(forecastTemp);
                        //HTML element to add forecast wind data
                        var forecastWind = document.createElement('p');
                        forecastWind.innerHTML = 'Wind: ' + data.list[forecastLoop].wind.speed + ' MPH';
                        fiveDayEls[i].append(forecastWind);
                        //HTML element to add forecast humidity data
                        var forecastHumidity = document.createElement('p');
                        forecastHumidity.innerHTML = 'Humidity: ' + data.list[forecastLoop].main.humidity + ' %';
                        fiveDayEls[i].append(forecastHumidity);
                    }
                })
        });
    }
    //Display input history using loop from local storage
    function renderSearchHistory() {
        searchHistoryEl.innerHTML = '';
        for (var i = 0; i < historyStorage.length; i++) {
            const searchHit = document.createElement('input');
            searchHit.setAttribute("type", "text");
            searchHit.setAttribute("readonly", true);
            searchHit.setAttribute("class", "form-control bg-primary-subtle border-primary-subtle text-center history-button");
            searchHit.setAttribute("value", historyStorage[i]);
            //recent history element event listener to run fetch function when clicked
            searchHit.addEventListener("click", function () {
                fetchWeatherData(searchHit.value);
            })
            searchHistoryEl.append(searchHit);
        }
    }
    //Search button listener 
    searchBtnEl.addEventListener('click', function () {
        var cityRequested = cityInputEl.val();
        fetchWeatherData(cityRequested);
        historyStorage.push(cityRequested);
        localStorage.setItem("search", JSON.stringify(historyStorage));
        renderSearchHistory();
    });
    
    clearBtn.addEventListener('click', function () {
        localStorage.clear();
        historyStorage = [];
        renderSearchHistory();
    })
    
    renderSearchHistory();
    if (historyStorage.length > 0) {
        fetchWeatherData(historyStorage[historyStorage.length - 1]);
    }

}
// Web app
init();