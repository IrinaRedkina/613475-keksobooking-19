'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var inputAddress = adForm.querySelector('input[name=address]');
  var selectType = adForm.querySelector('select[name=type]');
  var inputPrice = adForm.querySelector('input[name=price]');
  var selectTimein = adForm.querySelector('select[name=timein]');
  var selectTimeout = adForm.querySelector('select[name=timeout]');
  var selectRooms = adForm.querySelector('select[name=rooms]');
  var selectCapacity = adForm.querySelector('select[name=capacity]');
  var selectCapacityOptions = selectCapacity.options;


  /*
   * минимальная цена
   */
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


  /*
   * синхронизация полей заезда и выезда
   */
  var onSelectTimeChange = function (evt) {
    if (evt.target.name === 'timeout') {
      selectTimein.value = evt.target.value;
    } else if (evt.target.name === 'timein') {
      selectTimeout.value = evt.target.value;
    }
  };

  selectTimein.addEventListener('change', onSelectTimeChange);
  selectTimeout.addEventListener('change', onSelectTimeChange);


  /*
   * зависимость кол-ва гостей от кол-ва комнат
   */
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
   * адрес
   */
  inputAddress.setAttribute('readonly', 'readonly');
  window.util.setInputValue(inputAddress, window.address.getMainPinCoord('circle'));

})();
