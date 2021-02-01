window.onload = () => {
  const loginForm = document.querySelector('.login-form');

  const badRequestError = document.getElementById('bad-request-error');
  const notFoundError = document.getElementById('not-found-error');
  const wrongPasswordError = document.getElementById('wrong-password-error');
  const networkError = document.getElementById('network-error');
  const unknownError = document.getElementById('unknown-error');

  loginForm.onsubmit = event => {
    event.preventDefault();

    badRequestError.style.display =
    notFoundError.style.display =
    wrongPasswordError.style.display = 
    networkError.style.display =
    unknownError.style.display = 'none';

    const email = document.getElementById('email-input').value.trim();
    const password = document.getElementById('password-input').value.trim();

    if (!email || !email.length || !password || !password.length)
      return badRequestError.style.display = 'block';

    serverRequest('/auth/login', 'POST', {
      email,
      password
    }, res => {
      if (!res.success) {
        if (res.error == 'bad_request')
          return badRequestError.style.display = 'block';
        else if (res.error == 'document_not_found')
          return notFoundError.style.display = 'block';
        else if (res.error == 'password_verification')
          return wrongPasswordError.style.display = 'block';
        else if (res.error == 'network_error')
          return networkError.style.display = 'block';
        else
          return unknownError.style.display = 'block';
      } else {
        return window.location = '/campaigns';
      }
    });
  }
}
