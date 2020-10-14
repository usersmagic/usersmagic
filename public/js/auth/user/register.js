window.onload = () => {
  const registerForm = document.querySelector('.register-form');
  const agreementWrapper = document.querySelector('.agreement-wrapper');
  const agreementCheckboxWrapper = document.querySelector('.agreement-checkbox-wrapper');

  registerForm.onsubmit = event => {
    event.preventDefault();
    if (!agreementWrapper.childNodes[0].checked) {
      agreementCheckboxWrapper.style.borderColor = "rgb(240, 84, 79)";
      setTimeout(() => {
        agreementCheckboxWrapper.style.borderColor = "rgb(236, 236, 236)";
      }, 500);
    } else {
      registerForm.submit();
    }
  }

  document.addEventListener('click', event => {
    if (event.target.classList.contains('agreement-wrapper') || event.target.parentNode.classList.contains('agreement-wrapper') || event.target.parentNode.parentNode.classList.contains('agreement-wrapper')) {
      if (agreementWrapper.childNodes[0].checked) {
        agreementWrapper.childNodes[0].checked = false;
        agreementCheckboxWrapper.style.backgroundColor = "rgb(254, 254, 254)";
      } else {
        agreementWrapper.childNodes[0].checked = true;
        agreementCheckboxWrapper.style.backgroundColor = "rgb(240, 84, 79)";
      }
    }
  })
}
