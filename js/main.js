// Const

var TYPES = ["palace", "flat", "house", "bungalo"];
var CHECKINS = ["12:00", "13:00", "14:00"];
var CHECKOUTS = ["12:00", "13:00", "14:00"];
var FEATURES = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];
var PHOTOS = ["http://o0.github.io/assets/images/tokyo/hotel1.jpg",
   "http://o0.github.io/assets/images/tokyo/hotel2.jpg",
   "http://o0.github.io/assets/images/tokyo/hotel3.jpg"]

var LOCATION_MIN_X = 100;
var LOCATION_MAX_X = 1100;
var LOCATION_MIN_Y = 130;
var LOCATION_MAX_Y = 630;
var ADS_NUMBER = 8;



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
        avatar: "img/avatars/user0"+ i +".png",
      },
      offer: {
        title: "Название объекта",
        address: locationX + ", " + locationY,
        price: getRandomInt(1, 1000),
        type: getRandomElement(TYPES),
        rooms: getRandomInt(1, 4),
        guests: getRandomInt(1, 6),
        checkin: getRandomElement(CHECKINS),
        checkout: getRandomElement(CHECKOUTS),
        features: shuffleArray(FEATURES).slice(0, getRandomInt(1, FEATURES.length)),
        description: "Описание",
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

// убираем  класс map--faded

var switchingActiveMap = function() {
  var map = document.querySelector(".map");
  map.classList.remove("map--faded");
};

switchingActiveMap();

// Создаем пины к нашим объктам жилья

    // Находим темплейт
var pinTemplate = document.querySelector("#pin")
  .content
  .querySelector(".map__pin");
    
    //Делаем пин из темплейта и добавляем нужные свойства
var renderPin = function (housing) {
  var pinElement = pinTemplate.cloneNode(true);
  pinElement.style.left = housing.location.x - 25 + "px";
  pinElement.style.top = housing.location.y - 35 + "px";
  pinElement.children[0].src = housing.author.avatar;
  pinElement.children[0].alt = housing.offer.title;
  return pinElement;
}

// Добавляем пины на карту
var mapPins = document.querySelector(".map__pins");

var fragment = document.createDocumentFragment();

for (var i = 0; i < ads.length; i++) {
  fragment.appendChild(renderPin(ads[i]));
}
mapPins.appendChild(fragment);
