window.onload = () => {
  const registerButton = document.querySelector('.register-button');
  const buttonsWrapper = document.querySelector('.buttons-wrapper');

  document.addEventListener('click', event => {
    if (event.target.className == 'register-button' || event.target.parentNode.className == 'register-button') {
      registerButton.style.display = 'none';
      buttonsWrapper.style.display = 'flex';
    }
  });
}
