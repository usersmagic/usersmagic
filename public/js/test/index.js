let sendingAnswers = false;

const saveAnswers = (id, answers, question) => {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", '/test/save');
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xhr.send(JSON.stringify({
    answers,
    question,
    id
  }));
  
  xhr.onreadystatechange = () => {
    if (this.readyState == XMLHttpRequest.DONE) {
      if (this.status == 200)
        return;
      else
        return alert("Cevabınız kaydedilemedi!");
    }
  }
}

const sendAnswers = (id, callback) => {
  if (sendingAnswers) return;
  sendingAnswers = true;
  const xhr = new XMLHttpRequest();
  xhr.open("POST", '/test/submit');
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify({ id }));
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status != 200) return alert("An error occured, please try again.");
      return callback();
    }
  }
}

window.onload = () => {
  const campaign = JSON.parse(document.getElementById('campaign-json').value);
  const questions = JSON.parse(document.getElementById('questions-json').value);
  const answers = {};
  let questionNumber = campaign.last_question;
  let question;

  questions.forEach(question => {
    answers[question.question._id.toString()] = question.answer;
  });

  const characterLeftText = document.getElementById('character-left-text').innerHTML;
  const continueText = document.getElementById('continue-text').innerHTML;
  const endText = document.getElementById('end-text').innerHTML;
  const sendText = document.getElementById('send-text').innerHTML;

  const startPageWrapper = document.querySelector('.start-page-wrapper');
  const eachQuestionWrapper = document.querySelector('.each-question-wrapper');
  const eachQuestionText = document.querySelector('.each-question-text');

  const questionShortAnswerInputWrapper = document.querySelector('.question-short-answer-input-wrapper');
  const questionShortAnswerInput = document.querySelector('.question-short-answer-input');
  const questionShortLeftCharacterText = document.querySelector('.question-short-left-character-text');
  const questionLongAnswerInputWrapper = document.querySelector('.question-long-answer-input-wrapper');
  const questionLongAnswerInput = document.querySelector('.question-long-answer-input');
  const questionLongLeftCharacterText = document.querySelector('.question-long-left-character-text');

  const questionRadioAnswerWrapper = document.querySelector('.question-radio-answer-wrapper');
  const questionCheckedAnswerWrapper = document.querySelector('.question-checked-answer-wrapper');
  const otherOptionWrapperRadio = document.querySelector('.other-option-wrapper-radio');
  const otherOptionInputRadio = document.querySelector('.other-option-input-radio');
  const otherOptionWrapperChecked = document.querySelector('.other-option-wrapper-checked');
  const otherOptionInputChecked = document.querySelector('.other-option-input-checked');

  const questionRangeAnswerWrapper = document.querySelector('.question-range-answer-wrapper');

  const progressBar = document.querySelector('.progress-bar');
  const progressBarFull = document.querySelector('.progress-bar-full');

  const moveOnButton = document.querySelector('.move-on-button');
  const goBackButton = document.querySelector('.go-back-button');

  const endPageWrapper = document.querySelector('.end-page-wrapper');
  const endPageQuestionsWrapper = document.querySelector('.end-page-questions-wrapper');

  let charNumber;

  if (questionNumber > -1 && questionNumber < questions.length) {
    question = questions[questionNumber].question;
    startPageWrapper.style.display = 'none';
    eachQuestionWrapper.style.display = 'flex';
    eachQuestionText.innerHTML = question.text;
    if (questionNumber == questions.length - 1)
      moveOnButton.childNodes[0].innerHTML = endText;
    else
      moveOnButton.childNodes[0].innerHTML = continueText;
    goBackButton.style.cursor = "pointer";
    progressBarFull.style.width = ((questionNumber+1) / questions.length * progressBar.clientWidth) + "px";

    questionShortAnswerInputWrapper.style.display = 'none';
    questionLongAnswerInputWrapper.style.display = 'none';
    questionRadioAnswerWrapper.innerHTML = "";
    questionCheckedAnswerWrapper.innerHTML = "";
    otherOptionWrapperRadio.style.display = 'none';
    otherOptionWrapperChecked.style.display = 'none';
    questionRangeAnswerWrapper.innerHTML = "";

    if (question.type == "short_text") {
      questionShortAnswerInputWrapper.style.display = 'flex';
      questionShortAnswerInput.value = answers[question._id.toString()];
      questionShortLeftCharacterText.innerHTML = question.answer_length + " " + characterLeftText;
      charNumber = question.answer_length;
    } else if (question.type == "long_text") {
      questionLongAnswerInputWrapper.style.display = 'flex';
      questionLongAnswerInput.value = answers[question._id.toString()];
      questionLongLeftCharacterText.innerHTML = question.answer_length + " " + characterLeftText;
      charNumber = question.answer_length;
    } else if (question.type == "radio") {
      question.choices.forEach(choice => {
        const eachChoice = document.createElement('div');
        eachChoice.classList.add('each-choice');
        
        const choiceRadio = document.createElement('div');
        const choiceInnerRadio = document.createElement('div');
        choiceRadio.classList.add('choice-radio');
        if (choice == answers[question._id.toString()])
          choiceRadio.classList.add('selected');
        choiceInnerRadio.classList.add('choice-inner-radio');
        choiceRadio.appendChild(choiceInnerRadio);
        eachChoice.appendChild(choiceRadio);

        const choiceText = document.createElement('span');
        choiceText.classList.add('choice-text');
        choiceText.innerHTML = choice;
        choiceText.id = choice;
        eachChoice.appendChild(choiceText);

        questionRadioAnswerWrapper.appendChild(eachChoice);
      });

      if (question.other_option) {
        otherOptionWrapperRadio.style.display = 'flex';
        otherOptionInputRadio.value = "";
        otherOptionWrapperRadio.childNodes[0].classList.remove('selected');

        if (answers[question._id.toString()] && !question.choices.includes(answers[question._id.toString()])) {
          otherOptionWrapperRadio.childNodes[0].classList.add('selected');
          otherOptionInputRadio.value = answers[question._id.toString()];
        }
      }
    } else if (question.type == "checked") {
      question.choices.forEach(choice => {
        const eachChoice = document.createElement('div');
        eachChoice.classList.add('each-choice');
        eachChoice.classList.add('each-choice-checked');
        
        const choiceChecked = document.createElement('div');
        const choiceInnerChecked = document.createElement('i');
        choiceChecked.classList.add('choice-checked');
        if (answers[question._id.toString()] && answers[question._id.toString()].includes(choice))
          choiceChecked.classList.add('selected');
        choiceInnerChecked.classList.add('fas');
        choiceInnerChecked.classList.add('fa-check');
        choiceChecked.appendChild(choiceInnerChecked);
        eachChoice.appendChild(choiceChecked);

        const choiceText = document.createElement('span');
        choiceText.classList.add('choice-text');
        choiceText.innerHTML = choice;
        choiceText.id = choice;
        eachChoice.appendChild(choiceText);

        questionCheckedAnswerWrapper.appendChild(eachChoice);
      });

      if (question.other_option) {
        otherOptionWrapperChecked.style.display = 'flex';
        otherOptionInputChecked.value = "";
        otherOptionWrapperChecked.childNodes[0].classList.remove('selected');

        if (answers[question._id.toString()] && answers[question._id.toString()].filter(each => !question.choices.includes(each)).length) {
          otherOptionWrapperChecked.childNodes[0].classList.add('selected');
          otherOptionInputChecked.value = answers[question._id.toString()].filter(each => !question.choices.includes(each))[0];
        }
      }
    } else if (question.type == "range") {
      for (let number = question.min_value; number <= question.max_value; number++) {
        const eachChoice = document.createElement('div');
        eachChoice.classList.add('each-choice');
        
        const choiceRadio = document.createElement('div');
        const choiceInnerRadio = document.createElement('div');
        choiceRadio.classList.add('choice-radio');
        if (number == answers[question._id.toString()])
          choiceRadio.classList.add('selected');
        choiceInnerRadio.classList.add('choice-inner-radio');
        choiceRadio.appendChild(choiceInnerRadio);
        eachChoice.appendChild(choiceRadio);

        const choiceText = document.createElement('span');
        choiceText.classList.add('choice-text');
        choiceText.innerHTML = number + (number == question.min_value ? " (" + question.min_explanation + ")" : "") + (number == question.max_value ? " (" + question.max_explanation + ")" : "");
        choiceText.id = number;
        eachChoice.appendChild(choiceText);

        questionRangeAnswerWrapper.appendChild(eachChoice);
      }
    }
  } else if (questionNumber == questions.length) {
    startPageWrapper.style.display = 'none';
    eachQuestionWrapper.style.display = 'none';
    endPageWrapper.style.display = 'flex';
    goBackButton.style.cursor = "pointer";
    progressBarFull.style.width = ((questionNumber+1) / questions.length * progressBar.clientWidth) + "px";

    questions.forEach((question, number) => {
      const eachQuestion = document.createElement('div');
      eachQuestion.classList.add('each-question-end');

      const eachQuestionText = document.createElement('span');
      eachQuestionText.classList.add('each-question-text-end');
      eachQuestionText.innerHTML = (number+1) + ". " + question.question.text;
      eachQuestion.appendChild(eachQuestionText);

      if (question.question.type == "checked") {
        answers[question.question._id.toString()].forEach(answer => {
          const eachQuestionAnswer = document.createElement('span');
          eachQuestionAnswer.classList.add('each-question-answer-end');
          eachQuestionAnswer.innerHTML = "- " + answer;
          eachQuestion.appendChild(eachQuestionAnswer);
        });
      } else {
        const eachQuestionAnswer = document.createElement('span');
        eachQuestionAnswer.classList.add('each-question-answer-end');
        if (question.question.type == "range")
          eachQuestionAnswer.innerHTML = answers[question.question._id.toString()] + " / " + question.question.max_value;
        else
          eachQuestionAnswer.innerHTML = answers[question.question._id.toString()];
        eachQuestion.appendChild(eachQuestionAnswer);
      }

      endPageQuestionsWrapper.appendChild(eachQuestion);
    });
    moveOnButton.childNodes[0].innerHTML = sendText;
  }
  
  document.addEventListener('click', event => {
    if (event.target.className == 'move-on-button' || event.target.parentNode.className == 'move-on-button') {
      if (questionNumber == questions.length) {
        sendAnswers(campaign._id.toString(), () => {
          return window.location = "/history";
        });
      } else if (questionNumber == questions.length - 1 && answers[question._id.toString()] && answers[question._id.toString()].length) {
        saveAnswers(campaign._id.toString(), answers, questionNumber);
        questionNumber++;
        eachQuestionWrapper.style.display = 'none';
        startPageWrapper.style.display = 'none';
        endPageWrapper.style.display = 'flex';
        progressBarFull.style.width = ((questionNumber+1) / questions.length * progressBar.clientWidth) + "px";
        endPageQuestionsWrapper.innerHTML = "";

        questions.forEach((question, number) => {
          const eachQuestion = document.createElement('div');
          eachQuestion.classList.add('each-question-end');

          const eachQuestionText = document.createElement('span');
          eachQuestionText.classList.add('each-question-text-end');
          eachQuestionText.innerHTML = (number+1) + ". " + question.question.text;
          eachQuestion.appendChild(eachQuestionText);

          if (question.question.type == "checked") {
            answers[question.question._id.toString()].forEach(answer => {
              const eachQuestionAnswer = document.createElement('span');
              eachQuestionAnswer.classList.add('each-question-answer-end');
              eachQuestionAnswer.innerHTML = "- " + answer;
              eachQuestion.appendChild(eachQuestionAnswer);
            });
          } else {
            const eachQuestionAnswer = document.createElement('span');
            eachQuestionAnswer.classList.add('each-question-answer-end');
            if (question.question.type == "range")
              eachQuestionAnswer.innerHTML = answers[question.question._id.toString()] + " / " + question.question.max_value;
            else
              eachQuestionAnswer.innerHTML = answers[question.question._id.toString()];
            eachQuestion.appendChild(eachQuestionAnswer);
          }

          endPageQuestionsWrapper.appendChild(eachQuestion);
        });
        moveOnButton.childNodes[0].innerHTML = sendText;
      } else if (questionNumber == -1) {
        questionNumber++;
        question = questions[0].question;
        startPageWrapper.style.display = 'none';
        eachQuestionWrapper.style.display = 'flex';
        eachQuestionText.innerHTML = question.text;
        moveOnButton.childNodes[0].innerHTML = continueText;
        goBackButton.style.cursor = "pointer";
        progressBarFull.style.width = ((questionNumber+1) / questions.length * progressBar.clientWidth) + "px";

        questionShortAnswerInputWrapper.style.display = 'none';
        questionLongAnswerInputWrapper.style.display = 'none';
        questionRadioAnswerWrapper.innerHTML = "";
        questionCheckedAnswerWrapper.innerHTML = "";
        otherOptionWrapperRadio.style.display = 'none';
        otherOptionWrapperChecked.style.display = 'none';
        questionRangeAnswerWrapper.innerHTML = "";

        if (question.type == "short_text") {
          questionShortAnswerInputWrapper.style.display = 'flex';
          questionShortAnswerInput.value = answers[question._id.toString()];
          questionShortLeftCharacterText.innerHTML = question.answer_length + " " + characterLeftText;
          charNumber = question.answer_length;
        } else if (question.type == "long_text") {
          questionLongAnswerInputWrapper.style.display = 'flex';
          questionLongAnswerInput.value = answers[question._id.toString()];
          questionLongLeftCharacterText.innerHTML = question.answer_length + " " + characterLeftText;
          charNumber = question.answer_length;
        } else if (question.type == "radio") {
          question.choices.forEach(choice => {
            const eachChoice = document.createElement('div');
            eachChoice.classList.add('each-choice');
            
            const choiceRadio = document.createElement('div');
            const choiceInnerRadio = document.createElement('div');
            choiceRadio.classList.add('choice-radio');
            if (choice == answers[question._id.toString()])
              choiceRadio.classList.add('selected');
            choiceInnerRadio.classList.add('choice-inner-radio');
            choiceRadio.appendChild(choiceInnerRadio);
            eachChoice.appendChild(choiceRadio);

            const choiceText = document.createElement('span');
            choiceText.classList.add('choice-text');
            choiceText.innerHTML = choice;
            choiceText.id = choice;
            eachChoice.appendChild(choiceText);

            questionRadioAnswerWrapper.appendChild(eachChoice);
          });

          if (question.other_option) {
            otherOptionWrapperRadio.style.display = 'flex';
            otherOptionInputRadio.value = "";
            otherOptionWrapperRadio.childNodes[0].classList.remove('selected');

            if (answers[question._id.toString()] && !question.choices.includes(answers[question._id.toString()])) {
              otherOptionWrapperRadio.childNodes[0].classList.add('selected');
              otherOptionInputRadio.value = answers[question._id.toString()];
            }
          }
        } else if (question.type == "checked") {
          question.choices.forEach(choice => {
            const eachChoice = document.createElement('div');
            eachChoice.classList.add('each-choice');
            eachChoice.classList.add('each-choice-checked');
            
            const choiceChecked = document.createElement('div');
            const choiceInnerChecked = document.createElement('i');
            choiceChecked.classList.add('choice-checked');
            if (answers[question._id.toString()] && answers[question._id.toString()].includes(choice))
              choiceChecked.classList.add('selected');
            choiceInnerChecked.classList.add('fas');
            choiceInnerChecked.classList.add('fa-check');
            choiceChecked.appendChild(choiceInnerChecked);
            eachChoice.appendChild(choiceChecked);

            const choiceText = document.createElement('span');
            choiceText.classList.add('choice-text');
            choiceText.innerHTML = choice;
            choiceText.id = choice;
            eachChoice.appendChild(choiceText);

            questionCheckedAnswerWrapper.appendChild(eachChoice);
          });

          if (question.other_option) {
            otherOptionWrapperChecked.style.display = 'flex';
            otherOptionInputChecked.value = "";
            otherOptionWrapperChecked.childNodes[0].classList.remove('selected');

            if (answers[question._id.toString()] && answers[question._id.toString()].filter(each => !question.choices.includes(each)).length) {
              otherOptionWrapperChecked.childNodes[0].classList.add('selected');
              otherOptionInputChecked.value = answers[question._id.toString()].filter(each => !question.choices.includes(each))[0];
            }
          }
        } else if (question.type == "range") {
          for (let number = question.min_value; number <= question.max_value; number++) {
            const eachChoice = document.createElement('div');
            eachChoice.classList.add('each-choice');
            
            const choiceRadio = document.createElement('div');
            const choiceInnerRadio = document.createElement('div');
            choiceRadio.classList.add('choice-radio');
            if (number == answers[question._id.toString()])
              choiceRadio.classList.add('selected');
            choiceInnerRadio.classList.add('choice-inner-radio');
            choiceRadio.appendChild(choiceInnerRadio);
            eachChoice.appendChild(choiceRadio);

            const choiceText = document.createElement('span');
            choiceText.classList.add('choice-text');
            choiceText.innerHTML = number + (number == question.min_value ? " (" + question.min_explanation + ")" : "") + (number == question.max_value ? " (" + question.max_explanation + ")" : "");
            choiceText.id = number;
            eachChoice.appendChild(choiceText);

            questionRangeAnswerWrapper.appendChild(eachChoice);
          }
        }
      } else if (answers[question._id.toString()] && answers[question._id.toString()].length) {
        saveAnswers(campaign._id.toString(), answers, questionNumber);
        questionNumber++;
        question = questions[questionNumber].question;
        startPageWrapper.style.display = 'none';
        eachQuestionWrapper.style.display = 'flex';
        eachQuestionText.innerHTML = question.text;
        if (questionNumber == questions.length - 1)
          moveOnButton.childNodes[0].innerHTML = endText;
        goBackButton.style.cursor = "pointer";
        progressBarFull.style.width = ((questionNumber+1) / questions.length * progressBar.clientWidth) + "px";

        questionShortAnswerInputWrapper.style.display = 'none';
        questionLongAnswerInputWrapper.style.display = 'none';
        questionRadioAnswerWrapper.innerHTML = "";
        questionCheckedAnswerWrapper.innerHTML = "";
        otherOptionWrapperRadio.style.display = 'none';
        otherOptionWrapperChecked.style.display = 'none';
        questionRangeAnswerWrapper.innerHTML = "";

        if (question.type == "short_text") {
          questionShortAnswerInputWrapper.style.display = 'flex';
          questionShortAnswerInput.value = answers[question._id.toString()];
          questionShortLeftCharacterText.innerHTML = question.answer_length + " " + characterLeftText;
          charNumber = question.answer_length;
        } else if (question.type == "long_text") {
          questionLongAnswerInputWrapper.style.display = 'flex';
          questionLongAnswerInput.value = answers[question._id.toString()];
          questionLongLeftCharacterText.innerHTML = question.answer_length + " " + characterLeftText;
          charNumber = question.answer_length;
        } else if (question.type == "radio") {
          question.choices.forEach(choice => {
            const eachChoice = document.createElement('div');
            eachChoice.classList.add('each-choice');
            
            const choiceRadio = document.createElement('div');
            const choiceInnerRadio = document.createElement('div');
            choiceRadio.classList.add('choice-radio');
            if (choice == answers[question._id.toString()])
              choiceRadio.classList.add('selected');
            choiceInnerRadio.classList.add('choice-inner-radio');
            choiceRadio.appendChild(choiceInnerRadio);
            eachChoice.appendChild(choiceRadio);

            const choiceText = document.createElement('span');
            choiceText.classList.add('choice-text');
            choiceText.innerHTML = choice;
            choiceText.id = choice;
            eachChoice.appendChild(choiceText);

            questionRadioAnswerWrapper.appendChild(eachChoice);
          });

          if (question.other_option) {
            otherOptionWrapperRadio.style.display = 'flex';
            otherOptionInputRadio.value = "";
            otherOptionWrapperRadio.childNodes[0].classList.remove('selected');

            if (answers[question._id.toString()] && !question.choices.includes(answers[question._id.toString()])) {
              otherOptionWrapperRadio.childNodes[0].classList.add('selected');
              otherOptionInputRadio.value = answers[question._id.toString()];
            }
          }
        } else if (question.type == "checked") {
          question.choices.forEach(choice => {
            const eachChoice = document.createElement('div');
            eachChoice.classList.add('each-choice');
            eachChoice.classList.add('each-choice-checked');
            
            const choiceChecked = document.createElement('div');
            const choiceInnerChecked = document.createElement('i');
            choiceChecked.classList.add('choice-checked');
            if (answers[question._id.toString()] && answers[question._id.toString()].includes(choice))
              choiceChecked.classList.add('selected');
            choiceInnerChecked.classList.add('fas');
            choiceInnerChecked.classList.add('fa-check');
            choiceChecked.appendChild(choiceInnerChecked);
            eachChoice.appendChild(choiceChecked);

            const choiceText = document.createElement('span');
            choiceText.classList.add('choice-text');
            choiceText.innerHTML = choice;
            choiceText.id = choice;
            eachChoice.appendChild(choiceText);

            questionCheckedAnswerWrapper.appendChild(eachChoice);
          });

          if (question.other_option) {
            otherOptionWrapperChecked.style.display = 'flex';
            otherOptionInputChecked.value = "";
            otherOptionWrapperChecked.childNodes[0].classList.remove('selected');

            if (answers[question._id.toString()] && answers[question._id.toString()].filter(each => !question.choices.includes(each)).length) {
              otherOptionWrapperChecked.childNodes[0].classList.add('selected');
              otherOptionInputChecked.value = answers[question._id.toString()].filter(each => !question.choices.includes(each))[0];
            }
          }
        } else if (question.type == "range") {
          for (let number = question.min_value; number <= question.max_value; number++) {
            const eachChoice = document.createElement('div');
            eachChoice.classList.add('each-choice');
            
            const choiceRadio = document.createElement('div');
            const choiceInnerRadio = document.createElement('div');
            choiceRadio.classList.add('choice-radio');
            if (number == answers[question._id.toString()])
              choiceRadio.classList.add('selected');
            choiceInnerRadio.classList.add('choice-inner-radio');
            choiceRadio.appendChild(choiceInnerRadio);
            eachChoice.appendChild(choiceRadio);

            const choiceText = document.createElement('span');
            choiceText.classList.add('choice-text');
            choiceText.innerHTML = number + (number == question.min_value ? " (" + question.min_explanation + ")" : "") + (number == question.max_value ? " (" + question.max_explanation + ")" : "");
            choiceText.id = number;
            eachChoice.appendChild(choiceText);

            questionRangeAnswerWrapper.appendChild(eachChoice);
          }
        }
      }
    }

    if (event.target.className == 'go-back-button' || event.target.parentNode.className == 'go-back-button') {
      if (questionNumber == 0) {
        questionNumber = -1;
        eachQuestionWrapper.style.display = 'none';
        startPageWrapper.style.display = 'flex';
        progressBarFull.style.width = "5px";
        goBackButton.style.cursor = "not-allowed";
      } else if (questionNumber <= questions.length && questionNumber > 0) {
        questionNumber--;
        question = questions[questionNumber].question;
        endPageWrapper.style.display = 'none';
        eachQuestionWrapper.style.display = 'flex';
        eachQuestionText.innerHTML = question.text;
        if (questionNumber == questions.length)
          moveOnButton.childNodes[0].innerHTML = endText;
        else
          moveOnButton.childNodes[0].innerHTML = continueText;
        progressBarFull.style.width = ((questionNumber+1) / questions.length * progressBar.clientWidth) + "px";

        questionShortAnswerInputWrapper.style.display = 'none';
        questionLongAnswerInputWrapper.style.display = 'none';
        questionRadioAnswerWrapper.innerHTML = "";
        questionCheckedAnswerWrapper.innerHTML = "";
        otherOptionWrapperRadio.style.display = 'none';
        otherOptionWrapperChecked.style.display = 'none';
        questionRangeAnswerWrapper.innerHTML = "";

        if (question.type == "short_text") {
          questionShortAnswerInputWrapper.style.display = 'flex';
          questionShortAnswerInput.value = answers[question._id.toString()];
          questionShortLeftCharacterText.innerHTML = question.answer_length + " " + characterLeftText;
          charNumber = question.answer_length;
        } else if (question.type == "long_text") {
          questionLongAnswerInputWrapper.style.display = 'flex';
          questionLongAnswerInput.value = answers[question._id.toString()];
          questionLongLeftCharacterText.innerHTML = question.answer_length + " " + characterLeftText;
          charNumber = question.answer_length;
        } else if (question.type == "radio") {
          question.choices.forEach(choice => {
            const eachChoice = document.createElement('div');
            eachChoice.classList.add('each-choice');
            
            const choiceRadio = document.createElement('div');
            const choiceInnerRadio = document.createElement('div');
            choiceRadio.classList.add('choice-radio');
            if (choice == answers[question._id.toString()])
              choiceRadio.classList.add('selected');
            choiceInnerRadio.classList.add('choice-inner-radio');
            choiceRadio.appendChild(choiceInnerRadio);
            eachChoice.appendChild(choiceRadio);

            const choiceText = document.createElement('span');
            choiceText.classList.add('choice-text');
            choiceText.innerHTML = choice;
            choiceText.id = choice;
            eachChoice.appendChild(choiceText);

            questionRadioAnswerWrapper.appendChild(eachChoice);
          });

          if (question.other_option) {
            otherOptionWrapperRadio.style.display = 'flex';
            otherOptionInputRadio.value = "";
            otherOptionWrapperRadio.childNodes[0].classList.remove('selected');

            if (answers[question._id.toString()] && !question.choices.includes(answers[question._id.toString()])) {
              otherOptionWrapperRadio.childNodes[0].classList.add('selected');
              otherOptionInputRadio.value = answers[question._id.toString()];
            }
          }
        } else if (question.type == "checked") {
          question.choices.forEach(choice => {
            const eachChoice = document.createElement('div');
            eachChoice.classList.add('each-choice');
            eachChoice.classList.add('each-choice-checked');
            
            const choiceChecked = document.createElement('div');
            const choiceInnerChecked = document.createElement('i');
            choiceChecked.classList.add('choice-checked');
            if (answers[question._id.toString()].includes(choice))
              choiceChecked.classList.add('selected');
            choiceInnerChecked.classList.add('fas');
            choiceInnerChecked.classList.add('fa-check');
            choiceChecked.appendChild(choiceInnerChecked);
            eachChoice.appendChild(choiceChecked);

            const choiceText = document.createElement('span');
            choiceText.classList.add('choice-text');
            choiceText.innerHTML = choice;
            choiceText.id = choice;
            eachChoice.appendChild(choiceText);

            questionCheckedAnswerWrapper.appendChild(eachChoice);
          });

          if (question.other_option) {
            otherOptionWrapperChecked.style.display = 'flex';
            otherOptionInputChecked.value = "";
            otherOptionWrapperChecked.childNodes[0].classList.remove('selected');

            if (answers[question._id.toString()] && answers[question._id.toString()].filter(each => !question.choices.includes(each)).length) {
              otherOptionWrapperChecked.childNodes[0].classList.add('selected');
              otherOptionInputChecked.value = answers[question._id.toString()].filter(each => !question.choices.includes(each))[0];
            }
          }
        } else if (question.type == "range") {
          for (let number = question.min_value; number <= question.max_value; number++) {
            const eachChoice = document.createElement('div');
            eachChoice.classList.add('each-choice');
            
            const choiceRadio = document.createElement('div');
            const choiceInnerRadio = document.createElement('div');
            choiceRadio.classList.add('choice-radio');
            if (number == answers[question._id.toString()])
              choiceRadio.classList.add('selected');
            choiceInnerRadio.classList.add('choice-inner-radio');
            choiceRadio.appendChild(choiceInnerRadio);
            eachChoice.appendChild(choiceRadio);

            const choiceText = document.createElement('span');
            choiceText.classList.add('choice-text');
            choiceText.innerHTML = number + (number == question.min_value ? " (" + question.min_explanation + ")" : "") + (number == question.max_value ? " (" + question.max_explanation + ")" : "");
            choiceText.id = number;
            eachChoice.appendChild(choiceText);

            questionRangeAnswerWrapper.appendChild(eachChoice);
          }
        }
      }
    }

    if (event.target.classList.contains('each-choice')) {
      if (event.target.classList.contains('each-choice-checked')) {
        if (!answers[question._id.toString()] || !answers[question._id.toString()].length)
          answers[question._id.toString()] = [];

        if (answers[question._id.toString()].length && answers[question._id.toString()].includes(event.target.childNodes[1].id)) {
          event.target.childNodes[0].classList.remove('selected');
          answers[question._id.toString()] = answers[question._id.toString()].filter(each => each != event.target.childNodes[1].id);
        } else {
          event.target.childNodes[0].classList.add('selected');
          answers[question._id.toString()].push(event.target.childNodes[1].id);
        }
      } else {
        event.target.parentNode.childNodes.forEach(choice => {
          choice.childNodes[0].classList.remove('selected');
        });
        event.target.childNodes[0].classList.add('selected');
        answers[question._id.toString()] = event.target.childNodes[1].id;
      }
    }
    if (event.target.parentNode.classList.contains('each-choice')) {
      if (event.target.parentNode.classList.contains('each-choice-checked')) {
        if (!answers[question._id.toString()] || !answers[question._id.toString()].length)
          answers[question._id.toString()] = [];

        if (answers[question._id.toString()].includes(event.target.parentNode.childNodes[1].id)) {
          event.target.parentNode.childNodes[0].classList.remove('selected');
          answers[question._id.toString()] = answers[question._id.toString()].filter(each => each != event.target.parentNode.childNodes[1].id);
        } else {
          event.target.parentNode.childNodes[0].classList.add('selected');
          answers[question._id.toString()].push(event.target.parentNode.childNodes[1].id);
        }
      } else {
        event.target.parentNode.parentNode.childNodes.forEach(choice => {
          choice.childNodes[0].classList.remove('selected');
        });
        event.target.parentNode.childNodes[0].classList.add('selected');
        answers[question._id.toString()] = event.target.parentNode.childNodes[1].id;
      }
    }
    if (event.target.parentNode.parentNode.classList.contains('each-choice')) {
      if (event.target.parentNode.parentNode.classList.contains('each-choice-checked')) {
        if (!answers[question._id.toString()] || !answers[question._id.toString()].length)
          answers[question._id.toString()] = [];

        if (answers[question._id.toString()].includes(event.target.parentNode.parentNode.childNodes[1].id)) {
          event.target.parentNode.parentNode.childNodes[0].classList.remove('selected');
          answers[question._id.toString()] = answers[question._id.toString()].filter(each => each != event.target.parentNode.parentNode.childNodes[1].id);
        } else {
          event.target.parentNode.parentNode.childNodes[0].classList.add('selected');
          answers[question._id.toString()].push(event.target.parentNode.parentNode.childNodes[1].id);
        }
      } else {
        event.target.parentNode.parentNode.parentNode.childNodes.forEach(choice => {
          choice.childNodes[0].classList.remove('selected');
        });
        event.target.parentNode.parentNode.childNodes[0].classList.add('selected');
        answers[question._id.toString()] = event.target.parentNode.parentNode.childNodes[1].id;
      }
    }

    if (event.target.classList.contains('other-option-choice-checked') && otherOptionInputChecked.value) {
      if (event.target.classList.contains('selected')) {
        event.target.classList.remove('selected');
        answers[question._id.toString()] = answers[question._id.toString()].filter(each => each != otherOptionInputChecked.value);
      } else {
        event.target.classList.add('selected');
        answers[question._id.toString()].push(otherOptionInputChecked.value)
      }
    }
    if (event.target.parentNode.classList.contains('other-option-choice-checked') && otherOptionInputChecked.value) {
      if (event.target.parentNode.classList.contains('selected')) {
        event.target.parentNode.classList.remove('selected');
        answers[question._id.toString()] = answers[question._id.toString()].filter(each => each != otherOptionInputChecked.value);
      } else {
        event.target.parentNode.classList.add('selected');
        answers[question._id.toString()].push(otherOptionInputChecked.value)
      }
    }
  });
  
  questionShortAnswerInput.oninput = () => {
    if (charNumber < questionShortAnswerInput.value.length) {
      questionShortAnswerInput.value = questionShortAnswerInput.value.substring(0, charNumber);
    } else {
      questionShortLeftCharacterText.innerHTML = (charNumber - questionShortAnswerInput.value.length) + " " + characterLeftText;
    }
    answers[question._id.toString()] = questionShortAnswerInput.value;
  }
  questionLongAnswerInput.oninput = () => {
    if (charNumber < questionLongAnswerInput.value.length) {
      questionLongAnswerInput.value = questionLongAnswerInput.value.substring(0, charNumber);
    } else {
      questionLongLeftCharacterText.innerHTML = (charNumber - questionLongAnswerInput.value.length) + " " + characterLeftText;
    }
    answers[question._id.toString()] = questionLongAnswerInput.value;
  }

  otherOptionInputRadio.oninput = () => {
    answers[question._id.toString()] = otherOptionInputRadio.value;
    if (otherOptionInputRadio.value.length) {
      questionRadioAnswerWrapper.childNodes.forEach(choice => {
        choice.childNodes[0].classList.remove('selected');
      });
      otherOptionWrapperRadio.childNodes[0].classList.add('selected');
    } else {
      questionRadioAnswerWrapper.childNodes.forEach(choice => {
        choice.childNodes[0].classList.remove('selected');
      });
      otherOptionWrapperRadio.childNodes[0].classList.remove('selected');
    }
  }
  otherOptionInputChecked.oninput = () => {
    if (!answers[question._id.toString()] || !answers[question._id.toString()].length)
      answers[question._id.toString()] = [];

    if (otherOptionInputChecked.value.length) {
      if (document.getElementById('other-option-choice-checked').classList.contains('selected')) {
        answers[question._id.toString()] = answers[question._id.toString()].filter(each => question.choices.includes(each));
        answers[question._id.toString()].push(otherOptionInputChecked.value);
      } else {
        document.getElementById('other-option-choice-checked').classList.add('selected');
        answers[question._id.toString()].push(otherOptionInputChecked.value);
      }
    } else {
      document.getElementById('other-option-choice-checked').classList.remove('selected');
      answers[question._id.toString()] = answers[question._id.toString()].filter(each => question.choices.includes(each));
    }
  }
}
