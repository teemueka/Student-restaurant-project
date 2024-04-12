import {
  checkUsernameAvailability,
  userLogin,
  createUser,
} from '../mainApp/variables.js';

const form = document.getElementById('form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const reg_usernameInput = document.getElementById('reg-username');
  const reg_emailInput = document.getElementById('reg-email');
  const reg_passwordInput = document.getElementById('reg-password');

  const login_usernameInput = document.getElementById('login-username')
  const login_passwordInput = document.getElementById('login-password')

  if (reg_usernameInput && reg_emailInput && reg_passwordInput) {
    const username = reg_usernameInput.value;
    const email = reg_emailInput.value.trim();
    const password = reg_passwordInput.value.trim();
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
    } catch (error) {
      console.error('Error registering user:', error.message);
    }

  } else if (login_usernameInput && login_passwordInput) {
    const username = login_usernameInput.value;
    const password = login_passwordInput.value.trim();

    try {
      await userLogin(username, password)
      window.location.href = '../../restaurant app/mainApp/main.html';
    } catch (error) {
      document.getElementById('password-error').innerHTML =
        '<p>Incorrect username or password</p>';
      console.log('error logging in', error);
    }
  }
});

const validateUsername = async (username) => {
  const regex = /^.{5,}$/;
  const isUsernameValid = regex.test(username);

  if (!isUsernameValid) {
    document.getElementById('username-error').innerHTML =
      '<p>Username must be at least 5 characters long</p>';
    return;
  }

  const isAvailable = await checkUsernameAvailability(username); // Check username availability
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
    await createUser(userData);
    window.location.href = '../../restaurant app/mainApp/main.html';
  } catch (error) {
    console.error('Error registering user: ', error.message);
    if (error.message.includes('email already exists')) {
      document.getElementById('email-error').innerHTML = '<p>Email in use</p>';
    } else {
      document.getElementById('email-error').innerHTML = '';
    }
    throw new Error('Registration failed')
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

}

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

  document.getElementById('switchToRegistration').addEventListener('click', registration);

}

login();
