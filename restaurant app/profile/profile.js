import {
  updateUser,
  uploadAvatar,
  checkUsernameAvailability,
  getAvatar,
} from '../mainApp/variables.js';

const currentUser = JSON.parse(localStorage.getItem('user'));
const userToken = localStorage.getItem('token');
console.log(currentUser);
console.log('token', userToken);

const photoInput = document.getElementById('photo');
const avatars = document.querySelectorAll('.avatar');

photoInput.addEventListener('change', async (evt) => {
  const avatarFile = evt.target.files[0];
  try {
    // console.log(currentUser);
    // console.log(currentUser.token);
    await uploadAvatar(avatarFile, currentUser.token);
    const reader = new FileReader();
    reader.onload = () => {
      avatars.forEach((picture) => {
        picture.src = reader.result;
      });
    };
    reader.readAsDataURL(avatarFile);
  } catch (error) {
    console.log('Error uploading avatar', error);
  }
});
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('updateUserForm');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('profileUsername').value;
    const email = document.getElementById('profileEmail').value;
    const password = document.getElementById('profilePassword').value;

    try {
      await checkUsernameAvailability(username);
      console.log('username check');
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

const generateUserPictures = async () => {
  const avatars = document.querySelectorAll('.avatar');
  for (const pfp of avatars) {
    pfp.src = await getAvatar(localStorage.getItem('AVATAR_KEY'));
  }
};

if (currentUser !== null) {
  document.getElementById('userName').innerHTML = currentUser.data.username;
  document.getElementById('profileUsername').value = currentUser.data.username;
  document.getElementById('profileEmail').value = currentUser.data.email;
  document.getElementById('profilePassword').value = currentUser.data.password;
  await generateUserPictures();
}

document.getElementById('banner').addEventListener('click', () => {
  window.location.href = '../../restaurant app/mainApp/main.html';
});
