import {
  updateUser,
  uploadAvatar,
  checkUsernameAvailability,
} from '../mainApp/variables.js';

const currentUser = JSON.parse(localStorage.getItem('user'));
console.log(currentUser);
document.getElementById('userName').innerHTML = currentUser.data.username;
document.getElementById('profileUsername').value = currentUser.data.username;
document.getElementById('profileEmail').value = currentUser.data.email;
document.getElementById('profilePassword').value = currentUser.data.password;
const photoInput = document.getElementById('photo');
const avatars = document.querySelectorAll('.avatar');

photoInput.addEventListener('change', async (evt) => {
  const avatarFile = evt.target.files[0];
  try {
    await uploadAvatar(avatarFile, currentUser.token);
    const reader = new FileReader();
    // localStorage.setItem('AVATAR_KEY', avatarFile.name);
    reader.onload = () => {
      avatars.forEach(picture => {
        picture.src = reader.result;
      })
    };
    reader.readAsDataURL(avatarFile);
  } catch (error) {
    console.log('Error uploading avatar', error);
  }
});
document.addEventListener('DOMContentLoaded', (event) => {
  const form = document.getElementById('updateUserForm');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('profileUsername').value;
    const email = document.getElementById('profileEmail').value;
    const password = document.getElementById('profilePassword').value;

    try {
      await checkUsernameAvailability(username);
    } catch (error) {
      console.log('username not available', error);
      return;
    }

    const userData = {
      username: username,
      email: email,
      password: password,
    };

    try {
      const responseData = await updateUser(userData, currentUser.token);
      console.log('Update successful', responseData);
      document.getElementById('userName').innerHTML =
        responseData.data.username;
    } catch (error) {
      console.error('Update failed', error);
    }
  });
});
