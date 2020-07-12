'use strict';

(function () {
  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGHT = 70;

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
      if (window.card.template) {
        window.card.template.remove();
      }
      window.card.render(housing);
    });
    pinElement.addEventListener('keydown', function (evt) {
      if (evt.key === 'Enter') {
        if (window.card.template) {
          window.card.template.remove();
        }
        window.card.render(housing);
      }
    });
    return pinElement;
  };

  window.pin = {
    render: renderPin,
  };
})();
