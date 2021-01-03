window.onload = () => {
  const selectInput = document.querySelector('.select-input');
  const selectInputWrapper = document.querySelector('.select-input-wrapper');
  const countryInput = document.getElementById('country-input');
  const selectInputChoices = document.querySelector('.select-input-choices');
  const inputChoices = document.querySelectorAll('.each-input-choice');

  selectInput.onfocus = () => {
    if (selectInputWrapper.classList.contains('close-up-animation-class'))
      selectInputWrapper.classList.remove('close-up-animation-class');

    selectInputWrapper.classList.add('open-bottom-animation-class');
  }

  selectInput.oninput = () => {
    if (selectInput.value) {
      selectInputChoices.innerHTML = "";
      inputChoices.forEach(choice => {
        if (choice.innerHTML.toLocaleLowerCase().includes(selectInput.value.toLocaleLowerCase())) {
          selectInputChoices.appendChild(choice);
          while (choice.previousElementSibling && choice.innerHTML.toLocaleLowerCase().indexOf(selectInput.value.toLocaleLowerCase()) < choice.previousElementSibling.innerHTML.toLocaleLowerCase().indexOf(selectInput.value.toLocaleLowerCase()))
            selectInputChoices.insertBefore(choice, choice.previousElementSibling);
        }
      });
    } else {
      selectInputChoices.innerHTML = "";
      inputChoices.forEach(choice => {
        selectInputChoices.appendChild(choice);
      });
    }
  }
  
  document.addEventListener('click', event => {
    if (event.target.className == 'each-input-choice') {
      selectInput.value = event.target.innerHTML;
      countryInput.value = event.target.id;
      selectInputWrapper.classList.remove('open-bottom-animation-class');
      selectInputWrapper.classList.add('close-up-animation-class');
      setTimeout(() => {
        selectInputChoices.scrollTo(0, 0);
      }, 500);
    }
    else if (!selectInputWrapper.classList.contains('close-up-animation-class') && (event.target.className != 'select-input-choices' && event.target.className != 'select-input-wrapper' && event.target.className != 'select-input-outer-wrapper' && event.target.className != 'select-input')) {
      selectInputWrapper.classList.remove('open-bottom-animation-class');
      selectInputWrapper.classList.add('close-up-animation-class');
      setTimeout(() => {
        selectInputChoices.scrollTo(0, 0);
      }, 500);
    }
  });
}
