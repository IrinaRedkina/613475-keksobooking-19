'use strict';

var OFFER = {
  'CHECKIN': ['12:00', '13:00', '14:00'],
  'CHECKOUT': ['12:00', '13:00', '14:00'],
  'FEATURES': ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
  'PHOTOS': ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'],
  'TYPE': ['palace', 'flat', 'house', 'bungalo']
};

var ADS_COUNT = 8;

var mapElement = document.querySelector('.map');
mapElement.classList.remove('map--faded');

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPins = document.querySelector('.map__pins');


/*
 *  получение размера карты и метки
 */
var getHiddenElementSize = function () {
  var hiddenElement = pinTemplate.cloneNode();
  hiddenElement.setAttribute('style', 'opcity: 0; z-index: -1000; position: absolute;');
  mapElement.appendChild(hiddenElement);

  var width = hiddenElement.offsetWidth;
  var height = hiddenElement.offsetHeight;

  hiddenElement.remove();

  return {'width': width, 'height': height};
};

var pinSize = getHiddenElementSize();
var pinSizeWidthHalf = pinSize.width / 2;

var mapPinsWidth = mapPins.offsetWidth;
var mapPinsFromY = 130;
var mapPinsToY = 630;
var mapPinsFromX = pinSizeWidthHalf;
var mapPinsToX = mapPinsWidth - pinSizeWidthHalf;


/*
 *  генерация объявлений
 */
var getRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
};

var getRandomIndex = function (arr) {
  return Math.floor(Math.random() * arr.length);
};

var getRandomLengthArray = function (arr) {
  var randomArray = [];

  for (var i = 0; i < arr.length; i++) {
    var randomNumber = getRandomNumber(1, 100);

    if (randomNumber % 2 === 0) {
      randomArray.push(arr[i]);
    } else {
      continue;
    }
  }

  return randomArray;
};

var getRandomElement = function (arr) {
  return arr[getRandomIndex(arr)];
};

var generateAd = function (offerInfo, avatarFileNumber) {
  var object = {
    'author': {
      'avatar': 'img/avatars/user0' + avatarFileNumber + '.png'
    },
    'offer': {
      'title': 'заголовок предложения',
      'description': 'описание',
      'price': 10000000,
      'rooms': 3,
      'guests': 4,
      'type': getRandomElement(offerInfo.TYPE),
      'checkin': getRandomElement(offerInfo.CHECKIN),
      'checkout': getRandomElement(offerInfo.CHECKOUT),
      'features': getRandomLengthArray(offerInfo.FEATURES),
      'photos': getRandomLengthArray(offerInfo.PHOTOS)
    },
    'location': {
      'x': getRandomNumber(mapPinsFromX, mapPinsToX),
      'y': getRandomNumber(mapPinsFromY, mapPinsToY)
    }
  };

  object.offer.address = object.location.x + ', ' + object.location.y;
  return object;
};

var generateAds = function (count) {
  var objects = [];

  for (var i = 1; i <= count; i++) {
    var object = generateAd(OFFER, i);
    objects.push(object);
  }

  return objects;
};


/*
 *  Создание и вывод DOM элементов меток
 */
var createPin = function (objectPin) {
  var element = pinTemplate.cloneNode(true);

  element.style.top = (objectPin.location.y - pinSize.height) + 'px';
  element.style.left = (objectPin.location.x - pinSizeWidthHalf) + 'px';
  element.querySelector('img').setAttribute('src', objectPin.author.avatar);
  element.querySelector('img').setAttribute('alt', objectPin.offer.title);

  return element;
};

var renderPins = function (pins, wrapperElement) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < pins.length; i++) {
    fragment.appendChild(createPin(pins[i]));
  }

  wrapperElement.appendChild(fragment);
};

var pins = generateAds(ADS_COUNT);
renderPins(pins, mapPins);
