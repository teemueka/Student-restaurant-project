import {baseUrl} from './utils.js';
import {fetchData, getAvatar, getCurrentUserByToken} from './variables.js';
import {initializeMap, addMarkers, calculateDistance} from './leaflet.js';

const currentUser = JSON.parse(localStorage.getItem('user'));
const userToken = localStorage.getItem('token');
const avatarKey = localStorage.getItem('AVATAR_KEY');
const bannerPfp = document.getElementById('bannerPfp');

if (currentUser !== null && currentUser.username !== undefined) {
  document.getElementById('userName').innerHTML = currentUser.username;
} else {
  const dropDown = document.querySelector('.dropDown-content');
  dropDown.innerHTML = '';
  dropDown.innerHTML = `<a id="noUser" href="../login/login.html">Login</a>`;
}

if (avatarKey !== null) {
  try {
    bannerPfp.src = await getAvatar(avatarKey);
  } catch (error) {
    console.log(error);
  }
} else {
  if (userToken !== null) {
    try {
      const currentUserByToken = await getCurrentUserByToken(userToken);
      bannerPfp.src = await getAvatar(currentUserByToken.avatar);
    } catch (e) {
      /* empty */
    }
  }
}

navigator.geolocation.getCurrentPosition((position) => {
  const userLatitude = position.coords.latitude;
  const userLongitude = position.coords.longitude;

  initializeMap(userLatitude, userLongitude);
});

const processRestaurants = async () => {
  return await fetchData(baseUrl);
};

const sortByDistance = async (distance) => {
  const sorted = [];
  const restaurants = await processRestaurants();

  navigator.geolocation.getCurrentPosition((position) => {
    const userLatitude = position.coords.latitude;
    const userLongitude = position.coords.longitude;
    restaurants.forEach((restaurant) => {
      const distanceFromUser = calculateDistance(
        userLatitude,
        userLongitude,
        restaurant.location.coordinates[1],
        restaurant.location.coordinates[0]
      );
      if (distanceFromUser < distance) {
        sorted.push(restaurant);
      }
    });
    addMarkers(sorted);
  });
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
});

const logout = () => {
  localStorage.clear();
  location.reload();
};

document.addEventListener('DOMContentLoaded', () => {
  if (currentUser !== null) {
    document.getElementById('logoutDrop').addEventListener('click', logout);
  }
});
await sortRestaurants('all');
