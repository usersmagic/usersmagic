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

window.onload = () => {
  const campaign = {
    name: "",
    description: "",
    information: "",
    photo: null,
    questions: [],
    filter: {}
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
  const campaignPaymentTitle = document.getElementById('campaign-payment-title');

  const campaignInfoWrapper = document.querySelector('.campaign-info-wrapper');
  const campaignQuestionWrapper = document.querySelector('.campaign-question-wrapper');

  const nameInput = document.querySelector('.name-input');
  const descriptionInput = document.querySelector('.description-input');
  const informationInput = document.querySelector('.information-input');

  nameInput.oninput = () => campaign.name = (nameInput.value.length ? nameInput.value : null);
  descriptionInput.oninput = () => campaign.description = (descriptionInput.value.length ? descriptionInput.value : null);
  informationInput.oninput = () => campaign.information = (informationInput.value.length ? informationInput.value : null);

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

  document.addEventListener('click', event => {
    if (event.target.classList.contains('continue-button') || event.target.parentNode.classList.contains('continue-button')) {
      if (campaignProgressCount == 0 && campaign.name.length && campaign.description.length && campaign.information.length && campaign.photo) {
        campaignInfoTitle.style.display = "none";
        campaignQuestionTitle.style.display = "block";
        campaignProgressCount++;

        campaignInfoWrapper.style.display = "none";
        campaignQuestionWrapper.style.display = "flex";
      } else if (campaignProgressCount == 1 && campaign.questions.length) {
        campaignQuestionTitle.style.display = "none";
        campaignFilterTitle.style.display = "block";
        campaignProgressCount++;


      } else if (campaignProgressCount == 2) {
        campaignFilterTitle.style.display = "none";
        campaignPaymentTitle.style.display = "block";
        campaignProgressCount++;


      } else {

      }
    }

    if (event.target.classList.contains('each-question-type-wrapper') || event.target.parentNode.classList.contains('each-question-type-wrapper')) {
      if (!questionTextInput.value.length) {
        questionTextInput.style.borderColor = "rgb(240, 84, 79)";
        return setTimeout(() => {
          questionTextInput.style.borderColor = "rgb(236, 236, 236)";
        }, 500);
      }

      const newId = Math.random().toString(36).substr(2, 9);
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
}
