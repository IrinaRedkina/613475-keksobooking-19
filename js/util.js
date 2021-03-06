'use strict';

(function () {

  var Key = {
    ENTER: 'Enter',
    ESC: 'Escape',
    MOUSE_LEFT: 0
  };

  var mapPins = document.querySelector('.map__pins');
  var mapPinsWidth = mapPins.offsetWidth;

  var coordinatorMapsStart = {
    x: 0,
    y: 130
  };

  var coordinatorMapsEnd = {
    x: mapPinsWidth,
    y: 630
  };

  var callIfEnterKeyEvent = function (evt, action) {
    if (evt.key === Key.ENTER) {
      action(evt);
    }
  };

  var callIfEscKeyEvent = function (evt, action) {
    if (evt.key === Key.ESC) {
      action(evt);
    }
  };

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

  var getHiddenElementSize = function (element) {
    var hiddenElement = element.cloneNode();
    hiddenElement.setAttribute('style', 'opcity: 0; z-index: -1000; position: absolute;');
    document.querySelector('body').appendChild(hiddenElement);

    var width = hiddenElement.offsetWidth;
    var height = hiddenElement.offsetHeight;

    hiddenElement.remove();

    return {'width': width, 'height': height};
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

  var setInputValue = function (inputElement, value) {
    inputElement.setAttribute('value', value);
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

  window.util = {
    getRandomNumber: getRandomNumber,
    getRandomElement: getRandomElement,
    getRandomLengthArray: getRandomLengthArray,
    getHiddenElementSize: getHiddenElementSize,
    getWordDeclension: getWordDeclension,
    changeAttrDisabled: changeAttrDisabled,
    setInputValue: setInputValue,
    coordinatorMapsStart: coordinatorMapsStart,
    coordinatorMapsEnd: coordinatorMapsEnd,
    callIfEnterKeyEvent: callIfEnterKeyEvent,
    callIfEscKeyEvent: callIfEscKeyEvent,
    Key: Key
  };

})();
