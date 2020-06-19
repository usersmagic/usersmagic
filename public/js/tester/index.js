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
  const formWrapper = document.querySelector('.form-wrapper');
  const formResponse = document.querySelector('.form-response');
  const eachServices = document.querySelectorAll('.each-services-line');
  const testerInfo = document.querySelectorAll('.purple.tester-info-text');
  const changeLanguageMenu = document.querySelector('.change-language-menu');
  const studentButton = document.querySelector('.student-button');
  const professionInput = document.getElementById('profession-input');

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

    if (event.target.classList.contains('student-button-wrapper') || event.target.parentNode.classList.contains('student-button-wrapper') || event.target.parentNode.parentNode.classList.contains('student-button-wrapper')) {
      if (studentButton.style.backgroundColor == "rgb(254, 254, 254)") {
        studentButton.style.backgroundColor = "transparent";
        studentButton.childNodes[0].style.display = "none";
        professionInput.value = "";
      } else {
        studentButton.style.backgroundColor = "rgb(254, 254, 254)";
        studentButton.childNodes[0].style.display = "block";
        professionInput.value = "Öğrenci";
      }
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

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/tester', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
      email: document.getElementById('email-input').value,
      name: document.getElementById('name-input').value,
      gender: document.getElementById('gender-input').value,
      phone: document.getElementById('phone-input').value,
      birth_time: {
        day: document.getElementById('birth-day-input').value,
        month: document.getElementById('birth-month-input').value,
        year: document.getElementById('birth-year-input').value
      },
      last_school: document.getElementById('last-school-input').value,
      profession: document.getElementById('profession-input').value
    }));

    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if (xhr.status == 200) {
          formResponse.innerHTML = "Kaydın başarı ile alında, bir hafta içinde temsilcilerimiz sana ulaşacak!"
          formResponse.style.color = "rgb(0, 204, 136)";
        } else if (xhr.status == 400) {
          formResponse.innerHTML = "Lütfen geçerli bir e-posta adresi gir."
          formResponse.style.color = "rgb(234, 49, 96)";
        } else if (xhr.status == 500) {
          formResponse.innerHTML = "Bu e-posta adresi zaten kaydedilmiş."
          formResponse.style.color = "rgb(234, 49, 96)";
        } else {
          formResponse.innerHTML = "Bilinmeyen bir hata oluştu, lütfen daha sonra tekrar dene."
          formResponse.style.color = "rgb(234, 49, 96)";
        }
      }
    }
  }
}
