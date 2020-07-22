'use strict';
(function () {
  var MAIN_PIN_LEFT_DEFAULT = 570;
  var MAIN_PIN_TOP_DEFAULT = 375;
  var adForm = document.querySelector('.ad-form');
  var resetButton = adForm.querySelector('.ad-form__reset');
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
    updatePins();
  };

  var updatePins = function () {
    var typeHousing = document.querySelector('#housing-type');

    typeHousing.addEventListener('change', function () {
      window.map.removePins();
      var sameTypeHousing = ads.filter(function (ad) {
        return ad.offer.type === typeHousing.value;
      });
      window.map.addPins(sameTypeHousing);
    });
  };

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
