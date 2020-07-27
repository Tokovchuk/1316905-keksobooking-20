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
    var filterByType = function (ad) {
      if (typeHousing.value === 'any') {
        return true;
      }
      return ad.offer.type === typeHousing.value;
    };
    var filterByRooms = function (ad) {
      if (roomsHousing.value === 'any') {
        return true;
      }
      return ad.offer.rooms === parseInt(roomsHousing.value, 10);
    };
    var filterByGuests = function (ad) {
      if (guestsHousing.value === 'any') {
        return true;
      }
      return ad.offer.guests === parseInt(guestsHousing.value, 10);
    };
    var filterByPrice = function (ad) {
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
    };
    var filterByFeatures = function (ad) {
      var checkedFeatures = Array.from(document.querySelectorAll('.map__checkbox:checked'));
      return checkedFeatures.every(function (checkedFeature) {
        return ad.offer.features.includes(checkedFeature.value);
      });
    };
    var filterAds = ads.filter(function (ad) {
      return filterByType(ad) &&
        filterByPrice(ad) &&
        filterByRooms(ad) &&
        filterByGuests(ad) &&
        filterByFeatures(ad);
    });
    updatePins(filterAds);
  };
  var updatePins = window.debounce(window.map.addPins);

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
    window.map.switchDisable();
    window.map.removePins();
    adForm.classList.add('ad-form--disabled');
    adForm.reset();
    window.form.addAddressInDisable();
    window.map.mainPin.style.top = MAIN_PIN_TOP_DEFAULT + 'px';
    window.map.mainPin.style.left = MAIN_PIN_LEFT_DEFAULT + 'px';
  };

  var switchToActiveSite = function () {
    window.form.removeDisabled();
    window.form.addAddressInActive();
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
    switchToDisableSite();
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
