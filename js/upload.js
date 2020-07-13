'use strict';
(function () {
  var URL = 'https://javascript.pages.academy/keksobooking';

  var uploadForm = function (data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === window.data.STATUS_OK) {
        onSuccess();
      } else {
        onError();
      }
    });

    xhr.open('POST', URL);
    xhr.send(data);
  };

  window.upload = {
    data: uploadForm,
  };
})();
