(function () {
  'use strict';

  var params = new URLSearchParams(window.location.search);
  var fmno = params.get('fmno');

  if (!fmno) {
    document.getElementById('evaluee-name').textContent = 'No FMNO provided';
    return;
  }

  Promise.all([
    fetch('/api/profiles').then(function (r) { return r.json(); }),
    fetch('/api/requests').then(function (r) { return r.json(); }),
    fetch('/api/responses').then(function (r) { return r.json(); })
  ])
    .then(function (results) {
      var profiles = results[0];
      var allRequests = results[1];
      var allResponses = results[2];

      var profile = profiles.find(function (p) { return p.fmno === fmno; });
      var evalRequests = allRequests.filter(function (r) { return r.fmno === fmno; });
      var evalResponses = allResponses.filter(function (r) { return r.fmno === fmno; });

      renderHeader(profile, profiles);
      renderKPIs(evalRequests, evalResponses);
      renderCharts(evalRequests, evalResponses);
      var rows = buildRows(evalRequests, evalResponses);
      renderSortedTable(rows);
      bindSortEvents(rows);
      bindExport(rows, profile);
    })
    .catch(function (err) {
      console.error('Failed to load data:', err);
      document.getElementById('evaluee-name').textContent = 'Failed to load data';
    });

  /* =============================================
     UTILITIES
     ============================================= */
  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function daysBetween(dateA, dateB) {
    if (!dateA || !dateB) return null;
    var a = new Date(dateA);
    var b = new Date(dateB);
    if (isNaN(a) || isNaN(b)) return null;
    return Math.round(Math.abs(b - a) / 86400000);
  }

  function countByField(list, field) {
    var counts = {};
    list.forEach(function (item) {
      var val = item[field] || 'Unknown';
      counts[val] = (counts[val] || 0) + 1;
    });
    return counts;
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
     HEADER
     ============================================= */
  function renderHeader(profile, profiles) {
    if (!profile) {
      document.getElementById('evaluee-name').textContent = 'Unknown evaluee (' + fmno + ')';
      return;
    }

    document.title = profile.full_name + ' - PC Manager Dashboard';
    document.getElementById('evaluee-name').textContent = profile.full_name;

    var meta = 'FMNO ' + profile.fmno;
    if (profile.manager_fmno) {
      var mgr = profiles.find(function (p) { return p.fmno === profile.manager_fmno; });
      meta += '  |  Manager: ' + profile.manager_fmno;
      if (mgr) meta += ' (' + mgr.full_name + ')';
    }
    if (profile.manager_delegate_fmno) {
      var md = profiles.find(function (p) { return p.fmno === profile.manager_delegate_fmno; });
      meta += '  |  MD: ' + profile.manager_delegate_fmno;
      if (md) meta += ' (' + md.full_name + ')';
    }
    document.getElementById('evaluee-meta').textContent = meta;

    var tagsHtml = '';
    if (profile.impact_level) {
      var impactClass = profile.impact_level.toLowerCase();
      tagsHtml += '<span class="impact-tag impact-tag--' + impactClass + '"><span class="impact-tag__dot"></span>' + escapeHtml(profile.impact_level) + '</span>';
    }
    if (profile.region) {
      tagsHtml += '<span class="region-tag">' + escapeHtml(profile.region) + '</span>';
    }
    if (profile.path) {
      tagsHtml += '<span class="path-tag">' + escapeHtml(profile.path) + '</span>';
    }
    document.getElementById('evaluee-tags').innerHTML = tagsHtml;
  }

  /* =============================================
     KPI CARDS
     ============================================= */
  function renderKPIs(evalRequests, evalResponses) {
    var totalReq = evalRequests.length;
    var totalRes = evalResponses.length;
    var rate = totalReq > 0 ? Math.round((totalRes / totalReq) * 100) : 0;

    var turnaroundDays = [];
    evalRequests.forEach(function (req) {
      var res = evalResponses.find(function (r) { return r.request_id === req.request_id; });
      if (res) {
        var days = daysBetween(req.request_date, res.response_date);
        if (days !== null) turnaroundDays.push(days);
      }
    });

    var avgTurnaround = turnaroundDays.length > 0
      ? Math.round(turnaroundDays.reduce(function (a, b) { return a + b; }, 0) / turnaroundDays.length)
      : null;

    document.getElementById('dkpi-requests').textContent = totalReq;
    document.getElementById('dkpi-responses').textContent = totalRes;
    document.getElementById('dkpi-rate').textContent = rate + '%';
    document.getElementById('dkpi-turnaround').textContent = avgTurnaround !== null ? avgTurnaround + 'd' : 'N/A';
  }

  /* =============================================
     CHARTS
     ============================================= */
  function renderCharts(evalRequests, evalResponses) {
    renderStatusDonut(evalRequests);
    renderOriginChart(evalRequests);
    renderSharedChart(evalRequests);
  }

  function renderStatusDonut(evalRequests) {
    var container = document.getElementById('detail-chart-status');
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

    container.innerHTML = '<div class="donut-chart">' + buildDonutSVG(colors, total, 120) +
      '<div class="donut-chart__legend">' + colors.map(function (c) {
        return '<div class="donut-chart__legend-item">' +
          '<span class="donut-chart__legend-dot" style="background:' + c.color + '"></span>' +
          '<span>' + c.label + '</span>' +
          '<span class="donut-chart__legend-count">' + c.count + '</span></div>';
      }).join('') + '</div></div>';
  }

  function renderOriginChart(evalRequests) {
    var container = document.getElementById('detail-chart-origin');
    var counts = countByField(evalRequests, 'request_made_by');
    var data = Object.keys(counts).sort().map(function (k) {
      return { label: k, value: counts[k] };
    });

    if (data.length === 0) {
      container.innerHTML = '<p class="empty-state">No data</p>';
      return;
    }

    var total = data.reduce(function (s, d) { return s + d.value; }, 0);
    var colors = [
      { label: 'Subject', count: counts['Subject'] || 0, color: '#2251FF' },
      { label: 'Manager', count: counts['Manager'] || 0, color: '#377297' }
    ].filter(function (c) { return c.count > 0; });

    container.innerHTML = '<div class="donut-chart">' + buildDonutSVG(colors, total, 120) +
      '<div class="donut-chart__legend">' + colors.map(function (c) {
        return '<div class="donut-chart__legend-item">' +
          '<span class="donut-chart__legend-dot" style="background:' + c.color + '"></span>' +
          '<span>' + c.label + '</span>' +
          '<span class="donut-chart__legend-count">' + c.count + '</span></div>';
      }).join('') + '</div></div>';
  }

  function renderSharedChart(evalRequests) {
    var container = document.getElementById('detail-chart-shared');
    var yesCount = 0, noCount = 0;
    evalRequests.forEach(function (r) {
      if (r.shared_with_manager === 'Yes') yesCount++;
      else noCount++;
    });
    var total = yesCount + noCount;

    if (total === 0) {
      container.innerHTML = '<p class="empty-state">No data</p>';
      return;
    }

    var colors = [
      { label: 'Shared', count: yesCount, color: '#2EBBA5' },
      { label: 'Not Shared', count: noCount, color: '#B3B3B3' }
    ];

    container.innerHTML = '<div class="donut-chart">' + buildDonutSVG(colors, total, 120) +
      '<div class="donut-chart__legend">' + colors.map(function (c) {
        return '<div class="donut-chart__legend-item">' +
          '<span class="donut-chart__legend-dot" style="background:' + c.color + '"></span>' +
          '<span>' + c.label + '</span>' +
          '<span class="donut-chart__legend-count">' + c.count + '</span></div>';
      }).join('') + '</div></div>';
  }

  /* =============================================
     SVG DONUT BUILDER
     ============================================= */
  function buildDonutSVG(segments, total, size) {
    var cx = size / 2, cy = size / 2, r = (size / 2) - 8, strokeWidth = 18;
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
      'font-family="McKinsey Sans,sans-serif" font-weight="500" font-size="18" fill="#333">' + total + '</text>' +
      '</svg>';
  }

  /* =============================================
     HORIZONTAL BAR CHART BUILDER
     ============================================= */
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
     SORT STATE (default: provider ascending)
     ============================================= */
  var currentSort = { key: 'provider', dir: 'asc' };

  /* =============================================
     BUILD ROWS (data only)
     ============================================= */
  function buildRows(evalRequests, evalResponses) {
    var responseByReqId = {};
    var directResponses = [];
    evalResponses.forEach(function (res) {
      if (res.request_id) {
        responseByReqId[res.request_id] = res;
      } else {
        directResponses.push(res);
      }
    });

    var rows = [];

    evalRequests.forEach(function (req) {
      var res = responseByReqId[req.request_id] || null;
      var turnaround = res ? daysBetween(req.request_date, res.response_date) : null;
      var completeness = res ? answerCompleteness(res) : null;

      rows.push({
        provider: req.request_made_to,
        request_date: req.request_date,
        response_date: res ? res.response_date : '',
        requested_by: req.requester_name + ' (' + req.request_made_by + ')',
        shared: req.shared_with_manager,
        topic: res ? res.topic : '',
        status: req.request_status,
        turnaround: turnaround,
        completeness: completeness,
        completeness_sort: completeness ? completeness.answered / (completeness.total || 1) : -1,
        response: res
      });
    });

    directResponses.forEach(function (res) {
      rows.push({
        provider: 'Direct feedback',
        request_date: '',
        response_date: res.response_date,
        requested_by: '',
        shared: '',
        topic: res.topic,
        status: 'Responded',
        turnaround: null,
        completeness: answerCompleteness(res),
        completeness_sort: answerCompleteness(res) ? answerCompleteness(res).answered / (answerCompleteness(res).total || 1) : -1,
        response: res
      });
    });

    return rows;
  }

  /* =============================================
     RENDER SORTED TABLE
     ============================================= */
  function renderSortedTable(rows) {
    var tbody = document.getElementById('feedback-tbody');
    var countEl = document.getElementById('feedback-count');

    var total = rows.length;
    countEl.textContent = total + (total === 1 ? ' record' : ' records');

    if (total === 0) {
      tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No feedback data for this evaluee</td></tr>';
      return;
    }

    var sorted = rows.slice();
    if (currentSort.key) {
      sorted.sort(function (a, b) {
        var valA = a[currentSort.key];
        var valB = b[currentSort.key];

        if (valA === null || valA === undefined) valA = '';
        if (valB === null || valB === undefined) valB = '';

        if (typeof valA === 'number' && typeof valB === 'number') {
          return currentSort.dir === 'asc' ? valA - valB : valB - valA;
        }

        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
        if (valA < valB) return currentSort.dir === 'asc' ? -1 : 1;
        if (valA > valB) return currentSort.dir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    var html = '';
    sorted.forEach(function (row) {
      var statusClass = '';
      switch (row.status) {
        case 'Responded': statusClass = 'status-tag--responded'; break;
        case 'Pending':   statusClass = 'status-tag--pending'; break;
        case 'Declined':  statusClass = 'status-tag--declined'; break;
      }

      var origIdx = rows.indexOf(row);
      var providerCell;
      if (row.response) {
        providerCell = '<button class="provider-link" data-row-idx="' + origIdx + '">' + escapeHtml(row.provider) + '</button>';
      } else {
        providerCell = escapeHtml(row.provider);
      }

      var turnaroundCell = row.turnaround !== null ? row.turnaround + 'd' : '-';

      var compCell = '';
      if (row.completeness !== null) {
        var compClass = 'completeness-badge--';
        if (row.completeness.answered === row.completeness.total) compClass += 'full';
        else if (row.completeness.answered > 0) compClass += 'partial';
        else compClass += 'empty';
        compCell = '<span class="completeness-badge ' + compClass + '">' +
          row.completeness.answered + '/' + row.completeness.total + '</span>';
      } else {
        compCell = '-';
      }

      html += '<tr>' +
        '<td>' + providerCell + '</td>' +
        '<td>' + escapeHtml(row.request_date) + '</td>' +
        '<td>' + escapeHtml(row.response_date) + '</td>' +
        '<td>' + escapeHtml(row.requested_by) + '</td>' +
        '<td>' + escapeHtml(row.shared) + '</td>' +
        '<td>' + escapeHtml(row.topic) + '</td>' +
        '<td>' + turnaroundCell + '</td>' +
        '<td>' + compCell + '</td>' +
        '<td><span class="status-tag ' + statusClass + '">' + escapeHtml(row.status) + '</span></td>' +
        '</tr>';
    });

    tbody.innerHTML = html;

    updateSortIndicators();
  }

  /* =============================================
     SORT EVENTS & INDICATORS
     ============================================= */
  function bindSortEvents(rows) {
    var thead = document.querySelector('#feedback-table thead');
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
      renderSortedTable(rows);
    });

    var tbodyEl = document.getElementById('feedback-tbody');
    tbodyEl.addEventListener('click', function (e) {
      var btn = e.target.closest('.provider-link');
      if (!btn) return;
      var idx = parseInt(btn.getAttribute('data-row-idx'));
      var row = rows[idx];
      if (row && row.response) {
        showResponseDetail(row);
      }
    });

    updateSortIndicators();
  }

  function updateSortIndicators() {
    var ths = document.querySelectorAll('#feedback-table thead th[data-sort]');
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
     ANSWER COMPLETENESS
     ============================================= */
  function answerCompleteness(res) {
    var total = 0;
    var answered = 0;
    var pairs = [
      { q: res.question_1, a: res.answer_1 },
      { q: res.question_2, a: res.answer_2 },
      { q: res.question_3, a: res.answer_3 }
    ];
    pairs.forEach(function (p) {
      if (p.q) {
        total++;
        if (p.a && p.a.trim()) answered++;
      }
    });
    return { answered: answered, total: total };
  }

  /* =============================================
     RESPONSE DETAIL PANEL
     ============================================= */
  function showResponseDetail(row) {
    var panel = document.getElementById('response-detail');
    var res = row.response;

    document.getElementById('detail-provider').textContent = row.provider;
    document.getElementById('detail-date').textContent = res.response_date || '';
    document.getElementById('detail-topic').textContent = res.topic || '';

    var qaContainer = document.getElementById('detail-qa');
    var qaHtml = '';

    var pairs = [
      { q: res.question_1, a: res.answer_1 },
      { q: res.question_2, a: res.answer_2 },
      { q: res.question_3, a: res.answer_3 }
    ];

    pairs.forEach(function (pair) {
      if (!pair.q) return;
      qaHtml += '<div class="qa-block">' +
        '<h4 class="qa-block__question">' + escapeHtml(pair.q) + '</h4>' +
        '<p class="qa-block__answer">' + (pair.a ? escapeHtml(pair.a) : '<em class="qa-block__empty">No answer provided</em>') + '</p>' +
        '</div>';
    });

    qaContainer.innerHTML = qaHtml;
    panel.removeAttribute('hidden');
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* =============================================
     EXPORT CSV
     ============================================= */
  function bindExport(rows, profile) {
    var btn = document.getElementById('btn-export-detail');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (!rows || !rows.length) return;
      var name = profile ? profile.full_name : fmno;
      var headers = ['Provider', 'Request Date', 'Response Date', 'Requested By', 'Shared', 'Topic', 'Turnaround (days)', 'Completeness', 'Status'];
      var csvRows = rows.map(function (r) {
        var compStr = r.completeness ? r.completeness.answered + '/' + r.completeness.total : '';
        return [
          r.provider, r.request_date, r.response_date, r.requested_by,
          r.shared, r.topic,
          r.turnaround !== null ? r.turnaround : '',
          compStr, r.status
        ].map(function (v) { return '"' + String(v || '').replace(/"/g, '""') + '"'; }).join(',');
      });
      var csv = headers.join(',') + '\n' + csvRows.join('\n');
      downloadFile(name + '_feedback.csv', csv, 'text/csv');
    });
  }
})();
