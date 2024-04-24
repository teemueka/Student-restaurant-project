import {
  checkUsernameAvailability,
  userLogin,
  createUser,
} from '../mainApp/variables.js';
import {
  validateUsername,
  validatePassword,
  validateEmail,
} from '../mainApp/validators.js';

const currentUser = JSON.parse(localStorage.getItem('user'));
const userToken = localStorage.getItem('token');
console.log(currentUser);
console.log(userToken);
const form = document.getElementById('form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const regUsernameInput = document.getElementById('reg-username');
  const regEmailInput = document.getElementById('reg-email');
  const regPasswordInput = document.getElementById('reg-password');

  const loginUsernameInput = document.getElementById('login-username');
  const loginPasswordInput = document.getElementById('login-password');

  if (regUsernameInput && regEmailInput && regPasswordInput) {
    const username = regUsernameInput.value;
    const email = regEmailInput.value.trim();
    const password = regPasswordInput.value.trim();
    let hasErrors = false;

    if (!validateUsername(username)) {
      document.getElementById('username-error').innerHTML =
        '<p>Username must be at least 5 characters long</p>';
      hasErrors = true;
    } else {
      try {
        const isAvailable = await checkUsernameAvailability(username);
        document.getElementById('username-error').innerHTML = '';

        if (!isAvailable) {
          document.getElementById('username-error').innerHTML =
            '<p>Username already taken</p>';
          hasErrors = true;
        }
      } catch (error) {
        document.getElementById('username-error').innerHTML =
          '<p>Error validating username</p>';
        hasErrors = true;
      }
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
    } catch (error) {
      console.error('Error registering user:', error.message);
    }
  } else if (loginUsernameInput && loginPasswordInput) {
    const username = loginUsernameInput.value;
    const password = loginPasswordInput.value.trim();

    try {
      await userLogin(username, password);
      window.location.href = '../../restaurant app/mainApp/main.html';
    } catch (error) {
      document.getElementById('password-error').innerHTML =
        '<p>Incorrect username or password</p>';
      console.log('error logging in', error);
    }
  }
});

const handleRegistration = async (userData) => {
  try {
    await createUser(userData);
    const {username, password} = userData;
    await userLogin(username, password);
    window.location.href = '../../restaurant app/mainApp/main.html';
  } catch (error) {
    console.error('Error registering user: ', error.message);
    if (error.message.includes('email already exists')) {
      document.getElementById('email-error').innerHTML = '<p>Email in use</p>';
    } else {
      document.getElementById('email-error').innerHTML = '';
    }
    throw new Error('Registration failed');
  }
};

const registration = () => {
  form.innerHTML = `
    <h1>Registration</h1>
    <div class="input-control">
      <label for="reg-username">Username</label>
      <input id="reg-username" name="username" type="text" required />
      <div class="error" id="username-error"></div>
    </div>
    <div class="input-control">
      <label for="reg-email">Email</label>
      <input id="reg-email" name="email" type="text" required />
      <div class="error" id="email-error"></div>
    </div>
    <div class="input-control">
      <label for="reg-password">Password</label>
      <input id="reg-password" name="password" type="password" required />
      <div class="error" id="password-error"></div>
    </div>
    <div class="alreadyUser">
      <p>Already have an account?</p>
      <a href="#" id="switchToLogin">Sign in</a>
    </div>
    <button type="submit" >Register</button>`;

  document.getElementById('switchToLogin').addEventListener('click', login);
};

const login = () => {
  form.innerHTML = `
    <h1>Login</h1>
    <div class="input-control">
      <label for="login-username">Username</label>
      <input id="login-username" name="username" type="text" required />
      <div class="error" id="username-error"></div>
    </div>
    <div class="input-control">
      <label for="login-password">Password</label>
      <input id="login-password" name="password" type="password" required />
      <div class="error" id="password-error"></div>
    </div>
    <div class="alreadyUser">
      <p>Make an account</p>
      <a href="#" id="switchToRegistration">Sign up</a>
    </div>
    <button type="submit">Log in</button>`;

  document
    .getElementById('switchToRegistration')
    .addEventListener('click', registration);
};

if (currentUser !== null) {
  login();
} else {
  registration();
}
