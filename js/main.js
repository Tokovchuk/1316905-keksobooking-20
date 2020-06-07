'use strict';

var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECKINS = ['12:00', '13:00', '14:00'];
var CHECKOUTS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var LOCATION_MIN_X = 100;
var LOCATION_MAX_X = 1100;
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

var ads = generateAds(ADS_NUMBER);
switchActiveMap();
addPinsToMap(ads);

// Создаем карточку объекта жилья

var item = ads[0];
var cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.map__card');

//
var cardTitle = cardTemplate.querySelector('.popup__title');
cardTitle.textContent = item.offer.title;

//
var cardAddress = cardTemplate.querySelector('.popup__text--address');
cardAddress.textContent = item.offer.address;

//
var cardPrice = cardTemplate.querySelector('.popup__text--price');
cardPrice.textContent = item.offer.price + '₽/ночь';

//
var cardType = cardTemplate.querySelector('.popup__type');
if (item.offer.type === 'flat') {
  cardType.textContent = 'Квартира'
}
if (item.offer.type === 'bungalo') {
  cardType.textContent = 'Бунгало'
}
if (item.offer.type === 'house') {
  cardType.textContent = 'Дом'
}
if (item.offer.type === 'palace') {
  cardType.textContent = 'Дворец'
};

//
var cardRoomsGuests = cardTemplate.querySelector('.popup__text--capacity');
var rooms = item.offer.rooms;
var guests = item.offer.guests;

// функция для регулирования окончания в слове "комната"
var roomsFlexNormalize = function (number) {
  var forms = ["комнат", "комната", "комнаты"];
  return flexNormalize(number, forms);
};

// функция для регулирования окончания в слове "гость"
var guestsFlexNormalize = function (number) {
  var forms = ["гостей", "гостя", "гостей"];
  return flexNormalize(number, forms);
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

var textRooms = roomsFlexNormalize (rooms);
var textGuests = guestsFlexNormalize (guests);

cardRoomsGuests.textContent = rooms + ' ' + textRooms + ' для ' + guests + ' ' + textGuests;

//
var cardTime = cardTemplate.querySelector('.popup__text--time');
cardTime.textContent = 'Заезд после ' + item.offer.checkin + ', выезд до ' + item.offer.checkout;

//
var cardFeatures = cardTemplate.querySelector('.popup__features');
for (var i = cardFeatures.children.length - 1; i >= 0; i--) {
  var child = cardFeatures.children[i];
  
  child.parentElement.removeChild(child);
}
var featuresItems = item.offer.features;
featuresItems.forEach (function (features) {
cardFeatures.insertAdjacentHTML('afterbegin', '<li class="popup__feature popup__feature--' + features + '"></li>');
});


//
var cardDescription = cardTemplate.querySelector('.popup__description');
cardDescription.textContent = item.offer.description;

//
var cardAvatar = cardTemplate.querySelector('.popup__avatar');
cardAvatar.src = item.author.avatar;

//
var cardPhotos = cardTemplate.querySelector('.popup__photos');
for (var i = cardPhotos.children.length - 1; i >= 0; i--) {
  var child = cardPhotos.children[i];
  
  child.parentElement.removeChild(child);
}
var photosItems = item.offer.photos;
photosItems.forEach (function (photos) {
cardPhotos.insertAdjacentHTML('afterbegin', '<img src="' + photos + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">')
});

var map = document.querySelector('.map');
var mapFilters = document.querySelector('.map__filters-container');
map.insertBefore(cardTemplate, mapFilters);

console.log(cardTemplate);




