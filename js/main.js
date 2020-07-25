'use strict';
(function () {
  var MAIN_PIN_LEFT_DEFAULT = 570;
  var MAIN_PIN_TOP_DEFAULT = 375;
  var adForm = document.querySelector('.ad-form');
  var resetButton = adForm.querySelector('.ad-form__reset');
  var filterHousing = document.querySelector('.map__filters');
  var typeHousing = document.querySelector('#housing-type');
  var roomsHousing = document.querySelector('#housing-rooms');
  var guestsHousing = document.querySelector('#housing-guests');
  var priceHousing = document.querySelector('#housing-price');
  var wifi = document.querySelector('#filter-wifi');
  var dishwasher = document.querySelector('#filter-dishwasher');
  var parking = document.querySelector('#filter-parking');
  var washer = document.querySelector('#filter-washer');
  var elevator = document.querySelector('#filter-elevator');
  var conditioner = document.querySelector('#filter-conditioner');
  var ads = [];

  var onErrorLoadData = function (message) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'fixed';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';
    node.textContent = message;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  var onSuccessLoadData = function (data) {
    ads = data;
    window.map.addPins(ads);
  };

  var onFilterChange = function () {
    window.map.removePins();
    if (document.querySelector('.popup')) {
      document.querySelector('.popup').remove();
    }
    var types = ads.filter(function (ad) {
      if (typeHousing.value === 'any') {
        return true;
      }
      return ad.offer.type === typeHousing.value;
    });
    var rooms = types.filter(function (ad) {
      if (roomsHousing.value === 'any') {
        return true;
      }
      return ad.offer.rooms === parseInt(roomsHousing.value, 10);
    });
    var guests = rooms.filter(function (ad) {
      if (guestsHousing.value === 'any') {
        return true;
      }
      return ad.offer.guests === parseInt(guestsHousing.value, 10);
    });
    var prices = guests.filter(function (ad) {
      if (priceHousing.value === 'any') {
        return true;
      }
      switch (priceHousing.value) {
        case 'low':
          return ad.offer.price < 10000;
        case 'high':
          return ad.offer.price > 50000;
        case 'middle':
          return ad.offer.price >= 10000 && ad.offer.price <= 50000;
      }
      return false;
    });
    var featuresWifi = prices.filter(function (ad) {
      if (wifi.checked) {
        return ad.offer.features.includes('wifi');
      }
      return true;
    });
    var featuresDishwasher = featuresWifi.filter(function (ad) {
      if (dishwasher.checked) {
        return ad.offer.features.includes('dishwasher');
      }
      return true;
    });
    var featuresParking = featuresDishwasher.filter(function (ad) {
      if (parking.checked) {
        return ad.offer.features.includes('parking');
      }
      return true;
    });
    var featuresWasher = featuresParking.filter(function (ad) {
      if (washer.checked) {
        return ad.offer.features.includes('washer');
      }
      return true;
    });
    var featuresElevator = featuresWasher.filter(function (ad) {
      if (elevator.checked) {
        return ad.offer.features.includes('elevator');
      }
      return true;
    });
    var featuresConditioner = featuresElevator.filter(function (ad) {
      if (conditioner.checked) {
        return ad.offer.features.includes('conditioner');
      }
      return true;
    });
    window.map.addPins(featuresConditioner);
  };

  filterHousing.addEventListener('change', onFilterChange);

  var onErrorFormUpload = function () {
    var errorUploadForm = document.querySelector('#error')
      .content
      .querySelector('.error')
      .cloneNode(true);
    document.body.insertAdjacentElement('afterbegin', errorUploadForm);
    document.addEventListener('click', function (evt) {
      if (evt.button === 0) {
        errorUploadForm.remove();
        document.removeEventListener('keydown', onEscPressDown);
      }
    });
    var onEscPressDown = function (evt) {
      if (evt.key === 'Escape') {
        errorUploadForm.remove();
        document.removeEventListener('keydown', onEscPressDown);
      }
    };
    document.addEventListener('keydown', onEscPressDown);
  };

  var onSuccessFormUpload = function () {
    var successUploadForm = document.querySelector('#success')
      .content
      .querySelector('.success')
      .cloneNode(true);
    document.body.insertAdjacentElement('afterbegin', successUploadForm);
    switchToDisableSite();
    document.addEventListener('click', function (evt) {
      if (evt.button === 0) {
        successUploadForm.remove();
        document.removeEventListener('keydown', onEscPressDown);
      }
    });
    var onEscPressDown = function (evt) {
      if (evt.key === 'Escape') {
        successUploadForm.remove();
        document.removeEventListener('keydown', onEscPressDown);
      }
    };
    document.addEventListener('keydown', onEscPressDown);
  };

  var switchToDisableSite = function () {
    window.form.addDisabled();
    window.map.addListenersToMainPin();
    window.form.addAddressInDisable();
    window.map.switchDisable();
    window.map.removePins();
    adForm.classList.add('ad-form--disabled');
    adForm.reset();
    window.map.mainPin.style.top = MAIN_PIN_TOP_DEFAULT + 'px';
    window.map.mainPin.style.left = MAIN_PIN_LEFT_DEFAULT + 'px';
  };

  var switchToActiveSite = function () {
    window.form.removeDisabled();
    window.map.switchActive();
    adForm.classList.remove('ad-form--disabled');
    window.load.getAds(onSuccessLoadData, onErrorLoadData);
  };

  adForm.addEventListener('submit', function (evt) {
    window.upload.sendForm(new FormData(adForm), onSuccessFormUpload, onErrorFormUpload);
    evt.preventDefault();
  });

  resetButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    adForm.reset();
  });

  switchToDisableSite();
  window.form.addSyncCheckinAndCheckout();
  window.form.addValidateTypeAndPriceHousing();
  window.form.addValidateRoomsAndGuests();

  window.main = {
    switchToActiveSite: switchToActiveSite,
    switchToDisableSite: switchToDisableSite,
  };
})();
