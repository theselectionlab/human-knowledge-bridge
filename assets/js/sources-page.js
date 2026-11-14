/* Sources page — renders the source registry from content.js.
   Kept separate from app.js so the index page never pays for it. */

(function () {
  'use strict';

  var C = window.HKB_CONTENT;
  var tbody = document.getElementById('sources-body');
  if (!tbody || !C) return;

  var ACCESSED = C.accessed ? C.accessed : '';

  Object.keys(C.SOURCES).forEach(function (id) {
    var s = C.SOURCES[id];
    var tr = document.createElement('tr');

    var tdPublisher = document.createElement('td');
    tdPublisher.textContent = s.publisher;

    var accessed = s.accessed || ACCESSED;
    if (/^\d{4}-\d{2}-\d{2}$/.test(accessed)) {
      var parts = accessed.split('-');
      var months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      accessed = Number(parts[2]) + ' ' + months[Number(parts[1]) - 1] + ' ' + parts[0];
    }

    var tdPage = document.createElement('td');
    var a = document.createElement('a');
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'source';
    a.textContent = s.title;
    var sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = ' (opens in a new tab)';
    a.appendChild(sr);
    tdPage.appendChild(a);

    var tdSupports = document.createElement('td');
    tdSupports.textContent = s.supports || '';

    var tdAccess = document.createElement('td');
    tdAccess.textContent = accessed;

    tr.appendChild(tdPublisher);
    tr.appendChild(tdPage);
    tr.appendChild(tdSupports);
    tr.appendChild(tdAccess);
    tbody.appendChild(tr);
  });
})();
