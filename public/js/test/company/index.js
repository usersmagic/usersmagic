const createQuestion  = (question, wrapper, text, text2) => {
  const newQuestionWrapper = document.createElement('div');
  newQuestionWrapper.classList.add('new-question-wrapper');
  newQuestionWrapper.id = question._id;

  const newQuestionButtonWrapper = document.createElement('div');
  newQuestionButtonWrapper.classList.add('new-question-button-wrapper');

  const newQuestionDownButton = document.createElement('i');
  newQuestionDownButton.classList.add('fas');
  newQuestionDownButton.classList.add('fa-chevron-down');
  newQuestionDownButton.classList.add('new-question-down-button');
  newQuestionButtonWrapper.appendChild(newQuestionDownButton);

  const newQuestionUpButton = document.createElement('i');
  newQuestionUpButton.classList.add('fas');
  newQuestionUpButton.classList.add('fa-chevron-up');
  newQuestionUpButton.classList.add('new-question-up-button');
  newQuestionButtonWrapper.appendChild(newQuestionUpButton);

  const newQuestionDeleteButton = document.createElement('i');
  newQuestionDeleteButton.classList.add('fas');
  newQuestionDeleteButton.classList.add('fa-trash');
  newQuestionDeleteButton.classList.add('new-question-delete-button');
  newQuestionButtonWrapper.appendChild(newQuestionDeleteButton);

  newQuestionWrapper.appendChild(newQuestionButtonWrapper);

  const newQuestionText = document.createElement('span');
  newQuestionText.classList.add('new-question-text');
  newQuestionText.innerHTML = question.text;
  newQuestionWrapper.appendChild(newQuestionText);

  if (question.type == "radio") {
    const choicesWrapper = document.createElement('div');
    newQuestionWrapper.appendChild(choicesWrapper);

    const otherOptionWrapperRadio = document.createElement('div');
    otherOptionWrapperRadio.classList.add('other-option-wrapper-radio');
    const choiceRadio = document.createElement('div');
    const choiceInnerRadio = document.createElement('div');
    choiceRadio.classList.add('choice-radio');
    choiceInnerRadio.classList.add('choice-inner-radio');
    choiceRadio.appendChild(choiceInnerRadio);
    otherOptionWrapperRadio.appendChild(choiceRadio);
    const otherOptionInputRadio = document.createElement('input');
    otherOptionInputRadio.classList.add('other-option-input-radio');
    otherOptionInputRadio.type = "text";
    otherOptionInputRadio.placeholder = text;
    otherOptionWrapperRadio.appendChild(otherOptionInputRadio);
    newQuestionWrapper.appendChild(otherOptionWrapperRadio);
  } else if (question.type == "checked") {
    const choicesWrapper = document.createElement('div');
    newQuestionWrapper.appendChild(choicesWrapper);

    const otherOptionWrapperChecked = document.createElement('div');
    otherOptionWrapperChecked.classList.add('other-option-wrapper-checked');
    const choiceChecked = document.createElement('div');
    const choiceInnerChecked = document.createElement('div');
    choiceChecked.classList.add('choice-checked');
    choiceInnerChecked.classList.add('choice-inner-checked');
    choiceChecked.appendChild(choiceInnerChecked);
    otherOptionWrapperChecked.appendChild(choiceChecked);
    const otherOptionInputText = document.createElement('input');
    otherOptionInputText.classList.add('other-option-input-checked');
    otherOptionInputText.type = "text";
    otherOptionInputText.placeholder = text;
    otherOptionWrapperChecked.appendChild(otherOptionInputText);
    newQuestionWrapper.appendChild(otherOptionWrapperChecked);
  } else if (question.type == "short_text") {
    const newQuestionShortAnswerInput = document.createElement('input');
    newQuestionShortAnswerInput.classList.add('question-short-answer-input')
    newQuestionShortAnswerInput.placeholder = text;
    newQuestionWrapper.appendChild(newQuestionShortAnswerInput);

    const leftCharacterSpan = document.createElement('span');
    leftCharacterSpan.innerHTML = 1000 + " " + text2;
    leftCharacterSpan.classList.add('question-left-character-text')
    newQuestionWrapper.appendChild(leftCharacterSpan);
  } else if (question.type == "long_text") {
    const newQuestionLongAnswerInput = document.createElement('textarea');
    newQuestionLongAnswerInput.classList.add('question-long-answer-input')
    newQuestionLongAnswerInput.placeholder = text;
    newQuestionWrapper.appendChild(newQuestionLongAnswerInput);

    const leftCharacterSpan = document.createElement('span');
    leftCharacterSpan.innerHTML = 1000 + " " + text2;
    leftCharacterSpan.classList.add('question-left-character-text')
    newQuestionWrapper.appendChild(leftCharacterSpan);
  }

  wrapper.appendChild(newQuestionWrapper);
  wrapper.parentNode.scrollTo(0, wrapper.parentNode.scrollHeight)
}

const addChoice = (question, choice) => {
  const choiceId =  Math.random().toString(36).substr(2, 9);
  
  if (question.type != "radio" && question.type != "checked")
    return;

  const eachChoice = document.createElement('div');
  eachChoice.classList.add('each-choice');
  eachChoice.id = choiceId;
    
  if (question.type == "radio") {
    const choiceRadio = document.createElement('div');
    const choiceInnerRadio = document.createElement('div');
    choiceRadio.classList.add('choice-radio');
    choiceInnerRadio.classList.add('choice-inner-radio');
    choiceRadio.appendChild(choiceInnerRadio);
    eachChoice.appendChild(choiceRadio);
  } else {
    const choiceChecked = document.createElement('div');
    const choiceInnerChecked = document.createElement('i');
    choiceChecked.classList.add('choice-checked');
    choiceInnerChecked.classList.add('fas');
    choiceInnerChecked.classList.add('fa-check');
    choiceChecked.appendChild(choiceInnerChecked);
    eachChoice.appendChild(choiceChecked);
  }
    
  const choiceText = document.createElement('span');
  choiceText.classList.add('choice-text');
  choiceText.innerHTML = choice;
  eachChoice.appendChild(choiceText);

  document.getElementById(question._id).childNodes[2].appendChild(eachChoice);
  document.getElementById(question._id).parentNode.parentNode.scrollTo(0, document.getElementById(question._id).parentNode.parentNode.scrollHeight);
  return choiceId;
}

const createFilter = (filter, wrapper, search) => {
  const eachChooseFilter = document.createElement('div');
  eachChooseFilter.classList.add('each-choose-filter');
  eachChooseFilter.id = filter._id.toString();

  const eachChooseFilterName = document.createElement('span');
  eachChooseFilterName.classList.add('each-choose-filter-name');
  eachChooseFilterName.innerHTML = filter.name;

  eachChooseFilter.appendChild(eachChooseFilterName);
  wrapper.appendChild(eachChooseFilter);

  while (search && eachChooseFilter.previousElementSibling && filter.name.toLocaleLowerCase().trim().indexOf(search) < eachChooseFilter.previousElementSibling.childNodes[0].innerHTML.toLocaleLowerCase().trim().indexOf(search))
    wrapper.insertBefore(eachChooseFilter, eachChooseFilter.previousElementSibling);
}

const createFilterOption = (option, wrapper) => {
  const eachFilterOptionWrapper = document.createElement('div');
  eachFilterOptionWrapper.classList.add('each-filter-option-wrapper');

  const choiceChecked = document.createElement('div');
  const choiceInnerChecked = document.createElement('i');
  choiceChecked.classList.add('choice-checked');
  choiceInnerChecked.classList.add('fas');
  choiceInnerChecked.classList.add('fa-check');
  choiceChecked.appendChild(choiceInnerChecked);
  eachFilterOptionWrapper.appendChild(choiceChecked);

  const eachOptionSpan = document.createElement('span');
  eachOptionSpan.innerHTML = option;
  eachFilterOptionWrapper.appendChild(eachOptionSpan);

  wrapper.appendChild(eachFilterOptionWrapper);
}

const createAddedFilter = (filter, answers, wrapper, text) => {
  const eachAddedFilter = document.createElement('div');
  eachAddedFilter.classList.add('each-added-filter');
  eachAddedFilter.id = filter._id.toString();

  const eachAddedFilterName = document.createElement('span');
  eachAddedFilterName.classList.add('each-added-filter-name');
  eachAddedFilterName.innerHTML = filter.name;
  eachAddedFilter.appendChild(eachAddedFilterName);

  const eachAddedFilterText = document.createElement('span');
  eachAddedFilterText.classList.add('each-added-filter-text');
  eachAddedFilterText.innerHTML = filter.text;
  eachAddedFilter.appendChild(eachAddedFilterText);

  const answerWrapper = document.createElement('span');
  
  const eachAddedFilterAnswerTitle = document.createElement('span');
  eachAddedFilterAnswerTitle.classList.add('each-added-filter-answer-title');
  eachAddedFilterAnswerTitle.innerHTML = text + ':';
  answerWrapper.appendChild(eachAddedFilterAnswerTitle);

  const eachAddedFilterAnswer = document.createElement('span');
  eachAddedFilterAnswer.classList.add('each-added-filter-answer');
  eachAddedFilterAnswer.innerHTML = answers.join(', ');
  answerWrapper.appendChild(eachAddedFilterAnswer);

  eachAddedFilter.appendChild(answerWrapper);
  wrapper.appendChild(eachAddedFilter);
}

window.onload = () => {
  const campaign = {
    name: "",
    price: "",
    description: "",
    information: "",
    submition_limit: null,
    photo: null,
    questions: [],
    filter: [],
    gender: "",
    country: "",
    min_birth_year: 0,
    max_birth_year: 0
  }
  let questionIdOrder = [], choiceId;
  const question = {
    _id: null,
    text: null,
    type: null,
    other_option: false,
    choices: []
  }

  let campaignProgressCount = 0;

  const campaignInfoTitle = document.getElementById('campaign-info-title');
  const campaignQuestionTitle = document.getElementById('campaign-question-title');
  const campaignFilterTitle = document.getElementById('campaign-filter-title');
  // const campaignPaymentTitle = document.getElementById('campaign-payment-title');
  const campaignSendTitle = document.getElementById('campaign-send-title');

  const campaignInfoWrapper = document.querySelector('.campaign-info-wrapper');
  const campaignQuestionWrapper = document.querySelector('.campaign-question-wrapper');

  const nameInput = document.querySelector('.name-input');
  const priceInput = document.querySelector('.price-input');
  const descriptionInput = document.querySelector('.description-input');
  const informationInput = document.querySelector('.information-input');
  const campaignLimitInput = document.querySelector('.campaign-limit-input');
  const minBirthYearInput = document.querySelector('.min-birth-year-input');
  const maxBirthYearInput = document.querySelector('.max-birth-year-input');

  nameInput.oninput = () => campaign.name = (nameInput.value.length ? nameInput.value : null);
  priceInput.oninput = () => campaign.price = (priceInput.value.length ? priceInput.value : null);
  descriptionInput.oninput = () => campaign.description = (descriptionInput.value.length ? descriptionInput.value : null);
  informationInput.oninput = () => campaign.information = (informationInput.value.length ? informationInput.value : null);
  campaignLimitInput.oninput = () => campaign.submition_limit = (campaignLimitInput.value.length ? campaignLimitInput.value : null);
  minBirthYearInput.oninput = () => campaign.min_birth_year = minBirthYearInput.value;
  maxBirthYearInput.oninput = () => campaign.max_birth_year = maxBirthYearInput.value;

  const countryEachInputChoices = document.querySelectorAll('.country-each-input-choice');
  const genderEachInputChoices = document.querySelectorAll('.gender-each-input-choice');

  const photoSelectInput = document.getElementById('photo-select-input');
  const imageSpan = document.getElementById('image-span');
  const uploadingText = document.getElementById('uploading-text').innerHTML;
  const uploadedText = document.getElementById('uploaded-text').innerHTML;
  const campaignNoPhotoIcon = document.getElementById('campaign-no-photo-icon');
  const campaignPhoto = document.querySelector('.campaign-photo');

  photoSelectInput.onchange = () => {
    imageSpan.innerHTML = uploadingText;
    const file = photoSelectInput.files[0];
    var formdata = new FormData();
    formdata.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/test/company/photo");
    xhr.send(formdata);
    
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.responseText) {
        if (xhr.status == 500) {
          imageSpan.innerHTML = uploadedText;
          alert("An unknown error occured, please try again later.");
          photoSelectInput.value = ''
          if (!/safari/i.test(navigator.userAgent)){
            photoSelectInput.type = ''
            photoSelectInput.type = 'file'
          }
        } else {
          imageSpan.innerHTML = uploadedText;
          photoSelectInput.value = ''
          if (!/safari/i.test(navigator.userAgent)){
            photoSelectInput.type = ''
            photoSelectInput.type = 'file'
          }
          campaignPhoto.style.display = "block";
          campaignNoPhotoIcon.style.display = "none";
          campaignPhoto.src = xhr.responseText;
          campaign.photo = xhr.responseText;
        }
      };
    };
  }

  const campaignQuestionsWrapper = document.querySelector('.campaign-questions-wrapper');
  const questionTextInput = document.getElementById('question-text-input');

  const otherText = document.getElementById('other-text').innerHTML;
  const characterLeftText = document.getElementById('character-left-text').innerHTML;
  const yourAnswerText = document.getElementById('your-answer-text').innerHTML;

  const choiceInputListWrapper = document.querySelector('.choice-input-list-wrapper');
  const eachChoiceInput = document.querySelector('.each-choice-input');
  const characterCountInput = document.querySelector('.character-count-input');
  let eachChoiceInputLenght;

  const campaignQuestionCreateWrapper = document.querySelector('.campaign-question-create-wrapper');

  const campaignQuestionContentWrapper = document.querySelector('.campaign-question-content-wrapper');
  const selectedQuestionCreateWrapper = document.querySelector('.selected-question-create-wrapper');
  const writtenQuestionCreateWrapper = document.querySelector('.written-question-create-wrapper');

  const campaignFilterWrapper = document.querySelector('.campaign-filter-wrapper');
  const addedFiltersWrapper = document.querySelector('.added-filters-wrapper');

  const filters = JSON.parse(document.getElementById('filters-json').value);
  let selectedFilterId;

  const chooseFiltersWrapper = document.querySelector('.choose-filters-wrapper');
  const chooseFiltersInnerWrapper = document.querySelector('.choose-filters-inner-wrapper')
  const searchFilterInput = document.querySelector('.search-filter-input');
  const chooseFiltersFoundNumber = document.querySelector('.choose-filters-found-number');
  const chooseFiltersEachFilterWrapper = document.querySelector('.choose-filters-each-filter-wrapper');
  const chooseFiltersOptionsWrapper = document.querySelector('.choose-filters-options-wrapper');
  const chooseAllButtonWrapper = document.querySelector('.choose-all-button-wrapper');
  const chooseFiltersEachOptionWrapper = document.querySelector('.choose-filters-each-option-wrapper');
  const filterAddButton = document.querySelector('.filter-add-button');

  document.addEventListener('click', event => {
    if (event.target.classList.contains('continue-button') || event.target.parentNode.classList.contains('continue-button')) {
      if (campaignProgressCount == 0 && campaign.name.length && campaign.description.length && campaign.information.length && campaign.photo && campaign.gender.length && campaign.country.length && campaign.min_birth_year && campaign.max_birth_year) {
        campaignInfoTitle.style.display = "none";
        campaignQuestionTitle.style.display = "block";
        campaignProgressCount++;

        campaignInfoWrapper.style.display = "none";
        campaignQuestionWrapper.style.display = "flex";
      } else if (campaignProgressCount == 1 && campaign.questions.length) {
        campaignQuestionTitle.style.display = "none";
        campaignFilterTitle.style.display = "block";
        campaignProgressCount++;

        campaignQuestionWrapper.style.display = "none";
        campaignFilterWrapper.style.display = "flex";
      } else if (campaignProgressCount == 2) {
        // campaignFilterTitle.style.display = "none";
        // // campaignPaymentTitle.style.display = "block";
        // campaignSendTitle.style.display = "block";
        // campaignProgressCount++;

        (Array.from(addedFiltersWrapper.childNodes)).forEach(filter => {
          if (filter.classList.contains('each-added-filter') && filter.childNodes[2] && filter.childNodes[2].childNodes[1]) {
            const newFilter = {or: []};
            (filter.childNodes[2].childNodes[1].innerHTML.split(',').map(each => each.trim())).forEach(option => {
              const newFilterOption = {};
              newFilterOption[filter.id] = option;
              newFilter.or.push(newFilterOption);
            });
            campaign.filter.push(newFilter);
          }
        });

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/test/company");
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify(campaign));

        xhr.onreadystatechange = () => {
          if (xhr.readyState == 4 && xhr.responseText) {
            if (xhr.status == 500) {
              alert("An unknown error occured, please try again later.");
            } else {
              window.location = "/campaigns/company";
            }
          };
        };
      };
    }

    if (event.target.classList.contains('each-input-choice')) {
      if (event.target.classList.contains('country-each-input-choice')) {
        event.target.parentNode.parentNode.classList.remove('open-bottom-animation-class');
        event.target.parentNode.parentNode.classList.add('close-up-animation-class');
        event.target.parentNode.parentNode.childNodes[0].value = event.target.innerHTML;
        campaign.country = event.target.id;
      } else if (event.target.classList.contains('gender-each-input-choice')) {
        event.target.parentNode.parentNode.classList.remove('open-bottom-animation-class');
        event.target.parentNode.parentNode.classList.add('close-up-animation-class');
        event.target.parentNode.parentNode.childNodes[0].value = event.target.innerHTML;
        campaign.gender = event.target.id;
      }
    } else if (event.target.classList.contains('select-input-outer-wrapper') || event.target.parentNode.classList.contains('select-input-outer-wrapper') || event.target.parentNode.parentNode.classList.contains('select-input-outer-wrapper') || event.target.parentNode.parentNode.parentNode.classList.contains('select-input-outer-wrapper') ) {
      const openSelectInput = document.querySelector('.open-bottom-animation-class');
      const selectInputOuterWrapper = event.target.classList.contains('select-input-outer-wrapper') ? event.target : (event.target.parentNode.classList.contains('select-input-outer-wrapper') ? event.target.parentNode : (event.target.parentNode.parentNode.classList.contains('select-input-outer-wrapper') ? event.target.parentNode.parentNode : event.target.parentNode.parentNode));

      if (openSelectInput && !(Array.from(openSelectInput.classList)).find(each => selectInputOuterWrapper.classList.contains(each))) {
        openSelectInput.classList.remove('open-bottom-animation-class');
        openSelectInput.classList.add('close-up-animation-class');
      }
    } else {
      const openSelectInput = document.querySelector('.open-bottom-animation-class');

      if (openSelectInput) {
        openSelectInput.classList.remove('open-bottom-animation-class');
        openSelectInput.classList.add('close-up-animation-class');
      }
    }

    if (event.target.classList.contains('each-question-type-wrapper') || event.target.parentNode.classList.contains('each-question-type-wrapper')) {
      if (!questionTextInput.value.length) {
        questionTextInput.style.borderColor = "rgb(240, 84, 79)";
        return setTimeout(() => {
          questionTextInput.style.borderColor = "rgb(236, 236, 236)";
        }, 500);
      }

      const newId = (Math.random().toString(36).substr(2, 9) + Math.random().toString(36).substr(2, 9));
      question._id = newId;
      questionIdOrder.push(newId);
      question.text = questionTextInput.value;
      question.type = event.target.classList.contains('each-question-type-wrapper') ? event.target.id : event.target.parentNode.id;
      question.other_option = false;
      question.answer_length = 1000;
      question.choices = [];

      questionTextInput.value = "";

      if (!campaign.questions.length)
        campaignQuestionsWrapper.innerHTML = "";

      campaignQuestionCreateWrapper.style.display = "none";
      campaignQuestionContentWrapper.style.display = "flex";

      if (question.type == "radio" || question.type == "checked") {
        createQuestion(question, campaignQuestionsWrapper, otherText);

        writtenQuestionCreateWrapper.style.display = "none";
        selectedQuestionCreateWrapper.style.display = "flex";

        while (document.querySelector('.choice-input-list-wrapper').childNodes[document.querySelector('.choice-input-list-wrapper').childNodes.length-1].previousElementSibling)
          document.querySelector('.choice-input-list-wrapper').childNodes[document.querySelector('.choice-input-list-wrapper').childNodes.length-1].previousElementSibling.remove();
        document.querySelector('.other-option-button').childNodes[0].classList.remove('selected-choice');
        eachChoiceInputLenght = 1;
        eachChoiceInput.value = "";
        eachChoiceInput.focus();
      } else if (question.type == "short_text" || question.type == "long_text") {
        writtenQuestionCreateWrapper.style.display = "flex";
        selectedQuestionCreateWrapper.style.display = "none";

        createQuestion(question, campaignQuestionsWrapper, yourAnswerText, characterLeftText);
        characterCountInput.value = "1000";
        characterCountInput.focus();
      }
    }

    if (event.target.classList.contains('new-question-up-button') && event.target.parentNode.parentNode.previousElementSibling) {
      const questionWrapper = event.target.parentNode.parentNode;
      questionWrapper.parentNode.insertBefore(questionWrapper, questionWrapper.previousElementSibling);
      for (let index = 1; index < questionIdOrder.length; index++)
        if (questionIdOrder[index] == questionWrapper.id) {
          const temp = questionIdOrder[index-1];
          questionIdOrder[index-1] = questionIdOrder[index];
          questionIdOrder[index] = temp;
        }
    }
    if (event.target.classList.contains('new-question-down-button') && event.target.parentNode.parentNode.nextElementSibling) {
      const questionWrapper = event.target.parentNode.parentNode;
      questionWrapper.parentNode.insertBefore(questionWrapper.nextElementSibling, questionWrapper);
      for (let index = 0; index < questionIdOrder.length-1; index++)
        if (questionIdOrder[index] == questionWrapper.id) {
          const temp = questionIdOrder[index+1];
          questionIdOrder[index+1] = questionIdOrder[index];
          questionIdOrder[index] = temp;
        }
    }
    if (event.target.classList.contains('new-question-delete-button')) {
      event.target.parentNode.parentNode.remove();
      questionIdOrder = questionIdOrder.filter(id => id != event.target.parentNode.parentNode.id);
    }

    if (event.target.classList.contains('choice-up-button') && event.target.parentNode.previousElementSibling) {
      event.target.parentNode.parentNode.insertBefore(event.target.parentNode, event.target.parentNode.previousElementSibling);
      document.getElementById(question._id).childNodes[2].childNodes.forEach(node => {
        if (node.id == event.target.parentNode.id)
          node.parentNode.insertBefore(node, node.previousElementSibling);
      });
    }
    if (event.target.classList.contains('choice-down-button') && event.target.parentNode.nextElementSibling.nextElementSibling) {
      event.target.parentNode.parentNode.insertBefore(event.target.parentNode.nextElementSibling, event.target.parentNode);
      
      for (let index = 0; index < document.getElementById(question._id).childNodes[2].childNodes.length-1; index++) {
        const node = document.getElementById(question._id).childNodes[2].childNodes[index], nextNode = document.getElementById(question._id).childNodes[2].childNodes[index+1];
        if (node.id == event.target.parentNode.id)
          node.parentNode.insertBefore(nextNode, node);
      }
    }
    if (event.target.classList.contains('choice-delete-button')) {
      document.getElementById(question._id).childNodes[2].childNodes.forEach(node => {
        if (node.id == event.target.parentNode.id)
          node.remove();
      });
      event.target.parentNode.remove();
    }

    if (event.target.classList.contains('other-option-button') || event.target.parentNode.classList.contains('other-option-button') || event.target.parentNode.parentNode.classList.contains('other-option-button')) {      
      question.other_option = question.other_option ? false : true;
      if (question.other_option)
        document.querySelector('.other-option-button').childNodes[0].classList.add('selected-choice');
      else
        document.querySelector('.other-option-button').childNodes[0].classList.remove('selected-choice');
      document.getElementById(question._id).childNodes[3].style.display = question.other_option ? "flex" : "none";
    }

    if (event.target.classList.contains('create-question-button') || event.target.parentNode.classList.contains('create-question-button')) {
      if (question.type == "radio" || question.type == "checked") {
        document.getElementById(question._id).childNodes[2].childNodes.forEach(node => {
          question.choices.push(node.childNodes[1].innerHTML);
        });
        if (!question.choices.length && !question.other_option) return;
      }

      const newQuestion = {};
      newQuestion._id = question._id;
      newQuestion.type = question.type;
      newQuestion.text = question.text;
      newQuestion.choices = question.choices;
      newQuestion.other_option = question.other_option;
      campaign.questions.push(newQuestion);
      campaignQuestionCreateWrapper.style.display = "flex";
      campaignQuestionContentWrapper.style.display = "none";
    }

    if (event.target.classList.contains('each-choose-filter') || event.target.parentNode.classList.contains('each-choose-filter')) {
      selectedFilterId = event.target.classList.contains('each-choose-filter') ? event.target.id : event.target.parentNode.id;
      const filter = filters.find(each => each._id.toString() == selectedFilterId);

      chooseFiltersInnerWrapper.style.display = "none";
      chooseFiltersOptionsWrapper.style.display = "flex";

      chooseFiltersEachOptionWrapper.innerHTML = "";
      chooseAllButtonWrapper.childNodes[0].classList.remove('selected-choice');
      filter.choices.forEach(choice => createFilterOption(choice, chooseFiltersEachOptionWrapper));
    }

    if (event.target.classList.contains('options-go-back-button')) {
      chooseFiltersInnerWrapper.style.display = "flex";
      chooseFiltersOptionsWrapper.style.display = "none";
    }

    if (event.target.classList.contains('each-filter-option-wrapper') || event.target.parentNode.classList.contains('each-filter-option-wrapper') || event.target.parentNode.parentNode.classList.contains('each-filter-option-wrapper')) {
      const eachFilterOptionWrapper = event.target.classList.contains('each-filter-option-wrapper') ? event.target : (event.target.parentNode.classList.contains('each-filter-option-wrapper') ? event.target.parentNode : event.target.parentNode.parentNode);
      if (eachFilterOptionWrapper.childNodes[0].classList.contains('selected-choice'))
        eachFilterOptionWrapper.childNodes[0].classList.remove('selected-choice');
      else
        eachFilterOptionWrapper.childNodes[0].classList.add('selected-choice');

      filterAddButton.style.cursor = (Array.from(chooseFiltersEachOptionWrapper.childNodes)).find(node => node.childNodes[0].classList.contains('selected-choice')) ? "pointer" : "not-allowed";
    }

    if (event.target.classList.contains('choose-all-button-wrapper') || event.target.parentNode.classList.contains('choose-all-button-wrapper') || event.target.parentNode.parentNode.classList.contains('choose-all-button-wrapper')) {
      if (chooseAllButtonWrapper.childNodes[0].classList.contains('selected-choice')) {
        chooseAllButtonWrapper.childNodes[0].classList.remove('selected-choice');
        chooseFiltersEachOptionWrapper.childNodes.forEach(node => {
          node.childNodes[0].classList.remove('selected-choice');
        });
        filterAddButton.style.cursor = "not-allowed";
      } else {
        chooseAllButtonWrapper.childNodes[0].classList.add('selected-choice');
        chooseFiltersEachOptionWrapper.childNodes.forEach(node => {
          node.childNodes[0].classList.add('selected-choice');
        });
        filterAddButton.style.cursor = "pointer";
      }
    }

    if (event.target.classList.contains('add-filters-button') || event.target.parentNode.classList.contains('add-filters-button')) {
      chooseFiltersInnerWrapper.style.display = "flex";
      chooseFiltersOptionsWrapper.style.display = "none";
      campaignFilterTitle.style.opacity = "0.2";
      campaignFilterWrapper.style.opacity = "0.2";
      chooseFiltersWrapper.style.display = "block";
      searchFilterInput.focus();
    }

    if (event.target.classList.contains('close-filters-button')) {
      campaignFilterTitle.style.opacity = "1";
      campaignFilterWrapper.style.opacity = "1";
      chooseFiltersWrapper.style.display = "none";
    }

    if (event.target.classList.contains('filter-add-button') || event.target.parentNode.classList.contains('filter-add-button')) {
      const acceptedAnswers = (Array.from(chooseFiltersEachOptionWrapper.childNodes)).filter(each => each.childNodes[0].classList.contains('selected-choice')).map(each => each.childNodes[1].innerHTML);

      if (!acceptedAnswers.length) return;

      if (!filters.find(each => each._id.toString() == selectedFilterId)) return;

      if (addedFiltersWrapper.childNodes[0].classList.contains('added-filters-text'))
        addedFiltersWrapper.innerHTML = "";

      createAddedFilter(filters.find(each => each._id.toString() == selectedFilterId), acceptedAnswers, addedFiltersWrapper, document.getElementById('filter-accepted-answer-text').innerHTML);

      campaignFilterTitle.style.opacity = "1";
      campaignFilterWrapper.style.opacity = "1";
      chooseFiltersWrapper.style.display = "none";
    }
  });

  eachChoiceInput.onkeydown = event => {
    if (event.keyCode == 13 && eachChoiceInput.value.length) {
      const newChoiceWrapper = document.createElement('div');
      newChoiceWrapper.classList.add('new-choice-wrapper');
      newChoiceWrapper.id = choiceId;

      const newChoiceText = document.createElement('span');
      newChoiceText.innerHTML = eachChoiceInput.value;
      newChoiceWrapper.appendChild(newChoiceText);

      const newChoiceDownButton = document.createElement('i');
      newChoiceDownButton.classList.add('fas');
      newChoiceDownButton.classList.add('fa-chevron-down');
      newChoiceDownButton.classList.add('choice-down-button');
      newChoiceWrapper.appendChild(newChoiceDownButton);

      const newChoiceUpButton = document.createElement('i');
      newChoiceUpButton.classList.add('fas');
      newChoiceUpButton.classList.add('fa-chevron-up');
      newChoiceUpButton.classList.add('choice-up-button');
      newChoiceWrapper.appendChild(newChoiceUpButton);

      const newChoiceDeleteButton = document.createElement('i');
      newChoiceDeleteButton.classList.add('fas');
      newChoiceDeleteButton.classList.add('fa-trash');
      newChoiceDeleteButton.classList.add('choice-delete-button');
      newChoiceWrapper.appendChild(newChoiceDeleteButton);

      choiceInputListWrapper.appendChild(newChoiceWrapper);
      choiceInputListWrapper.insertBefore(newChoiceWrapper, eachChoiceInput);
      eachChoiceInput.value = "";
      eachChoiceInputLenght++;

      choiceInputListWrapper.parentNode.parentNode.scrollTo(0, choiceInputListWrapper.parentNode.parentNode.scrollHeight);
    }
  }

  eachChoiceInput.oninput = () => {
    const currentQuestion = document.getElementById(question._id);

    if (eachChoiceInputLenght == currentQuestion.childNodes[2].childNodes.length) {
      if (eachChoiceInput.value.length)
        currentQuestion.childNodes[2].childNodes[currentQuestion.childNodes[2].childNodes.length-1].childNodes[1].innerHTML = eachChoiceInput.value;
      else
        currentQuestion.childNodes[2].childNodes[currentQuestion.childNodes[2].childNodes.length-1].remove();
    } else {
      choiceId = addChoice(question, eachChoiceInput.value);
    }
  }

  characterCountInput.oninput = () => {
    if (!characterCountInput.value)
      return;

    if (parseInt(characterCountInput.value) <= 10000)
      document.getElementById(question._id).childNodes[3].innerHTML = characterCountInput.value + " " + document.getElementById(question._id).childNodes[3].innerHTML.split(' ').filter((e, i) => i != 0).join(" ");
    else {
      characterCountInput.value = 100000;
      document.getElementById(question._id).childNodes[3].innerHTML = 100000 + " " + document.getElementById(question._id).childNodes[3].innerHTML.split(' ').filter((e, i) => i != 0).join(" ");
    }
  }

  searchFilterInput.oninput = () => {
    chooseFiltersEachFilterWrapper.innerHTML = "";
    if (searchFilterInput.value.length) {
      filters.forEach(filter => {
        if (filter.name.toLocaleLowerCase().trim().indexOf(searchFilterInput.value.toLocaleLowerCase().trim()) > -1)
          createFilter(filter, chooseFiltersEachFilterWrapper, searchFilterInput.value.toLocaleLowerCase().trim());
      });
      chooseFiltersFoundNumber.innerHTML = chooseFiltersEachFilterWrapper.childNodes.length + " " + chooseFiltersFoundNumber.innerHTML.split(' ').filter((e, i) => i != 0).join(' ');
    } else {
      filters.forEach(filter => createFilter(filter, chooseFiltersEachFilterWrapper, null));
      chooseFiltersFoundNumber.innerHTML = filters.length + " " + chooseFiltersFoundNumber.innerHTML.split(' ').filter((e, i) => i != 0).join(' ');
    }
  }

  document.addEventListener('focus', event => {
    const openSelectInput = document.querySelector('.open-bottom-animation-class');

    if (openSelectInput) {
      openSelectInput.classList.remove('open-bottom-animation-class');
      openSelectInput.classList.add('close-up-animation-class');
    }

    if (event.target.classList.contains('select-input')) {
      const selectInputWrapper = event.target.parentNode;

      if (selectInputWrapper.classList.contains('close-up-animation-class'))
        selectInputWrapper.classList.remove('close-up-animation-class');

      selectInputWrapper.classList.add('open-bottom-animation-class');
    }
  }, true);

  document.addEventListener('input', event => {
    if (event.target.classList.contains('select-input')) {
      if (event.target.classList.contains('country-select-input')) {
        const selectInputChoices = document.querySelector('.select-input-choices.country-select-input');
        selectInputChoices.innerHTML = "";

        if (event.target.value.length) {
          countryEachInputChoices.forEach(choice => {
            if (choice.innerHTML.toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase())) {
              selectInputChoices.appendChild(choice);
              while (choice.previousElementSibling && choice.innerHTML.toLocaleLowerCase().indexOf(selectInput.value.toLocaleLowerCase()) < choice.previousElementSibling.innerHTML.toLocaleLowerCase().indexOf(selectInput.value.toLocaleLowerCase()))
                selectInputChoices.insertBefore(choice, choice.previousElementSibling);
            }
          });
        } else {
          countryEachInputChoices.forEach(choice => {
            selectInputChoices.appendChild(choice);
          });
        }
      } else if (event.target.classList.contains('gender-select-input')) {
        const selectInputChoices = document.querySelector('.select-input-choices.gender-select-input');
        selectInputChoices.innerHTML = "";

        if (event.target.value.length) {
          genderEachInputChoices.forEach(choice => {
            if (choice.innerHTML.toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase())) {
              selectInputChoices.appendChild(choice);
              while (choice.previousElementSibling && choice.innerHTML.toLocaleLowerCase().indexOf(selectInput.value.toLocaleLowerCase()) < choice.previousElementSibling.innerHTML.toLocaleLowerCase().indexOf(selectInput.value.toLocaleLowerCase()))
                selectInputChoices.insertBefore(choice, choice.previousElementSibling);
            }
          });
        } else {
          genderEachInputChoices.forEach(choice => {
            selectInputChoices.appendChild(choice);
          });
        }
      }
    }
  }, true);
}
