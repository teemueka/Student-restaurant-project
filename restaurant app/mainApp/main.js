import {restaurantModal, restaurantRow} from './components.js';
import {baseUrl} from './utils.js';
import {fetchData, weeklyMenu} from './variables.js';
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

const createTables = async (sortBy) => {
  const tableNode = document.querySelector('table');
  const allButHeaders = tableNode.querySelectorAll('tr:not(:first-child)');

  allButHeaders.forEach((row) => {
    tableNode.removeChild(row);
  });

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

  const modal = document.querySelector('dialog');
  const modalDivs = modal.querySelectorAll('div');
  modalDivs.forEach((div) => {
    modal.removeChild(div);
  });
  const modalButtons = modal.querySelectorAll('button');
  modalButtons.forEach((button) => {
    modal.removeChild(button);
  });

  const closeBtn = document.createElement('button');
  closeBtn.innerText = 'Close';
  closeBtn.id = 'close-button';

  restaurants.forEach((restaurant) => {
    tableNode.appendChild(restaurantRow(restaurant));
  });

  const tableData = document.querySelectorAll('table tr:not(:first-child)');
  tableData.forEach((row, index) => {
    row.addEventListener('click', async () => {
      tableData.forEach((row) => row.classList.remove('highlight'));
      row.classList.toggle('highlight');

      const restaurantID = restaurants[index]._id;
      const restaurant = restaurants[index];

      try {
        const menu = await weeklyMenu(restaurantID);
        console.log(menu.days.length);
        if (menu.days.length !== 0) {
          modal.innerHTML = restaurantModal(restaurant, menu);
        }
      } catch (error) {
        console.error('Error fetching weekly menu: ', error);
      }

      modal.appendChild(closeBtn);
      modal.showModal();
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.close();
  });
};

const displayAll = document.getElementById('default');
displayAll.addEventListener('click', async () => {
  createTables('all');
});

const sodexoButton = document.getElementById('sodexoBtn');
sodexoButton.addEventListener('click', async () => {
  createTables('sodexo');
});

const compassButton = document.getElementById('compassBtn');
compassButton.addEventListener('click', async () => {
  createTables('compass group');
});

const userProfile = document.getElementById('profile');
userProfile.addEventListener('click', () => {
  console.log('avatar clicked');
});

createTables('all');
