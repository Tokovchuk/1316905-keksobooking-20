'use strict';

(function (){
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var CHECKINS = ['12:00', '13:00', '14:00'];
  var CHECKOUTS = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

  var ADS_NUMBER = 8;
  var LOCATION_MIN_X = 0;
  var LOCATION_MAX_X = 1200;
  var LOCATION_MIN_Y = 130;
  var LOCATION_MAX_Y = 630;

  var getRandomInt = function (min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var getRandomElement = function (items) {
  var randomElement = Math.floor(Math.random() * items.length);
  return items[randomElement];
  };  

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

  var ads = generateAds(ADS_NUMBER);
})();