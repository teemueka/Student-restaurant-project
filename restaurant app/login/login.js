import {
  checkUsernameAvailability,
  userLogin,
  createUser,
} from '../mainApp/variables.js';

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
    window.location.href = 'main.html';
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
const registration = () => {
  form.innerHTML = `
    <h1>Registration</h1>
    <div class="input-control">
      <label for="username">Username</label>
      <input id="username" name="username" type="text" required />
      <div class="error" id="username-error"></div>
    </div>
    <div class="input-control">
      <label for="email">Email</label>
      <input id="email" name="email" type="text" required />
      <div class="error" id="email-error"></div>
    </div>
    <div class="input-control">
      <label for="password">Password</label>
      <input id="password" name="password" type="password" required />
      <div class="error" id="password-error"></div>
    </div>
    <div class="alreadyUser">
      <p>Already have an account?</p>
      <a href="#" id="switchToLogin">Sign in</a>
    </div>
    <button type="submit" >Register</button>`;

  document.getElementById('switchToLogin').addEventListener('click', login);

}

const login = () => {
  form.innerHTML = `
    <h1>Login</h1>
    <div class="input-control">
      <label for="username">Username</label>
      <input id="username" name="username" type="text" required />
      <div class="error" id="username-error"></div>
    </div>
    <div class="input-control">
      <label for="password">Password</label>
      <input id="password" name="password" type="password" required />
      <div class="error" id="password-error"></div>
    </div>
    <div class="alreadyUser">
      <p>Make an account</p>
      <a href="#" id="switchToRegistration">Sign up</a>
    </div>
    <button type="submit">Log in</button>`;

  document.getElementById('switchToRegistration').addEventListener('click', registration);

}

registration();
