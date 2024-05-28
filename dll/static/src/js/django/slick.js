import $ from 'jquery';

$('.js-slick-wrapper').slick({
  autoplay: true,
  dots: true,
  infinite: true,
  responsive: [
    {
      breakpoint: 1490,
      settings: {
        slidesToScroll: 2,
        slidesToShow: 2
      }
    },
    {
      breakpoint: 920,
      settings: {
        slidesToScroll: 1,
        slidesToShow: 1
      }
    }
  ],
  slidesToScroll: 3,
  slidesToShow: 3
});
$('.js-testimonials').slick({
  autoplay: true,
  dots: true,
  infinite: true,
  slidesToScroll: 1,
  slidesToShow: 1
});
