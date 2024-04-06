const name = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const form = document.getElementById('form');

form.addEventListener('submit', (evt) => {
  console.log('form submitted');
  window.location.href = 'main.html';
});
