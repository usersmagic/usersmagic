window.onload = () => {
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
  const okeyText = document.querySelector('.okey-text').innerHTML;
  const confirmText = document.querySelector('.confirm-text').innerHTML;
  const cancelText = document.querySelector('.cancel-text').innerHTML;

  document.addEventListener('click', event => {
    if (event.target.classList.contains('withdraw-button') || event.target.parentNode.classList.contains('withdraw-button')) {
      if (!paymentNumberInput) {
        createConfirm({
          title: confirmPaymentTitle,
          text: confirmPaymentText,
          accept: confirmText,
          reject: cancelText
        }, res => {
          if (!res) return;

        });
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
              console.log(res);
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
                  accept: okeyText
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
            reject: okeyText
          }, res => { return });
        }
      }
    }
  })
}
