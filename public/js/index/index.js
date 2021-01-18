const smoothScroll = (scrollAmount, contentWrapper) => {
  if (scrollAmount <= 0)
    return;

  contentWrapper.scrollBy(0, 5);

  setTimeout(() => {
    smoothScroll(scrollAmount-5, contentWrapper);
  }, 0.001);
}

window.onload = () => {
  const landingAllHeader = document.querySelector('.landing-all-header');
  const landingAllContent = document.querySelector('.landing-all-content');

  const nameInput = document.getElementById('name-input');
  const surnameInput = document.getElementById('surname-input');
  const emailInput = document.getElementById('email-input');
  const companyNameInput = document.getElementById('company-name-input');
  const detailsInput = document.getElementById('details-input');

  const generalErrorSpan = document.getElementById('general-error-span');
  const alreadyRegisteredErrorSpan = document.getElementById('already-registered-error-span');
  const missingInformationErrorSpan = document.getElementById('missing-information-error-span');
  const finishedSpan = document.getElementById('finished-span');

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
    // if (event.target.classList.contains('landing-start-button') || (event.target.parentNode && event.target.parentNode.classList.contains('landing-start-button')) || event.target.classList.contains('second-page-down-button') || (event.target.parentNode && event.target.parentNode.classList.contains('second-page-down-button')))
    //   smoothScroll(window.innerHeight - 70, landingAllContent);

    // if (event.target.classList.contains('landing-header-start-button'))
    //   document.querySelector('.contact-content-wrapper').scrollIntoView();

    if (event.target.classList.contains('contact-send-button') || event.target.parentNode.classList.contains('contact-send-button')) {
      generalErrorSpan.style.display = "none";
      alreadyRegisteredErrorSpan.style.display = "none";
      missingInformationErrorSpan.style.display = "none";
      finishedSpan.style.display = "none";

      if (!nameInput.value || !nameInput.value.length || !surnameInput.value || !surnameInput.value.length || !emailInput.value || !emailInput.value.length || !companyNameInput.value || !companyNameInput.value.length)
        return missingInformationErrorSpan.style.display = "block";
      
      const xhr = new XMLHttpRequest();
      xhr.open("POST", '/');
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

      xhr.send(JSON.stringify({
        name: nameInput.value,
        surname: surnameInput.value,
        email: emailInput.value,
        company_name: companyNameInput.value,
        details: detailsInput.value && detailsInput.value.length ? detailsInput.value : null
      }));
      
      xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          if (xhr.status == 200) 
            return finishedSpan.style.display = "block"
          else if (xhr.status == 400)
            return missingInformationErrorSpan.style.display = "block";
          else if (xhr.status == 500)
            return alreadyRegisteredErrorSpan.style.display = "block";
          else
            return generalErrorSpan.style.display = "block";
        }
      }
    }
  });
}
