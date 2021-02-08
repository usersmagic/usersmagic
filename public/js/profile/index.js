window.onload = () => {
  listenDropDownListInputs(document); // Listen for drop down items

  const countries = JSON.parse(document.getElementById('countries').value);
  const countryInput = document.getElementById('country-input');

  document.addEventListener('focusout', event => {
    if (event.target.id == 'country-visible-input')
      setTimeout(() => {
        document.querySelector('.phone-code').innerHTML = '+' + (countries.find(country => country.alpha2_code == countryInput.value) ? countries.find(country => country.alpha2_code == countryInput.value).phone_code : '0');
      }, 100);
  });
}
