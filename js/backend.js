'use strict';

(function () {

  var GET_URL = 'https://js.dump.academy/keksobooking/data';
  var TIMEOUT_IN_MS = 10000;
  var StatusCode = {
    OK: 200,
    SERVER_ERROR: 500,
    NOT_FOUND_ERROR: 404
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
            onError('Возникла ошибка ' + xhr.status + ', ресурс, к которому был обращен запрос, не найден');
            break;
          case StatusCode.SERVER_ERROR:
            onError('Возникла ошибка ' + xhr.status + ', на стороне сервера');
            break;
          default:
            onError('Статус ответа ' + xhr.status + ' ' + xhr.statusText);
        }
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.open(method, url);
    xhr.send(data);
  };

  var load = function (onLoad, onError) {
    sendRequest('GET', GET_URL, null, onLoad, onError);
  };

  window.backend = {
    load: load
  };

})();
