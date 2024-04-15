import {
  updateUser,
  uploadAvatar,
  checkUsernameAvailability,
  getAvatar,
  deleteUser,
} from '../mainApp/variables.js';

const currentUser = JSON.parse(localStorage.getItem('user'));
const userToken = localStorage.getItem('token');
const avatarKey = localStorage.getItem('AVATAR_KEY');
console.log('avatar_key', avatarKey);
console.log('currentUser', currentUser);
console.log('token', userToken);

if (currentUser === null) {
  window.location.href = '../../restaurant app/login/login.html';
}

const deleteButton = document.getElementById('delete');
const photoInput = document.getElementById('photo');
const avatars = document.querySelectorAll('.avatar');
const modal = document.querySelector('dialog');

photoInput.addEventListener('change', async (evt) => {
  const avatarFile = evt.target.files[0];
  try {
    await uploadAvatar(avatarFile, userToken);
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
      const responseData = await updateUser(userData, userToken);
      if (responseData !== undefined) {
        document.getElementById('userName').innerHTML =
          responseData.data.username;
      }
    } catch (error) {
      console.error('Update failed', error);
    }
  });
});

if (currentUser !== null) {
  document.getElementById('userName').innerHTML = currentUser.username;
  document.getElementById('profileUsername').value = currentUser.username;
  document.getElementById('profileEmail').value = currentUser.email;
}

if (avatarKey !== null) {
  const avatars = document.querySelectorAll('.avatar');
  for (const pfp of avatars) {
    pfp.src = await getAvatar(avatarKey);
  }
}

document.getElementById('header').addEventListener('click', () => {
  window.location.href = '../../restaurant app/mainApp/main.html';
});

deleteButton.addEventListener('click', async () => {
  modal.show();
});

document.getElementById('dontDelete').addEventListener('click', async () => {
  modal.close();
});
document.getElementById('deleteUser').addEventListener('click', async () => {
  await deleteUser(userToken);
  modal.close();
  location.reload();
});
