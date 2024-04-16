import $ from 'jquery';
import Popover from 'bootstrap/js/dist/popover';

$(function () {
  $('.js-share-content').map((idx, ele) => {new Popover(ele, {
      html: true,
      sanitize: false,
      trigger: 'focus'
    });
  });
  $("body").on("click", "[data-share]", (e) => {
    var value = $(e.target).closest("[data-share]").data("share");
    _paq.push(["trackEvent", "Sharing", value, window.location.href]);
  });
});
