'use strict';

(function () {

  var PRICE = {
    low: 10000,
    high: 50000
  };
  var filterForm = document.querySelector('.map__filters');
  var features = filterForm.querySelectorAll('input[name=features]');
  var filterValues = {};
  var pinsCopy;


  var getFilterValues = function (evt) {
    window.card.close();
    window.pin.remove();

    // если тип жилья, цена, кол-во комнат, кол-во гостей
    if (evt.target.value !== 'any') {
      filterValues[evt.target.name] = evt.target.value;
    } else {
      delete filterValues[evt.target.name];
    }

    // если удобства
    filterValues.features = [];
    features.forEach(function (element) {
      if (element.checked) {
        filterValues.features.push(element.value);
      }
    });

    if (filterValues.features.length === 0) {
      delete filterValues.features;
    }
  };

  var checkFilterValuesEmpty = function () {
    return (Object.keys(filterValues).length === 0 && filterValues.constructor === Object) ? true : false;
  };

  var filterByValue = function (key, value, pins) {
    pins = pins.filter(function (pin) {
      return pin.offer[key] === value;
    });

    return pins;
  };

  var filterByPrice = function (value, pins) {
    if (value === 'high') {
      pins = pins.filter(function (pin) {
        return pin.offer.price > PRICE['high'];
      });
    }

    if (value === 'low') {
      pins = pins.filter(function (pin) {
        return pin.offer.price < PRICE['low'];
      });
    }

    if (value === 'middle') {
      pins = pins.filter(function (pin) {
        return pin.offer.price >= PRICE['low'] && pin.offer.price <= PRICE['high'];
      });
    }

    return pins;
  };

  var filterPins = function (pins) {
    for (var key in filterValues) {
      if (filterValues.hasOwnProperty(key)) {

        var dashIndex = key.indexOf('-');
        var shortKey = key.substring(dashIndex + 1);

        if (shortKey === 'rooms' || shortKey === 'guests') {
          filterValues[key] = +filterValues[key];
        }

        if (shortKey === 'rooms' || shortKey === 'guests' || shortKey === 'type') {
          pins = filterByValue(shortKey, filterValues[key], pins);
        }

        if (shortKey === 'price') {
          pins = filterByPrice(filterValues[key], pins);
        }

        if (key === 'features') {
          filterValues[key].forEach(function (feature) {
            pins = pins.filter(function (pin) {
              return pin.offer.features.indexOf(feature) !== -1;
            });
          });
        }
      }
    }

    return pins;
  };

  var updatePins = window.debounce(function (pins) {
    window.pin.render(pins);
  });

  var onFilterFormChange = function (evt) {
    getFilterValues(evt);

    var filteredPins = pinsCopy;

    if (!checkFilterValuesEmpty()) {
      filteredPins = filterPins(pinsCopy);
    }

    updatePins(filteredPins);
  };

  var filterMap = function (pins) {
    pinsCopy = pins.slice();

    pinsCopy.forEach(function (item, index) {
      item.id = index;
    });

    filterForm.addEventListener('change', onFilterFormChange);
  };

  window.filter = {
    pins: filterMap,
    onFilterFormChange: onFilterFormChange
  };

})();
