import {baseUrl} from './utils.js';
import {fetchData, weeklyMenu, dailyMenu} from './variables.js';
import {initializeMap, addMarkers, calculateDistance} from './leaflet.js';

const currentUser = localStorage.getItem('user');
console.log(currentUser);
const parseUser = JSON.parse(localStorage.getItem('user'));
console.log(parseUser);
console.log(parseUser.data);
console.log(parseUser.token);

navigator.geolocation.getCurrentPosition((position) => {
  const userLatitude = position.coords.latitude;
  const userLongitude = position.coords.longitude;

  initializeMap(userLatitude, userLongitude);
});

const processRestaurants = async () => {
  const restaurants = await fetchData(baseUrl);

  restaurants.sort((a, b) =>
    a.name.toLowerCase().trim().localeCompare(b.name.toLowerCase().trim())
  );

  return restaurants;
};

// I know this function is a piece of shit, but it works so w.e
const sortByDistance = async (distance) => {
  let sorted = [];
  let restaurants = await processRestaurants();

  navigator.geolocation.getCurrentPosition((position) => {
    const userLatitude = position.coords.latitude;
    const userLongitude = position.coords.longitude;
    restaurants.forEach((restaurant) => {
      const distanceFromUser = calculateDistance(userLatitude, userLongitude, restaurant.location.coordinates[1], restaurant.location.coordinates[0])
      if (distanceFromUser < distance) {
        sorted.push(restaurant);
      }
  })
  addMarkers(sorted)
  });
}

const sortRestaurants = async (sortBy) => {
  let restaurants = await processRestaurants();

  restaurants =
    sortBy === 'sodexo'
      ? restaurants.filter(
          (restaurant) => restaurant.company.toLowerCase() === 'sodexo'
        )
      : sortBy === 'compass group'
        ? restaurants.filter(
            (restaurant) => restaurant.company.toLowerCase() === 'compass group'
          )
        : restaurants;

  addMarkers(restaurants);
};

const displayAll = document.getElementById('default');
displayAll.addEventListener('click', async () => {
  await sortRestaurants('all');
});

const sodexoButton = document.getElementById('sodexoBtn');
sodexoButton.addEventListener('click', async () => {
  await sortRestaurants('sodexo');
});

const compassButton = document.getElementById('compassBtn');
compassButton.addEventListener('click', async () => {
  await sortRestaurants('compass group');
});

const distanceInput = document.getElementById('distance');
const distanceSort = document.getElementById('distanceSort');
const distanceError = document.getElementById('distanceError');
distanceSort.addEventListener('click', async () => {
  distanceError.innerHTML = '';
  const distance = distanceInput.value;
  if (distance >= 0 && distance.trim() !== '') {
    await sortByDistance(distance);
  } else {
    distanceError.innerHTML = '<p>Invalid distance</p>';
  }
})

const userProfile = document.getElementById('profile');
userProfile.addEventListener('click', () => {
  window.location.href = '../profile/profile.html';
});

sortRestaurants('all');
