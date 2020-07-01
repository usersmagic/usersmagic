const smoothScroll = (scrollAmount, contentWrapper) => {
  if (scrollAmount <= 0)
    return;

  contentWrapper.scrollBy(0, 7);

  setTimeout(() => {
    smoothScroll(scrollAmount-7, contentWrapper);
  }, 0.001);
}

const dissapearToLeft = (referencesWrapper) => {
  const currNode = referencesWrapper.childNodes[0];

  if (currNode.classList.contains('reference-disappear-animation-class'))
    currNode.classList.remove('reference-disappear-animation-class');

  currNode.classList.add('reference-disappear-animation-class');

  setTimeout(() => {
    currNode.remove();

    setTimeout(() => {
      currNode.classList.remove('reference-disappear-animation-class');
      referencesWrapper.appendChild(currNode);
      return dissapearToLeft(referencesWrapper);
    }, 10000);
  }, 1500);
}

window.onload = () => {
  const contentWrapper = document.querySelector('.content-wrapper');
  const headerWrapper = document.querySelector('.header-wrapper');
  const currentLanguage = document.querySelector('.current-language');
  const learnMoreLink = document.querySelector('.learn-more-link');
  const formTitle = document.querySelector('.form-title');
  const formWrapper = document.querySelector('.form-wrapper');
  const eachServices = document.querySelectorAll('.each-services-line');
  const testerInfo = document.querySelectorAll('.purple.tester-info-text');
  const changeLanguageMenu = document.querySelector('.change-language-menu');
  const successText = document.getElementById('success-text');
  const badRequestError = document.getElementById('bad-request-error');
  const databaseError = document.getElementById('database-error');
  const unknownError = document.getElementById('unknown-error');
  const referencesWrapper = document.querySelector('.references-wrapper');

  dissapearToLeft(referencesWrapper);

  contentWrapper.onscroll = event => {
    if (contentWrapper.scrollTop >= 70) {
      headerWrapper.style.borderBottom = "1px solid rgba(254, 254, 254, 0.1)";
      currentLanguage.style.marginTop = "1px";
    } else {
      headerWrapper.style.borderBottom = "0px";
      currentLanguage.style.marginTop = "0px";
    }

    if (contentWrapper.scrollTop > 0 && !learnMoreLink.classList.contains('opacity-decrease-animation-class')) {
      if (learnMoreLink.classList.contains('opacity-increase-animation-class'))
        learnMoreLink.classList.remove('opacity-increase-animation-class');
      learnMoreLink.classList.add('opacity-decrease-animation-class');
    } else if (contentWrapper.scrollTop == 0 && learnMoreLink.classList.contains('opacity-decrease-animation-class')) {
      if (learnMoreLink.classList.contains('opacity-decrease-animation-class'))
        learnMoreLink.classList.remove('opacity-decrease-animation-class');
      learnMoreLink.classList.add('opacity-increase-animation-class');
    }

    if (contentWrapper.scrollTop >= window.innerHeight - 220) {
      eachServices.forEach(service => {
        if (!service.classList.contains('opacity-slowly-increase-animation-class'))
          service.classList.add('opacity-slowly-increase-animation-class');
      });
    }

    if (contentWrapper.scrollTop >= window.innerHeight + 200) {
      testerInfo.forEach(info => {
        if (!info.classList.contains('opacity-increase-animation-class'))
          info.classList.add('opacity-slowly-increase-animation-class');
      });
    }
  }

  document.addEventListener('click', event => {
    if (event.target.classList.contains('learn-more-link') || event.target.parentNode.classList.contains('learn-more-link')) {
      smoothScroll(window.innerHeight, contentWrapper);
    }

    if (event.target.classList.contains('header-register-button') || event.target.parentNode.classList.contains('header-register-button') || event.target.classList.contains('start-page-button') || event.target.parentNode.classList.contains('start-page-button')) {
      formTitle.scrollIntoView();
    }
  });

  document.addEventListener('mouseover', event => {
    if (event.target.className == 'change-language-wrapper' || event.target.parentNode.className == 'change-language-wrapper' || event.target.parentNode.parentNode.className == 'change-language-wrapper' || event.target.parentNode.parentNode.parentNode.className == 'change-language-wrapper') {
      changeLanguageMenu.style.display = 'block';
    } else {
      changeLanguageMenu.style.display = 'none';
    }
  });

  formWrapper.onsubmit = event => {
    event.preventDefault();
    console.log("here");

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
      name: document.getElementById('name-input').value,
      title: document.getElementById('title-input').value,
      business: document.getElementById('business-input').value,
      phone: document.getElementById('phone-input').value,
      company: document.getElementById('company-input').value,
      link: document.getElementById('link-input').value
    }));

    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if (xhr.status == 200) {
          successText.style.display = 'block';
          badRequestError.style.display = 'none';
          databaseError.style.display = 'none';
          unknownError.style.display = 'none';
        } else if (xhr.status == 400) {
          successText.style.display = 'none';
          badRequestError.style.display = 'block';
          databaseError.style.display = 'none';
          unknownError.style.display = 'none';
        } else if (xhr.status == 500) {
          successText.style.display = 'none';
          badRequestError.style.display = 'none';
          databaseError.style.display = 'block';
          unknownError.style.display = 'none';
        } else {
          successText.style.display = 'none';
          badRequestError.style.display = 'none';
          databaseError.style.display = 'none';
          unknownError.style.display = 'block';
        }
      }
    }
  }
}
