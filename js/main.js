'use strict';
(function () {
  var adForm = document.querySelector('.ad-form');

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
    // window.map.removeListenersFromMainPin();
    // window.form.addAddressInActive();
    window.map.switchActive();
    window.map.addPins(window.data.ads);
    adForm.classList.remove('ad-form--disabled');
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
