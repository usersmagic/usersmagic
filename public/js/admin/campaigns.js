window.onload = () => {
  const questions = [];

  document.addEventListener('click', event => {
    if (event.target.className == 'new-campaign-button' || event.target.parentNode.className == 'new-campaign-button') {
      document.querySelector('.all-content-inner-wrapper').style.display = 'none';
      document.querySelector('.new-form-wrapper').style.display = 'flex';
    }

    if (event.target.className == 'back-button') {
      document.querySelector('.all-content-inner-wrapper').style.display = 'flex';
      document.querySelector('.new-form-wrapper').style.display = 'none';
    }

    const campaignQuestionsInput = document.getElementById('campaign-questions-input');
    const questionTextInput = document.getElementById('question-text-input');
    const typeInputs = document.querySelectorAll('.question-type-input');
    const questionChoicesInput = document.getElementById('question-choices-input');

    if (event.target.className == 'add-question-button') {
      if (!questionTextInput.value.length) return;

      let type = null;
      typeInputs.forEach(input => {
        if (input.checked) {
          type = input.value;
          input.checked = false;
        }
      });

      if (!type) return;

      if ((type == 'radio' || type == 'checked') && !questionChoicesInput.value.length) return;

      const new_question = {
        text: questionTextInput.value,
        type,
        choices: (type == 'radio' || type == 'checked') ? questionChoicesInput.value.split(',').map(e => e.trim()) : null
      };

      questions.push(new_question)

      campaignQuestionsInput.value = JSON.stringify(questions);

      questionTextInput.value = "";
      questionChoicesInput.value = "";
    }
  });
}
