window.onload = () => {
  document.addEventListener('click', event => {
    if (event.target.classList.contains('view-each-campaign-details-button')) {
      createConfirm({
        title: event.target.nextElementSibling.innerHTML,
        text: event.target.nextElementSibling.nextElementSibling.innerHTML,
        accept: document.querySelector('.dismiss-text').innerHTML
      }, res => {
        return;
      });
    };
  });
}
