'use strict';
(function () {
  var MAIN_PIN_LEFT_DEFAULT = 570;
  var MAIN_PIN_TOP_DEFAULT = 375;
  var adForm = document.querySelector('.ad-form');
  var resetButton = adForm.querySelector('.ad-form__reset');

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
    window.map.addPins(data);
  };

  var onErrorFormUpload = function () {
    var errorUploadForm = document.querySelector('#error')
      .content
      .querySelector('.error')
      .cloneNode(true);
    var errorButton = errorUploadForm.querySelector('.error__button');
    document.body.insertAdjacentElement('afterbegin', errorUploadForm);
    document.addEventListener('click', function (evt) {
      if (evt.button === 0) {
        errorUploadForm.remove();
      }
    });
    errorButton.addEventListener('click', function (evt) {
      if (evt.button === 0) {
        errorUploadForm.remove();
      }
    });
    document.addEventListener('keydown', function (evt) {
      if (evt.key === 'Escape') {
        errorUploadForm.remove();
      }
    });
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
      }
    });
    document.addEventListener('keydown', function (evt) {
      if (evt.key === 'Escape') {
        successUploadForm.remove();
      }
    });
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
    window.load.data(onSuccessLoadData, onErrorLoadData);
  };

  adForm.addEventListener('submit', function (evt) {
    window.upload.data(new FormData(adForm), onSuccessFormUpload, onErrorFormUpload);
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
