'use strict';

var ADVERTS = {
  'CHECKIN_TIMES': ['12:00', '13:00', '14:00'],
  'CHECKOUT_TIMES': ['12:00', '13:00', '14:00'],
  'FEATURES': ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
  'PHOTOS': [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg',
  ],
  'TYPES': ['palace', 'flat', 'house', 'bungalo'],
  'TYPES_RUS': ['Дворец', 'Квартира', 'Дом', 'Бунгало'],
};

var ADVERTS_COUNT = 8;

var mapElement = document.querySelector('.map');
mapElement.classList.remove('map--faded');

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var cardAdvertTemplate = document.querySelector('#card').content.querySelector('.map__card');

var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');
var cardAdvertBeforeElement = map.querySelector('.map__filters-container');


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
var locationPinsFromY = 130;
var locationPinsToY = 630;
var locationPinsFromX = pinSizeWidthHalf;
var locationPinsToX = mapPinsWidth - pinSizeWidthHalf;


/*
 *  генерация объявлений
 */
var getRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
};

var getRandomElement = function (arr) {
  var index = Math.floor(Math.random() * arr.length);
  return arr[index];
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

var generateAdvert = function (advertInfo, avatarFileNumber) {
  var object = {
    'author': {
      'avatar': 'img/avatars/user0' + avatarFileNumber + '.png'
    },
    'offer': {
      'title': 'заголовок предложения',
      'description': 'описание',
      'price': getRandomNumber(5000, 8000),
      'rooms': getRandomNumber(1, 8),
      'guests': getRandomNumber(1, 5),
      'type': getRandomElement(advertInfo.TYPES),
      'checkin': getRandomElement(advertInfo.CHECKIN_TIMES),
      'checkout': getRandomElement(advertInfo.CHECKOUT_TIMES),
      'features': getRandomLengthArray(advertInfo.FEATURES),
      'photos': getRandomLengthArray(advertInfo.PHOTOS)
    },
    'location': {
      'x': getRandomNumber(locationPinsFromX, locationPinsToX),
      'y': getRandomNumber(locationPinsFromY, locationPinsToY)
    }
  };

  object.offer.address = object.location.x + ', ' + object.location.y;
  return object;
};

var generateAdverts = function (count) {
  var objects = [];

  for (var i = 1; i <= count; i++) {
    var object = generateAdvert(ADVERTS, i);
    objects.push(object);
  }

  return objects;
};


/*
 *  Создание и вывод DOM элементов меток
 */
var createPin = function (advert) {
  var element = pinTemplate.cloneNode(true);

  element.style.top = (advert.location.y - pinSize.height) + 'px';
  element.style.left = (advert.location.x - pinSizeWidthHalf) + 'px';
  element.querySelector('img').setAttribute('src', advert.author.avatar);
  element.querySelector('img').setAttribute('alt', advert.offer.title);

  return element;
};

var renderPins = function (adverts, wrapperElement) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < adverts.length; i++) {
    fragment.appendChild(createPin(adverts[i]));
  }

  wrapperElement.appendChild(fragment);
};

var ads = generateAdverts(ADVERTS_COUNT);
renderPins(ads, mapPins);


/*
 *  Создание и вывод объявления
 */

var getPriceFormat = function (price) {
  return price + '₽/ночь';
};

var getWordDeclension = function (n, forms) {
  var word;

  if (n % 10 === 1 && n % 100 !== 11) {
    word = forms[0];
  } else if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) {
    word = forms[1];
  } else {
    word = forms[2];
  }

  return word;
};

var getElementTranslation = function (arr, arrRus, key) {
  var object = {};

  for (var i = 0; i < arr.length; i++) {
    object[arr[i]] = (arrRus[i] !== undefined) ? arrRus[i] : arr[i];
  }

  return (typeof object[key] !== 'undefined') ? object[key] : false;
};

var createPhotosElements = function (photosWrapper, photos) {

  var fragment = document.createDocumentFragment();
  var photoTemplate = photosWrapper.querySelector('img');

  for (var i = 0; i < photos.length; i++) {
    var photoElement = photoTemplate.cloneNode(true);
    photoElement.setAttribute('src', photos[i]);
    fragment.appendChild(photoElement);
  }

  return fragment;
};

var createCardAdvert = function (advert) {
  var element = cardAdvertTemplate.cloneNode(true);

  var roomsString = getWordDeclension(advert.offer.rooms, ['комната', 'комнаты', 'комнат']);
  var guestsString = getWordDeclension(advert.offer.guests, ['гостя', 'гостей', 'гостей']);

  element.querySelector('.popup__avatar').setAttribute('src', advert.author.avatar);
  element.querySelector('.popup__text--price').innerText = getPriceFormat(advert.offer.price);
  element.querySelector('.popup__title').innerText = advert.offer.title;
  element.querySelector('.popup__description').innerText = advert.offer.description;
  element.querySelector('.popup__text--address').innerText = advert.offer.address;
  element.querySelector('.popup__text--time').innerText = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;
  element.querySelector('.popup__text--capacity').innerText = advert.offer.rooms + ' ' + roomsString + ' для ' + advert.offer.guests + ' ' + guestsString;

  // тип жилья
  var typeWrapper = element.querySelector('.popup__type');
  var typeRus = getElementTranslation(ADVERTS.TYPES, ADVERTS.TYPES_RUS, advert.offer.type);

  if (typeRus === false) {
    typeWrapper.style.display = 'none';
  } else {
    typeWrapper.innerText = typeRus;
  }

  // удобства
  var featuresWrapper = element.querySelector('.popup__features');
  var featuresElements = element.querySelectorAll('.popup__feature');
  var features = advert.offer.features;

  for (var i = 0; i < featuresElements.length; i++) {
    featuresElements[i].style.display = 'none';
  }

  if (features.length > 0) {
    for (i = 0; i < features.length; i++) {
      var featureElement = featuresWrapper.querySelector('.popup__feature--' + features[i]);
      featureElement.style.display = 'inline-block';
    }
  } else {
    featuresWrapper.style.display = 'none';
  }

  // фото
  var photosWrapper = element.querySelector('.popup__photos');
  var photos = advert.offer.photos;

  if (photos.length > 0) {
    var photoFirst = photosWrapper.children[0];
    var photosElements = createPhotosElements(photosWrapper, photos);
    photosWrapper.replaceChild(photosElements, photoFirst);
  } else {
    photosWrapper.style.display = 'none';
  }

  return element;
};

var renderCardAdvert = function (adverts, wrapperElement, beforeElement) {
  var fragment = document.createDocumentFragment();
  fragment.appendChild(createCardAdvert(adverts[0]));
  wrapperElement.insertBefore(fragment, beforeElement);
};

renderCardAdvert(ads, map, cardAdvertBeforeElement);
