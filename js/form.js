'use strict';

(function () {
  var MAIN_MAP_PIN_WIDTH_DISABLE = 65;
  var MAIN_MAP_PIN_HEIGHT_DISABLE = 65;
  var MAIN_MAP_PIN_WIDTH_ACTIVE = 65;
  var MAIN_MAP_PIN_HEIGHT_ACTIVE = 84;

  var addressMain = document.querySelector('#address');
  var roomNumber = document.querySelector('#room_number');
  var capacity = document.querySelector('#capacity');
  var mainPin = document.querySelector('.map__pin--main');

  var roomsAndCapacity = {
    // rooms: capacity
    1: {
      guests: ['1'],
      error: 'Слишком много людей для данного количества комнат.',
    },
    2: {
      guests: ['1', '2'],
      error: 'Слишком много людей для данного количества комнат.',
    },
    3: {
      guests: ['1', '2', '3'],
      error: 'Слишком много людей для данного количества комнат.',
    },
    100: {
      guests: ['0'],
      error: 'Извините, в этот дворец гостям нельзя.',
    },
  };

  var addDisabled = function () {
    var fields = document.querySelectorAll('fieldset');
    fields.forEach(function (item) {
      item.setAttribute('disabled', 'disabled');
    });
    document.querySelector('.map__filters').setAttribute('disabled', 'disabled');
  };

  var removeDisabled = function () {
    var fields = document.querySelectorAll('fieldset');
    fields.forEach(function (item) {
      item.removeAttribute('disabled');
    });
    document.querySelector('.map__filters').removeAttribute('disabled');
  };

  var addAddressInDisable = function () {
    addressMain.value = Math.round(parseInt(mainPin.style.left, 10) + MAIN_MAP_PIN_WIDTH_DISABLE / 2) + ', ' + Math.round(parseInt(mainPin.style.top, 10) + MAIN_MAP_PIN_HEIGHT_DISABLE / 2);
  };

  var addAddressInActive = function () {
    addressMain.value = Math.round(parseInt(mainPin.style.left, 10) + MAIN_MAP_PIN_WIDTH_ACTIVE / 2) + ', ' + Math.round(parseInt(mainPin.style.top, 10) + MAIN_MAP_PIN_HEIGHT_ACTIVE);
  };

  var onInputRoomsOrGuestsChange = function () {
    var roomValue = roomNumber.value;
    var capacityValue = capacity.value;
    if (!roomsAndCapacity[roomValue].guests.includes(capacityValue)) {
      capacity.setCustomValidity(roomsAndCapacity[roomValue].error);
    } else {
      capacity.setCustomValidity('');
    }
  };

  var addValidateRoomsAndGuests = function () {
    roomNumber.addEventListener('change', onInputRoomsOrGuestsChange);
    capacity.addEventListener('change', onInputRoomsOrGuestsChange);
  };

  var addSyncCheckinAndCheckout = function () {
    var checkinTime = document.querySelector('#timein');
    var checkoutTime = document.querySelector('#timeout');

    checkinTime.addEventListener('change', function () {
      checkoutTime.value = checkinTime.value;
    });

    checkoutTime.addEventListener('change', function () {
      checkinTime.value = checkoutTime.value;
    });
  };

  var addValidateTypeAndPriceHousing = function () {
    var typeHousing = document.querySelector('#type');
    var priceHousing = document.querySelector('#price');
    typeHousing.addEventListener('change', function () {
      if (typeHousing.value === 'bungalo') {
        priceHousing.placeholder = 'Минимум 0';
        priceHousing.min = 0;
      }
      if (typeHousing.value === 'flat') {
        priceHousing.placeholder = 'Минимум 1000';
        priceHousing.min = 1000;
      }
      if (typeHousing.value === 'house') {
        priceHousing.placeholder = 'Минимум 5000';
        priceHousing.min = 5000;
      }
      if (typeHousing.value === 'palace') {
        priceHousing.placeholder = 'Минимум 10000';
        priceHousing.min = 10000;
      }
    });
  };

  window.form = {
    addDisabled: addDisabled,
    removeDisabled: removeDisabled,
    addAddressInDisable: addAddressInDisable,
    addAddressInActive: addAddressInActive,
    addValidateRoomsAndGuests: addValidateRoomsAndGuests,
    addSyncCheckinAndCheckout: addSyncCheckinAndCheckout,
    addValidateTypeAndPriceHousing: addValidateTypeAndPriceHousing,
  };
})();
