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

      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      var onDocumentMousemove = function (moveEvt) {
        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };

        var max = {
          left: window.util.coordinatorMapsStart.x - mainPinSize.sharp.widthHalf,
          right: window.util.coordinatorMapsEnd.x - mainPinSize.sharp.widthHalf,
          top: window.util.coordinatorMapsStart.y - mainPinSize.sharp.height,
          bottom: window.util.coordinatorMapsEnd.y - mainPinSize.sharp.height
        };

        var left = mainPin.offsetLeft - shift.x;
        var top = mainPin.offsetTop - shift.y;

        if (left < max.left) {
          left = max.left;
        }

        if (left > max.right) {
          left = max.right;
        }

        if (top < max.top) {
          top = max.top;
        }

        if (top > max.bottom) {
          top = max.bottom;
        }

        mainPin.style.left = left + 'px';
        mainPin.style.top = top + 'px';

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        setAddressValue('sharp');
      };

      var onDocumentMouseup = function () {
        document.removeEventListener('mousemove', onDocumentMousemove);
        document.removeEventListener('mouseup', onDocumentMouseup);
      };
    }

    document.addEventListener('mousemove', onDocumentMousemove);
    document.addEventListener('mouseup', onDocumentMouseup);
  };

  var onMainPinKeydown = function (evt) {
    if (!window.map.isPageActive) {
      window.util.callIfEnterKeyEvent(evt, window.map.activatePage);
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
