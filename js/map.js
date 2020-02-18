'use strict';

(function () {

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mainPin = map.querySelector('.map__pin--main');

  var adForm = document.querySelector('.ad-form');
  var filterForm = document.querySelector('.map__filters');
  var adFieldsets = adForm.querySelectorAll('fieldset');
  var filterFieldsets = filterForm.querySelectorAll('fieldset');
  var filterFields = filterForm.querySelectorAll('.map__filter');
  var allGroupsFields = [adFieldsets, filterFieldsets, filterFields];
  var inputAddress = adForm.querySelector('input[name=address]');

  var errorText = 'Объявления не доступны.';

  /*
   * Активация, деактивация страницы
   */
  var onMainPinMousedown = function (evt) {
    window.util.isLeftMauseKeyEvent(evt, activatePage);
  };

  var onMainPinKeydown = function (evt) {
    window.util.isEnterEvent(evt, activatePage);
  };

  var deactivatePage = function () {
    adForm.classList.add('ad-form--disabled');
    filterForm.classList.add('map__filters--disabled');
    map.classList.add('map--faded');

    window.util.changeAttrDisabled(allGroupsFields, 'set');

    mainPin.addEventListener('mousedown', onMainPinMousedown);
    mainPin.addEventListener('keydown', onMainPinKeydown);
  };

  deactivatePage();

  var activatePage = function () {
    adForm.classList.remove('ad-form--disabled');
    filterForm.classList.remove('map__filters--disabled');
    map.classList.remove('map--faded');

    window.util.setInputValue(inputAddress, window.address.getMainPinCoord('sharp'));
    window.util.changeAttrDisabled(allGroupsFields, 'remove');

    mainPin.removeEventListener('mousedown', onMainPinMousedown);
    mainPin.removeEventListener('keydown', onMainPinKeydown);

    var onError = function (error) {
      var errorMessage = document.createElement('div');
      errorMessage.innerText = errorText + ' ' + error;
      errorMessage.style = 'color: #fff; padding: 15px; font-size: 12px; font-weight: 500; text-align: center;';
      filterForm.style.display = 'none';
      document.querySelector('.map__filters-container').replaceChild(errorMessage, filterForm);
    };

    var onSuccess = function (adverts) {
      window.pin.render(adverts, mapPins);
    };

    window.backend.load(onSuccess, onError);
  };


  window.map = {
    deactivatePage: deactivatePage,
    activatePage: activatePage
  };

})();
