'use strict';

(function () {

  var MAIN_PIN_SHARP_END_HEIGHT = 22;
  var mainPin = document.querySelector('.map__pin--main');

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

  /*
   * Возвращает координаты главной метки
   * @param {string} pinType, тип метки: circle (круглая) или sharp (с острым концом)
   * @return {string} координаты
   */
  var getMainPinCoord = function (pinType) {
    var coord = {};

    if (pinType === 'circle') {
      coord.x = Math.floor(mainPin.offsetLeft + mainPinSize.circle.width / 2);
      coord.y = Math.floor(mainPin.offsetTop + mainPinSize.circle.height / 2);
    } else if (pinType === 'sharp') {
      coord.x = Math.floor(mainPin.offsetLeft + mainPinSize.sharp.width / 2);
      coord.y = Math.floor(mainPin.offsetTop + mainPinSize.sharp.height);
    }

    return coord.x + ', ' + coord.y;
  };


  window.address = {
    mainPinSize: mainPinSize,
    getMainPinCoord: getMainPinCoord
  };

})();
