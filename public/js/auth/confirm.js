window.onload = () => {
  document.addEventListener('click', event => {
    if (event.target.classList.contains('resend-confirm-button') || event.target.parentNode.classList.contains('resend-confirm-button'))
      return window.location.reload();
  });
}
