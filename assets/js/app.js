
'use strict';

import { fetchData, url } from "./api.js";
import * as module from "./module.js";

/**
 * add event listener on multiple elements
 * @param {NodeList} elements Element node array
 * @param {string} eventType event type e.g : "click", "mouseover"
 * @param {Function} callback callbacl function 
 */

const addEventOnElements = function (elements, eventType, callback) {
    for( const element of elements)  element.addEventListener(eventType, callback);
}

/**
 * toogle search in mobile devices
 */

const searchView = document.querySelector("[data-search-view]");
const searchTogglers = document.querySelectorAll("[data-search-toggler]");


const toggleSearch = () => searchView.classList.toggle("active");
addEventOnElements(searchTogglers, "click", toggleSearch);


/**
 * Search Integration
 */

const searchField = document.querySelector("[data-search-field]");
const searchResult = document.querySelector("[data-search-result]");

let searchTimeout = null;
const searchTimeotDuration = 500; 

searchField.addEventListener("input", function() {
   
    searchTimeout ?? clearTimeout(searchTimeout);

    if (!searchField.value) {
        searchResult.classList.remove("active");
        searchResult.innerHTML= ""; 
        searchField.classList.remove("searching");
    } else{
        searchField.classList.add("searching");
    }

    if (searchField.value) {
       searchTimeout = setTimeout(() => {
             fetchData(url.geo(searchField.value), function(locations ) {
                searchField.classList.remove("searching");
                searchResult.classList.add("active");
                searchResult.innerHTML = `
                    <ul class="view-list" data-search-list></ul>
                `;

                const /** {NodeList} | [] */ items = [];

                for (const { name, lat, lon, country, state } of locations){
                    const searchItem = document.createElement("li");
                    searchItem.classList.add("view-item");   
                    
                    searchItem.innerHTML = `
                        <i class="fa-solid fa-location-dot m-icon"></i>

                        <div class="">
                            <p class="item-title">${name}</p>
                            <p class="label-2 item-subtitle">${state || " "} ${country}</p>
                        </div>

                        <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link has-state" aria-label="${name} weather" data-search-toggler>
                            <span class="span"></span>
                        </a>
                    `;

                    searchResult.querySelector("[data-search-list]").appendChild(searchItem);
                    items.push(searchItem.querySelector("[data-search-toggler]"));
                }

                addEventOnElements(items, "click", function() {
                  toggleSearch();
                  searchResult.classList.remove("active");  
                });
             });
        }, searchTimeotDuration);
    } 
});


const container = document.querySelector("[data-container]");
const loading = document.querySelector("[data-loading]");
const currentLocationBtn = document.querySelector("[data-current-location-btn]");
const errorContent = document.querySelector("[data-error-content]");

/**
 * Render all weather data in html paage
 * @param {number} lat latitude
 * @param {number} lon longitude
 */

export const updateWeather = function (lat, lon) {
    
    loading.style.display = "grid";
    container.style.overflowY ="hidden";
    container.classList.remove("fade-in");
    errorContent.style.display = "none";

    const currentWeatherSection = document.querySelector("[data-current-weather]");
    const highlightSection = document.querySelector("[data-highlights]");
    const hourlySection = document.querySelector("[data-hourly-forecast]");
    const forecastSection = document.querySelector("[data-5-day-forecast]");   


    currentWeatherSection.innerHTML = "";
    highlightSection.innerHTML = "";
    hourlySection.innerHTML = "";
    forecastSection.innerHTML = "";


    if (window.location.hash === "#/current-location") {
        currentLocationBtn.setAttribute("disabled", "");
    } else {
        currentLocationBtn.removeAttribute("disabled");
    }


    /**
     * Current Weather Section 
     */

    fetchData(url.currentWeather(lat, lon), function(currentWeather){

        const {
            weather,
            dt: dateUnix,
            sys: { sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC, country},
            main : { temp, feels_like, pressure, humidity},
            visibility,
            timezone,
            name
        } = currentWeather
        const [{ description, icon }] = weather;

        const card = document.createElement("div");
        card.classList.add("card", "card-lg", "current-weather-card");

        card.innerHTML = `
            <h2 class="title-2 card-title">Saat Ini</h2>

            <div class="weapper">
                <p class="heading">${parseInt(temp)}&deg; <sup>c</sup></p>

                <img src="./assets//images//weather_icons/${icon}.png" width="64" height="64" alt="${description}" class="weather-icon">
            </div>

            <p class="body-3">${description}</p>
            
            <ul class="meta-list">
                <li class="meta-item">
                    <i class="fa-solid fa-calendar-days m-icon"></i>

                    <p class="title-3 meta-text">${module.getDate(dateUnix, timezone)}</p>
                </li>

                <li class="meta-item">
                    <i class="fa-solid fa-location-dot m-icon"></i>

                    <p class="title-3 meta-text" data-location>${name}, ${country}</p>
                </li>
            </ul>
        `;

        currentWeatherSection.appendChild(card);

        /**
         * Today'Higlight
         */

        fetchData(url.airPollution(lat, lon), function (airPollution) {
           
            const [{ 
                main: {aqi},
                components : {no2, o3, so2, pm2_5 }
             }] = airPollution.list;

             const card = document.createElement("div");
             card.classList.add("card", "card-lg");

             card.innerHTML = `
                <h2 class="title-2" id="highlights-label">Kondisi Hari Ini</h2>

                <div class="highlight-list">

                    <div class="card card-sm highlight-card one">

                        <h3 class="title-3">Index Kualitas Udara</h3>

                        <div class="wrapper">

                            <i class="fa-solid fa-wind m-icon"></i>
                            <ul class="card-list">

                                <li class="card-item">

                                    <p class="title-1">${pm2_5.toPrecision(3)}</p>

                                    <p class="label-1">PM<sub>2.5</sub></p>
                                    
                                </li>
                                <li class="card-item">

                                    <p class="title-1">${so2.toPrecision(3)}</p>

                                    <p class="label-1">SO<sub>2</sub></p>
                                    
                                </li>
                                <li class="card-item">

                                    <p class="title-1">${no2.toPrecision(3)}</p>

                                    <p class="label-1">NO<sub>2</sub></p>
                                    
                                </li>
                                <li class="card-item">

                                    <p class="title-1">${o3.toPrecision(3)}</p>

                                    <p class="label-1">O<sub>3</sub></p>
                                    
                                </li>

                            </ul>

                        </div>

                        <span class="badge aqi-${aqi} label-${aqi}" title="${module.aqiText[aqi].message}">
                            ${module.aqiText[aqi].level}
                        </span>
                    </div>

                    <div class="card card-sm highlight-card two">

                        <h3 class="title-3">Matahari Terbit dan Terbenam</h3>

                        <div class="card-list">

                            <div class="card-item">
                                <i class="fa-solid fa-cloud-sun m-icon"></i>

                                <div>
                                    <p class="label-1">Sunrise</p>

                                    <p class="title-1">${module.getTime(sunriseUnixUTC, timezone)}</p>
                                </div>
                            </div>
                            <div class="card-item">
                                <i class="fa-solid fa-cloud-moon m-icon"></i>

                                <div>
                                    <p class="label-1">Sunset</p>

                                    <p class="title-1">${module.getTime(sunsetUnixUTC, timezone)}</p>
                                </div>
                            </div>
                            
                        </div>

                    </div>

                    <div class="card card-sm highlight-card">

                        <h3 class="title-3">Kelembaban</h3>

                        <div class="wrapper">
                            <i class="fa-solid fa-droplet m-icon"></i>

                            <p class="title-1">${humidity}<sub>%</sub></p>
                        </div>
                    </div>

                    <div class="card card-sm highlight-card">

                        <h3 class="title-3">Tekanan</h3>

                        <div class="wrapper">
                            <i class="fa-solid fa-water m-icon"></i>

                            <p class="title-1">${pressure}<sub>hPa</sub></p>
                        </div>
                    </div>

                    <div class="card card-sm highlight-card">

                        <h3 class="title-3">Jarak Pandang</h3>

                        <div class="wrapper">
                            <i class="fa-regular fa-eye-slash m-icon"></i>

                            <p class="title-1">${parseInt(visibility/1000)}<sub>km</sub></p>
                        </div>
                    </div>

                    <div class="card card-sm highlight-card">

                        <h3 class="title-3">Suhu Yang dirasakan</h3>

                        <div class="wrapper">
                            <i class="fa-solid fa-temperature-high m-icon"></i>

                            <p class="title-1">${parseInt(feels_like)}&deg;c</p>
                        </div>
                    </div>
                </div>
             `;

             highlightSection.appendChild(card);

        });
        
        /**
         * 24H Forecast Section
         */

        fetchData(url.forecast(lat, lon), function (forecast) {
            
            const {
                list : forecastList,
                city : { timezone }
            } = forecast;

            hourlySection.innerHTML = `
            <h2 class="title-2">Hari Ini</h2>
            <div class="slider-container">
                <ul class="slider-list" data-temp></ul>
                <ul class="slider-list" data-wind></ul>
            </div>
            `;

           for( const [index, data] of forecastList.entries()) {

            if (index >= 7) break;

            const {
                dt : dateTimeUnix,
                main : { temp },
                weather,
                wind : { deg: windDirection, speed: windSpeed }
            } = data

            const [{ icon, description}] = weather

            const tempLi = document.createElement("li");
            tempLi.classList.add("slider-item");


            tempLi.innerHTML = `
                <div class="card card-sm slider-card">

                    <p class="body-3">${module.getHours(dateTimeUnix, timezone)}</p>

                    <img src="./assets/images/weather_icons/${icon}.png" alt="${description}" width="48" height="48" loading="lazy" class="weather-icon" title="${description}" >

                    <p class="body-3">${parseInt(temp)}&deg;<sup>C</sup></p>
                </div>
            `;
            hourlySection.querySelector("[data-temp]").appendChild(tempLi);

            const windLi = document.createElement("li");
            windLi.classList.add("slider-item");

            windLi.innerHTML = `
                <div class="card card-sm slider-card">

                    <p class="body-3">${module.getHours(dateTimeUnix, timezone)}</p>

                    <img src="./assets/images/weather_icons/direction.png" alt="" width="48" height="48" loading="lazy" class="weather-icon" style="transform: rotate(${windDirection - 180}deg)" >

                    <p class="body-3">${parseInt(module.mps_to_kmh(windSpeed))}km/h</p>
                </div>
            `;

            hourlySection.querySelector("[data-wind]").appendChild(windLi);

           }

           /**
            * 5 Hari Section
            */

           forecastSection.innerHTML = `
            <h2 class="title-2" id="forecast-label">Perkiraan Cuaca 5 hari</h2>

                <div class="card card-lg forecast-card">
                    <ul data-forecast-list></ul>
                </div>
           `;

           for( let i = 7, len = forecastList.length; i < len; i += 8){

            const {
                main : {temp_max},
                weather,
                dt_txt
            } = forecastList[i];
            const [{ icon, description}] = weather
            const date = new Date(dt_txt);

            const li = document.createElement("li");
            li.classList.add("card-item");

            li.innerHTML = `
                <div class="icon-wrapper">
                    <img src="./assets/images/weather_icons/${icon}.png" width="36" height="36" alt="${description}" class="weather-icon title="${description}">

                    <span class="span">
                        <p class="title-2">${parseInt(temp_max)}&deg;<sup>c</sup></p>
                    </span>
                </div>

                <p class="label-1">${date.getDate()} ${module.monthNames[date.getUTCMonth()]}</p>

                <p class="label-1">${module.weekDayNames[date.getUTCDay()]}</p>
            `;

            forecastSection.querySelector("[data-forecast-list]").appendChild(li);
           }

           loading.style.display = "none";
           container.style.overflowY ="overlay";
           container.classList.add("fade-in");
        });

    }); 

}


export const error404 = () => errorContent.style.display = "flex";