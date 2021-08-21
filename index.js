//DOM render form node
function renderForm() {
    const inputForm = document.createElement("form")
    inputForm.innerHTML =
        '<label for="searchByZIP">Search By ZIP</label> ' +
        '<input id="searchByZIP" type="text" placeholder="Enter ZIP Code here"/> ' +
        '<input type="submit" />';
    document.querySelector("header").append(inputForm)
    inputForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let input = document.querySelector('input#searchByZIP');

        fetch(`https://api.openweathermap.org/data/2.5/forecast?zip=${input.value},us&units=imperial&appid=ef01095af7db393fb4e616c0fd670ab3`)
            .then(res => res.json())
            .then(json => {
                renderWeatherData(json, input.value)
            })
            .catch(error => alert("please enter a zip code"))

        document.querySelector("header").append(inputForm);
        inputForm.reset();

    })
}

function renderWeatherData(weatherData, zipCodeEntered) {
    //creating and appending elements for the data that's been pulled
    let newWeatherCard = document.createElement("div")
    newWeatherCard.className = "weather-card"
    // console.log(typeof (weatherData))
    // console.log(weatherData)
    let cityName = document.createElement("h1")
    cityName.textContent = weatherData.city.name

    let currentWeather = document.createElement("h3")
    currentWeather.textContent = "Current Weather Conditions: " + weatherData.list[0].weather[0].description

    let currentTemp = document.createElement("h3")
    currentTemp.textContent = "Current Tempature (Farenheit): " + weatherData.list[0].main.temp

    let favButton = document.createElement("button")
    favButton.textContent = '\u2661'
    favButton.addEventListener('click', (e) => {
        favoriteButton(favButton, cityName, zipCodeEntered, currentWeather, currentTemp)
    })

    newWeatherCard.append(cityName, currentWeather, currentTemp, favButton)
    document.querySelector("content").append(newWeatherCard)
}

function favoriteButton(i, cityName, inp, currentWeather, currentTemp) {
    //adds selected node to "favorites" (local server), also changes display to a different color.
    //stretch - figure out how to remove favorites
    i.textContent = '\u2665'

    fetch("http://localhost:3000/zipcodes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            city: cityName.textContent,
            zipcode: inp,
            weather: currentWeather.textContent,
            tempature: currentTemp.textContent
        })
    })
}

function fetchFavorites() {
    fetch("http://localhost:3000/zipcodes")
        .then(res => res.json())
        .then(json => {
            json.forEach(element => renderFavorites(element))
        })
}

function renderFavorites(element) {
    let newWeatherCard = document.createElement("div")
    newWeatherCard.className = "weather-card"

    let cityName = document.createElement("h1")
    cityName.textContent = element.city

    let currentWeather = document.createElement("h3")
    currentWeather.textContent = element.weather

    let currentTemp = document.createElement("h3")
    currentTemp.textContent = element.tempature

    let id = document.createElement('div')
    id.textContent = element.id

    let favButton = document.createElement("button")
    favButton.textContent = '\u2665'
    favButton.addEventListener('click', () => {
        fetch(`http://localhost:3000/zipcodes/${id.textContent}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            }
        })

        newWeatherCard.remove()
    })

    newWeatherCard.append(cityName, currentWeather, currentTemp, favButton)
    document.querySelector("content").append(newWeatherCard)
}

//on program start, these are the functions we want to run right away:
function initialize() {
    renderForm();
    fetchFavorites();

}

initialize()
