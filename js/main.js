'use strict';

var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECKINS = ['12:00', '13:00', '14:00'];
var CHECKOUTS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var LOCATION_MIN_X = 0;
var LOCATION_MAX_X = 1200;
var LOCATION_MIN_Y = 130;
var LOCATION_MAX_Y = 630;
var ADS_NUMBER = 8;
var MAP_PIN_WIDTH = 50;
var MAP_PIN_HEIGHT = 70;

// случайное число в заданом диапазоне

var getRandomInt = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Случайный элемент массива

var getRandomElement = function (items) {
  var randomElement = Math.floor(Math.random() * items.length);
  return items[randomElement];
};

// Перемешивание массива

var shuffleArray = function (items) {
  var itemsClone = items.slice();
  var length = itemsClone.length;
  for (var i = 0; i < length; i++) {
    var j = getRandomInt(0, length - 1);
    var swap = itemsClone[i];
    itemsClone[i] = itemsClone[j];
    itemsClone[j] = swap;
  }
  return itemsClone;
};

// функция для регулирования окончания в слове "комната"
var roomsFlexNormalize = function (number) {
  var FORMS = ['комнат', 'комната', 'комнаты'];
  return flexNormalize(number, FORMS);
};

// функция для регулирования окончания в слове "гость"
var guestsFlexNormalize = function (number) {
  var FORMS = ['гостей', 'гостя', 'гостей'];
  return flexNormalize(number, FORMS);
};

// функция регулирования слова "гость" и "комната"
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

// Гененрируем итоговый массив объектов жилья

var generateAds = function (number) {
  var ads = [];
  for (var i = 1; i <= number; i++) {
    var locationX = getRandomInt(LOCATION_MIN_X, LOCATION_MAX_X);
    var locationY = getRandomInt(LOCATION_MIN_Y, LOCATION_MAX_Y);
    var ad = {
      author: {
        avatar: 'img/avatars/user0' + i + '.png',
      },
      offer: {
        title: 'Название объекта',
        address: locationX + ', ' + locationY,
        price: getRandomInt(1, 1000),
        type: getRandomElement(TYPES),
        rooms: getRandomInt(1, 20),
        guests: getRandomInt(1, 50),
        checkin: getRandomElement(CHECKINS),
        checkout: getRandomElement(CHECKOUTS),
        features: shuffleArray(FEATURES).slice(0, getRandomInt(1, FEATURES.length)),
        description: 'Просто описание объекта: бла-бла-бла',
        photos: shuffleArray(PHOTOS).slice(0, getRandomInt(1, PHOTOS.length)),
      },
      location: {
        x: locationX,
        y: locationY,
      },
    };
    ads.push(ad);
  }
  return ads;
};

// убираем  класс map--faded

var switchActiveMap = function () {
  var map = document.querySelector('.map');
  map.classList.remove('map--faded');
};

// Создаем пины к нашим объктам жилья
// Находим темплейт
// Делаем пин из темплейта и добавляем нужные свойства

var renderPin = function (housing) {
  var pinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');
  var pinElement = pinTemplate.cloneNode(true);
  pinElement.style.left = housing.location.x - MAP_PIN_WIDTH / 2 + 'px';
  pinElement.style.top = housing.location.y - MAP_PIN_HEIGHT + 'px';
  pinElement.querySelector('img').src = housing.author.avatar;
  pinElement.querySelector('img').alt = housing.offer.title;
  return pinElement;
};

// Добавляем пины на карту

var addPinsToMap = function (items) {
  var mapPins = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  items.forEach(function (ad) {
    fragment.appendChild(renderPin(ad));
  });
  mapPins.appendChild(fragment);
};

// функция для заполнения поля преимуществ
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

// функция для заполнения поля фотографий объекта жилья
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

// Создаем карточку объекта жилья
var renderCard = function (ad) {
  var cardTemplate = document.querySelector('#card')
    .content
    .querySelector('.map__card');
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
};

var addDisabled = function(){
  var fields = document.querySelectorAll('fieldset');
  fields.forEach(function (item) {
    item.setAttribute('disabled', 'disabled');
  });
  document.querySelector('.map__filters').setAttribute('disabled', 'disabled');
}

var removeDisabled = function(){
  var fields = document.querySelectorAll('fieldset');
  fields.forEach(function (item) {
    item.removeAttribute('disabled');
  });
  document.querySelector('.map__filters').removeAttribute('disabled');
}

addDisabled();

var activateSite = function() {
  switchActiveMap();
  addPinsToMap(ads);
  renderCard(ads[0]);
  removeDisabled();
  document.querySelector('.ad-form').classList.remove('ad-form--disabled');
};

var mainPin = document.querySelector('.map__pin--main');
mainPin.addEventListener('mousedown', function(evt) {
  evt.preventDefault();
  if (evt.which == 1) {
    activateSite();
  }
});
mainPin.addEventListener('keydown', function(evt) {
  evt.preventDefault();
  if (evt.key == 'Enter') {
    activateSite();
  }
});

var addressMain = document.querySelector('#address');
addressMain.value = ((LOCATION_MIN_X + LOCATION_MAX_X) / 2) + ', ' + ((LOCATION_MIN_X + LOCATION_MAX_X) / 2);

var ads = generateAds(ADS_NUMBER);

var roomNumber = document.querySelector('#room_number');
var capacity = document.querySelector('#capacity');

capacity.addEventListener('invalid', function(evt) {
  if(evt.target.value > roomNumber.target.value) {
    capacity.setCustomValidity('слишком много людишек для это халупы');
  } else {
    capacity.setCustomValidity('');
  }
});
