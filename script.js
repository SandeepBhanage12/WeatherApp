const cityInput = document.querySelector(".city");
const apikey = 'ad825813b7ba794987535e3d9acd963b';
const searchbtn = document.querySelector(".search-btn");
const weatherinfoSection = document.querySelector(".weather-info");
const searchcitysection = document.querySelector(".search-city-mesaage");
const contrytext = document.querySelector(".contry-text");
const dateElement = document.querySelector(".date"); // Renamed from Date to dateElement
const temp = document.querySelector(".temp-text");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");
const nonfound = document.querySelector(".not-found");

const ForecastItemsContainer=document.querySelector(".forecast-items-container")


searchbtn.addEventListener('click', () => {
    if (cityInput.value.trim() != '') {
        UpdateWeatherInfo(cityInput.value);
        console.log(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && cityInput.value.trim() != '') {
        UpdateWeatherInfo(cityInput.value);
        console.log(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
});

async function getFetchData(endPoint, city) {
    const url = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apikey}&units=metric`;
    const response = await fetch(url);
    return response.json();
}

async function UpdateWeatherInfo(city) {
    const weatherdata = await getFetchData('weather', city);

    
    if (weatherdata.cod != 200) {
        console.log(weatherdata.cod);
        nonfound.style.display = 'flex';
        nonfound.style.flexDirection='column';
        weatherinfoSection.style.display='none';
        searchcitysection.style.display='none';
        return; 
    }
    
    dateElement.innerHTML = getCurrdate(); 
    contrytext.innerHTML = weatherdata.name;
    temp.innerHTML = `${Math.round(weatherdata.main.temp)} °C`;
    wind.innerHTML = `${weatherdata.wind.speed} m/s`;
    humidity.innerHTML =` ${weatherdata.main.humidity} %`;
   
   await updateForecast(city);
   console.log(weatherdata);
    showDisplay(weatherinfoSection);
}
async function updateForecast(city){
    const forecastData= await getFetchData('forecast',city);
    console.log(forecastData);
    const timetaken='12:00:00';
    const todayDate=new Date().toISOString().split('T')[0];
    ForecastItemsContainer.innerHTML='';
    forecastData.list.forEach(foreweather=>{
        if(foreweather.dt_txt.includes(timetaken)&& !foreweather.dt_txt.includes(todayDate)){
        console.log(foreweather);
        updateForecastItems(foreweather);
        }
    })
    console.log("today is: ",todayDate);

}
function updateForecastItems(weatherdata){
    console.log(weatherdata);
    const{
        dt_txt:date,
        main:{temp},
        weather:[{id}]

    }=weatherdata;

    let currdate = new Date(date);

    const options = { weekday: 'short', day: '2-digit', month: 'short' };
   let d= currdate.toLocaleDateString('en-US', options);
   
    const forecastItem = `
       <div class="forecast-item">
        <h5 class="forecast-data regular-txt">${d} </h5>
        <img src="storm.png" alt="" class="forecast-img">
        <h5 class="forecast-tem">${Math.round(temp)} °C </h5>
      </div>
`
ForecastItemsContainer.insertAdjacentHTML('beforeend',forecastItem);

}

function getCurrdate() {
    let currdate = new Date();

    const options = { weekday: 'short', day: '2-digit', month: 'short' };
    return currdate.toLocaleDateString('en-US', options);
}

function showDisplay(section) {
    [weatherinfoSection, searchcitysection, nonfound].forEach(section => {
        section.style.display = 'none'; 
    });

    section.style.display = 'flex';
    section.style.flexDirection = 'column';
}
