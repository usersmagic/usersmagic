// Validate questions and return them if there is no error
// If options {final: true} is set validates questions for their final shape

const async = require('async');

module.exports = (questions, options, callback) => {
  if (!questions || !Array.isArray(questions))
    return callback('bad_request');

  if (options.final && !questions.length)
    return callback('bad_request');

  const allowedQuestionTypes = ['yes_no', 'multiple_choice', 'opinion_scale', 'open_answer'];
  const questionIdLength = 11, maxQuestionTextLength = 1000, maxQuestionLongTextLength = 5000, maxQuestionAnswerLength = 5000;
  const rangeMinValue = 1, rangeMaxValue = 10;

  async.times(
    questions.length,
    (time, next) => {
      const question = questions[time];

      if (!question || !question.type || !question._id)
        return next('bad_request');

      if (!allowedQuestionTypes.includes(question.type))
        return next('unknown_question_type');

      if (question.text && question.text.length > maxQuestionTextLength)
        return next('character_limit');

      if (options.final && (!question.text || !question.text.length))
        return next('bad_request');

      if (question.details && question.details.length > maxQuestionLongTextLength)
        return next('character_limit');

      const newQuestionData = {
        type: question.type,
        _id: question._id,
        text: question.text || '',
        details: question.details && question.details.length ? question.details : null,
        image: question.image && question.image.length ? question.image : null,
        required: question.required
      };

      if (question.type == 'multiple_choice') {
        if (!question.subtype || (question.subtype != 'single' && question.subtype != 'multiple'))
          return next('unknown_question_type');

        if (options.final && (!question.choices || !question.choices.length) && (!question.choiceInputValue || !question.choiceInputValue.length))
          return next('bad_request');

        if (question.choices && question.choices.filter(choice => choice.length > maxQuestionTextLength).length)
          return next('character_limit');
        
        newQuestionData.subtype = question.subtype;
        newQuestionData.choices = question.choices || [];
        if (options.final && question.choiceInputValue && question.choiceInputValue.length)
          question.choices.push(question.choiceInputValue);
        else
          newQuestionData.choiceInputValue = question.choiceInputValue || '';
      } else if (question.type == 'opinion_scale') {
        const range = {
          min: (question.range && question.range.min && !isNaN(parseInt(question.range.min))) ? Math.max(1, parseInt(question.range.min)) : '',
          max: (question.range && question.range.max && !isNaN(parseInt(question.range.max))) ? Math.min(10, parseInt(question.range.max)) : ''
        };
        const labels = {
          left: question.labels && question.labels.left ? question.labels.left : '',
          middle: question.labels && question.labels.middle ? question.labels.middle : '',
          right: question.labels && question.labels.right ? question.labels.right : ''
        };

        if (options.final && (!Number.isInteger(question.range.min) || !Number.isInteger(question.range.max)))
          return next('bad_request');
        
        if (options.final && range.min < rangeMinValue)
          return next('bad_request');

        if (options.final && range.max > rangeMaxValue)
          return next('bad_request');

        if (options.final && range.min >= range.max)
          return next('bad_request');

        if (labels.left.length > maxQuestionTextLength || labels.middle.length > maxQuestionTextLength || labels.right.length > maxQuestionTextLength)
          return next('bad_request');

        newQuestionData.range = range;
        newQuestionData.labels = labels;
      } else if (question.type == 'open_answer') {
        newQuestionData.max_answer_length = maxQuestionAnswerLength;
      }

      next(null, newQuestionData);
    },
    (err, newQuestions) => {
      if (err) return callback(err);

      return callback(null, newQuestions)
    }
  );
}
