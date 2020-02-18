'use strict';

(function () {

  var MAIN_PIN_SHARP_END_HEIGHT = 22;
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var inputAddress = document.querySelector('input[name=address]');

  var mainPinSize = {
    'circle': {
      'width': mainPin.offsetWidth,
      'widthHalf': mainPin.offsetWidth / 2,
      'height': mainPin.offsetHeight,
      'heightHalf': mainPin.offsetHeight / 2
    },
    'sharp': {
      'width': mainPin.offsetWidth,
      'widthHalf': Math.floor(mainPin.offsetWidth / 2),
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
      coord.x = Math.floor(mainPin.offsetLeft + mainPinSize.circle.widthHalf);
      coord.y = Math.floor(mainPin.offsetTop + mainPinSize.circle.heightHalf);
    } else if (pinType === 'sharp') {
      coord.x = Math.floor(mainPin.offsetLeft + mainPinSize.sharp.widthHalf);
      coord.y = Math.floor(mainPin.offsetTop + mainPinSize.sharp.height);
    }

    return coord;
  };

  var setAddressValue = function (pinType) {
    var coord = getMainPinCoord(pinType).x + ', ' + getMainPinCoord(pinType).y;
    window.util.setInputValue(inputAddress, coord);
  };


  /*
   * Манипуляции с главной меткой
   */
  var onMainPinMousedown = function (evt) {
    if (evt.button === window.util.Key.MOUSE_LEFT) {

      if (!window.map.isPageActive) {
        window.map.activatePage();
        window.map.isPageActive = true;
      }

      setAddressValue('sharp');

    }
  };

  var onMainPinKeydown = function (evt) {
    if (!window.map.isPageActive) {
      window.util.isEnterEvent(evt, window.map.activatePage);
      window.map.isPageActive = true;
    }
  };


  window.address = {
    mainPinSize: mainPinSize,
    getMainPinCoord: getMainPinCoord,
    set: setAddressValue,
    onMousedown: onMainPinMousedown,
    onKeydown: onMainPinKeydown,
  };

})();
