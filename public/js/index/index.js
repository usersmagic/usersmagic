const smoothScroll = (scrollAmount, contentWrapper) => {
  if (scrollAmount <= 0)
    return;

  contentWrapper.scrollBy(0, 7);

  setTimeout(() => {
    smoothScroll(scrollAmount-7, contentWrapper);
  }, 0.001);
}

window.onload = () => {
  const contentWrapper = document.querySelector('.content-wrapper');
  const headerWrapper = document.querySelector('.header-wrapper');
  const currentLanguage = document.querySelector('.current-language');
  const learnMoreLink = document.querySelector('.learn-more-link');
  const formTitle = document.querySelector('.form-title');
  const eachServices = document.querySelectorAll('.each-services-line');
  const testerInfo = document.querySelectorAll('.purple.tester-info-text');
  const changeLanguageMenu = document.querySelector('.change-language-menu');

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
  })
}
