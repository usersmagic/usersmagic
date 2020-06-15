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
  const learnMoreLink = document.querySelector('.learn-more-link');
  const formTitle = document.querySelector('.form-title');

  contentWrapper.onscroll = event => {
    if (contentWrapper.scrollTop >= 70) {
      headerWrapper.style.borderBottom = "1px solid rgba(254, 254, 254, 0.1)";
    } else {
      headerWrapper.style.borderBottom = "0px";
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
  }

  document.addEventListener('click', event => {
    if (event.target.classList.contains('learn-more-link') || event.target.parentNode.classList.contains('learn-more-link')) {
      smoothScroll(window.innerHeight, contentWrapper);
    }

    if (event.target.classList.contains('header-register-button') || event.target.parentNode.classList.contains('header-register-button') || event.target.classList.contains('start-page-button') || event.target.parentNode.classList.contains('start-page-button')) {
      formTitle.scrollIntoView();
    }
  })
}
