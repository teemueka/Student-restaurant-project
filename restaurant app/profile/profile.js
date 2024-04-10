import {
  updateUser,
  getUserToken,
  uploadAvatar,
  checkUsernameAvailability,
} from '../mainApp/variables.js';

document.addEventListener('DOMContentLoaded', (event) => {
  const form = document.getElementById('updateUserForm');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const accessToken = getUserToken();

    const formData = new FormData(form);
    const userData = {};
    formData.forEach((value, key) => {
      userData[key] = value;
    });

    try {
      const responseData = await updateUser(userData, accessToken);
      console.log('Update successful', responseData);
    } catch (error) {
      console.error('Update failed', error);
    }
  });
});
