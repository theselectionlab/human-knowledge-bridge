/* Human Knowledge Bridge — screens 2 to 5.
   Rendered against the copy in content.js. All child input is written with
   textContent; nothing here builds HTML from a string a child typed. */

(function () {
  'use strict';

  var C = window.HKB_CONTENT;
  var L = window.HKB_LOGIC;

  /* ---- shared helpers ------------------------------------------------- */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function svgIcon(paths, size) {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', String(size || 20));
    svg.setAttribute('height', String(size || 20));
    svg.setAttribute('class', 'icon');
    svg.setAttribute('aria-hidden', 'true');
    paths.forEach(function (d) {
      var p = document.createElementNS(ns, 'path');
      p.setAttribute('d', d);
      p.setAttribute('fill', 'none');
      p.setAttribute('stroke', 'currentColor');
      p.setAttribute('stroke-width', '2');
      p.setAttribute('stroke-linecap', 'round');
      p.setAttribute('stroke-linejoin', 'round');
      svg.appendChild(p);
    });
    return svg;
  }

  /* A source link: publisher page title, opens in a new tab, announced. */
  function sourceLink(id) {
    var src = C.SOURCES[id];
    if (!src) return null;
    var a = el('a', 'source', src.title);
    a.href = src.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    var sr = el('span', 'sr-only', ' (opens in a new tab)');
    a.appendChild(sr);
    return a;
  }

  function fillSourceList(container, ids, options) {
    if (!container) return;
    options = options || {};
    container.textContent = '';
    ids.forEach(function (id, index) {
      if (index > 0) container.appendChild(document.createTextNode(options.separator || ' · '));
      var link = sourceLink(id);
      if (link) container.appendChild(link);
    });
  }

  /* ---- screen 2 ------------------------------------------------------- */

  function renderScreen2(state) {
    var echo = document.getElementById('discovery-echo');
    if (echo) {
      var question = state.firstQuestion;
      var showEcho = state.match === 'moon' && question;
      if (showEcho) {
        if (state.matchReason === 'chosen') {
          echo.textContent = 'You chose the Moon investigation.';
        } else if (L.shouldEcho(question, C.canonicalQuestion)) {
          echo.textContent = 'You asked: \u201C' + question + '\u201D';
        } else {
          showEcho = false;
        }
      }
      echo.hidden = !showEcho;
    }

    var cheese = document.getElementById('cheese-panel');
    if (cheese) cheese.hidden = state.matchReason !== 'cheese';

    var list = document.querySelector('#discovery-sources .source-list');
    fillSourceList(list, ['S1', 'S4', 'S2']);
  }

  /* ---- screen 3 ------------------------------------------------------- */

  function renderScreen3() {
    document.querySelectorAll('#screen-instrument .source-list').forEach(function (node) {
      var ids = (node.getAttribute('data-sources') || '').split(',').filter(Boolean);
      fillSourceList(node, ids);
    });
  }

  /* ---- screen 4 ------------------------------------------------------- */

  var LABEL_ICONS = {
    measurement: ['M4 19h16', 'M7 19V9m4 10V6m4 13v-7m4 7v-10'],
    inference: ['M11 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13z', 'M15.6 15.6 21 21'],
    model: ['M4 18l5-6 4 3 6-8', 'M4 6h6', 'M16 18h4']
  };

  function labelButton(label, claimId) {
    var btn = el('button', 'label-btn label-btn--' + label.id);
    btn.type = 'button';
    btn.setAttribute('data-label', label.id);
    btn.setAttribute('data-claim', claimId);
    btn.setAttribute('aria-pressed', 'false');
    btn.appendChild(svgIcon(LABEL_ICONS[label.id] || []));
    btn.appendChild(el('span', 'label-btn__text', label.text));
    return btn;
  }

  function buildClaimCard(claim, index) {
    var card = el('article', 'claim');
    card.setAttribute('data-claim', claim.id);
    card.appendChild(el('p', 'eyebrow claim__eyebrow', 'Claim ' + (index + 1)));
    var statement = el('p', 'claim__text', claim.text);
    card.appendChild(statement);

    var fieldset = el('fieldset', 'claim__fieldset');
    var legend = el('legend', 'sr-only', 'What kind of knowledge is this? Claim ' + (index + 1) + '.');
    fieldset.appendChild(legend);

    var buttons = el('div', 'label-btns');
    C.LABELS.forEach(function (label) {
      buttons.appendChild(labelButton(label, claim.id));
    });
    fieldset.appendChild(buttons);
    card.appendChild(fieldset);

    var feedback = el('div', 'feedback');
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');
    feedback.setAttribute('data-feedback', claim.id);
    card.appendChild(feedback);

    return card;
  }

  function buildScale() {
    var host = document.getElementById('claims');
    if (!host) return;
    host.textContent = '';
    C.CLAIMS.forEach(function (claim, index) {
      host.appendChild(buildClaimCard(claim, index));
    });
  }

  function updateFeedback(claimId, labelId) {
    var claim = L.claimById(claimId);
    var box = document.querySelector('.feedback[data-feedback="' + claimId + '"]');
    var card = document.querySelector('.claim[data-claim="' + claimId + '"]');
    if (!claim || !box || !card) return;

    box.textContent = '';
    card.classList.remove('is-correct', 'is-hint');

    if (!labelId) return;

    var correct = L.isCorrect(claimId, labelId);
    box.appendChild(svgIcon(correct ? ['M5 12.5 10 17.5 19 6.5'] : ['M6 10a6 6 0 0 1 12 0c0 4-6 3-6 7', 'M12 20.5v.01']));
    var text = el('p', 'feedback__text', L.feedbackFor(claimId, labelId));
    box.appendChild(text);

    if (correct) {
      card.classList.add('is-correct');
      var link = sourceLink(claim.sourceId);
      if (link) {
        var p = el('p', 'feedback__source');
        p.appendChild(document.createTextNode('Source: '));
        p.appendChild(link);
        box.appendChild(p);
      }
    } else {
      card.classList.add('is-hint');
    }
  }

  function countCorrect() {
    var n = 0;
    C.CLAIMS.forEach(function (claim) {
      if (state.answers[claim.id] === claim.correct) n++;
    });
    return n;
  }

  function countSorted() {
    var n = 0;
    C.CLAIMS.forEach(function (claim) {
      if (state.answers[claim.id]) n++;
    });
    return n;
  }

  function renderScaleState(announceIt) {
    C.CLAIMS.forEach(function (claim) {
      var chosen = state.answers[claim.id];
      var buttons = document.querySelectorAll('.claim[data-claim="' + claim.id + '"] .label-btn');
      buttons.forEach(function (btn) {
        btn.setAttribute('aria-pressed', btn.getAttribute('data-label') === chosen ? 'true' : 'false');
      });
      updateFeedback(claim.id, chosen);
    });

    var sorted = document.getElementById('sorted-count');
    if (sorted) {
      var text = C.screen4.progress(countSorted());
      if (sorted.textContent !== text) sorted.textContent = text;
    }

    var summary = document.getElementById('case-summary');
    if (summary) summary.hidden = countCorrect() !== 3;

    if (announceIt) announceOnScreen4(C.screen4.progress(countSorted()));
  }

  function announceOnScreen4(text) {
    var live = document.getElementById('live-region');
    if (!live) return;
    live.textContent = '';
    window.setTimeout(function () { live.textContent = text; }, 30);
  }

  /* ---- screen 5 ------------------------------------------------------- */

  function updateNextCounter() {
    var input = document.getElementById('next-input');
    var counter = document.getElementById('next-count');
    if (!input || !counter) return;
    counter.textContent = input.value.length + ' / ' + C.screen1.maxLength;
    var sr = el('span', 'sr-only', ' characters');
    counter.appendChild(sr);
  }

  /* ---- wiring --------------------------------------------------------- */

  var state = null;

  window.HKB_SCREENS = {
    /* Called by app.js once the state is available and on every route change. */
    attach: function (appState, api) {
      state = appState;
      this.api = api;

      if (!document.querySelector('.claims .claim')) {
        buildScale();
        renderScaleState(false);
      }

      var host = document.getElementById('claims');
      if (host && !host.getAttribute('data-wired')) {
        host.setAttribute('data-wired', '1');
        host.addEventListener('click', function (event) {
          var btn = event.target.closest ? event.target.closest('.label-btn') : null;
          if (!btn) return;
          var claimId = btn.getAttribute('data-claim');
          var labelId = btn.getAttribute('data-label');
          // Re-clicking the pressed label keeps it pressed (no toggle-off).
          if (state.answers[claimId] === labelId) return;
          state.answers[claimId] = labelId;
          api.save();
          renderScaleState(true);
        });
      }

      var reset = document.getElementById('reset-scales');
      if (reset && !reset.getAttribute('data-wired')) {
        reset.setAttribute('data-wired', '1');
        reset.addEventListener('click', function () {
          state.answers.c1 = state.answers.c2 = state.answers.c3 = null;
          api.save();
          renderScaleState(true);
          announceOnScreen4(C.screen4.progress(0));
        });
      }
    },

    /* Route entry point: render whatever this screen needs from state. */
    render: function (screenNumber, appState) {
      state = appState;
      if (screenNumber === 2) renderScreen2(state);
      if (screenNumber === 3) renderScreen3();
      if (screenNumber === 4) renderScaleState(false);
      if (screenNumber === 5) {
        var input = document.getElementById('next-input');
        if (input && !input.value) input.value = state.nextQuestion || '';
        updateNextCounter();
      }
    },

    showNextUnknown: function (question, result, appState) {
      state = appState;
      var panel = document.getElementById('next-unknown');
      var body = document.getElementById('next-unknown-body');
      var echo = document.getElementById('next-unknown-echo');
      if (!panel || !body) return;

      var text = result.reason === 'theia'
        ? 'Theia belongs to a scientific model. This demo shows that model on the Evidence Scales.'
        : 'I don\u2019t have enough verified evidence to answer it yet. This demo has one checked investigation: what the Moon is made of and what\u2019s inside it.';
      body.textContent = '';
      body.appendChild(el('p', null, text));
      body.appendChild(el('p', 'panel__note', 'It has not searched the internet or generated a new scientific answer.'));

      if (echo) {
        echo.textContent = 'You asked: \u201C' + question + '\u201D';
        echo.hidden = false;
      }
      panel.hidden = false;
    },

    hideNextUnknown: function () {
      var panel = document.getElementById('next-unknown');
      if (panel) panel.hidden = true;
    },

    updateNextCounter: updateNextCounter
  };
})();
