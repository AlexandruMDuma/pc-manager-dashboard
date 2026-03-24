(function () {
  'use strict';

  var profiles = [];
  var requests = [];
  var responses = [];

  var managerSelect  = document.getElementById('manager-select');
  var evalueeCount   = document.getElementById('evaluee-count');
  var evalueeTbody   = document.getElementById('evaluee-tbody');
  var filterSearch   = document.getElementById('filter-search');
  var filterRegion   = document.getElementById('filter-region');
  var filterPath     = document.getElementById('filter-path');
  var filterImpact   = document.getElementById('filter-impact');
  var btnExport      = document.getElementById('btn-export');

  var currentSort    = { key: 'full_name', dir: 'asc' };
  var currentEvaluees = [];

  function init() {
    Promise.all([
      fetch('/api/profiles').then(function (r) { return r.json(); }),
      fetch('/api/requests').then(function (r) { return r.json(); }),
      fetch('/api/responses').then(function (r) { return r.json(); })
    ])
      .then(function (results) {
        profiles  = results[0];
        requests  = results[1];
        responses = results[2];
        populateManagerDropdown();
        populateFilterDropdowns();
        bindFilterEvents();
        bindSortEvents();
        bindExportEvent();
        initColumnResize();
      })
      .catch(function (err) {
        console.error('Failed to load data:', err);
        evalueeTbody.innerHTML = '<tr><td colspan="11" class="empty-state">Failed to load data</td></tr>';
      });
  }

  /* =============================================
     UTILITIES
     ============================================= */
  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function countByFmno(list) {
    var counts = {};
    list.forEach(function (item) {
      counts[item.fmno] = (counts[item.fmno] || 0) + 1;
    });
    return counts;
  }

  function countByField(list, field) {
    var counts = {};
    list.forEach(function (item) {
      var val = item[field] || 'Unknown';
      counts[val] = (counts[val] || 0) + 1;
    });
    return counts;
  }

  /* =============================================
     MANAGER DROPDOWN
     ============================================= */
  function populateManagerDropdown() {
    var managerSet = {};
    profiles.forEach(function (p) {
      if (p.manager_fmno) managerSet[p.manager_fmno] = true;
      if (p.manager_delegate_fmno) managerSet[p.manager_delegate_fmno] = true;
    });

    var managerFmnos = Object.keys(managerSet).sort(function (a, b) {
      return parseInt(a) - parseInt(b);
    });

    managerSelect.innerHTML = '';
    managerFmnos.forEach(function (fmno) {
      var nameMatch = profiles.find(function (p) { return p.fmno === fmno; });
      var label = nameMatch ? fmno + ' - ' + nameMatch.full_name : fmno;
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

  /* =============================================
     FILTER DROPDOWNS
     ============================================= */
  function populateFilterDropdowns() {
    var regions = {}, paths = {}, impacts = {};
    profiles.forEach(function (p) {
      if (p.region) regions[p.region] = true;
      if (p.path) paths[p.path] = true;
      if (p.impact_level) impacts[p.impact_level] = true;
    });

    appendOptions(filterRegion, Object.keys(regions).sort());
    appendOptions(filterPath, Object.keys(paths).sort());
    appendOptions(filterImpact, Object.keys(impacts).sort());
  }

  function appendOptions(select, items) {
    items.forEach(function (item) {
      var opt = document.createElement('option');
      opt.value = item;
      opt.textContent = item;
      select.appendChild(opt);
    });
  }

  function bindFilterEvents() {
    filterSearch.addEventListener('input', renderFilteredTable);
    filterRegion.addEventListener('change', renderFilteredTable);
    filterPath.addEventListener('change', renderFilteredTable);
    filterImpact.addEventListener('change', renderFilteredTable);
  }

  /* =============================================
     SORT
     ============================================= */
  function bindSortEvents() {
    var thead = document.querySelector('#evaluee-table thead');
    if (!thead) return;
    thead.addEventListener('click', function (e) {
      if (e.target.classList && e.target.classList.contains('th-resize')) return;
      var th = e.target.closest('th[data-sort]');
      if (!th) return;
      var key = th.getAttribute('data-sort');
      if (currentSort.key === key) {
        currentSort.dir = currentSort.dir === 'asc' ? 'desc' : 'asc';
      } else {
        currentSort = { key: key, dir: 'asc' };
      }
      updateSortIndicators();
      renderFilteredTable();
    });
  }

  function updateSortIndicators() {
    var ths = document.querySelectorAll('#evaluee-table thead th[data-sort]');
    ths.forEach(function (th) {
      th.classList.remove('sort-asc', 'sort-desc');
      var icon = th.querySelector('.sort-icon');
      if (!icon) return;
      if (th.getAttribute('data-sort') === currentSort.key) {
        th.classList.add(currentSort.dir === 'asc' ? 'sort-asc' : 'sort-desc');
        icon.innerHTML = currentSort.dir === 'asc' ? '&#9650;' : '&#9660;';
      } else {
        icon.innerHTML = '&#9650;';
      }
    });
  }

  /* =============================================
     EXPORT CSV
     ============================================= */
  function bindExportEvent() {
    btnExport.addEventListener('click', function () {
      if (!currentEvaluees.length) return;
      var headers = ['FMNO', 'Full Name', 'Manager FMNO', 'MD FMNO', 'Impact Level', 'Region', 'Path', 'Requests', 'Responses', 'Response Rate', 'Relationship'];
      var rows = currentEvaluees.map(function (e) {
        return [
          e.fmno, e.full_name, e.manager_fmno || '', e.manager_delegate_fmno || '',
          e.impact_level || '', e.region || '', e.path || '',
          e.req_count, e.res_count,
          e.req_count > 0 ? Math.round((e.res_count / e.req_count) * 100) + '%' : 'N/A',
          e.relationship
        ].map(function (v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(',');
      });
      var csv = headers.join(',') + '\n' + rows.join('\n');
      downloadFile('evaluees.csv', csv, 'text/csv');
    });
  }

  function downloadFile(name, content, type) {
    var blob = new Blob([content], { type: type });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /* =============================================
     MAIN RENDER ON MANAGER CHANGE
     ============================================= */
  function onManagerChange() {
    var selectedFmno = managerSelect.value;
    if (!selectedFmno) {
      evalueeTbody.innerHTML = '<tr><td colspan="11" class="empty-state">Select a manager to view evaluees</td></tr>';
      evalueeCount.textContent = '';
      clearDashboard();
      return;
    }

    var evaluees = profiles.filter(function (p) {
      return p.manager_fmno === selectedFmno || p.manager_delegate_fmno === selectedFmno;
    });

    var reqCounts = countByFmno(requests);
    var resCounts = countByFmno(responses);

    evaluees.forEach(function (e) {
      e.req_count = reqCounts[e.fmno] || 0;
      e.res_count = resCounts[e.fmno] || 0;
      e.rate = e.req_count > 0 ? e.res_count / e.req_count : 0;

      var isMgr = e.manager_fmno === selectedFmno;
      var isMD = e.manager_delegate_fmno === selectedFmno;
      e.relationship = isMgr && isMD ? 'Both' : (isMgr ? 'Manager' : 'Manager Delegate');
    });

    currentEvaluees = evaluees;

    var evalFmnos = {};
    evaluees.forEach(function (e) { evalFmnos[e.fmno] = true; });

    var evalRequests = requests.filter(function (r) { return evalFmnos[r.fmno]; });
    var evalResponses = responses.filter(function (r) { return evalFmnos[r.fmno]; });

    renderKPIs(evaluees, evalRequests, evalResponses);
    renderAttentionPanel(evaluees, evalRequests);
    renderCharts(evaluees, evalRequests, evalResponses);
    renderFilteredTable();
  }

  function clearDashboard() {
    document.getElementById('kpi-evaluees').textContent = '-';
    document.getElementById('kpi-requests').textContent = '-';
    document.getElementById('kpi-responses').textContent = '-';
    document.getElementById('kpi-rate').textContent = '-';
    document.getElementById('kpi-pending').textContent = '-';
    document.getElementById('kpi-declined').textContent = '-';
    document.getElementById('attention-bar').setAttribute('hidden', '');
    document.getElementById('chart-status').innerHTML = '';
    document.getElementById('chart-months').innerHTML = '';
    document.getElementById('chart-region').innerHTML = '';
  }

  /* =============================================
     KPI CARDS
     ============================================= */
  function renderKPIs(evaluees, evalRequests, evalResponses) {
    var totalReq = evalRequests.length;
    var totalRes = evalResponses.length;
    var pending = evalRequests.filter(function (r) { return r.request_status === 'Pending'; }).length;
    var declined = evalRequests.filter(function (r) { return r.request_status === 'Declined'; }).length;
    var rate = totalReq > 0 ? Math.round((totalRes / totalReq) * 100) : 0;

    document.getElementById('kpi-evaluees').textContent = evaluees.length;
    document.getElementById('kpi-requests').textContent = totalReq;
    document.getElementById('kpi-responses').textContent = totalRes;
    document.getElementById('kpi-rate').textContent = rate + '%';
    document.getElementById('kpi-pending').textContent = pending;
    document.getElementById('kpi-declined').textContent = declined;
  }

  /* =============================================
     NEEDS ATTENTION BAR
     ============================================= */
  function renderAttentionPanel(evaluees, evalRequests) {
    var bar = document.getElementById('attention-bar');
    var countEl = document.getElementById('attention-count');
    var items = [];

    var reqByFmno = {};
    evalRequests.forEach(function (r) {
      if (!reqByFmno[r.fmno]) reqByFmno[r.fmno] = [];
      reqByFmno[r.fmno].push(r);
    });

    evaluees.forEach(function (e) {
      var reqs = reqByFmno[e.fmno] || [];
      if (reqs.length === 0) {
        items.push(escapeHtml(e.full_name) + ' (' + escapeHtml(e.fmno) + ') has no feedback requests');
      }

      var allDeclined = reqs.length > 0 && reqs.every(function (r) { return r.request_status === 'Declined'; });
      if (allDeclined) {
        items.push(escapeHtml(e.full_name) + ' (' + escapeHtml(e.fmno) + ') — all requests were declined');
      }

      var longPending = reqs.filter(function (r) {
        if (r.request_status !== 'Pending') return false;
        var days = Math.floor((Date.now() - new Date(r.request_date).getTime()) / 86400000);
        return days > 30;
      });
      if (longPending.length > 0) {
        items.push(escapeHtml(e.full_name) + ' (' + escapeHtml(e.fmno) + ') has ' + longPending.length + ' request(s) pending >30 days');
      }
    });

    if (items.length === 0) {
      bar.setAttribute('hidden', '');
      return;
    }

    countEl.textContent = items.length;
    bar.removeAttribute('hidden');

    try { sessionStorage.setItem('attentionItems', JSON.stringify(items)); } catch (_) {}
  }

  /* =============================================
     CHARTS
     ============================================= */
  function renderCharts(evaluees, evalRequests, evalResponses) {
    renderStatusDonut(evalRequests);
    renderMonthChart(evalRequests);
    renderRegionChart(evaluees);
  }

  function renderStatusDonut(evalRequests) {
    var container = document.getElementById('chart-status');
    var counts = countByField(evalRequests, 'request_status');
    var responded = counts['Responded'] || 0;
    var pending   = counts['Pending'] || 0;
    var declined  = counts['Declined'] || 0;
    var total = responded + pending + declined;

    if (total === 0) {
      container.innerHTML = '<p class="empty-state">No request data</p>';
      return;
    }

    var colors = [
      { label: 'Responded', count: responded, color: '#2EBBA5' },
      { label: 'Pending',   count: pending,   color: '#FFD24C' },
      { label: 'Declined',  count: declined,  color: '#EB5959' }
    ];

    var svg = buildDonutSVG(colors, total, 140);

    var legendHtml = colors.map(function (c) {
      return '<div class="donut-chart__legend-item">' +
        '<span class="donut-chart__legend-dot" style="background:' + c.color + '"></span>' +
        '<span>' + c.label + '</span>' +
        '<span class="donut-chart__legend-count">' + c.count + '</span>' +
        '</div>';
    }).join('');

    container.innerHTML =
      '<div class="donut-chart">' + svg + '<div class="donut-chart__legend">' + legendHtml + '</div></div>';
  }

  function buildDonutSVG(segments, total, size) {
    var cx = size / 2, cy = size / 2, r = (size / 2) - 10, strokeWidth = 22;
    var circumference = 2 * Math.PI * r;
    var offset = 0;

    var paths = segments.map(function (seg) {
      var pct = total > 0 ? seg.count / total : 0;
      var dash = pct * circumference;
      var gap = circumference - dash;
      var html = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" ' +
        'fill="none" stroke="' + seg.color + '" stroke-width="' + strokeWidth + '" ' +
        'stroke-dasharray="' + dash + ' ' + gap + '" ' +
        'stroke-dashoffset="-' + offset + '" ' +
        'transform="rotate(-90 ' + cx + ' ' + cy + ')"/>';
      offset += dash;
      return html;
    }).join('');

    return '<svg class="donut-chart__svg" viewBox="0 0 ' + size + ' ' + size + '" xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#E6E6E6" stroke-width="' + strokeWidth + '"/>' +
      paths +
      '<text x="' + cx + '" y="' + cy + '" text-anchor="middle" dominant-baseline="central" ' +
      'font-family="McKinsey Sans,sans-serif" font-weight="500" font-size="22" fill="#333">' + total + '</text>' +
      '</svg>';
  }

  function renderMonthChart(evalRequests) {
    var container = document.getElementById('chart-months');
    var monthOrder = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var counts = countByField(evalRequests, 'request_month');

    var data = monthOrder.filter(function (m) { return counts[m]; }).map(function (m) {
      return { label: m.substring(0, 3), value: counts[m] };
    });

    if (data.length === 0) {
      container.innerHTML = '<p class="empty-state">No data</p>';
      return;
    }

    var maxVal = Math.max.apply(null, data.map(function (d) { return d.value; }));
    container.innerHTML = buildHBarChart(data, maxVal, 'var(--mds-color-electric-blue-500)');
  }

  function renderRegionChart(evaluees) {
    var container = document.getElementById('chart-region');
    var counts = countByField(evaluees, 'region');
    var data = Object.keys(counts).sort().map(function (k) {
      return { label: k, value: counts[k] };
    });

    if (data.length === 0) {
      container.innerHTML = '<p class="empty-state">No data</p>';
      return;
    }

    var maxVal = Math.max.apply(null, data.map(function (d) { return d.value; }));
    container.innerHTML = buildHBarChart(data, maxVal, 'var(--mds-color-deep-blue-500)');
  }

  function buildHBarChart(data, maxVal, color) {
    return '<div class="hbar-chart">' + data.map(function (d) {
      var pct = maxVal > 0 ? Math.round((d.value / maxVal) * 100) : 0;
      return '<div class="hbar-chart__row">' +
        '<span class="hbar-chart__label">' + escapeHtml(d.label) + '</span>' +
        '<div class="hbar-chart__track"><div class="hbar-chart__fill" style="width:' + pct + '%;background:' + color + '"></div></div>' +
        '<span class="hbar-chart__value">' + d.value + '</span>' +
        '</div>';
    }).join('') + '</div>';
  }

  /* =============================================
     FILTERED & SORTED TABLE
     ============================================= */
  function renderFilteredTable() {
    var searchTerm = filterSearch.value.toLowerCase();
    var regionVal  = filterRegion.value;
    var pathVal    = filterPath.value;
    var impactVal  = filterImpact.value;

    var filtered = currentEvaluees.filter(function (e) {
      if (searchTerm && e.full_name.toLowerCase().indexOf(searchTerm) === -1 && e.fmno.indexOf(searchTerm) === -1) return false;
      if (regionVal && e.region !== regionVal) return false;
      if (pathVal && e.path !== pathVal) return false;
      if (impactVal && e.impact_level !== impactVal) return false;
      return true;
    });

    filtered.sort(function (a, b) {
      var key = currentSort.key;
      var va = a[key], vb = b[key];

      if (key === 'req_count' || key === 'res_count' || key === 'rate') {
        va = Number(va) || 0;
        vb = Number(vb) || 0;
      } else {
        va = String(va || '').toLowerCase();
        vb = String(vb || '').toLowerCase();
      }

      if (va < vb) return currentSort.dir === 'asc' ? -1 : 1;
      if (va > vb) return currentSort.dir === 'asc' ? 1 : -1;
      return 0;
    });

    evalueeCount.textContent = filtered.length + (filtered.length === 1 ? ' evaluee' : ' evaluees');

    if (filtered.length === 0) {
      evalueeTbody.innerHTML = '<tr><td colspan="11" class="empty-state">No evaluees match current filters</td></tr>';
      return;
    }

    var html = '';
    filtered.forEach(function (e) {
      var selectedFmno = managerSelect.value;
      var isMgr = e.manager_fmno === selectedFmno;
      var isMD  = e.manager_delegate_fmno === selectedFmno;
      var relationship = '';
      if (isMgr && isMD) {
        relationship = '<span class="relationship-tag relationship-tag--manager">Manager</span> ' +
                       '<span class="relationship-tag relationship-tag--delegate">Manager Delegate</span>';
      } else if (isMgr) {
        relationship = '<span class="relationship-tag relationship-tag--manager">Manager</span>';
      } else {
        relationship = '<span class="relationship-tag relationship-tag--delegate">Manager Delegate</span>';
      }

      var impactClass = (e.impact_level || '').toLowerCase();
      var impactHtml = e.impact_level
        ? '<span class="impact-tag impact-tag--' + impactClass + '"><span class="impact-tag__dot"></span>' + escapeHtml(e.impact_level) + '</span>'
        : '';

      var ratePct = e.req_count > 0 ? Math.round(e.rate * 100) : -1;
      var rateClass = 'none';
      if (ratePct >= 75) rateClass = 'high';
      else if (ratePct >= 40) rateClass = 'mid';
      else if (ratePct >= 0) rateClass = 'low';
      var rateText = ratePct >= 0 ? ratePct + '%' : 'N/A';
      var rateWidth = ratePct >= 0 ? ratePct : 0;

      var statusDot = '';
      if (e.req_count === 0) {
        statusDot = '';
      } else if (ratePct >= 75) {
        statusDot = '<span class="status-dot status-dot--green"></span>';
      } else if (ratePct >= 40) {
        statusDot = '<span class="status-dot status-dot--yellow"></span>';
      } else {
        statusDot = '<span class="status-dot status-dot--red"></span>';
      }

      html += '<tr>' +
        '<td>' + escapeHtml(e.fmno) + '</td>' +
        '<td><a class="evaluee-link" href="evaluee-detail.html?fmno=' + encodeURIComponent(e.fmno) + '">' + escapeHtml(e.full_name) + '</a></td>' +
        '<td>' + escapeHtml(e.manager_fmno || '') + '</td>' +
        '<td>' + escapeHtml(e.manager_delegate_fmno || '') + '</td>' +
        '<td>' + impactHtml + '</td>' +
        '<td><span class="region-tag">' + escapeHtml(e.region || '') + '</span></td>' +
        '<td><span class="path-tag">' + escapeHtml(e.path || '') + '</span></td>' +
        '<td>' + e.req_count + '</td>' +
        '<td>' + e.res_count + '</td>' +
        '<td>' +
          '<div class="rate-bar">' + statusDot +
            '<div class="rate-bar__track"><div class="rate-bar__fill rate-bar__fill--' + rateClass + '" style="width:' + rateWidth + '%"></div></div>' +
            '<span class="rate-bar__text">' + rateText + '</span>' +
          '</div>' +
        '</td>' +
        '<td>' + relationship + '</td>' +
        '</tr>';
    });

    evalueeTbody.innerHTML = html;
  }

  /* =============================================
     COLUMN RESIZE
     ============================================= */
  function initColumnResize() {
    var table = document.getElementById('evaluee-table');
    if (!table) return;

    var handles = table.querySelectorAll('.th-resize');
    handles.forEach(function (handle) {
      handle.addEventListener('mousedown', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var th = handle.parentElement;
        var thIndex = Array.prototype.indexOf.call(th.parentElement.children, th);
        var cols = table.querySelectorAll('colgroup col');

        if (cols[0] && !cols[0]._pxLocked) {
          var ths = table.querySelectorAll('thead th');
          ths.forEach(function (h, i) {
            if (cols[i]) cols[i].style.width = h.offsetWidth + 'px';
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

  /* =============================================
     BOOTSTRAP
     ============================================= */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
