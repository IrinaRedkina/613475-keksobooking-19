'use strict';

(function () {

  var TYPES = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };

  var cardAdvertTemplate = document.querySelector('#card').content.querySelector('.map__card');

  var createPhotosElements = function (photosWrapper, photos) {
    var fragment = document.createDocumentFragment();
    var photoTemplate = photosWrapper.querySelector('img');

    for (var i = 0; i < photos.length; i++) {
      var photoElement = photoTemplate.cloneNode(true);
      photoElement.setAttribute('src', photos[i]);
      fragment.appendChild(photoElement);
    }

    return fragment;
  };

  var createCard = function (advert) {
    var element = cardAdvertTemplate.cloneNode(true);

    var roomsString = window.util.getWordDeclension(advert.offer.rooms, ['комната', 'комнаты', 'комнат']);
    var guestsString = window.util.getWordDeclension(advert.offer.guests, ['гостя', 'гостей', 'гостей']);
    var roomsAndGuestsString = advert.offer.rooms + ' ' + roomsString + ' для ' + advert.offer.guests + ' ' + guestsString;
    var priceString = advert.offer.price + '₽/ночь';
    var timesString = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;

    element.querySelector('.popup__avatar').setAttribute('src', advert.author.avatar);
    element.querySelector('.popup__text--price').innerText = priceString;
    element.querySelector('.popup__title').innerText = advert.offer.title;
    element.querySelector('.popup__description').innerText = advert.offer.description;
    element.querySelector('.popup__text--address').innerText = advert.offer.address;
    element.querySelector('.popup__text--time').innerText = timesString;
    element.querySelector('.popup__text--capacity').innerText = roomsAndGuestsString;

    // тип жилья
    element.querySelector('.popup__type').innerText = TYPES[advert.offer.type];

    // удобства
    var featuresWrapper = element.querySelector('.popup__features');
    var featuresElements = element.querySelectorAll('.popup__feature');
    var features = advert.offer.features;

    for (var i = 0; i < featuresElements.length; i++) {
      featuresElements[i].style.display = 'none';
    }

    if (features.length > 0) {
      for (i = 0; i < features.length; i++) {
        var featureElement = featuresWrapper.querySelector('.popup__feature--' + features[i]);
        featureElement.style.display = 'inline-block';
      }
    } else {
      featuresWrapper.style.display = 'none';
    }

    // фото
    var photosWrapper = element.querySelector('.popup__photos');
    var photos = advert.offer.photos;

    if (photos.length > 0) {
      var photoFirst = photosWrapper.children[0];
      var photosElements = createPhotosElements(photosWrapper, photos);
      photosWrapper.replaceChild(photosElements, photoFirst);
    } else {
      photosWrapper.style.display = 'none';
    }

    return element;
  };

  var renderCard = function (adverts, index, wrapperElement, beforeElement) {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(createCard(adverts[index]));
    wrapperElement.insertBefore(fragment, beforeElement);
  };


  window.card = {
    render: renderCard
  };

})();
