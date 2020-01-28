'use strict';

var OFFER = {
  'CHECKIN': ['12:00', '13:00', '14:00'],
  'CHECKOUT': ['12:00', '13:00', '14:00'],
  'FEATURES': ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
  'PHOTOS': ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'],
  'TYPE': ['palace', 'flat', 'house', 'bungalo']
};

var PINS_QUANTITY = 8;

var mapElement = document.querySelector('.map');
mapElement.classList.remove('map--faded');

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPins = document.querySelector('.map__pins');
var widthMapPins = mapPins.offsetWidth;

var getSizeHiddenElement = function () {
  var hiddenElement = pinTemplate.cloneNode();
  hiddenElement.setAttribute('style', 'opcity: 0; z-index: -1000; position: absolute;');
  mapElement.appendChild(hiddenElement);

  var width = hiddenElement.offsetWidth;
  var height = hiddenElement.offsetHeight;

  hiddenElement.remove();

  return {'width': width, 'height': height};
};

var pinSize = getSizeHiddenElement();


var getRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
};

var getRandomIndex = function (arr) {
  return Math.floor(Math.random() * arr.length);
};

var getRandomArrayLength = function (arr) {
  var randomArray = [];

  for (var i = 0; i < arr.length; i++) {
    var randomNamber = getRandomNumber(1, 100);

    if (randomNamber % 2 === 0) {
      randomArray.push(arr[i]);
    } else {
      continue;
    }
  }

  return randomArray;
};

var generateObjectWithRandomData = function (data, avatarFileNumber) {
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
      'type': data.TYPE[getRandomIndex(data.TYPE)],
      'checkin': data.CHECKIN[getRandomIndex(data.CHECKIN)],
      'checkout': data.CHECKOUT[getRandomIndex(data.CHECKOUT)],
      'features': getRandomArrayLength(data.FEATURES),
      'photos': getRandomArrayLength(data.PHOTOS)
    },
    'location': {
      'x': getRandomNumber(pinSize.width / 2, widthMapPins - pinSize.width / 2),
      'y': getRandomNumber(130, 630)
    }
  };

  object.offer.address = object.location.x + ', ' + object.location.y;
  return object;
};

var generateDataArray = function (quantity) {
  var objects = [];
  var avatarFileNumber = 1;

  for (var i = 0; i < quantity; i++) {
    var object = generateObjectWithRandomData(OFFER, avatarFileNumber);
    objects.push(object);
    avatarFileNumber++;
  }

  return objects;
};

var createElement = function (object) {
  var element = pinTemplate.cloneNode(true);

  element.style.top = (object.location.y - pinSize.height) + 'px';
  element.style.left = (object.location.x - pinSize.width / 2) + 'px';
  element.querySelector('img').setAttribute('src', object.author.avatar);
  element.querySelector('img').setAttribute('alt', object.offer.title);

  return element;
};

var renderElements = function (data, wrapperElement) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < data.length; i++) {
    fragment.appendChild(createElement(data[i]));
  }

  wrapperElement.appendChild(fragment);
};


var pins = generateDataArray(PINS_QUANTITY);
renderElements(pins, mapPins);
