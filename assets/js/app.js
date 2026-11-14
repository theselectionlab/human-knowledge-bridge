/* Human Knowledge Bridge — app shell.
   DOM, routing, the progress rail and screen 1. Screens 2–5 are built in
   the next tasks; their routes exist and guard-fail back to screen 1 until
   then. No framework, no build step, no runtime AI. */

(function () {
  'use strict';

  var C = window.HKB_CONTENT;
  var L = window.HKB_LOGIC;
  var STORAGE_KEY = 'hkb.state.v1';

  var el = {
    progress: document.getElementById('progress'),
    railStep: document.getElementById('rail-step'),
    live: document.getElementById('live-region'),
    main: document.getElementById('main')
  };

  var screens = Array.prototype.slice.call(document.querySelectorAll('[data-screen]'));

  var state = loadState();

  /* ---- persistence ---------------------------------------------------- */

  function loadState() {
    try {
      var raw = window.sessionStorage.getItem(STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : null;
      return L.validateState(parsed) ? L.readState(parsed) : L.readState(null);
    } catch (err) {
      return L.readState(null);
    }
  }

  function saveState() {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      /* Private mode or a full quota: the demo still works, it just will not
         remember the tab. Never surface this to the child. */
    }
  }

  /* ---- routing -------------------------------------------------------- */

  function routeInfo(route) {
    for (var i = 0; i < C.routes.length; i++) {
      if (C.routes[i].route === route) return C.routes[i];
    }
    return null;
  }

  function currentRoute() {
    var route = (location.hash || '').replace(/^#/, '');
    return routeInfo(route) ? route : null;
  }

  function sectionExists(screenNumber) {
    return Boolean(screens[screenNumber - 1]);
  }

  /* A route is allowed when the screen it depends on has actually been
     reached. guardOn names the screen whose arrival unlocks this one. */
  function guardFails(info) {
    if (!info || info.screen === 1) return false;
    if (!sectionExists(info.screen)) return true;
    if (info.screen === 2) return state.match !== 'moon';
    return state.visited[info.guardOn] !== true;
  }

  /* The earliest screen the child is allowed to see. Used when a route is
     rejected: send them back to the start of what they have unlocked, never
     forward to the last screen that happens to pass its guard. */
  function earliestValidRoute() {
    var ordered = C.routes;
    for (var i = 0; i < ordered.length; i++) {
      if (!guardFails(ordered[i])) return ordered[i].route;
    }
    return 'question';
  }

  function navigate(route, opts) {
    opts = opts || {};
    var target = '#' + route;
    if (location.hash === target) {
      renderRoute(route);
      return;
    }
    if (opts.replace && history.replaceState) {
      history.replaceState(null, '', target);
      renderRoute(route);
    } else {
      location.hash = route; // triggers hashchange -> renderRoute
    }
  }

  function renderRoute(route) {
    var info = routeInfo(route);

    if (!info) {
      info = routeInfo('question');
    }

    if (guardFails(info)) {
      var earliest = earliestValidRoute();
      announce('Start with your question.');
      navigate(earliest, { replace: true });
      return;
    }

    screens.forEach(function (section) {
      var isCurrent = Number(section.getAttribute('data-screen')) === info.screen;
      section.hidden = !isCurrent;
    });

    state.visited[info.screen] = true;
    saveState();

    if (window.HKB_SCREENS) {
      window.HKB_SCREENS.attach(state, api);
      window.HKB_SCREENS.render(info.screen, state);
    }

    renderRail(info.screen);
    focusScreenHeading(info.screen);
    scrollToTop();

    if (!isInitialRender) announce('Step ' + info.screen + ' of 5: ' + info.label + '.');
    isInitialRender = false;
  }

  var isInitialRender = true;

  function focusScreenHeading(screenNumber) {
    var section = screens[screenNumber - 1];
    if (!section) return;
    var heading = section.querySelector('h1');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }

  function scrollToTop() {
    var reduced = prefersReducedMotion();
    if (window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    }
  }

  function announce(message) {
    if (!el.live) return;
    el.live.textContent = '';
    window.setTimeout(function () { el.live.textContent = message; }, 30);
  }

  /* ---- progress rail -------------------------------------------------- */

  function renderRail(screenNumber) {
    if (!el.progress) return;
    el.progress.innerHTML = '';
    var currentLabel = '';

    C.routes.forEach(function (r) {
      var li = document.createElement('li');
      li.className = 'progress__item';
      li.setAttribute('data-step', String(r.screen));

      var dot = document.createElement('span');
      dot.className = 'progress__dot';
      dot.setAttribute('aria-hidden', 'true');
      li.appendChild(dot);

      var label = document.createElement('span');
      label.className = 'progress__label';
      label.textContent = r.label;
      li.appendChild(label);

      var stateName = r.screen === screenNumber ? 'current'
        : (r.screen < screenNumber ? 'visited' : 'future');
      li.setAttribute('data-state', stateName);

      if (r.screen === screenNumber) {
        li.setAttribute('aria-current', 'step');
        currentLabel = r.label;
      }
      el.progress.appendChild(li);
    });

    if (el.railStep) {
      el.railStep.textContent = 'Step ' + screenNumber + ' of 5';
      var srOnly = el.railStep.querySelector('.sr-only');
      if (!srOnly) {
        srOnly = document.createElement('span');
        srOnly.className = 'sr-only';
        el.railStep.appendChild(srOnly);
      }
      srOnly.textContent = ': ' + currentLabel;
    }
  }

  /* ---- motion preference ---------------------------------------------- */

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function applyMotionPreference() {
    document.documentElement.style.setProperty('--moon-float', prefersReducedMotion() ? '0px' : '3px');
  }

  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    applyMotionPreference();
    if (mq.addEventListener) mq.addEventListener('change', applyMotionPreference);
    else if (mq.addListener) mq.addListener(applyMotionPreference);
  }

  /* ---- screen 1 ------------------------------------------------------- */

  var form = document.getElementById('question-form');
  var input = document.getElementById('question-input');
  var error = document.getElementById('question-error');
  var counter = document.getElementById('question-count');
  var example = document.getElementById('example-chip');
  var unknownPanel = document.getElementById('unknown-panel');
  var unknownBody = document.getElementById('unknown-body');
  var unknownTitle = document.getElementById('unknown-title');
  var unknownEcho = document.getElementById('unknown-echo');
  var unknownRoute = document.getElementById('unknown-route');
  var unknownEdit = document.getElementById('unknown-edit');

  function updateCounter() {
    if (!counter || !input) return;
    counter.textContent = input.value.length + ' / ' + C.screen1.maxLength;
    var sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = ' characters';
    counter.appendChild(sr);
    counter.setAttribute('data-at-limit', input.value.length >= C.screen1.maxLength ? 'true' : 'false');
  }

  function showError(message) {
    if (!error) return;
    error.textContent = message;
    error.hidden = false;
    input.setAttribute('aria-invalid', 'true');
    input.focus();
  }

  function clearError() {
    if (!error) return;
    error.hidden = true;
    error.textContent = '';
    input.removeAttribute('aria-invalid');
  }

  function hideUnknown() {
    if (unknownPanel) unknownPanel.hidden = true;
  }

  function showUnknown(question, result) {
    if (!unknownPanel) return;

    var body = result.reason === 'theia'
      ? 'Theia belongs to a scientific model. This demo shows that model on the Evidence Scales after the Apollo instrument.'
      : 'I don\u2019t have enough verified evidence to answer it yet. This demo has one checked investigation: what the Moon is made of and what\u2019s inside it.';

    if (unknownTitle) unknownTitle.textContent = 'That\u2019s a great question.';
    if (unknownBody) {
      unknownBody.textContent = '';
      var p = document.createElement('p');
      p.textContent = body;
      unknownBody.appendChild(p);
      var note = document.createElement('p');
      note.className = 'panel__note';
      note.textContent = 'This demo does not search the internet or generate a new scientific answer.';
      unknownBody.appendChild(note);
    }
    if (unknownEcho) {
      unknownEcho.textContent = 'You asked: \u201C' + question + '\u201D';
      unknownEcho.hidden = false;
    }

    unknownPanel.hidden = false;
    announce('That is a great question. This demo does not have a verified answer yet.');
  }

  function submitQuestion(raw) {
    var question = L.clampInput(raw, C.screen1.maxLength).trim();

    if (L.isBlank(question)) {
      showError(C.screen1.validation);
      return;
    }

    clearError();
    var result = L.classifyQuestion(question);

    // A new question starts a new investigation: the walk, the answers and
    // the route progress all reset. Carrying the old flags forward let a
    // fresh question skip straight to a later screen.
    var fresh = L.readState(null);
    state.firstQuestion = question;
    state.match = result.intent === 'moon-composition' ? 'moon' : 'unknown';
    state.matchReason = result.reason || (result.variant === 'cheese' ? 'cheese' : '');
    state.answers = fresh.answers;
    state.visited = fresh.visited;
    state.nextQuestion = '';

    if (state.match === 'moon') {
      hideUnknown();
      saveState();
      navigate('discovery');
      return;
    }

    saveState();
    showUnknown(question, result);
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      submitQuestion(input ? input.value : '');
    });
  }

  if (input) {
    input.addEventListener('input', function () {
      updateCounter();
      if (!error.hidden) clearError();
    });
    input.value = state.firstQuestion || '';
    updateCounter();
  }

  if (example) {
    example.addEventListener('click', function () {
      if (!input) return;
      input.value = C.screen1.exampleQuestion;
      updateCounter();
      clearError();
      hideUnknown();
      input.focus();
    });
  }

  if (unknownRoute) {
    unknownRoute.addEventListener('click', function () {
      state.firstQuestion = C.canonicalQuestion;
      state.match = 'moon';
      state.matchReason = 'chosen';
      hideUnknown();
      saveState();
      navigate('discovery');
    });
  }

  if (unknownEdit) {
    unknownEdit.addEventListener('click', function () {
      hideUnknown();
      if (input) input.focus();
    });
  }

  /* ---- shared api for screens.js -------------------------------------- */

  var api = {
    save: saveState,
    navigate: navigate,
    announce: announce,
    /* Diagnostics only: lets the test page inspect the guard decisions. */
    debug: function () {
      return {
        state: JSON.parse(JSON.stringify(state)),
        routes: C.routes.map(function (r) {
          return { route: r.route, screen: r.screen, guardOn: r.guardOn, fails: guardFails(r) };
        }),
        earliest: earliestValidRoute(),
        screensFound: screens.length
      };
    }
  };

  /* ---- navigation buttons (data-action) -------------------------------- */

  document.addEventListener('click', function (event) {
    var target = event.target;
    if (!target || !target.closest) return;

    var go = target.closest('[data-action="go"]');
    if (go) {
      navigate(go.getAttribute('data-to'));
      return;
    }

    var back = target.closest('[data-action="back"]');
    if (back) {
      var from = Number(back.getAttribute('data-from'));
      var ordered = C.routes;
      var prev = ordered[Math.max(0, from - 2)];
      navigate(prev ? prev.route : 'question');
    }
  });

  /* ---- screen 5 ------------------------------------------------------- */

  var nextForm = document.getElementById('next-form');
  var nextInput = document.getElementById('next-input');
  var nextError = document.getElementById('next-error');

  function clearNextError() {
    if (!nextError) return;
    nextError.hidden = true;
    nextError.textContent = '';
    if (nextInput) nextInput.removeAttribute('aria-invalid');
  }

  if (nextInput) {
    nextInput.addEventListener('input', function () {
      if (window.HKB_SCREENS) window.HKB_SCREENS.updateNextCounter();
      if (nextError && !nextError.hidden) clearNextError();
      if (window.HKB_SCREENS) window.HKB_SCREENS.hideNextUnknown();
    });
  }

  if (nextForm) {
    nextForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var raw = L.clampInput(nextInput ? nextInput.value : '', C.screen1.maxLength).trim();

      if (L.isBlank(raw)) {
        if (nextError) {
          nextError.textContent = C.screen1.validation;
          nextError.hidden = false;
        }
        if (nextInput) {
          nextInput.setAttribute('aria-invalid', 'true');
          nextInput.focus();
        }
        return;
      }

      clearNextError();
      var result = L.classifyQuestion(raw);
      state.nextQuestion = raw;
      saveState();

      if (result.intent === 'moon-composition') {
        state.match = 'moon';
        state.matchReason = result.variant === 'cheese' ? 'cheese' : 'standard';
        saveState();
        navigate('discovery');
        return;
      }

      if (window.HKB_SCREENS) window.HKB_SCREENS.showNextUnknown(raw, result, state);
      announce('That is a great question. This demo does not have a verified answer yet.');
    });
  }

  var nextRoute = document.getElementById('next-unknown-route');
  if (nextRoute) {
    nextRoute.addEventListener('click', function () {
      state.match = 'moon';
      state.matchReason = 'chosen';
      saveState();
      if (window.HKB_SCREENS) window.HKB_SCREENS.hideNextUnknown();
      navigate('discovery');
    });
  }

  var nextEdit = document.getElementById('next-unknown-edit');
  if (nextEdit) {
    nextEdit.addEventListener('click', function () {
      if (window.HKB_SCREENS) window.HKB_SCREENS.hideNextUnknown();
      if (nextInput) nextInput.focus();
    });
  }

  var startOver = document.getElementById('start-over');
  if (startOver) {
    startOver.addEventListener('click', function () {
      try { window.sessionStorage.removeItem(STORAGE_KEY); } catch (err) { /* ignore */ }
      state = L.readState(null);
      if (input) {
        input.value = '';
        updateCounter();
      }
      if (nextInput) nextInput.value = '';
      if (window.HKB_SCREENS) {
        window.HKB_SCREENS.hideNextUnknown();
        window.HKB_SCREENS.updateNextCounter();
      }
      hideUnknown();
      clearError();
      navigate('question', { replace: true });
    });
  }

  /* Exposed for the test page and for debugging; the app does not depend on it. */
  window.HKB_APP = api;

  /* ---- boot ----------------------------------------------------------- */

  window.addEventListener('hashchange', function () {
    var route = currentRoute();
    renderRoute(route || earliestValidRoute());
  });

  var initialRoute = currentRoute();
  if (!initialRoute) {
    navigate(earliestValidRoute(), { replace: true });
  } else {
    renderRoute(initialRoute);
  }
})();
