import {checkUsernameAvailability,userLogin, createUser} from '../mainApp/variables.js';

const form = document.getElementById('form');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = usernameInput.value;
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  let hasErrors = false;

  try {
    await validateUsername(username);
  } catch (error) {
    document.getElementById('username-error').innerHTML =
      '<p>Username is already taken</p>';
    console.error('Error validating username:', error.message);
    hasErrors = true;
  }

  if (!validateEmail(email)) {
    document.getElementById('email-error').innerHTML = '<p>Invalid email</p>';
    hasErrors = true;
  } else {
    document.getElementById('email-error').innerHTML = '';
  }

  if (!validatePassword(password)) {
    document.getElementById('password-error').innerHTML =
      '<p>Password must contain 8 characters and a number</p>';
    hasErrors = true;
  } else {
    document.getElementById('password-error').innerHTML = '';
  }

  if (hasErrors) {
    return;
  }

  const userData = {
    username: username,
    email: email,
    password: password,
  };

  try {
    await handleRegistration(userData);
    // window.location.href = 'main.html';
  } catch (error) {
    console.error('Error registering user:', error.message);
  }
});

const validateUsername = async (username) => {
  const isAvailable = await checkUsernameAvailability(username);
  document.getElementById('username-error').innerHTML = '';
  if (!isAvailable) {
    document.getElementById('username-error').innerHTML =
      '<p>Username already taken</p>';
  }
};

const validateEmail = (email) => {
  const regex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return regex.test(email);
};

const validatePassword = (password) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return regex.test(password);
};

const handleRegistration = async (userData) => {
  try {
    const newUser = await createUser(userData);
    console.log('User registered successfully:', newUser);
  } catch (error) {
    console.error('Error registering user: ', error.message);
    if (error.message.includes('email already exists')) {
      document.getElementById('email-error').innerHTML = '<p>Email in use</p>';
    } else {
      document.getElementById('email-error').innerHTML = '';
    }
  }
};
