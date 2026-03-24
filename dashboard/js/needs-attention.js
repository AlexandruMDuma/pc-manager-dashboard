(function () {
  'use strict';

  var list = document.getElementById('attention-list');
  var subtitle = document.getElementById('attention-subtitle');
  var emptyEl = document.getElementById('attention-empty');

  var items = [];
  try {
    var raw = sessionStorage.getItem('attentionItems');
    if (raw) items = JSON.parse(raw);
  } catch (_) {}

  if (!items || items.length === 0) {
    subtitle.textContent = '0 items';
    emptyEl.removeAttribute('hidden');
    return;
  }

  subtitle.textContent = items.length + (items.length === 1 ? ' item' : ' items');

  list.innerHTML = items.map(function (text) {
    return '<li class="attention-panel__item">' + text + '</li>';
  }).join('');
})();
