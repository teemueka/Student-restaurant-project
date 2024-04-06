import {baseUrl} from './utils.js';
import {fetchData, weeklyMenu, dailyMenu} from './variables.js';
import {initializeMap, addMarkers} from './leaflet.js';

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
  sortRestaurants('all');
});

const sodexoButton = document.getElementById('sodexoBtn');
sodexoButton.addEventListener('click', async () => {
  sortRestaurants('sodexo');
});

const compassButton = document.getElementById('compassBtn');
compassButton.addEventListener('click', async () => {
  sortRestaurants('compass group');
});

const userProfile = document.getElementById('profile');
userProfile.addEventListener('click', () => {
  console.log('avatar clicked');
  window.location.href = '../profile/profile.html';
});

sortRestaurants('all');
