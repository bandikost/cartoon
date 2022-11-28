
let mask = document.querySelector('.mask');

window.addEventListener('load', () => {
  mask.classList.add('hide');
  setTimeout(() => {
    mask.remove();
  }, 1000)
});


document.addEventListener("DOMContentLoaded", function(){
  var scrollbar = document.body.clientWidth - window.innerWidth + 'px';
  console.log(scrollbar);
  
});


$(document).ready(function() {
    $('.planet__burger').click(function(event) {
        $('.planet__burger, .planet__menu').toggleClass('active');
        $('body').toggleClass('lock');
    });
});