(function () {
  'use strict';

  var profiles = [];
  var requests = [];
  var responses = [];
  var managerSelect = document.getElementById('manager-select');
  var evalueeCount = document.getElementById('evaluee-count');
  var evalueeTbody = document.getElementById('evaluee-tbody');

  function init() {
    Promise.all([
      fetch('/api/profiles').then(function (r) { return r.json(); }),
      fetch('/api/requests').then(function (r) { return r.json(); }),
      fetch('/api/responses').then(function (r) { return r.json(); })
    ])
      .then(function (results) {
        profiles = results[0];
        requests = results[1];
        responses = results[2];
        populateManagerDropdown();
        initColumnResize();
      })
      .catch(function (err) {
        console.error('Failed to load data:', err);
        evalueeTbody.innerHTML = '<tr><td colspan="7" class="empty-state">Failed to load data</td></tr>';
      });
  }

  function countByFmno(list) {
    var counts = {};
    list.forEach(function (item) {
      var fmno = item.fmno;
      counts[fmno] = (counts[fmno] || 0) + 1;
    });
    return counts;
  }

  function populateManagerDropdown() {
    var managerSet = {};

    profiles.forEach(function (p) {
      if (p.manager_fmno) {
        managerSet[p.manager_fmno] = true;
      }
      if (p.manager_delegate_fmno) {
        managerSet[p.manager_delegate_fmno] = true;
      }
    });

    var managerFmnos = Object.keys(managerSet).sort(function (a, b) {
      return parseInt(a) - parseInt(b);
    });

    managerSelect.innerHTML = '';

    managerFmnos.forEach(function (fmno) {
      var nameMatch = profiles.find(function (p) { return p.fmno === fmno; });
      var label = fmno;
      if (nameMatch) {
        label = fmno + ' - ' + nameMatch.full_name;
      }
      var option = document.createElement('option');
      option.value = fmno;
      option.textContent = label;
      managerSelect.appendChild(option);
    });

    if (managerFmnos.indexOf('315337') !== -1) {
      managerSelect.value = '315337';
    }

    managerSelect.addEventListener('change', onManagerChange);
    onManagerChange();
  }

  function onManagerChange() {
    var selectedFmno = managerSelect.value;
    if (!selectedFmno) {
      evalueeTbody.innerHTML = '<tr><td colspan="7" class="empty-state">Select a manager to view evaluees</td></tr>';
      evalueeCount.textContent = '';
      return;
    }

    var evaluees = profiles.filter(function (p) {
      return p.manager_fmno === selectedFmno || p.manager_delegate_fmno === selectedFmno;
    });

    evalueeCount.textContent = evaluees.length + (evaluees.length === 1 ? ' evaluee' : ' evaluees');

    if (evaluees.length === 0) {
      evalueeTbody.innerHTML = '<tr><td colspan="7" class="empty-state">No evaluees found for this FMNO</td></tr>';
      return;
    }

    var reqCounts = countByFmno(requests);
    var resCounts = countByFmno(responses);

    var html = '';
    evaluees.forEach(function (e) {
      var relationship = '';
      if (e.manager_fmno === selectedFmno && e.manager_delegate_fmno === selectedFmno) {
        relationship = '<span class="relationship-tag relationship-tag--manager">Manager</span> ' +
                       '<span class="relationship-tag relationship-tag--delegate">Manager Delegate</span>';
      } else if (e.manager_fmno === selectedFmno) {
        relationship = '<span class="relationship-tag relationship-tag--manager">Manager</span>';
      } else {
        relationship = '<span class="relationship-tag relationship-tag--delegate">Manager Delegate</span>';
      }

      var reqCount = reqCounts[e.fmno] || 0;
      var resCount = resCounts[e.fmno] || 0;

      html += '<tr>' +
        '<td>' + escapeHtml(e.fmno) + '</td>' +
        '<td><a class="evaluee-link" href="evaluee-detail.html?fmno=' + encodeURIComponent(e.fmno) + '">' + escapeHtml(e.full_name) + '</a></td>' +
        '<td>' + escapeHtml(e.manager_fmno || '') + '</td>' +
        '<td>' + escapeHtml(e.manager_delegate_fmno || '') + '</td>' +
        '<td>' + reqCount + '</td>' +
        '<td>' + resCount + '</td>' +
        '<td>' + relationship + '</td>' +
        '</tr>';
    });

    evalueeTbody.innerHTML = html;
  }

  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  /* Column resize (per MDS table patterns) */
  function initColumnResize() {
    var table = document.getElementById('evaluee-table');
    if (!table) return;

    var handles = table.querySelectorAll('.th-resize');
    handles.forEach(function (handle) {
      handle.addEventListener('mousedown', function (e) {
        e.preventDefault();

        var th = handle.parentElement;
        var thIndex = Array.prototype.indexOf.call(th.parentElement.children, th);
        var cols = table.querySelectorAll('colgroup col');

        if (cols[0] && !cols[0]._pxLocked) {
          var ths = table.querySelectorAll('thead th');
          ths.forEach(function (h, i) {
            if (cols[i]) {
              cols[i].style.width = h.offsetWidth + 'px';
            }
          });
          table.style.width = table.offsetWidth + 'px';
          cols.forEach(function (c) { c._pxLocked = true; });
        }

        var startX = e.pageX;
        var leftCol = cols[thIndex];
        var rightCol = cols[thIndex + 1];
        if (!leftCol || !rightCol) return;

        var startLeftW = parseInt(leftCol.style.width);
        var startRightW = parseInt(rightCol.style.width);
        var minWidth = 50;

        handle.classList.add('th-resize--active');
        document.body.classList.add('col-resizing');

        function onMouseMove(ev) {
          var delta = ev.pageX - startX;
          var newLeft = Math.max(minWidth, startLeftW + delta);
          var newRight = Math.max(minWidth, startRightW - delta);

          if (newLeft >= minWidth && newRight >= minWidth) {
            leftCol.style.width = newLeft + 'px';
            rightCol.style.width = newRight + 'px';
          }
        }

        function onMouseUp() {
          handle.classList.remove('th-resize--active');
          document.body.classList.remove('col-resizing');
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
