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
      renderChart(evalRequests.length, evalResponses.length);
      renderTable(evalRequests, evalResponses);
    })
    .catch(function (err) {
      console.error('Failed to load data:', err);
      document.getElementById('evaluee-name').textContent = 'Failed to load data';
    });

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
  }

  function renderChart(reqCount, resCount) {
    var container = document.getElementById('chart-container');
    var maxVal = Math.max(reqCount, resCount, 1);
    var barMaxWidth = 320;

    var reqWidth = Math.round((reqCount / maxVal) * barMaxWidth);
    var resWidth = Math.round((resCount / maxVal) * barMaxWidth);

    var html =
      '<div class="bar-chart">' +
        '<div class="bar-chart__row">' +
          '<span class="bar-chart__label">Requests</span>' +
          '<div class="bar-chart__track">' +
            '<div class="bar-chart__bar bar-chart__bar--requests" style="width:' + reqWidth + 'px"></div>' +
          '</div>' +
          '<span class="bar-chart__value">' + reqCount + '</span>' +
        '</div>' +
        '<div class="bar-chart__row">' +
          '<span class="bar-chart__label">Responses</span>' +
          '<div class="bar-chart__track">' +
            '<div class="bar-chart__bar bar-chart__bar--responses" style="width:' + resWidth + 'px"></div>' +
          '</div>' +
          '<span class="bar-chart__value">' + resCount + '</span>' +
        '</div>' +
      '</div>';

    container.innerHTML = html;
  }

  function renderTable(evalRequests, evalResponses) {
    var tbody = document.getElementById('feedback-tbody');
    var countEl = document.getElementById('feedback-count');

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
      rows.push({
        provider: req.request_made_to,
        request_date: req.request_date,
        response_date: res ? res.response_date : '',
        requested_by: req.requester_name + ' (' + req.request_made_by + ')',
        shared: req.shared_with_manager,
        topic: res ? res.topic : '',
        status: req.request_status,
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
        response: res
      });
    });

    var total = rows.length;
    countEl.textContent = total + (total === 1 ? ' record' : ' records');

    if (total === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No feedback data for this evaluee</td></tr>';
      return;
    }

    var html = '';
    rows.forEach(function (row, idx) {
      var statusClass = '';
      switch (row.status) {
        case 'Responded': statusClass = 'status-tag--responded'; break;
        case 'Pending':   statusClass = 'status-tag--pending'; break;
        case 'Declined':  statusClass = 'status-tag--declined'; break;
      }

      var providerCell;
      if (row.response) {
        providerCell = '<button class="provider-link" data-row-idx="' + idx + '">' + escapeHtml(row.provider) + '</button>';
      } else {
        providerCell = escapeHtml(row.provider);
      }

      html += '<tr>' +
        '<td>' + providerCell + '</td>' +
        '<td>' + escapeHtml(row.request_date) + '</td>' +
        '<td>' + escapeHtml(row.response_date) + '</td>' +
        '<td>' + escapeHtml(row.requested_by) + '</td>' +
        '<td>' + escapeHtml(row.shared) + '</td>' +
        '<td>' + escapeHtml(row.topic) + '</td>' +
        '<td><span class="status-tag ' + statusClass + '">' + escapeHtml(row.status) + '</span></td>' +
        '</tr>';
    });

    tbody.innerHTML = html;

    tbody.addEventListener('click', function (e) {
      var btn = e.target.closest('.provider-link');
      if (!btn) return;
      var idx = parseInt(btn.getAttribute('data-row-idx'));
      var row = rows[idx];
      if (row && row.response) {
        showResponseDetail(row);
      }
    });
  }

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

    pairs.forEach(function (pair, i) {
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

  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
})();
