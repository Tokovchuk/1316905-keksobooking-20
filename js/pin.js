'use strict';

(function (){
  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGHT = 70;
  var MAIN_MAP_PIN_WIDTH_DISABLE = 65;
  var MAIN_MAP_PIN_HEIGHT_DISABLE = 65;
  var MAIN_MAP_PIN_WIDTH_ACTIVE = 65;
  var MAIN_MAP_PIN_HEIGHT_ACTIVE = 84;

  var renderPin = function (housing) {
    var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
    var pinElement = pinTemplate.cloneNode(true);
    pinElement.style.left = housing.location.x - MAP_PIN_WIDTH / 2 + 'px';
    pinElement.style.top = housing.location.y - MAP_PIN_HEIGHT + 'px';
    pinElement.querySelector('img').src = housing.author.avatar;
    pinElement.querySelector('img').alt = housing.offer.title;
    pinElement.addEventListener('click', function () {
      renderCard(housing);
    });
    pinElement.addEventListener('keydown', function (evt) {
      if (evt.key === 'Enter') {
        renderCard(housing);
      }
    });
    return pinElement;
  };
})();