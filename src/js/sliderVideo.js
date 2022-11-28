
// Для блока с карточками на главной странице -- сладйер


$(document).ready(function(){
    let position = 0;
    const slidesToShow = 3;
    const slidesToScroll = 1;
    const container = $('.slider-container');
    const track = $('.slider-track');
    const item = $('.slider-item');

    const btnPrev = $('.btn-prev');
    const btnNext = $('.btn-next');

    const itemsCount = item.length;
    const itemWidth = container.width() / slidesToShow;
    const movePosition = slidesToScroll * itemWidth;
    

    item.each(function (index, item) {
        $(item).css({
            minWidth: itemWidth - 20,
        });
    });

    btnNext.click(function() {
        const itemsLeft = itemsCount - (Math.abs(position) + slidesToShow * itemWidth) / itemWidth;

        position -= itemsLeft >= slidesToScroll ? movePosition : itemsLeft * itemWidth;

        setPosition();
        CheckBtns();
    });

    btnPrev.click(function() {
        const itemsLeft = Math.abs(position) / itemWidth;

        position += itemsLeft >= slidesToScroll ? movePosition : itemsLeft * itemWidth;

        setPosition();
        CheckBtns();
    });

    const setPosition = () => {
        track.css({
            transform: `translateX(${position}px)`
        });
    };

    const CheckBtns = () => {
        btnPrev.prop('disabled', position === 0);
        btnNext.prop(
            'disabled',
            position <= -(itemsCount - slidesToShow) * itemWidth
        );  
    };

    CheckBtns();


});



// Для блока видеоэпизодов на главной странице -- сладйер

$(document).ready(function(){
    let position = 0;
    const slidesToShower = 5;
    const slidesToScroller = 1;
    const container = $('.slide-container');
    const track = $('.slide-track');
    const item = $('.slide-item');

    const btnPrev = $('.batn-prev');
    const btnNext = $('.batn-next');

    const itemsCount = item.length;
    const itemWidth = container.width() / slidesToShower;
    const movePosition = slidesToScroller * itemWidth;
    

    item.each(function (index, item) {
        $(item).css({
            minWidth: itemWidth - 20,
        });
    });

    btnNext.click(function() {
        const itemsLeft = itemsCount - (Math.abs(position) + slidesToShower * itemWidth) / itemWidth;

        position -= itemsLeft >= slidesToScroller ? movePosition : itemsLeft * itemWidth;

        setPosition();
        CheckBtns();
    });

    btnPrev.click(function() {
        const itemsLeft = Math.abs(position) / itemWidth;

        position += itemsLeft >= slidesToScroller ? movePosition : itemsLeft * itemWidth;

        setPosition();
        CheckBtns();
    });

    const setPosition = () => {
        track.css({
            transform: `translateX(${position}px)`
        });
    };

    const CheckBtns = () => {
        btnPrev.prop('disabled', position === 0);
        btnNext.prop(
            'disabled',
            position <= -(itemsCount - slidesToShow) * itemWidth
        );  
    };

    CheckBtns();


});



// Для блока о героях на главной странице -- сладйер


$(document).ready(function(){
    let position = 0;
    const slidesToShower = 3;
    const slidesToScroller = 1;
    const container = $('.carousel-container');
    const track = $('.carousel-track');
    const item = $('.carousel-item');

    const btnPrev = $('.carouselbtn-prev');
    const btnNext = $('.carouselbtn-next');

    const itemsCount = item.length;
    const itemWidth = container.width() / slidesToShower;
    const movePosition = slidesToScroller * itemWidth;
    

    item.each(function (index, item) {
        $(item).css({
            minWidth: itemWidth - 20,
        });
    });

    btnNext.click(function() {
        const itemsLeft = itemsCount - (Math.abs(position) + slidesToShower * itemWidth) / itemWidth;

        position -= itemsLeft >= slidesToScroller ? movePosition : itemsLeft * itemWidth;

        setPosition();
        CheckBtns();
    });

    btnPrev.click(function() {
        const itemsLeft = Math.abs(position) / itemWidth;

        position += itemsLeft >= slidesToScroller ? movePosition : itemsLeft * itemWidth;

        setPosition();
        CheckBtns();
    });

    const setPosition = () => {
        track.css({
            transform: `translateX(${position}px)`
        });
    };

    const CheckBtns = () => {
        btnPrev.prop('disabled', position === 0);
        btnNext.prop(
            'disabled',
            position <= -(itemsCount - slidesToShow) * itemWidth
        );  
    };

    CheckBtns();


});





// Для блока о сказке -- сладйер


$(document).ready(function(){
    let position = 0;
    const slidesToShower = 1;
    const slidesToScroller = 1;
    const container = $('.heroes-container');
    const track = $('.heroes-track');
    const item = $('.heroes-item');

    const btnPrev = $('.heroesbtn-prev');
    const btnNext = $('.heroesbtn-next');

    const itemsCount = item.length;
    const itemWidth = container.width() / slidesToShower;
    const movePosition = slidesToScroller * itemWidth;
    

    item.each(function (index, item) {
        $(item).css({
            minWidth: itemWidth - 20,
        });
    });

    btnNext.click(function() {
        const itemsLeft = itemsCount - (Math.abs(position) + slidesToShower * itemWidth) / itemWidth;

        position -= itemsLeft >= slidesToScroller ? movePosition : itemsLeft * itemWidth;

        setPosition();
        CheckBtns();
    });

    btnPrev.click(function() {
        const itemsLeft = Math.abs(position) / itemWidth;

        position += itemsLeft >= slidesToScroller ? movePosition : itemsLeft * itemWidth;

        setPosition();
        CheckBtns();
    });

    const setPosition = () => {
        track.css({
            transform: `translateX(${position}px)`
        });
    };

    const CheckBtns = () => {
        btnPrev.prop('disabled', position === 0);
        btnNext.prop(
            'disabled',
            position <= -(itemsCount - slidesToShow) * itemWidth
        );  
    };

    CheckBtns();


});