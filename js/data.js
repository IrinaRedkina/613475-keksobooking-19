'use strict';

(function () {

  var typesHousingMap = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };

  var MOCK = {
    'CHECKIN_TIMES': ['12:00', '13:00', '14:00'],
    'CHECKOUT_TIMES': ['12:00', '13:00', '14:00'],
    'FEATURES': ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
    'PHOTOS': [
      'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel3.jpg',
    ],
    'TYPES': ['palace', 'flat', 'house', 'bungalo']
  };

  var MOCK_COUNT = 8;

  var generateMock = function (advertInfo, avatarFileNumber) {
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

  var generateMockArray = function (count) {
    var mockArray = [];

    for (var i = 1; i <= count; i++) {
      var object = generateMock(MOCK, i);
      mockArray.push(object);
    }

    return mockArray;
  };


  window.data = {
    mock: generateMockArray(MOCK_COUNT),
    typesHousingMap: typesHousingMap
  };

})();
