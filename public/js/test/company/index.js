window.onload = () => {
  const campaign = {
    name: null,
    description: null,
    information: null,
    photo: null,
    questions: [],
    filter: {}
  }

  const campaignInfoTitle = document.getElementById('campaign-info-title');
  const campaignQuestionTitle = document.getElementById('campaign-question-title');
  const campaignFilterTitle = document.getElementById('campaign-filter-title');
  const campaignPaymentTitle = document.getElementById('campaign-payment-title');

  const campaignInfoWrapper = document.querySelector('.campaign-info-wrapper');
  const campaignQuestionWrapper = document.querySelector('.campaign-question-wrapper');

  const nameInput = document.querySelector('.name-input');
  const descriptionInput = document.querySelector('.description-input');
  const informationInput = document.querySelector('information-input');

  nameInput.oninput = () => campaign.name = (nameInput.value.length ? nameInput.value : null);
  descriptionInput.oninput = () => campaign.description = (descriptionInput.value.length ? descriptionInput.value : null);
  informationInput.oninput = () => campaign.information = (informationInput.value.length ? informationInput.value : null);

  document.addEventListener('click', event => {

  });

  const photoSelectInput = document.getElementById('photo-select-input');
  const imageSpan = document.getElementById('image-span');
  const uploadingText = document.getElementById('uploading-text').innerHTML;
  const uploadedText = document.getElementById('uploaded-text').innerHTML;
  const campaignNoPhotoIcon = document.getElementById('campaign-no-photo-icon');
  const campaignPhoto = document.querySelector('.campaign-photo');

  photoSelectInput.onchange = () => {
    imageSpan.innerHTML = uploadingText;
    const file = photoSelectInput.files[0];
    var formdata = new FormData();
    formdata.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/test/company/photo");
    xhr.send(formdata);
    
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.responseText) {
        if (xhr.status == 500) {
          imageSpan.innerHTML = uploadedText;
          alert("An unknown error occured, please try again later.");
          photoSelectInput.value = ''
          if (!/safari/i.test(navigator.userAgent)){
            photoSelectInput.type = ''
            photoSelectInput.type = 'file'
          }
        } else {
          imageSpan.innerHTML = uploadedText;
          photoSelectInput.value = ''
          if (!/safari/i.test(navigator.userAgent)){
            photoSelectInput.type = ''
            photoSelectInput.type = 'file'
          }
          campaignPhoto.style.display = "block";
          campaignNoPhotoIcon.style.display = "none";
          campaignPhoto.src = xhr.responseText;
          campaign.photo = xhr.responseText;
        }
      };
    };
  }
}
