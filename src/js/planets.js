document.addEventListener('DOMContentLoaded', function() {

  // Вешаем событие при нажатии на Show
  var Show = document.getElementsByClassName('button-light');
  [].forEach.call(Show, function(element, i) {       
    element.addEventListener('click', function(){
      showMessageDialog(i);
    });
  });

  // Вешаем событие при нажатии на Ok
  var Close = document.getElementsByClassName('button-primary');
  [].forEach.call(Close, function(element, i) {       
    element.addEventListener('click', function(){
      closeMessageDialog(i);
    });
  });

});

function showMessageDialog(i){
  var modal = document.getElementsByClassName('ui-message-box__wrapper')[i];   
  modal.style.display = "block";   
}

function closeMessageDialog(i){
  var modal = document.getElementsByClassName('ui-message-box__wrapper')[i];   
  modal.style.display = "none";   
}