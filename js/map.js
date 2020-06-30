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
      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();

        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };
        if (startCoords.x >= window.data.LOCATION_MIN_X && startCoords.x <= window.data.LOCATION_MAX_X && startCoords.y >= window.data.LOCATION_MIN_Y && startCoords.y <= window.data.LOCATION_MAX_Y) {
          mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
          mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
        }
      };
      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      window.main.switchToActiveSite();
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
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

