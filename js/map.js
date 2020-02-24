'use strict';

(function () {

  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');

  var adForm = document.querySelector('.ad-form');
  var filterForm = map.querySelector('.map__filters');
  var adFieldsets = adForm.querySelectorAll('fieldset');
  var buttons = adForm.querySelectorAll('button');
  var filterFieldsets = filterForm.querySelectorAll('fieldset');
  var filterFields = filterForm.querySelectorAll('.map__filter');
  var allGroupsFields = [adFieldsets, filterFieldsets, filterFields, buttons];
  var filtersContainer = map.querySelector('.map__filters-container');
  var inputAddress = document.querySelector('input[name=address]');

  var stylesError = 'color: #fff; padding: 15px; font-size: 12px; font-weight: 500; text-align: center';
  var errorText = 'Объявления не доступны.';

  var mainPinDefaultCoord = window.address.getMainPinCoord('circle');
  var mainPinSize = window.address.mainPinSize;


  /*
  * Обработка ответа сервера
  */
  var onError = function (error) {
    var errorElement = document.createElement('div');
    errorElement.innerText = errorText + ' ' + error;
    errorElement.style = stylesError;
    filtersContainer.replaceChild(errorElement, filterForm);
  };

  var onSuccess = function (data) {
    var adverts = window.filter.quantity(data);

    window.filter.pins(adverts);
    window.pin.render(adverts);
    window.pin.click(adverts);
  };


  /*
   * Активация, деактивация страницы
   */
  var activatePage = function () {
    adForm.classList.remove('ad-form--disabled');
    filterForm.classList.remove('map__filters--disabled');
    map.classList.remove('map--faded');

    window.util.changeAttrDisabled(allGroupsFields, 'remove');
    window.address.set('sharp');
    mainPin.removeEventListener('keydown', window.address.onKeydown);

    window.backend.load(onSuccess, onError);
  };

  var deactivatePage = function () {
    adForm.classList.add('ad-form--disabled');
    filterForm.classList.add('map__filters--disabled');
    map.classList.add('map--faded');

    window.util.changeAttrDisabled(allGroupsFields, 'set');

    mainPin.addEventListener('mousedown', window.address.onMousedown);
    mainPin.addEventListener('keydown', window.address.onKeydown);

    window.pin.remove();
    window.card.close();

    mainPin.style.left = (mainPinDefaultCoord.x - mainPinSize.circle.widthHalf) + 'px';
    mainPin.style.top = (mainPinDefaultCoord.y - mainPinSize.circle.heightHalf) + 'px';
    window.util.setInputValue(inputAddress, mainPinDefaultCoord.x + ', ' + mainPinDefaultCoord.y);
  };

  deactivatePage();


  window.map = {
    deactivatePage: deactivatePage,
    activatePage: activatePage,
    isPageActive: false
  };

})();
