'use strict';

(function () {

  var HOUSING_PHOTO_WIDTH = 70;
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
  var filterForm = document.querySelector('.map__filters');
  var adForm = document.querySelector('.ad-form');
  var inputAddress = adForm.querySelector('input[name=address]');
  var selectHousingType = adForm.querySelector('select[name=type]');
  var inputPrice = adForm.querySelector('input[name=price]');
  var selectTimein = adForm.querySelector('select[name=timein]');
  var selectTimeout = adForm.querySelector('select[name=timeout]');
  var selectRooms = adForm.querySelector('select[name=rooms]');
  var selectCapacity = adForm.querySelector('select[name=capacity]');
  var selectCapacityOptions = selectCapacity.options;

  // фото
  var fileInput = adForm.querySelectorAll('input[type=file]');
  var avatarInputName = 'avatar';
  var housingPhotoInputName = 'images';
  var avatarImg = adForm.querySelector('.ad-form-header__preview img');
  var avatarDefaultSrc = avatarImg.getAttribute('src');
  var housingPhotoContainer = adForm.querySelector('.ad-form__photo');
  var housingPhotoAltText = 'Фото жилья ';
  var allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];

  // Сообщения
  var mainWrapper = document.querySelector('main');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var errorUploadFile = 'Загружать можно только изображения с разрешением jpg, png и gif';

  // кнопки
  var resetButton = adForm.querySelector('.ad-form__reset');
  var submitButton = adForm.querySelector('.ad-form__submit');

  var minPiceLabel = 'Цена за ночь от #price# руб';
  var capacityError = 'Для выбранного колличества комнат нужно выбрать другое колличество мест';

  /*
   * Установка фото
   */
  var renderPhoto = function (src, alt) {
    var existingImage = housingPhotoContainer.querySelector('img');

    if (existingImage === null) {
      var image = document.createElement('img');
      image.setAttribute('src', src);
      image.setAttribute('alt', alt);
      image.setAttribute('width', HOUSING_PHOTO_WIDTH + 'px');
      housingPhotoContainer.appendChild(image);
    } else {
      existingImage.setAttribute('src', src);
      existingImage.setAttribute('alt', alt);
    }
  };

  var readFile = function (file, onload) {
    var reader = new FileReader();

    reader.onload = function (readerEvt) {
      onload(readerEvt.target.result);
    };

    reader.readAsDataURL(file);
  };

  var onFileInputChange = function (evt) {
    var file = evt.target.files[0];

    if (allowedFileTypes.indexOf(file.type) === -1) {
      showMessage('error', errorUploadFile);
      return;
    }

    if (evt.target.name === avatarInputName && file) {
      readFile(file, function (result) {
        avatarImg.setAttribute('src', result);
      });
    }

    if (evt.target.name === housingPhotoInputName) {
      readFile(file, function (result) {
        renderPhoto(result, housingPhotoAltText + file.name);
      });
    }
  };

  fileInput.forEach(function (input) {
    input.addEventListener('change', onFileInputChange);
  });

  var clearImgsSrc = function () {
    housingPhotoContainer.innerHTML = '';
    avatarImg.setAttribute('src', avatarDefaultSrc);
  };

  /*
   * минимальная цена
   */
  var setMinPrice = function () {
    var selectedType = selectHousingType.value;
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


  /*
   * сброс форм и деактивация страницы
   */
  var resetPage = function () {
    window.map.isPageActive = false;
    window.map.deactivatePage();

    adForm.reset();
    filterForm.reset();

    setMinPrice();
    verifyGuestsValue();
    disabledCapacityValues();
    clearImgsSrc();
  };

  setMinPrice();
  verifyGuestsValue();
  disabledCapacityValues();

  selectHousingType.addEventListener('change', function () {
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

  /*
   * Отправка формы
   */
  var onDocumentKeydown = function (evt) {
    window.util.callIfEscKeyEvent(evt, closeMessage);
  };

  var onDocumentClick = function (evt) {
    if (evt.target === document.querySelector('.error__message') ||
        evt.target === document.querySelector('.success__message')) {
      return;
    }

    closeMessage();
  };

  var showMessage = function (message) {
    var errorText = arguments[1];

    if (message === 'success') {
      var successMessage = successTemplate.cloneNode(true);
      mainWrapper.appendChild(successMessage);
    }

    if (message === 'error') {
      var errorMessage = errorTemplate.cloneNode(true);

      if (errorText !== undefined) {
        errorMessage.querySelector('.error__message').innerText = errorText;
      }

      mainWrapper.appendChild(errorMessage);
    }

    document.addEventListener('keydown', onDocumentKeydown);
    document.addEventListener('click', onDocumentClick);
  };

  var closeMessage = function () {
    var successMessage = mainWrapper.querySelector('.success');
    var errorMessage = mainWrapper.querySelector('.error');

    if (successMessage !== null) {
      successMessage.remove();
    }

    if (errorMessage !== null) {
      errorMessage.remove();
    }

    document.removeEventListener('keydown', onDocumentKeydown);
    document.removeEventListener('click', onDocumentClick);
  };

  var onSuccess = function () {
    showMessage('success');
    resetPage();
  };

  var onError = function (errorText) {
    showMessage('error', errorText);
  };

  adForm.addEventListener('submit', function (evt) {
    var formData = new FormData(adForm);
    window.backend.save(formData, onSuccess, onError);
    submitButton.blur();
    evt.preventDefault();
  });

})();
