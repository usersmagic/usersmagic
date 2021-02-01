window.onload = () => {
  const registerForm = document.querySelector('.register-form');
  const agreementWrapper = document.querySelector('.agreement-wrapper');
  const agreementCheckboxWrapper = document.querySelector('.agreement-checkbox-wrapper');

  const badRequestError = document.getElementById('bad-request-error');
  const agreementError = document.getElementById('agreement-error');
  const validEmailError = document.getElementById('valid-email-error');
  const duplicatedEmailError = document.getElementById('duplicated-email-error');
  const passwordLengthError = document.getElementById('password-length-error');
  const passwordConfirmError = document.getElementById('password-confirm-error');
  const networkError = document.getElementById('network-error');
  const unknownError = document.getElementById('unknown-error');

  registerForm.onsubmit = event => {
    event.preventDefault();

    badRequestError.style.display =
    agreementError.style.display =
    validEmailError.style.display =
    duplicatedEmailError.style.display =
    passwordLengthError.style.display =
    passwordConfirmError.style.display = 
    networkError.style.display =
    unknownError.style.display = 'none';

    const email = document.getElementById('email-input').value.trim();
    const password = document.getElementById('password-input').value.trim();
    const confirmPassword = document.getElementById('confirm-password-input').value.trim();
    const agreementApproved = agreementWrapper.childNodes[0].checked;
    const code = document.getElementById('invitor-code').value;

    if (!email || !email.length || !password || !password.length || !confirmPassword || !confirmPassword.length)
      return badRequestError.style.display = 'block';

    if (!agreementApproved)
      return agreementError.style.display = 'block';

    if (password.length < 6)
      return passwordLengthError.style.display = 'block';

    if (password != confirmPassword)
      return passwordConfirmError.style.display = 'block';

    serverRequest('/auth/register', 'POST', {
      email,
      password,
      code: (code ? code : null)
    }, res => {
      if (!res.success) {
        if (res.error == 'email_validation')
          return validEmailError.style.display = 'block';
        else if (res.error == 'email_duplication')
          return duplicatedEmailError.style.display = 'block';
        else if (res.error == 'network_error')
          return networkError.style.display = 'block';
        else
          return unknownError.style.display = 'block';
      } else {
        return window.location = '/campaigns';
      }
    });
  }

  document.addEventListener('click', event => {
    if (event.target.classList.contains('agreement-wrapper') || event.target.parentNode.classList.contains('agreement-wrapper') || event.target.parentNode.parentNode.classList.contains('agreement-wrapper')) {
      if (agreementWrapper.childNodes[0].checked) {
        agreementWrapper.childNodes[0].checked = false;
        agreementCheckboxWrapper.style.backgroundColor = 'rgb(254, 254, 254)';
        agreementCheckboxWrapper.style.borderColor = 'rgba(151, 151, 151, 0.3)';
      } else {
        agreementWrapper.childNodes[0].checked = true;
        agreementCheckboxWrapper.style.backgroundColor = 'rgb(46, 197, 206)';
        agreementCheckboxWrapper.style.borderColor = 'transparent';
      }
    }
  });
}
