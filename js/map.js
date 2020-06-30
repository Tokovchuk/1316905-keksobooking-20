'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');
  var mainPin = document.querySelector('.map__pin--main');

  var switchActiveMap = function () {
    map.classList.remove('map--faded');
  };

  var switchDisableMap = function () {
    map.classList.add('map--faded');
  };

  var addPinsToMap = function (items) {
    var fragment = document.createDocumentFragment();
    items.forEach(function (ad) {
      fragment.appendChild(window.pin.render(ad));
    });
    mapPins.appendChild(fragment);
  };

  var removePinsFromMap = function () {
    var pins = mapPins.querySelectorAll('button:not(.map__pin--main');
    pins.forEach(function (pin) {
      pin.remove();
    });
  };

  var onMainPinEnterPress = function (evt) {
    if (evt.key === 'Enter') {
      window.main.switchToActiveSite();
    }
  };

  var onMainPinMouseDown = function (evt) {
    if (evt.button === 0) {
      window.main.switchToActiveSite();
    }
  };

  var addListenersToMainPin = function () {
    mainPin.addEventListener('mousedown', onMainPinMouseDown);
    mainPin.addEventListener('keydown', onMainPinEnterPress);
  };

  var removeListenersFromMainPin = function () {
    mainPin.removeEventListener('mousedown', onMainPinMouseDown);
    mainPin.removeEventListener('keydown', onMainPinEnterPress);
  };

  window.map = {
    switchActive: switchActiveMap,
    switchDisable: switchDisableMap,
    addPins: addPinsToMap,
    removePins: removePinsFromMap,
    addListenersToMainPin: addListenersToMainPin,
    removeListenersFromMainPin: removeListenersFromMainPin,
  };
})();

