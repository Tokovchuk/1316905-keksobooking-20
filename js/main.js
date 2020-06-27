'use strict';

var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var adForm = document.querySelector('.ad-form');
var mainPin = document.querySelector('.map__pin--main');
var addressMain = document.querySelector('#address');
var roomNumber = document.querySelector('#room_number');
var capacity = document.querySelector('#capacity');

var switchToDisableSite = function () {
  addDisabled();
  addListenersToMainPin();
  addAddressInDisable();
  switchDisableMap();
  removePinsFromMap();
  adForm.classList.add('ad-form--disabled');
};

var switchToActiveSite = function () {
  removeDisabled();
  removeListenersFromMainPin();
  addAddressInActive();
  switchActiveMap();
  addPinsToMap(ads);
  addValidateRoomsAndGuests();
  adForm.classList.remove('ad-form--disabled');
};

switchToDisableSite();
addSyncCheckinAndCheckout();
addValidateTypeAndPriceHousing();
