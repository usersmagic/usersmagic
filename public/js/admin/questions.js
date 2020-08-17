window.onload = () => {
  document.addEventListener('click', event => {
    if (event.target.className == 'new-campaign-button' || event.target.parentNode.className == 'new-campaign-button') {
      document.querySelector('.all-content-inner-wrapper').style.display = 'none';
      document.querySelector('.new-form-wrapper').style.display = 'flex';
    }

    if (event.target.className == 'back-button') {
      document.querySelector('.all-content-inner-wrapper').style.display = 'flex';
      document.querySelector('.new-form-wrapper').style.display = 'none';
    }
  });

  const searchInput = document.querySelector('.search-input');
  const searchWrapper = document.querySelector('.search-wrapper');
  searchWrapper.onsubmit = event => {
    event.preventDefault();
    if (searchInput.value)
      window.location = "/admin/questions?page=0&limit=100&search=" + searchInput.value;
    else
      window.location = "/admin/questions?page=0&limit=100"; 
  }
}
