'use strict';

(function () {

  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

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

  var renderPins = function (adverts, wrapperElement) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < adverts.length; i++) {
      fragment.appendChild(createPin(adverts[i], i));
    }

    wrapperElement.appendChild(fragment);
  };


  window.pin = {
    render: renderPins
  };

})();
