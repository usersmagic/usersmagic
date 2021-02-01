window.onload = () => {
  listenDropDownListInputs(document); // Listen for drop down items

  const completeForm = document.querySelector('.complete-form');
  const countries = JSON.parse(document.getElementById('countries').value);
  const genders = JSON.parse(document.getElementById('genders').value);
  const countryInput = document.getElementById('country-input');

  document.addEventListener('focusout', event => {
    if (event.target.id == 'country-visible-input')
      setTimeout(() => {
        document.querySelector('.phone-code').innerHTML = '+' + (countries.find(country => country.alpha2_code == countryInput.value) ? countries.find(country => country.alpha2_code == countryInput.value).phone_code : '0');
      }, 100);
  });

  const badRequestError = document.getElementById('bad-request-error');
  const countryError = document.getElementById('country-error');
  const genderError = document.getElementById('gender-error');
  const phoneError = document.getElementById('phone-error');
  const networkError = document.getElementById('network-error');
  const unknownError = document.getElementById('unknown-error');

  completeForm.onsubmit = event => {
    event.preventDefault();

    badRequestError.style.display =
    countryError.style.display =
    genderError.style.display =
    phoneError.style.display =
    networkError.style.display =
    unknownError.style.display = 'none';

    const name = document.getElementById('name-input').value.trim();
    const country = document.getElementById('country-input').value.trim();
    const phoneCode = document.getElementById('phone-code').innerHTML.trim();
    const phone = document.getElementById('phone-input').value.trim();
    const gender = document.getElementById('gender-input').value.trim();
    const birthYear = document.getElementById('birth-year-input').value.trim();

    if (!name || !name.length || !country || !country.length || !phoneCode || !phoneCode.length || !phone || !phone.length || !gender || !gender.length || !birthYear || !birthYear.length)
      return badRequestError.style.display = 'block';

    if (!countries.find(each => each.alpha2_code == country))
      return countryError.style.display = 'block';

    if (!genders.find(each => each.id == gender))
      return genderError.style.display = 'block';

    serverRequest('/auth/complete', 'POST', {
      name,
      country,
      phone: (phoneCode + ' ' + phone).trim(),
      gender,
      birth_year: birthYear
    }, res => {
      if (!res.success) {
        if (res.error == 'bad_request')
          return badRequestError.style.display = 'block';
        else if (res.error == 'phone_validation')
          return phoneError.style.display = 'block';
        else if (res.error == 'network_error')
          return networkError.style.display = 'block';
        else if (res.error == 'already_authenticated')
          return window.location = '/campaigns';
        else
          return unknownError.style.display = 'block';
      } else {
        return window.location = '/campaigns';
      }
    });
  }
}
