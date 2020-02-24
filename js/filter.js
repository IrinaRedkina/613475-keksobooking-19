'use strict';

(function () {

  var LIMIT_PINS = 5;

  var filterForm = document.querySelector('.map__filters');
  var selectType = filterForm.querySelector('select[name=housing-type');


  var filterPins = function (pins) {

    var allPins = pins.slice();

    var onFilterFormChange = function (evt) {

      window.card.close();
      window.pin.remove();

      // если тип жилья
      if (evt.target === selectType) {
        var filteredPins = allPins.filter(function (element, index) {
          element.id = index;
          return element.offer.type === evt.target.value;
        });

        if (evt.target.value === 'any') {
          filteredPins = allPins;
        }

        window.pin.render(filteredPins);
      }
    };

    filterForm.addEventListener('change', onFilterFormChange);
  };

  // фильтр по кол-ву
  var limitQuantity = function (pins) {
    var pinsCopy = pins.slice();
    pinsCopy.length = LIMIT_PINS;
    return pinsCopy;
  };

  window.filter = {
    quantity: limitQuantity,
    pins: filterPins
  };

})();
