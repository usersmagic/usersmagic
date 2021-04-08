window.onload = () => {
  const landingAllHeader = document.querySelector('.landing-all-header');
  const landingAllContent = document.querySelector('.landing-all-content');

  landingAllContent.onscroll = () => {
    if (landingAllContent.scrollTop >= 70)
      landingAllHeader.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
    else
      landingAllHeader.style.boxShadow = "none";

    if (landingAllContent.scrollTop < window.innerHeight - 70) {
      if (landingAllContent.scrollTop >= 70)
        landingAllHeader.style.backgroundColor = "rgb(217, 232, 239)";
      else
        landingAllHeader.style.backgroundColor = "transparent";
    } else if (landingAllContent.scrollTop >= window.innerHeight - 70) {
      landingAllHeader.style.backgroundColor = "rgb(254, 254, 254)";
    }
  }

  document.addEventListener('click', event => {
    if (event.target.classList.contains('all-wrapper-right-button') || event.target.classList.contains('all-wrapper-left-button')) {
      document.querySelector('.all-wrapper').style.display = 'none';
    }

    if (event.target.classList.contains('go-company-button')) {
      document.querySelector('.all-wrapper-tester').style.display = 'none';
      document.querySelector('.all-wrapper-company').style.display = 'flex';
    }

    if (event.target.classList.contains('go-tester-button')) {
      document.querySelector('.all-wrapper-company').style.display = 'none';
      document.querySelector('.all-wrapper-tester').style.display = 'flex';
    }

    if (event.target.classList.contains('tester-landing-logo')) {
      window.location.reload()
    }
  });
}
