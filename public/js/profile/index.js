const getTowns = city => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "/profile/town?city=" + city.toLocaleLowerCase().trim());
  
  xhr.onreadystatechange = () => {
    if (xhr.readyState == xhr.DONE && xhr.responseText) {
      if (xhr.status == 500)
        return [];
      else {
        const towns = JSON.parse(xhr.responseText);
        towns.forEach(town => console.log(town));
        return towns;
      }
    };
  };

  xhr.send();
}

window.onload = () => {
  const user = JSON.parse(document.getElementById('user-object').value);
  const cities = JSON.parse(document.getElementById('city-array').value);
  let towns = [];

  const paymentNumberWrapper = document.querySelector('.payment-number-wrapper');

  const inviteButton = document.querySelector('.invite-button');
  document.addEventListener('mouseover', event => {
    if (event.target.classList.contains('invite-button') || event.target.parentNode.classList.contains('invite-button')) {
      inviteButton.classList.remove('invite-button-close-animation-class');
      inviteButton.classList.add('invite-button-open-animation-class');
    } else {
      if (inviteButton.classList.contains('invite-button-open-animation-class')) {
        inviteButton.classList.remove('invite-button-open-animation-class');
        inviteButton.classList.add('invite-button-close-animation-class');
      }
    }
  });

  const cityInputWrapper = document.querySelector('.city-input-wrapper');
  const cityInput = document.querySelector('.city-input');
  const cityInputChoices = document.querySelector('.city-input-choices');

  const townInputWrapper = document.querySelector('.town-input-wrapper');
  const townInput = document.querySelector('.town-input');
  const townInputChoices = document.querySelector('.town-input-choices');

  document.addEventListener('click', event => {
    if (event.target.className == 'get-credit-button' || event.target.parentNode.className == 'get-credit-button') {
      if (user.payment_number)
        return window.location = "/profile/payment";

      paymentNumberWrapper.style.display = 'flex';
    }

    if (event.target.className == 'close-payment-button'){ 
      paymentNumberWrapper.style.display = 'none';
    }

    if (event.target.className == 'invite-close-text') {
      document.querySelector('.invite-wrapper').style.display = 'none';
    } else if ((event.target.classList.contains('invite-button') || event.target.parentNode.classList.contains('invite-button'))) {
      document.querySelector('.invite-wrapper').style.display = 'flex';
    } else if (event.target.className == 'invite-copy-button' || event.target.parentNode.className == 'invite-copy-button') {
      const inviteMessage = document.querySelector('.invite-message');
      const range = document.createRange();
      range.selectNodeContents(inviteMessage);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand('copy');
      document.querySelector('.invite-copy-button-text').innerHTML = 'Kopyalandı!';
      document.querySelector('.invite-copy-button').style.cursor = 'default';
      setTimeout(() => {
        document.querySelector('.invite-copy-button-text').innerHTML = 'Linki Kopyala';
        document.querySelector('.invite-copy-button').style.cursor = 'pointer';
      }, 1000);
    } else if (event.target.className != 'invite-wrapper' && event.target.parentNode.className != 'invite-wrapper' && event.target.parentNode.parentNode.className != 'invite-wrapper' && event.target.parentNode.parentNode.parentNode.className != 'invite-wrapper') {
      document.querySelector('.invite-wrapper').style.display = 'none';
    }

    if (event.target.classList.contains('send-city-outer-wrapper')) {
      document.querySelector('.send-city-outer-wrapper').style.display = "none";
    }
    if (event.target.classList.contains('send-city-close-button') || event.target.parentNode.classList.contains('send-city-close-button')) {
      document.querySelector('.send-city-outer-wrapper').style.display = "none";
    }

    if (event.target.className == 'each-city-input-choice' && cityInputWrapper.classList.contains('open-bottom-animation-class')) {
      cityInput.value = event.target.innerHTML;
      townInput.value = "";
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "/profile/town?city=" + event.target.innerHTML.toLocaleLowerCase().trim());
      xhr.send();

      xhr.onreadystatechange = () => {
        if (xhr.readyState == xhr.DONE && xhr.responseText) {
          if (xhr.status == 500)
            towns = [];
          else {
            towns = [];
            const newTowns = JSON.parse(xhr.responseText);
            newTowns.forEach(town => towns.push(town));
          }
        };
      };
      cityInputWrapper.classList.remove('open-bottom-animation-class');
      cityInputWrapper.classList.add('close-up-animation-class');
      setTimeout(() => {
        cityInputChoices.scrollTo(0, 0);
      }, 500);
    } else if (cityInputWrapper.classList.contains('open-bottom-animation-class') && !cityInputWrapper.classList.contains('close-up-animation-class') && (event.target.className != 'city-input-choices' && event.target.className != 'city-input-wrapper' && event.target.className != 'city-input-outer-wrapper' && event.target.className != 'city-input')) {
      cityInputWrapper.classList.remove('open-bottom-animation-class');
      cityInputWrapper.classList.add('close-up-animation-class');
      setTimeout(() => {
        cityInputChoices.scrollTo(0, 0);
      }, 500);
    }

    if (event.target.className == 'each-town-input-choice' && townInputWrapper.classList.contains('open-bottom-animation-class')) {
      townInput.value = event.target.innerHTML;
      townInputWrapper.classList.remove('open-bottom-animation-class');
      townInputWrapper.classList.add('close-up-animation-class');
      setTimeout(() => {
        townInputChoices.scrollTo(0, 0);
      }, 500);
    } else if (townInputWrapper.classList.contains('open-bottom-animation-class') && !townInputWrapper.classList.contains('close-up-animation-class') && (event.target.className != 'town-input-choices' && event.target.className != 'town-input-wrapper' && event.target.className != 'town-input-outer-wrapper' && event.target.className != 'town-input')) {
      townInputWrapper.classList.remove('open-bottom-animation-class');
      townInputWrapper.classList.add('close-up-animation-class');
      setTimeout(() => {
        townInputChoices.scrollTo(0, 0);
      }, 500);
    }
  });

  if (cityInput.value && cityInput.value.length) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/profile/town?city=" + cityInput.value.toLocaleLowerCase().trim());
    xhr.send();

    xhr.onreadystatechange = () => {
      if (xhr.readyState == xhr.DONE && xhr.responseText) {
        if (xhr.status == 500)
          towns = [];
        else {
          towns = [];
          const newTowns = JSON.parse(xhr.responseText);
          newTowns.forEach(town => towns.push(town));
        }
      };
    };
  }

  cityInput.onfocus = () => {
    if (cityInputWrapper.classList.contains('close-up-animation-class'))
      cityInputWrapper.classList.remove('close-up-animation-class');

    cityInputWrapper.classList.add('open-bottom-animation-class');
  }

  cityInput.oninput = () => {
    townInput.value = "";
    towns = [];

    if (cityInput.value) {
      cityInputChoices.innerHTML = "";
      cities.forEach(city => {
        if (city.toLocaleLowerCase().includes(cityInput.value.toLocaleLowerCase())) {
          const newChoice = document.createElement('span');
          newChoice.classList.add('each-city-input-choice');
          newChoice.innerHTML = city;
          cityInputChoices.appendChild(newChoice);
          while (newChoice.previousElementSibling && newChoice.innerHTML.toLocaleLowerCase().indexOf(cityInput.value.toLocaleLowerCase()) < newChoice.previousElementSibling.innerHTML.toLocaleLowerCase().indexOf(cityInput.value.toLocaleLowerCase()))
            cityInputChoices.insertBefore(newChoice, newChoice.previousElementSibling);
        }
      });
      if (cities.includes(cityInput.value.charAt(0).toLocaleUpperCase() + cityInput.value.slice(1).toLocaleLowerCase())) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "/profile/town?city=" + cityInput.value.toLocaleLowerCase().trim());
        xhr.send();

        xhr.onreadystatechange = () => {
          if (xhr.readyState == xhr.DONE && xhr.responseText) {
            if (xhr.status == 500)
              towns = [];
            else {
              towns = [];
              const newTowns = JSON.parse(xhr.responseText);
              newTowns.forEach(town => towns.push(town));
            }
          };
        };
      }
    } else {
      cityInputChoices.innerHTML = "";
      cities.forEach(city => {
        const newChoice = document.createElement('span');
        newChoice.classList.add('each-city-input-choice');
        newChoice.innerHTML = city;
        cityInputChoices.appendChild(newChoice);
      });
    }
  }

  townInput.onfocus = () => {
    if (townInputWrapper.classList.contains('close-up-animation-class'))
      townInputWrapper.classList.remove('close-up-animation-class');

    if (towns.length) {
      townInputChoices.innerHTML = "";
      towns.forEach(town => {
        const newChoice = document.createElement('span');
        newChoice.classList.add('each-town-input-choice');
        newChoice.innerHTML = town;
        townInputChoices.appendChild(newChoice);
      });
    } else {
      townInputChoices.innerHTML = "";
      const noTown = document.createElement('span');
      noTown.classList.add('no-town');
      noTown.innerHTML = "Hiçbir ilçe bulunamadı, lütfen önce ilinizi seçin";
      townInputChoices.appendChild(noTown);
    }
    townInputWrapper.classList.add('open-bottom-animation-class');
  }

  townInput.oninput = () => {
    if (towns.length) {
      if (townInput.value) {
        townInputChoices.innerHTML = "";
        towns.forEach(town => {
          if (town.toLocaleLowerCase().includes(townInput.value.toLocaleLowerCase())) {
            const newChoice = document.createElement('span');
            newChoice.classList.add('each-town-input-choice');
            newChoice.innerHTML = town;
            townInputChoices.appendChild(newChoice);
            while (newChoice.previousElementSibling && newChoice.innerHTML.toLocaleLowerCase().indexOf(townInput.value.toLocaleLowerCase()) < newChoice.previousElementSibling.innerHTML.toLocaleLowerCase().indexOf(townInput.value.toLocaleLowerCase()))
              townInputChoices.insertBefore(newChoice, newChoice.previousElementSibling);
          }
        });
      } else {
        townInputChoices.innerHTML = "";
        towns.forEach(town => {
          const newChoice = document.createElement('span');
          newChoice.classList.add('each-town-input-choice');
          newChoice.innerHTML = town;
          townInputChoices.appendChild(newChoice);
        });
      }
    } else {
      townInputChoices.innerHTML = "";
      const noTown = document.createElement('span');
      noTown.classList.add('no-town');
      noTown.innerHTML = "Hiçbir ilçe bulunamadı, lütfen önce ilinizi seçin";
      townInputChoices.appendChild(noTown);
    }
  }
}
