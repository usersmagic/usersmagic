window.onload = () => {
  const user = JSON.parse(document.getElementById('user-object').value);

  const paymentNumberWrapper = document.querySelector('.payment-number-wrapper');

  const inviteButton = document.querySelector('.invite-button');
  document.addEventListener('mouseover', event => {
    if (event.target.classList.contains('invite-button') || event.target.parentNode.classList.contains('invite-button')) {
      inviteButton.classList.remove('invite-button-close-animation-class');
      inviteButton.classList.add('invite-button-open-animation-class');
    } else {
      if (inviteButton.classList.contains('invite-button-open-animation-class')) {
        inviteButton.classList.remove('invite-button-open-animation-class');
        inviteButton.classList.add('invite-button-close-animation-class');
      }
    }
  });

  document.addEventListener('click', event => {
    if (event.target.className == 'get-credit-button' || event.target.parentNode.className == 'get-credit-button') {
      if (user.payment_number)
        return window.location = "/profile/user/payment";

      paymentNumberWrapper.style.display = 'flex';
    }

    if (event.target.className == 'close-payment-button')
      paymentNumberWrapper.style.display = 'none';

    if (event.target.className == 'invite-close-text') {
      document.querySelector('.invite-wrapper').style.display = 'none';
    } else if ((event.target.classList.contains('invite-button') || event.target.parentNode.classList.contains('invite-button'))) {
      document.querySelector('.invite-wrapper').style.display = 'flex';
    } else if (event.target.className == 'invite-copy-button' || event.target.parentNode.className == 'invite-copy-button') {
      const inviteMessage = document.querySelector('.invite-message');
      const range = document.createRange();
      range.selectNodeContents(inviteMessage);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand('copy');
      document.querySelector('.invite-copy-button-text').innerHTML = 'Kopyalandı!';
      document.querySelector('.invite-copy-button').style.cursor = 'default';
      setTimeout(() => {
        document.querySelector('.invite-copy-button-text').innerHTML = 'Linki Kopyala';
        document.querySelector('.invite-copy-button').style.cursor = 'pointer';
      }, 1000);
    } else if (event.target.className != 'invite-wrapper' && event.target.parentNode.className != 'invite-wrapper' && event.target.parentNode.parentNode.className != 'invite-wrapper' && event.target.parentNode.parentNode.parentNode.className != 'invite-wrapper') {
      document.querySelector('.invite-wrapper').style.display = 'none';
    }
  });
}
