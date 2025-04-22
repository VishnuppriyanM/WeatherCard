const API_KEY = '0106f784817d49fc8d461457231407';
const weatherInfo = document.getElementById('weatherInfo');
const errorMessage = document.getElementById('errorMessage');
const locationInput = document.getElementById('locationInput');
const cityDropdown = document.getElementById('cityDropdown');

async function fetchWeather() {
    const place = locationInput.value.trim();
    if (!place) {
        showError();
        return;
    }

    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${place}&aqi=no`);
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();

       // Update UI
        document.getElementById('cityName').textContent = `${data.location.name}, ${data.location.country}`;
        document.getElementById('temperature').textContent = `${Math.round(data.current.temp_c)}°C`;
        document.getElementById('condition').textContent = data.current.condition.text;
        document.getElementById('weatherIcon').src = `https:${data.current.condition.icon}`;
        document.getElementById('humidity').textContent = `${data.current.humidity}%`;
        document.getElementById('windSpeed').textContent = `${data.current.wind_kph} km/h`;
        document.getElementById('feelsLike').textContent = `${Math.round(data.current.feelslike_c)}°C`;

        // Show weather info, hide error, and hide dropdown
        weatherInfo.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        cityDropdown.classList.add('hidden');

        // Update background based on condition and time of day
        updateBackground(data.current.condition.text.toLowerCase(), data.current.is_day);
    } catch (error) {
        showError();
    }
}

function showError() {
    errorMessage.textContent = 'Please provide a valid city name';
    errorMessage.classList.remove('hidden');
    weatherInfo.classList.add('hidden');
}

function updateBackground(condition, isDay) {
    const body = document.body;
    if (!isDay) {
        body.style.background = 'linear-gradient(135deg, #1e1e2e, #3b0764)';
    } else if (condition.includes('sunny') || condition.includes('clear')) {
        body.style.background = 'linear-gradient(135deg, #f59e0b, #fef3c7)';
    } else if (condition.includes('cloud') || condition.includes('overcast')) {
        body.style.background = 'linear-gradient(135deg, #4b5563, #9ca3af)';
    } else if (condition.includes('rain') || condition.includes('shower')) {
        body.style.background = 'linear-gradient(135deg, #1e40af, #60a5fa)';
    } else if (condition.includes('snow')) {
        body.style.background = 'linear-gradient(135deg, #e5e7eb, #f3f4f6)';
    } else {
        body.style.background = 'linear-gradient(135deg, #1e3a8a, #60a5fa)';
    }
}

function showDropdown() {
    cityDropdown.classList.remove('hidden');
}

function handleMouseOut(event) {
    const relatedTarget = event.relatedTarget || event.toElement;
    if (!locationInput.contains(relatedTarget) && !cityDropdown.contains(relatedTarget)) {
        cityDropdown.classList.add('hidden');
    }
}

function selectCity(city) {
    locationInput.value = city;
    cityDropdown.classList.add('hidden');
    fetchWeather();
}