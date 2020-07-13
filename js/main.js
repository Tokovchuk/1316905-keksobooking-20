'use strict';
(function () {
  var adForm = document.querySelector('.ad-form');

  var onError = function (message) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'fixed';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';
    node.textContent = message;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  var onSuccess = function (data) {
    window.map.addPins(data);
  };

  var switchToDisableSite = function () {
    window.form.addDisabled();
    window.map.addListenersToMainPin();
    window.form.addAddressInDisable();
    window.map.switchDisable();
    window.map.removePins();
    adForm.classList.add('ad-form--disabled');
  };

  var switchToActiveSite = function () {
    window.form.removeDisabled();
    window.map.switchActive();
    adForm.classList.remove('ad-form--disabled');
    window.load.data(onSuccess, onError);
  };

  switchToDisableSite();
  window.form.addSyncCheckinAndCheckout();
  window.form.addValidateTypeAndPriceHousing();
  window.form.addValidateRoomsAndGuests();

  window.main = {
    switchToActiveSite: switchToActiveSite,
    switchToDisableSite: switchToDisableSite,
  };
})();
