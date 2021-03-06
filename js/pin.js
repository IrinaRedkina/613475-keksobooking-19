'use strict';

(function () {
  var LIMIT_PINS = 5;
  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinActiveClass = 'map__pin--active';

  var pinSize = window.util.getHiddenElementSize(pinTemplate);
  var pinSizeWidthHalf = pinSize.width / 2;


  var createPin = function (advert, id) {
    var element = pinTemplate.cloneNode(true);

    element.setAttribute('data-id', id);
    element.style.top = (advert.location.y - pinSize.height) + 'px';
    element.style.left = (advert.location.x - pinSizeWidthHalf) + 'px';
    element.querySelector('img').setAttribute('src', advert.author.avatar);
    element.querySelector('img').setAttribute('alt', advert.offer.title);

    return element;
  };


  var renderPins = function (adverts) {
    var fragment = document.createDocumentFragment();
    var count = 0;

    adverts.forEach(function (advert, index) {
      var id = advert.id === undefined ? index : advert.id;

      if (advert.offer !== undefined && count < LIMIT_PINS) {
        fragment.appendChild(createPin(advert, id));
      }

      count++;
    });

    mapPins.appendChild(fragment);
  };


  var clickPin = function (adverts) {

    var onMapPinsClick = function (evt) {

      var pin = evt.target.closest('.map__pin');

      if (pin === null || pin.classList.contains('map__pin--main')) {
        return;
      }

      clearActiveClass();
      window.card.close();
      pin.classList.add(pinActiveClass);

      window.card.open(adverts, pin.getAttribute('data-id'));
    };

    mapPins.addEventListener('click', function (evt) {
      onMapPinsClick(evt);
    });

    mapPins.addEventListener('keydown', function (evt) {
      window.util.callIfEnterKeyEvent(evt, onMapPinsClick);
    });

  };

  var clearActiveClass = function () {
    var pinActive = mapPins.querySelector('.' + pinActiveClass);

    if (pinActive !== null) {
      pinActive.classList.remove(pinActiveClass);
    }
  };

  var removePins = function () {
    var pins = document.querySelectorAll('.map__pin');

    pins.forEach(function (pin) {
      if (!pin.classList.contains('map__pin--main')) {
        pin.remove();
      }
    });
  };


  window.pin = {
    render: renderPins,
    click: clickPin,
    clearActiveClass: clearActiveClass,
    remove: removePins
  };

})();
