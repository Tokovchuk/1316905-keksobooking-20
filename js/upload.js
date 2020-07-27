'use strict';
(function () {
  var URL = 'https://javascript.pages.academy/keksobooking';
  var STATUS_OK = 200;

  var uploadForm = function (data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_OK) {
        onSuccess();
      } else {
        onError();
      }
    });

    xhr.addEventListener('error', function () {
      onError();
    });

    xhr.addEventListener('timeout', function () {
      onError();
    });

    xhr.timeout = 10000; // 10s

    xhr.open('POST', URL);
    xhr.send(data);
  };

  window.upload = {
    sendForm: uploadForm,
  };
})();
