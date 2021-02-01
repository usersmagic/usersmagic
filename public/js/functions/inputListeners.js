function listenDropDownListInputs (document) {
  // Listen for drop down input focus in event
  document.addEventListener('focusin', event => {
    if (event.target.classList.contains('general-drop-down-list-input')) {
      event.target.parentNode.classList.add('general-drop-down-list-open-bottom-animation-class');
      event.target.parentNode.classList.remove('general-drop-down-list-close-up-animation-class');
      event.target.parentNode.style.outlineColor = 'rgba(46, 197, 206, 0.6)';
      event.target.parentNode.style.outlineWidth = '5px';
      event.target.parentNode.style.outlineStyle = 'auto';
    }
  });

  // Listen for drop down input focus out event
  document.addEventListener('focusout', event => {
    if (event.target.classList.contains('general-drop-down-list-input')) {
      event.target.parentNode.classList.remove('general-drop-down-list-open-bottom-animation-class');
      event.target.parentNode.classList.add('general-drop-down-list-close-up-animation-class');
      event.target.parentNode.style.outline = 'none';
    }
  });

  // Listen for drop down input event, search the values with the given input
  document.addEventListener('input', event => {
    if (event.target.classList.contains('general-drop-down-list-input')) {
      event.target.parentNode.parentNode.querySelector('.general-drop-down-list-input-not-visible').value = '';
      const values = JSON.parse(event.target.parentNode.querySelector('.general-drop-down-list-items-json').value);
      const wrapper = event.target.parentNode.querySelector('.general-drop-down-choices-wrapper');

      wrapper.innerHTML = ''; // Reset content of the wrapper
      const inputValue = event.target.value.toLowerCase().trim();

      values.forEach(value => {
        if (inputValue.length) { // If there is a search text
          if (value.name.toLowerCase().trim().includes(inputValue)) { // Take documents that include the given text
            const newValue = document.createElement('span');
            newValue.classList.add('general-drop-down-list-each-item');
            newValue.id = value.id;
            newValue.innerHTML = value.name;
            wrapper.appendChild(newValue);
            // while (newValue.previousElementSibling && value.name.toLowerCase().trim().indexOf(inputValue) < newValue.previousElementSibling.innerHTML.toLowerCase().trim().indexOf(inputValue))
            //   wrapper.insertBefore(newValue, newValue.previousElementSibling);
          }
          if (value.name.toLowerCase().trim() == inputValue) { // If the name exactly matches the value, take this value
            event.target.parentNode.parentNode.querySelector('.general-drop-down-list-input-not-visible').value = value.id;
          }
        } else { // Select all elements
          const newValue = document.createElement('span');
          newValue.classList.add('general-drop-down-list-each-item');
          newValue.id = value.id;
          newValue.innerHTML = value.name;
          wrapper.appendChild(newValue);
        }
      });
    }
  });

  // Listen for click events
  document.addEventListener('click', event => {
    // Click on a list item, change value and id accordingly
    if (event.target.classList.contains('general-drop-down-list-each-item')) {
      event.target.parentNode.parentNode.querySelector('.general-drop-down-list-input').value = event.target.innerHTML;
      event.target.parentNode.parentNode.querySelector('.general-drop-down-list-input-not-visible').value = event.target.id;
    }
  });
}
