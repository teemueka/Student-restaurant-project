import {restaurantModal} from './components.js';
import {dailyMenu, updateUser, weeklyMenu} from './api.js';

let map;
let markers = [];
const modal = document.querySelector('dialog');
const token = localStorage.getItem('token');

const userIcon = L.icon({
  iconUrl: '../images/marker-icon-red.png',
  iconSize: [25, 41],
});

const initializeMap = (userLatitude, userLongitude) => {
  map = L.map('map').setView([userLatitude, userLongitude], 12);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const user = L.marker([userLatitude, userLongitude], {icon: userIcon}).addTo(
    map
  );
  const userPopup = `<p>You are here</p>`;
  user.bindPopup(userPopup);
};

let favourite;

const addMarkers = (restaurants) => {
  const user = JSON.parse(localStorage.getItem('user'));
  removeMarkers();

  navigator.geolocation.getCurrentPosition((position) => {
    const userLatitude = position.coords.latitude;
    const userLongitude = position.coords.longitude;

    let minDistance = Infinity;
    let nearestMarker = null;

    restaurants.forEach((restaurant) => {
      const distance = calculateDistance(
        userLatitude,
        userLongitude,
        restaurant.location.coordinates[1],
        restaurant.location.coordinates[0]
      );

      const marker = L.marker([
        restaurant.location.coordinates[1],
        restaurant.location.coordinates[0],
      ]).addTo(map);

      const popup = `<b>${restaurant.name}</b>
                     <br>${restaurant.address}
                     <br>Distance: ${distance.toFixed(2)} km`;

      try {
        if (user !== null && restaurant._id === user.favouriteRestaurant) {
          marker.setIcon(
            L.icon({
              iconUrl: '../images/marker-icon-green.png',
              iconSize: [25, 41],
            })
          );
        }
      } catch (e) {
        console.log('error setting user favourite', e.message);
      }

      if (distance < minDistance) {
        minDistance = distance;
        nearestMarker = marker;
      }
      marker.bindPopup(popup);

      const closeBtn = document.createElement('button');
      closeBtn.innerText = 'Close';
      closeBtn.id = 'close-button';
      closeBtn.addEventListener('click', () => {
        modal.close();
      });

      const dailyBtn = document.createElement('button');
      dailyBtn.innerText = "Today's menu";
      dailyBtn.id = 'toDaily';
      dailyBtn.addEventListener('click', async () => {
        const menu = await dailyMenu(restaurant._id);
        modal.innerHTML = restaurantModal(restaurant, menu);
        user ? modal.appendChild(favouriteBtn) : '';
        modal.appendChild(weeklyBtn);
        modal.appendChild(closeBtn);
      });

      const weeklyBtn = document.createElement('button');
      weeklyBtn.innerText = 'This weeks menu';
      weeklyBtn.id = 'toWeekly';
      weeklyBtn.addEventListener('click', async () => {
        const menu = await weeklyMenu(restaurant._id);
        modal.innerHTML = restaurantModal(restaurant, menu);
        user ? modal.appendChild(favouriteBtn) : '';
        modal.appendChild(dailyBtn);
        modal.appendChild(closeBtn);
      });

      const favouriteBtn = document.createElement('button');
      favouriteBtn.innerText = 'Favourite';
      favouriteBtn.id = 'favouriteBtn';

      const userData = {
        favouriteRestaurant: restaurant._id,
      };

      favouriteBtn.addEventListener('click', async () => {
        if (favourite !== marker) {
          await updateUser(userData, token);
          favourite = marker;
          favourite.setIcon(
            L.icon({
              iconUrl: '../images/marker-icon-green.png',
              iconSize: [25, 41],
            })
          );
          addMarkers(restaurants);
        }
      });


      marker.addEventListener('click', async () => {
        const menu = await dailyMenu(restaurant._id);
        modal.innerHTML = restaurantModal(restaurant, menu);
        user ? modal.appendChild(favouriteBtn) : '';
        modal.appendChild(weeklyBtn);
        modal.appendChild(closeBtn);
        modal.show();
      });
      markers.push(marker);
    });

    if (nearestMarker) {
      nearestMarker.bindPopup(
        nearestMarker.getPopup().getContent() +
          '<br><i>This is your nearest restaurant</i>'
      );
      nearestMarker.setIcon(
        L.icon({
          iconUrl: '../images/marker-icon-gold.png',
          iconSize: [25, 41],
        })
      );
    }
  });
};

const removeMarkers = () => {
  markers.forEach((marker) => {
    marker.remove();
  });
  markers = [];
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export {initializeMap, addMarkers, calculateDistance};
