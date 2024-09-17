const queryURL = "http://api.openweathermap.org/data/2.5/weather";
const APIKey = "cc3d36ee1252559edacf9330f27c3aeb";
const cities = ["Cape Town", "Johannesburg","Durban", "East London", "Polokwane","Kimberly", "Nelspruit", "Bloemfontein"]; 
const weatherCards = document.getElementById('weather-cards');

async function getForecast() {
  try {
    const fetchPromises = cities.map(async city => {
      const url = `${queryURL}?q=${encodeURIComponent(city)}&appid=${APIKey}&units=metric`;
      const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`GET request failed for ${city} with status: ${response.status}`);
        }
        return await response.json();
    });

    const results = await Promise.all(fetchPromises);

    weatherCards.innerHTML = ''; 
    
    results.forEach(data => {
      displayData(data, weatherCards);
    });

    initCarousel();

  } catch (error) {
    console.error("Error during GET request:", error.message);
  }
}

function displayData(data, container) {
  const card = document.createElement('div');
  card.className = 'weather-card';

  const iconURL = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
 
  card.innerHTML = `
    <img src="${iconURL}" alt="${data.weather[0].description}" class="weather-icon">
    <h2>${data.name}</h2>
    <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
    <p><strong>Weather:</strong> ${data.weather[0].description}</p>
    <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
    <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
  `;

  container.appendChild(card);
}

function initCarousel() {
  const carouselWrapper = document.querySelector('.carousel-wrapper');
  const nextButton = document.querySelector('.carousel-control.next');
  const prevButton = document.querySelector('.carousel-control.prev');
  const cards = document.querySelectorAll('.weather-card');

  if (cards.length === 0) return;

  const cardWidth = cards[0].offsetWidth + 20; 
  let index = 0;


  carouselWrapper.style.width = `${cards.length * cardWidth}px`;

  nextButton.addEventListener('click', () => {
    if (index < cards.length - 1) {
      index++;
      carouselWrapper.style.transform = `translateX(-${index * cardWidth}px)`;
    }
  });

  prevButton.addEventListener('click', () => {
    if (index > 0) {
      index--;
      carouselWrapper.style.transform = `translateX(-${index * cardWidth}px)`;
    }
  });
}

getForecast();


