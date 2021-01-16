window.onload = () => {
  const selectInput = document.querySelector('.select-input');
  const selectInputWrapper = document.querySelector('.select-input-wrapper');
  const countryInput = document.getElementById('country-input');
  const selectInputChoices = document.querySelector('.select-input-choices');
  const inputChoices = document.querySelectorAll('.each-input-choice');

  selectInput.onfocus = () => {
    if (selectInputWrapper.classList.contains('close-up-animation-class'))
      selectInputWrapper.classList.remove('close-up-animation-class');

    selectInputWrapper.classList.add('open-bottom-animation-class');
  }

  selectInput.oninput = () => {
    if (selectInput.value) {
      selectInputChoices.innerHTML = "";
      inputChoices.forEach(choice => {
        if (choice.innerHTML.toLocaleLowerCase().includes(selectInput.value.toLocaleLowerCase())) {
          selectInputChoices.appendChild(choice);
          while (choice.previousElementSibling && choice.innerHTML.toLocaleLowerCase().indexOf(selectInput.value.toLocaleLowerCase()) < choice.previousElementSibling.innerHTML.toLocaleLowerCase().indexOf(selectInput.value.toLocaleLowerCase()))
            selectInputChoices.insertBefore(choice, choice.previousElementSibling);
        }
      });
    } else {
      selectInputChoices.innerHTML = "";
      inputChoices.forEach(choice => {
        selectInputChoices.appendChild(choice);
      });
    }
  }

  document.addEventListener('click', event => {
    if (event.target.className == 'each-input-choice') {
      selectInput.value = event.target.innerHTML;
      countryInput.value = event.target.id;
      selectInputWrapper.classList.remove('open-bottom-animation-class');
      selectInputWrapper.classList.add('close-up-animation-class');
      setTimeout(() => {
        selectInputChoices.scrollTo(0, 0);
      }, 500);
    }
    else if (!selectInputWrapper.classList.contains('close-up-animation-class') && (event.target.className != 'select-input-choices' && event.target.className != 'select-input-wrapper' && event.target.className != 'select-input-outer-wrapper' && event.target.className != 'select-input')) {
      selectInputWrapper.classList.remove('open-bottom-animation-class');
      selectInputWrapper.classList.add('close-up-animation-class');
      setTimeout(() => {
        selectInputChoices.scrollTo(0, 0);
      }, 500);
    }
  });

  const birth_year_section = ".input-choices-birthyear"
  //list birty_years from start to finish
  const start = 1920;
  const finish = 2010;

  var list = ""

  for(var i = finish; i >= start; i--){
    list += "<li class='each-input-birthyear' id='"+i+"'>"+i+"</li>";
  }

  $(birth_year_section).html(list)
  $(birth_year_section).hide()
  var clicked = false;
  $(".general-input-with-border[name='birth_year']").click(function(){
    if (!clicked) {
      $(birth_year_section).show(500);
      clicked = true;
    }
    else{
      clicked = false;
      $(birth_year_section).hide(500);
    }
  })

  $(".each-input-birthyear").click(function(){
    var clicked_value = this.id
    $(".general-input-with-border[name='birth_year']").val(clicked_value)
    $(birth_year_section).hide()
  })

  $.getJSON("/js/country_codes.json", function(data){
    data.forEach(item => {
      $(".country-codes").append("<option value="+item['dial_code']+"> "+item['name']+" ("+item['dial_code']+")</option>")
    });
  var last_item;
  var country;

  $(".country-codes").on('change', function(){
    if(last_item != null && country != null){
      country.text = last_item
    }

    var value = $(this).val()
    var country_code = document.getElementById('country-codes')
    country = country_code.options[country_code.selectedIndex]
    last_item = country_code.options[country_code.selectedIndex].text
    country.text = value
  })
  })



}
