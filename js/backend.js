'use strict';

(function () {

  var GET_URL = 'https://js.dump.academy/keksobooking/data';
  var POST_URL = 'https://js.dump.academy/keksobooking';
  var TIMEOUT_IN_MS = 10000;

  var StatusCode = {
    OK: 200,
    SERVER_ERROR: 500,
    NOT_FOUND_ERROR: 404
  };

  var ErrorMessage = {
    NOT_FOUND: 'Возникла ошибка #status#. Ресурс, к которому был обращен запрос, не найден',
    SERVER: 'Ошибка #status# на стороне сервера',
    CONNECTION: 'Произошла ошибка соединения',
    TIMEOUT: 'Запрос не успел выполниться за #timeout# мс',
    DEFAULT: 'Статус ответа сервера #status# #statusText#'
  };

  var sendRequest = function (method, url, data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT_IN_MS;

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onLoad(xhr.response);
      } else {
        switch (xhr.status) {
          case StatusCode.NOT_FOUND_ERROR:
            onError(ErrorMessage.NOT_FOUND.replace('#status#', xhr.status));
            break;
          case StatusCode.SERVER_ERROR:
            onError(ErrorMessage.SERVER.replace('#status#', xhr.status));
            break;
          default:
            onError(ErrorMessage.DEFAULT
              .replace('#status#', xhr.status)
              .replace('#statusText#', xhr.statusText));
        }
      }
    });

    xhr.addEventListener('error', function () {
      onError(ErrorMessage.CONNECTION);
    });

    xhr.addEventListener('timeout', function () {
      onError(ErrorMessage.TIMEOUT.replace('#timeout#', xhr.timeout));
    });

    xhr.open(method, url);
    xhr.send(data);
  };

  var load = function (onLoad, onError) {
    sendRequest('GET', GET_URL, null, onLoad, onError);
  };

  var save = function (data, onLoad, onError) {
    sendRequest('POST', POST_URL, data, onLoad, onError);
  };

  window.backend = {
    load: load,
    save: save
  };

})();
