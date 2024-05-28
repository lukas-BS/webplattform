import Modal from 'bootstrap/js/dist/modal';

let modal;

var accepted = getCookie('cookiesAccepted') === 'true';
console.log(accepted);
if (!accepted) {
  modal = new Modal($('.js-cookiebanner'), { backdrop: 'static', keyboard: false });
  modal.show();
}
window.acceptCookies = function () {
  const date = new Date();
  date.setTime(date.getTime() + window.cookieBannerDuration * 30 * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + date.toUTCString();
  document.cookie = 'cookiesAccepted=true;path=/; ' + expires;
  modal.hide();
};
