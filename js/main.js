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
var MAIN_PIN_SHARP_END_HEIGHT = 22;
var ENTER_KEY = 'Enter';
var LEFT_MOUSE_KEY = 1;

// карта и метки
var map = document.querySelector('.map');
var mainPin = map.querySelector('.map__pin--main');
var mapPins = map.querySelector('.map__pins');

// шаблоны
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

// формы
var adForm = document.querySelector('.ad-form');
var filterForm = document.querySelector('.map__filters');

var adFieldsets = adForm.querySelectorAll('fieldset');
var filterFieldsets = filterForm.querySelectorAll('fieldset');
var filterFields = filterForm.querySelectorAll('.map__filter');
var allGroupsFields = [adFieldsets, filterFieldsets, filterFields];

var inputAddress = adForm.querySelector('input[name=address]');
var selectType = adForm.querySelector('select[name=type]');
var inputPrice = adForm.querySelector('input[name=price]');
var selectTimein = adForm.querySelector('select[name=timein]');
var selectTimeout = adForm.querySelector('select[name=timeout]');
var selectRooms = adForm.querySelector('select[name=rooms]');
var selectCapacity = adForm.querySelector('select[name=capacity]');
var selectCapacityOptions = selectCapacity.options;

/*
 *  получение размера карты и меток
 */
var getHiddenElementSize = function () {
  var hiddenElement = pinTemplate.cloneNode();
  hiddenElement.setAttribute('style', 'opcity: 0; z-index: -1000; position: absolute;');
  map.appendChild(hiddenElement);

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

var mainPinSize = {
  'circle': {
    'width': mainPin.offsetWidth,
    'height': mainPin.offsetHeight
  },
  'sharp': {
    'width': mainPin.offsetWidth,
    'height': mainPin.querySelector('img').offsetHeight + MAIN_PIN_SHARP_END_HEIGHT,
  }
};

var getMainPinLocation = function (pinElement, size, typePin) {
  var pinLocation = {};
  pinLocation.x = Math.floor(pinElement.offsetLeft + size.width / 2);

  if (typePin === 'circle') {
    pinLocation.y = Math.floor(pinElement.offsetTop + size.height / 2);
  } else if (typePin === 'sharp') {
    pinLocation.y = Math.floor(pinElement.offsetTop + size.height);
  }

  return pinLocation;
};


/*
 * Добавляет/удаляет атрибут disable
 * @param {array} elements, массив с коллекциями элементов
 * @param {string} action, может принимать значения set или remove
 */
var changeAttrDisabled = function (elements, action) {
  for (var i = 0; i < elements.length; i++) {
    for (var j = 0; j < elements[i].length; j++) {
      var element = elements[i][j];

      if (action === 'set') {
        element.setAttribute('disabled', 'disabled');
      } else if (action === 'remove') {
        element.removeAttribute('disabled');
      }
    }
  }
};


/*
 *  Валидация формы
 */

// минимальная цена
var setMinPrice = function (selectedType) {
  var minValue = 0;

  if (selectedType === 'flat') {
    minValue = 1000;
  } else if (selectedType === 'house') {
    minValue = 5000;
  } else if (selectedType === 'palace') {
    minValue = 10000;
  }

  inputPrice.setAttribute('min', minValue);
  adForm.querySelector('label[for=price]').innerText = 'Цена за ночь от ' + minValue + ' руб.';
};

var selectTypeDefaultValue = selectType.value;
setMinPrice(selectType.value);

selectType.addEventListener('change', function (evt) {
  setMinPrice(evt.target.value);
});

adForm.addEventListener('reset', function () {
  setMinPrice(selectTypeDefaultValue);
});


// синхронизация полей заезда и выезда
var onSelectTimeChange = function (evt) {
  if (evt.target.name === 'timeout') {
    selectTimein.value = evt.target.value;
  } else if (evt.target.name === 'timein') {
    selectTimeout.value = evt.target.value;
  }
};

selectTimein.addEventListener('change', onSelectTimeChange);
selectTimeout.addEventListener('change', onSelectTimeChange);

// адрес
var setAddressValue = function (inputElement, typePin) {
  var location = getMainPinLocation(mainPin, mainPinSize.sharp, typePin);
  var address = location.x + ', ' + location.y;
  inputElement.setAttribute('value', address);
};

inputAddress.setAttribute('readonly', 'readonly');
setAddressValue(inputAddress, 'circle');

// зависимость кол-ва гостей от кол-ва комнат
var getAllowedValues = function (numberRooms) {
  var allowedValues = [];

  switch (numberRooms) {
    case '1':
      allowedValues.push('1');
      break;
    case '2':
      allowedValues.push('1', '2');
      break;
    case '3':
      allowedValues.push('1', '2', '3');
      break;
    case '100':
      allowedValues.push('0');
      break;
  }

  return allowedValues;
};

var validateSelectCapacity = function (allowedValues) {
  if (allowedValues.indexOf(selectCapacity.value) === -1) {
    selectCapacity.setCustomValidity('Выбирайте другое кол-во комнат или гостей');
  } else {
    selectCapacity.setCustomValidity('');
  }
};

var lockSelectCapacityOptions = function (allowedValues) {
  for (var i = 0; i < selectCapacityOptions.length; i++) {
    if (allowedValues.indexOf(selectCapacityOptions[i].value) === -1) {
      selectCapacityOptions[i].disabled = true;
    } else {
      selectCapacityOptions[i].disabled = false;
    }
  }
};

var onSelectRoomsChange = function (evt) {
  var allowedValues = getAllowedValues(evt.target.value);
  validateSelectCapacity(allowedValues);
  lockSelectCapacityOptions(allowedValues);
};

var onSelectCapacityChange = function () {
  var allowedValues = getAllowedValues(selectRooms.value);
  validateSelectCapacity(allowedValues);
};

var allowedValues = getAllowedValues(selectRooms.value);
validateSelectCapacity(allowedValues);
lockSelectCapacityOptions(allowedValues);

selectRooms.addEventListener('change', onSelectRoomsChange);
selectCapacity.addEventListener('change', onSelectCapacityChange);


/*
 * Вспомогательные функции
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


/*
 *  генерация объявлений
 */
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

var ads = generateAdverts(ADVERTS_COUNT);


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


/*
 * Переход страницы в активное/неативное состояние
 */
var onPinMainMousedown = function (evt) {
  if (evt.which === LEFT_MOUSE_KEY) {
    ativatePage();
  }
};

var onPinMainKeydown = function (evt) {
  if (evt.key === ENTER_KEY) {
    ativatePage();
  }
};

var disablePage = function () {
  adForm.classList.add('ad-form--disabled');
  filterForm.classList.add('map__filters--disabled');

  changeAttrDisabled(allGroupsFields, 'set');

  mainPin.addEventListener('mousedown', onPinMainMousedown);
  mainPin.addEventListener('keydown', onPinMainKeydown);
};

disablePage();

var ativatePage = function () {
  adForm.classList.remove('ad-form--disabled');
  filterForm.classList.remove('map__filters--disabled');
  map.classList.remove('map--faded');

  setAddressValue(inputAddress, 'sharp');
  changeAttrDisabled(allGroupsFields, 'remove');

  mainPin.removeEventListener('mousedown', onPinMainMousedown);
  mainPin.removeEventListener('keydown', onPinMainKeydown);

  renderPins(ads, mapPins);
};
