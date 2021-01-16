window.onload = () => {
  $("#email-error").hide()
  $("#password-length-error").hide()
  $("#password-confirmation-error").hide()

  const registerForm = document.querySelector('.register-form');
  const agreementWrapper = document.querySelector('.agreement-wrapper');
  const agreementCheckboxWrapper = document.querySelector('.agreement-checkbox-wrapper');

  registerForm.onsubmit = event => {
    $(".error-text").hide()
    event.preventDefault();
    // if (!agreementWrapper.childNodes[0].checked) {
    //   agreementCheckboxWrapper.style.borderColor = "rgb(240, 84, 79)";
    //   setTimeout(() => {
    //     agreementCheckboxWrapper.style.borderColor = "rgb(236, 236, 236)";
    //   }, 500);
    // } else {
      var email = $("input[name='email']").val()
      var password = $("input[name='password']").val()
      var confirm_password = $("input[name='password_confirm']").val()
      var is_there_an_error = false;

      if(!is_valid_email(email)){
        $("#email-error").show()
        is_there_an_error = true;
      }

      if(!is_valid_password(password)){
        $("#password-length-error").show()
        is_there_an_error = true;
      }

      if(!does_password_match(password, confirm_password)){
        $("#password-confirmation-error").show()
        is_there_an_error = true;
      }

      if(!is_there_an_error) registerForm.submit();
    //}
  }

  document.addEventListener('click', event => {
    if (event.target.classList.contains('agreement-wrapper') || event.target.parentNode.classList.contains('agreement-wrapper') || event.target.parentNode.parentNode.classList.contains('agreement-wrapper')) {
      if (agreementWrapper.childNodes[0].checked) {
        agreementWrapper.childNodes[0].checked = false;
        agreementCheckboxWrapper.style.backgroundColor = "rgb(254, 254, 254)";
      } else {
        agreementWrapper.childNodes[0].checked = true;
        agreementCheckboxWrapper.style.backgroundColor = "rgb(240, 84, 79)";
      }
    }
  })
}

function is_valid_email(email){
  if(!email.includes('@')) return false;
  email = email.split('@')
  prefix = email[0]
  suffix = email[1]

  if(prefix == '' || suffix == '') return false;

  return true;
}

function is_valid_password(password){
  var pass_length = password.length;

  if (pass_length < 6) return false;
  else return true;
}

function does_password_match(password, confirm_password){
  if(password != confirm_password) return false;
  else return true;
}
