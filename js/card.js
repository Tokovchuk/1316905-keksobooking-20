'use strict';

(function () {
  var roomsFlexNormalize = function (number) {
    var FORMS = ['комнат', 'комната', 'комнаты'];
    return flexNormalize(number, FORMS);
  };

  var guestsFlexNormalize = function (number) {
    var FORMS = ['гостей', 'гостя', 'гостей'];
    return flexNormalize(number, FORMS);
  };

  var flexNormalize = function (number, forms) {
    number = Number(number);
    if (number % 100 > 10 && number % 100 < 15) {
      return forms[0];
    }
    var remainder = number % 10;
    switch (true) {
      case remainder === 0 || remainder > 4:
        return forms[0];
      case remainder === 1:
        return forms[1];
      default:
        return forms[2];
    }
  };

  var addFeatures = function (features, template) {
    template.innerHTML = '';
    if (!features) {
      template.style.display = 'none';
    } else {
      var featuresList = features.reduce(function (htmlFeatures, feature) {
        return htmlFeatures + '<li class="popup__feature popup__feature--' + feature + '"></li>';
      }, '');
      template.insertAdjacentHTML('afterbegin', featuresList);
    }
  };

  var addPhotos = function (photos, template) {
    template.innerHTML = '';
    if (!photos) {
      template.style.display = 'none';
    } else {
      var photosList = photos.reduce(function (htmlPhotos, photo) {
        return htmlPhotos + '<img src="' + photo + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">';
      }, '');
      template.insertAdjacentHTML('afterbegin', photosList);
    }
  };

  var renderCard = function (ad) {
    var cardTemplate = document.querySelector('#card')
      .content
      .querySelector('.map__card')
      .cloneNode(true);
    var typesMap = {
      'flat': 'Квартира',
      'bungalo': 'Бунгало',
      'house': 'Дом',
      'palace': 'Дворец',
    };
    var rooms = ad.offer.rooms;
    var guests = ad.offer.guests;
    var textRooms = roomsFlexNormalize(rooms);
    var textGuests = guestsFlexNormalize(guests);
    var featuresTempalte = cardTemplate.querySelector('.popup__features');
    var photosTemplate = cardTemplate.querySelector('.popup__photos');
    var closeCardButton = cardTemplate.querySelector('.popup__close');

    var onEscDown = function (evt) {
      if (evt.key === 'Escape') {
        cardTemplate.remove();
        document.removeEventListener('keydown', onEscDown);
      }
    };

    cardTemplate.querySelector('.popup__title').textContent = ad.offer.title;
    cardTemplate.querySelector('.popup__text--address').textContent = ad.offer.address;
    cardTemplate.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
    cardTemplate.querySelector('.popup__type').textContent = typesMap[ad.offer.type];
    cardTemplate.querySelector('.popup__text--capacity').textContent = rooms + ' ' + textRooms + ' для ' + guests + ' ' + textGuests;
    cardTemplate.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    cardTemplate.querySelector('.popup__description').textContent = ad.offer.description;
    cardTemplate.querySelector('.popup__avatar').src = ad.author.avatar;
    addFeatures(ad.offer.features, featuresTempalte);
    addPhotos(ad.offer.photos, photosTemplate);
    document.querySelector('.map__filters-container').insertAdjacentElement('beforebegin', cardTemplate);
    closeCardButton.addEventListener('click', function () {
      cardTemplate.remove();
    });
    document.addEventListener('keydown', onEscDown);
    window.card.template = cardTemplate;
  };

  window.card = {
    render: renderCard,
  };
})();
