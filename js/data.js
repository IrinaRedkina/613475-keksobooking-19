'use strict';

(function () {

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

  var generateAdvert = function (advertInfo, avatarFileNumber) {
    var object = {
      'author': {
        'avatar': 'img/avatars/user0' + avatarFileNumber + '.png'
      },
      'offer': {
        'title': 'заголовок предложения',
        'description': 'описание',
        'price': window.util.getRandomNumber(5000, 8000),
        'rooms': window.util.getRandomNumber(1, 8),
        'guests': window.util.getRandomNumber(1, 5),
        'type': window.util.getRandomElement(advertInfo.TYPES),
        'checkin': window.util.getRandomElement(advertInfo.CHECKIN_TIMES),
        'checkout': window.util.getRandomElement(advertInfo.CHECKOUT_TIMES),
        'features': window.util.getRandomLengthArray(advertInfo.FEATURES),
        'photos': window.util.getRandomLengthArray(advertInfo.PHOTOS)
      },
      'location': {
        'x': window.util.getRandomNumber(window.util.coordinatorMapsStart.x, window.util.coordinatorMapsEnd.x),
        'y': window.util.getRandomNumber(window.util.coordinatorMapsStart.y, window.util.coordinatorMapsEnd.y)
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


  window.data = {
    adverts: generateAdverts(ADVERTS_COUNT)
  };

})();
