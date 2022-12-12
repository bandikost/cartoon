
// Прелоадер

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


// Облако в планетах


$(document).ready(function() {
    $('.planet__burger').click(function(event) {
        $('.planet__burger, .planet__menu').toggleClass('active');
        $('body').toggleClass('lock');
    });
});



// Кнопка Загрузить еще

const showMore = document.querySelector('.show-more');
const productsLength = document.querySelectorAll('.products-grid__item').length;
let items = 3;
showMore.addEventListener('click', () => {
	items += 3;
	const array = Array.from(document.querySelector('.products-grid').children);
	const visItems = array.slice(0, items);

	visItems.forEach(el => el.classList.add('is-visible'));

	if (visItems.length === productsLength) {
		showMore.style.display = 'none';
	}
});




