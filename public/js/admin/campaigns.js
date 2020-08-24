let type_names;

const createQuestion = (wrapper, question, type) => {
  const new_question = document.createElement('div');
  new_question.classList.add('each-question');
  if (type == "added")
    new_question.classList.add('added-question');
  new_question.id = question._id.toString();

  const text = document.createElement('span');
  text.classList.add('question-name');
  text.innerHTML = `${question.name} (${type_names[question.type]})`;
  new_question.appendChild(text);

  const info_wrapper = document.createElement('a');
  info_wrapper.classList.add('question-info-button');
  info_wrapper.href = "/admin/questions/details?id=" + question._id.toString();
  info_wrapper.target = "_blank";
  const info = document.createElement('i');
  info.classList.add('fas');
  info.classList.add('fa-info');
  info_wrapper.appendChild(info);
  new_question.appendChild(info_wrapper);

  if (type == "added") {
    const trash = document.createElement('i');
    trash.classList.add('fas');
    trash.classList.add('fa-trash');
    trash.classList.add('delete-question-button');
    new_question.appendChild(trash);

    const arrow = document.createElement('i');
    arrow.classList.add('fas');
    arrow.classList.add('fa-chevron-up');
    arrow.classList.add('insert-before-question-button');
    new_question.appendChild(arrow);
  } else {
    const plus = document.createElement('i');
    plus.classList.add('fas');
    plus.classList.add('fa-plus');
    plus.classList.add('add-question-button');
    new_question.appendChild(plus);
  }
  
  wrapper.appendChild(new_question);
}

window.onload = () => {
  let questions = [];
  type_names = JSON.parse(document.getElementById('type-names').value);
  const addedQuestionsWrapper = document.getElementById('added-questions-wrapper');
  const questionsWrapper = document.getElementById('questions-wrapper');
  const questionArray = JSON.parse(document.getElementById('questions').value);
  const questionsInput = document.getElementById('campaign-questions-input');
  const campaignForm = document.querySelector('.new-form-wrapper');
  const questionSearchInput = document.getElementById('question-search-input')
  let searchQuestions = document.querySelectorAll('.each-question');

  document.addEventListener('click', event => {
    if (event.target.className == 'new-campaign-button' || event.target.parentNode.className == 'new-campaign-button') {
      document.querySelector('.all-content-inner-wrapper').style.display = 'none';
      document.querySelector('.new-form-wrapper').style.display = 'flex';
    }

    if (event.target.className == 'back-button') {
      document.querySelector('.all-content-inner-wrapper').style.display = 'flex';
      document.querySelector('.new-form-wrapper').style.display = 'none';
    }

    if (event.target.classList.contains('add-question-button')) {
      if (!questions.length) addedQuestionsWrapper.innerHTML = "";
      questions.push(event.target.parentNode.id);
      questionsInput.value = JSON.stringify(questions);
      createQuestion(addedQuestionsWrapper, questionArray.find(question => question._id.toString() == event.target.parentNode.id), "added");
      event.target.parentNode.remove();
    }

    if (event.target.classList.contains('delete-question-button')) {
      if (questions.length == 1) {
        const noQuestionText = document.createElement('span');
        noQuestionText.classList.add('no-question-text');
        noQuestionText.innerHTML = 'Hiçbir soru seçmediniz.';
        addedQuestionsWrapper.appendChild(noQuestionText);
      }
      questions = questions.filter(question => question != event.target.parentNode.id);
      questionsInput.value = JSON.stringify(questions);
      createQuestion(questionsWrapper, questionArray.find(question => question._id.toString() == event.target.parentNode.id), "removed");
      event.target.parentNode.remove();
    }

    if (event.target.classList.contains('insert-before-question-button')) {
      if (event.target.parentNode.previousElementSibling);
      addedQuestionsWrapper.insertBefore(event.target.parentNode, event.target.parentNode.previousElementSibling);
      const newQuestions = [];
      questions.forEach((question, index) => {
        if (question != event.target.parentNode.id)
          newQuestions.push(question);
        else {
          newQuestions.pop();
          newQuestions.push(question);
          newQuestions.push(questions[index-1]);
        }
      });
      questions = newQuestions;
      questionsInput.value = JSON.stringify(questions);
    }
  });

  questionSearchInput.oninput = () => {
    if (questionSearchInput.value) {
      questionsWrapper.innerHTML = "";
      searchQuestions.forEach(question => {
        const questionName = question.childNodes[0].innerHTML.split('(')[0].trim().toLocaleLowerCase();
        if (!questions.includes(question.id) && questionName.includes(questionSearchInput.value.toLocaleLowerCase().trim()))
          questionsWrapper.appendChild(question);
      });
    } else {
      questionsWrapper.innerHTML = "";
      searchQuestions.forEach(question => {
        if (!questions.includes(question.id))
          questionsWrapper.appendChild(question);
      });
    }
  };

  campaignForm.onsubmit = event => {
    event.preventDefault();
    if (!questions.length) return alert("Lütfen en az bir soru seçin!");
    questionsInput.value = JSON.stringify(questions);
    campaignForm.submit();
  };
}
