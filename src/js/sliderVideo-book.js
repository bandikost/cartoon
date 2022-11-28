$(document).ready(function(){
    let position = 0;
    const slidesToShower = 4;
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