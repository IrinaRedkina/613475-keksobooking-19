'use strict';

(function () {

  var minPriceMap = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  var allowedCapacityValuesMap = {
    '1': ['1'],
    '2': ['2', '1'],
    '3': ['3', '2', '1'],
    '100': ['0']
  };

  // поля
  var adForm = document.querySelector('.ad-form');
  var inputAddress = adForm.querySelector('input[name=address]');
  var selectTypeHousing = adForm.querySelector('select[name=type]');
  var inputPrice = adForm.querySelector('input[name=price]');
  var selectTimein = adForm.querySelector('select[name=timein]');
  var selectTimeout = adForm.querySelector('select[name=timeout]');
  var selectRooms = adForm.querySelector('select[name=rooms]');
  var selectCapacity = adForm.querySelector('select[name=capacity]');
  var selectCapacityOptions = selectCapacity.options;

  // кнопки
  var resetButton = adForm.querySelector('.ad-form__reset');

  var minPiceLabel = 'Цена за ночь от #price# руб';
  var capacityError = 'Для выбранного колличества комнат нужно выбрать другое колличество мест';


  /*
   * минимальная цена
   */
  var setMinPrice = function () {
    var selectedType = selectTypeHousing.value;
    var minValue = minPriceMap[selectedType];

    inputPrice.setAttribute('min', minValue);
    inputPrice.setAttribute('placeholder', minValue);

    adForm.querySelector('label[for=price]').innerText = minPiceLabel.replace('#price#', minValue);
  };

  /*
   * синхронизация полей заезда и выезда
   */
  var syncTimes = function (evt) {
    var timeValue = evt.target.value;

    switch (evt.target.name) {
      case 'timeout':
        selectTimein.value = timeValue;
        break;
      case 'timein':
        selectTimeout.value = timeValue;
        break;
    }
  };

  /*
   * зависимость кол-ва мест от кол-ва комнат
   */
  var verifyGuestsValue = function () {
    var selectedRooms = selectRooms.value;
    var selectedGuests = selectCapacity.value;
    var allowedCapacityValues = allowedCapacityValuesMap[selectedRooms];

    if (allowedCapacityValues.indexOf(selectedGuests) === -1) {
      selectCapacity.setCustomValidity(capacityError);
    } else {
      selectCapacity.setCustomValidity('');
    }
  };

  var disabledCapacityValues = function () {
    var selectedRooms = selectRooms.value;
    var allowedCapacityValues = allowedCapacityValuesMap[selectedRooms];

    for (var i = 0; i < selectCapacityOptions.length; i++) {
      var option = selectCapacityOptions[i];
      var optionValue = option.value;

      if (allowedCapacityValues.indexOf(optionValue) === -1) {
        option.disabled = true;
      } else {
        option.disabled = false;
      }
    }
  };

  /*
   * адрес
   */
  inputAddress.setAttribute('readonly', 'readonly');


  var resetPage = function () {
    window.map.isPageActive = false;
    window.map.deactivatePage();
    adForm.reset();
    setMinPrice();
    verifyGuestsValue();
  };


  setMinPrice();
  verifyGuestsValue();
  disabledCapacityValues();

  selectTypeHousing.addEventListener('change', function () {
    setMinPrice();
  });

  selectTimein.addEventListener('change', function (evt) {
    syncTimes(evt);
  });

  selectTimeout.addEventListener('change', function (evt) {
    syncTimes(evt);
  });

  selectRooms.addEventListener('change', function () {
    verifyGuestsValue();
    disabledCapacityValues();
  });

  selectCapacity.addEventListener('change', function () {
    verifyGuestsValue();
    disabledCapacityValues();
  });

  resetButton.addEventListener('click', function () {
    resetPage();
  });


})();
