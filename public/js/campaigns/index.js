window.onload = () => {
  //const inviteButton = document.querySelector('.invite-button');
  // document.addEventListener('mouseover', event => {
  //   if (event.target.classList.contains('invite-button') || event.target.parentNode.classList.contains('invite-button')) {
  //     inviteButton.classList.remove('invite-button-close-animation-class');
  //     inviteButton.classList.add('invite-button-open-animation-class');
  //   } else {
  //     if (inviteButton.classList.contains('invite-button-open-animation-class')) {
  //       inviteButton.classList.remove('invite-button-open-animation-class');
  //       inviteButton.classList.add('invite-button-close-animation-class');
  //     }
  //   }
  // });

  // document.addEventListener('click', event => {
  //   if (event.target.className == 'invite-close-text') {
  //     document.querySelector('.invite-wrapper').style.display = 'none';
  //   } else if ((event.target.classList.contains('invite-button') || event.target.parentNode.classList.contains('invite-button'))) {
  //     document.querySelector('.invite-wrapper').style.display = 'flex';
  //   } else if (event.target.className == 'invite-copy-button' || event.target.parentNode.className == 'invite-copy-button') {
  //     const inviteMessage = document.querySelector('.invite-message');
  //     const range = document.createRange();
  //     range.selectNodeContents(inviteMessage);
  //     const selection = window.getSelection();
  //     selection.removeAllRanges();
  //     selection.addRange(range);
  //     document.execCommand('copy');
  //     document.querySelector('.invite-copy-button-text').innerHTML = 'Kopyalandı!';
  //     document.querySelector('.invite-copy-button').style.cursor = 'default';
  //     setTimeout(() => {
  //       document.querySelector('.invite-copy-button-text').innerHTML = 'Linki Kopyala';
  //       document.querySelector('.invite-copy-button').style.cursor = 'pointer';
  //     }, 1000);
  //   } else if (event.target.className != 'invite-wrapper' && event.target.parentNode.className != 'invite-wrapper' && event.target.parentNode.parentNode.className != 'invite-wrapper' && event.target.parentNode.parentNode.parentNode.className != 'invite-wrapper') {
  //     document.querySelector('.invite-wrapper').style.display = 'none';
  //   }
  // });

  var campaign_details = $("#campaign-details").val()
  campaign_details = JSON.parse(campaign_details)
  var sum = 0;
  campaign_details.forEach(campaign => {
    sum += campaign['price']
  })

  const currency = $("#currency").val()

  const money = currency +""+ sum
  var html_content_total_price = $(".total-price-of-tests").html()
  html_content_total_price = html_content_total_price.replace('__', money)
  $(".total-price-of-tests").html(html_content_total_price)

}
