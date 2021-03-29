window.onload = () => {
  const user = JSON.parse(document.getElementById('user-json').value);
  const country = JSON.parse(document.getElementById('country-json').value);

  const paymentNumberInput = document.querySelector('.payment-number-input');
  const confirmPaymentTitle = document.querySelector('.confirm-payment-title').innerHTML;
  const confirmPaymentText = document.querySelector('.confirm-payment-text').innerHTML;
  const noPaymentNumberTitle = document.querySelector('.no-payment-number-title').innerHTML;
  const noPaymentNumberText = document.querySelector('.no-payment-number-text').innerHTML;
  const confirmPaymentNumberTitle = document.querySelector('.confirm-payment-number-title').innerHTML;
  const confirmPaymentNumberText = document.querySelector('.confirm-payment-number-text').innerHTML;
  const numberChangedTitle = document.querySelector('.number-changed-title').innerHTML;
  const numberChangedText = document.querySelector('.number-changed-text').innerHTML;
  const unknownErrorTitle = document.querySelector('.unknown-error-title').innerHTML;
  const tryAgainLaterText = document.querySelector('.try-again-later-text').innerHTML;
  const notEnoughCreditTitle = document.querySelector('.not-enough-credit-title').innerHTML;
  const notEnoughCreditText = document.querySelector('.not-enough-credit-text').innerHTML;
  const okayText = document.querySelector('.okay-text').innerHTML;
  const confirmText = document.querySelector('.confirm-text').innerHTML;
  const cancelText = document.querySelector('.cancel-text').innerHTML;

  document.addEventListener('click', event => {
    if (event.target.classList.contains('withdraw-button') || event.target.parentNode.classList.contains('withdraw-button')) {
      if (!paymentNumberInput) {
        if (user.credit < country.min_payment_amount) {
          createConfirm({
            title: notEnoughCreditTitle,
            text: notEnoughCreditText.replace('0', country.min_payment_amount.toString()),
            reject: okayText
          }, res => { return });
        } else {
          createConfirm({
            title: confirmPaymentTitle,
            text: confirmPaymentText,
            accept: confirmText,
            reject: cancelText
          }, res => {
            if (!res) return;
  
            serverRequest('/wallet/payment?user_id=' + user._id.toString(), 'GET', {}, res => {
              if (!res.success)
                return createConfirm({
                  title: unknownErrorTitle,
                  text: tryAgainLaterText,
                  reject: confirmText
                }, res => { return });
  
              return window.location.reload();
            });
          }); 
        }
      } else {
        if (paymentNumberInput.value && paymentNumberInput.value.length) {
          createConfirm({
            title: confirmPaymentNumberTitle,
            text: confirmPaymentNumberText + ' ' + paymentNumberInput.value.trim(),
            accept: confirmText,
            reject: cancelText
          }, res => {
            if (!res) return;

            serverRequest('/wallet/number', 'POST', {
              payment_number: paymentNumberInput.value.trim()
            }, res => {
              if (!res.success) {
                createConfirm({
                  title: unknownErrorTitle,
                  text: tryAgainLaterText,
                  reject: confirmText
                }, res => { return });
              } else {
                createConfirm({
                  title: numberChangedTitle,
                  text: numberChangedText,
                  accept: okayText
                }, res => {
                  document.querySelector('.card-number').childNodes[1].innerHTML = paymentNumberInput.value.trim();
                  paymentNumberInput.remove();
                });
              }
            });
          });
        } else {
          createConfirm({
            title: noPaymentNumberTitle,
            text: noPaymentNumberText,
            reject: okayText
          }, res => { return });
        }
      }
    }
  })
}
