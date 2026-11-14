/* Human Knowledge Bridge — browser test runner.
   Open tests/tests.html. No npm, no framework. Tests the pure logic in
   assets/js/logic.js against the locked 89-case matcher fixture and the
   content contract (test-plan §3.1–3.2). */

'use strict';
(function () {
  var L = window.HKB_LOGIC;
  var C = window.HKB_CONTENT;

  var results = [];
  function eq(name, actual, expected, note) {
    var pass = JSON.stringify(actual) === JSON.stringify(expected);
    results.push({ name: name, pass: pass, actual: actual, expected: expected, note: note || '' });
  }
  function ok(name, cond, note) {
    results.push({ name: name, pass: !!cond, actual: !!cond, expected: true, note: note || '' });
  }

  // ---------- 1. MATCHER ----------
  // [input, expectedIntent, expectedReasonOrVariant]
    var MATCH_CASES = [
    // 1A core
    ['What is the Moon made of?',                              'moon-composition', 'standard'],
    ["what's the moon made of",                                'moon-composition', 'standard'],
    ['What is the Moon composed of?',                          'moon-composition', 'standard'],
    ['What is inside the Moon?',                               'moon-composition', 'standard'],
    ['Does the Moon have a core?',                             'moon-composition', 'standard'],
    ["What are the Moon's layers?",                            'moon-composition', 'standard'],
    ['Is the Moon made of cheese?',                            'moon-composition', 'cheese'],
    ["What is the Moon's crust made of?",                      'moon-composition', 'standard'],
    ['What is the moon made out of',                           'moon-composition', 'standard'],
    ['Can you tell me what the Moon is made of',               'moon-composition', 'standard'],
    ['What is the Moon made of? Please',                       'moon-composition', 'standard'],
    ['moon cheese',                                            'moon-composition', 'cheese'],
    ['What is the Moon made of in Spanish?',                   'moon-composition', 'standard'],
    // 1B normalization
    ['   WHAT  IS   the   MOON   MADE   OF   ',                'moon-composition', 'standard'],
    ['\u201CWhat is the moon made of?\u201D',                  'moon-composition', 'standard'],
    ['What is the moon\u2019s interior made of',               'moon-composition', 'standard'],
    ['What is the Moon made of?!',                             'moon-composition', 'standard'],
    ['WHAT IS THE MOON MADE OF',                               'moon-composition', 'standard'],
    ['what is the moon made of \uD83C\uDF19',                  'moon-composition', 'standard'],
    ['What is the Moon made of \uD83E\uDDC0',                  'moon-composition', 'standard'],
    ['What is the Moon made of \u2014 really?',                'moon-composition', 'standard'],
    // 1C off-topic Moon
    ['How far away is the Moon?',                              'unknown', 'moon-other'],
    ['How far is the Moon from Earth',                         'unknown', 'moon-other'],
    ['Why does the Moon shine?',                               'unknown', 'moon-other'],
    ['How does the moon shine at night',                       'unknown', 'moon-other'],
    ['Tell me about the Moon landing',                         'unknown', 'moon-other'],
    ['Is the moon landing real',                               'unknown', 'moon-other'],
    ['How big is the Moon',                                    'unknown', 'moon-other'],
    ['Moon',                                                   'unknown', 'moon-other'],
    ['MOON',                                                   'unknown', 'moon-other'],
    ['MoOn',                                                   'unknown', 'moon-other'],
    ['What is the Moon?',                                      'unknown', 'moon-other'],
    ['Why does the Moon have craters',                         'unknown', 'moon-other'],
    ['Is the moon covered in craters',                         'unknown', 'moon-other'],
    ['How old is the Moon',                                    'unknown', 'moon-other'],
    ['how old is the rock on the Moon',                        'unknown', 'moon-other'], // over-block is CORRECT
    ['How long is a day inside a crater on the Moon?',         'unknown', 'moon-other'], // inside must not win
    ['Why do we see phases of the Moon',                       'unknown', 'moon-other'],
    ['Does the Moon have gravity',                             'unknown', 'moon-other'],
    ['does the moon have water',                               'unknown', 'moon-other'],
    ['Why is the far side of the Moon different',              'unknown', 'moon-other'],
    ['What did Apollo 11 leave on the Moon',                   'unknown', 'moon-other'],
    ['how did the Moon form',                                  'unknown', 'moon-other'],
    ['Why is the Moon made of craters',                        'unknown', 'moon-other'], // G2
    ['Is the Moon a planet or a star',                         'unknown', 'moon-other'],
    ['does the moon have an atmosphere',                       'unknown', 'moon-other'],
    // 1D not-moon
    ['What is the Sun made of?',                               'unknown', 'not-moon'],
    ['What is the Sun made of',                                'unknown', 'not-moon'],
    ['Is the sun made of rock',                                'unknown', 'not-moon'],
    ['What is a Mars rover?',                                  'unknown', 'not-moon'],
    ['How do volcanoes work?',                                 'unknown', 'not-moon'],
    ['What is an inner planet',                                'unknown', 'not-moon'],
    ['what is inside a spoon',                                 'unknown', 'not-moon'],   // homograph
    ['spoon',                                                  'unknown', 'not-moon'],
    ['how many moons does Earth have',                         'unknown', 'not-moon'],
    ['what is a moon',                                         'unknown', 'moon-other'],
    // 1E theia
    ['Who is Theia?',                                          'unknown', 'theia'],
    ['What is Theia made of?',                                 'unknown', 'theia'],
    ['giant impact theory',                                    'unknown', 'theia'],
    ['did theia make the moon',                                'unknown', 'theia'],
    ['Theia',                                                  'unknown', 'theia'],
    ['What is a giant impact',                                 'unknown', 'theia'],
    // 1F empty + injection
    ['',                                                       'empty', null],
    ['   ',                                                    'empty', null],
    ['\t\n  \n',                                               'empty', null],
    ['<script>alert(1)</script>',                              'unknown', 'not-moon'],
    ['<img src=x onerror=alert(1)>',                           'unknown', 'not-moon'],
    ['\"><svg onload=alert(1)>',                               'unknown', 'not-moon'],
    ['What is the Moon made of? <script>alert(1)</script>',    'moon-composition', 'standard'],
    // 1G length
    ['A'.repeat(240),                                          'unknown', null],       // assert intent only
    // 1H other languages
    ['\u00BFDe qu\u00E9 est\u00E1 hecha la Luna?',             'unknown', 'not-moon'],
    ['\u00BFDe qu\u00E9 est\u00E1 hecha la luna?',             'unknown', 'not-moon'],
    ['La Lune est faite de quoi',                              'unknown', 'not-moon'],
    ['\u6708\u7403\u662F\u7531\u4EC0\u4E48\u7EC4\u6210\u7684','unknown', 'not-moon'],
    // 1A high-value extras
    ['What makes up the Moon',                                 'moon-composition', 'standard'], // G1
    ["What is the Moon's interior like",                       'moon-composition', 'standard'], // G1
    ['What is the Moon made of and how far away is it?',       'unknown', 'moon-other'],
    ['How big is the Moon and what is it made of?',            'unknown', 'moon-other'],
    ['When was the Moon made?',                                'unknown', 'moon-other'], // G3
    ['Is the Moon made of rock?',                              'moon-composition', 'standard'],
    ["What is the moon's surface made of",                     'moon-composition', 'standard'],
    ['how many layers does the moon have',                     'moon-composition', 'standard'],
    ["Is the Moon's mantle made of rock",                      'moon-composition', 'standard'],
    ['Does the Moon have a solid core?',                       'moon-composition', 'standard'],
    ['Is the moon hot inside',                                 'moon-composition', 'standard'],
    ['The moon is made of cheese',                             'moon-composition', 'cheese'],
    ['does the moon have a layer of cheese',                   'moon-composition', 'cheese'],
    ['Is the moon made of cheese or rock',                     'moon-composition', 'cheese'],
    // TYPED variant of the 240-char limit (maxlength truncates):
    ['What is the Moon made of? '.repeat(10).trim().slice(0, 240), 'moon-composition', 'standard'],
  ];

  MATCH_CASES.forEach(function (c) {
    var input = c[0], wantIntent = c[1], wantDetail = c[2];
    var r = L.classifyQuestion(input);
    var label = 'classify: ' + JSON.stringify(input.slice(0, 60));
    eq(label + ' #intent', r.intent, wantIntent);
    if (wantDetail === 'standard' || wantDetail === 'cheese') {
      eq(label + ' #variant', r.variant, wantDetail);
    } else if (wantDetail) {
      eq(label + ' #reason', r.reason, wantDetail);
      ok(label + ' #noOfferMoonRoute', wantDetail === 'theia' ? r.offerMoonRoute === true : r.offerMoonRoute !== true, 'only Theia offers a route');
    }
    if (input.indexOf('<') !== -1 || input.indexOf('>') !== -1) {
      ok(label + ' #hasNoTemplateInjection', String(r.intent).indexOf('<') === -1);
    }
  });

  eq('MATCH_CASES has 89 cases', MATCH_CASES.length, 89);
  eq('theia offers Moon route', L.classifyQuestion('Who is Theia?').offerMoonRoute, true);
  ok('empty has no variant', L.classifyQuestion('   ').variant === undefined);

  ['How far away is the Moon?', 'What is the Sun made of?', 'Moon', 'What is a Mars rover?']
    .forEach(function (q) {
      eq('gate: not answered -> ' + q, L.classifyQuestion(q).intent !== 'moon-composition', true);
    });

  // ---------- 2. normalize() ----------
  eq('normalize: case',         L.normalize('WHAT IS THE MOON'), 'what is the moon');
  eq('normalize: curly apos',   L.normalize('the moon\u2019s core'), 'the moon s core');
  eq('normalize: curly quotes', L.normalize('\u201Cthe moon\u201D'), 'the moon');
  eq('normalize: punctuation',  L.normalize('What is the Moon?!'), 'what is the moon');
  eq('normalize: whitespace',   L.normalize('  a   b  '), 'a b');
  eq('normalize: NFKC',         L.normalize('\uFB01ne'), 'fine');
  eq('normalize: null',         L.normalize(null), '');
  eq('normalize: undefined',    L.normalize(undefined), '');
  eq('normalize: number',       L.normalize(42), '42');

  // ---------- 3. CLAIMS / LABELS ----------
  eq('CLAIMS count is 3', C.CLAIMS.length, 3);
  eq('LABELS count is 3', C.LABELS.length, 3);
  eq('label ids', C.LABELS.map(function (l) { return l.id; }).sort(),
                 ['inference', 'measurement', 'model'].sort());
  C.CLAIMS.forEach(function (claim) {
    var tag = 'claim ' + claim.id;
    ok(tag + ': has id', typeof claim.id === 'string' && claim.id.length > 0);
    ok(tag + ': has text', typeof claim.text === 'string' && claim.text.length > 0);
    ok(tag + ': has feedbackCorrect', typeof claim.feedbackCorrect === 'string' && claim.feedbackCorrect.length > 0);
    ok(tag + ': has feedbackTryAgain', typeof claim.feedbackTryAgain === 'string' && claim.feedbackTryAgain.length > 0);
    ok(tag + ': correct label is valid', ['measurement', 'inference', 'model'].indexOf(claim.correct) !== -1);
    ok(tag + ': sourceId exists in SOURCES', !!C.SOURCES[claim.sourceId]);
  });
  eq('no duplicate claim ids', uniqueCount(C.CLAIMS.map(function (c) { return c.id; })), C.CLAIMS.length);
  eq('c1 correct = measurement', C.CLAIMS[0].correct, 'measurement');
  eq('c2 correct = inference',   C.CLAIMS[1].correct, 'inference');
  eq('c3 correct = model',       C.CLAIMS[2].correct, 'model');

  // ---------- 4. SOURCES ----------
  var ids = Object.keys(C.SOURCES);
  ok('SOURCES is non-empty', ids.length > 0);
  eq('SOURCES ids unique', uniqueCount(ids), ids.length);
  ok('claim sourceIds all resolve', C.CLAIMS.every(function (c) { return !!C.SOURCES[c.sourceId]; }));
  ids.forEach(function (id) {
    var s = C.SOURCES[id];
    ok('source ' + id + ': https URL', /^https:\/\//.test(s.url || ''), s.url);
    ok('source ' + id + ': title', typeof s.title === 'string' && s.title.length > 0);
    ok('source ' + id + ': publisher', typeof s.publisher === 'string' && s.publisher.length > 0);
    ok('source ' + id + ': supports', typeof s.supports === 'string' && s.supports.length > 0);
    ok('source ' + id + ': type', typeof s.type === 'string' && s.type.length > 0);
    ok('source ' + id + ': accessed date', /^\d{4}-\d{2}-\d{2}$/.test(s.accessed || ''), s.accessed);
    ok('source ' + id + ': accessed not in the future', new Date(s.accessed) <= new Date('2026-11-16T23:59:59Z'));
    ok('source ' + id + ': no placeholder', !/TODO|TBD|example\.com|xxx/.test(s.url + s.title));
  });

  // ---------- 5. isCorrect() ----------
  C.CLAIMS.forEach(function (claim) {
    ['measurement', 'inference', 'model'].forEach(function (labelId) {
      eq('isCorrect(' + claim.id + ',' + labelId + ')', L.isCorrect(claim.id, labelId), claim.correct === labelId);
    });
  });

  // ---------- 6. feedbackFor() ----------
  C.CLAIMS.forEach(function (claim) {
    ['measurement', 'inference', 'model'].forEach(function (labelId) {
      var f = L.feedbackFor(claim.id, labelId);
      ok('feedbackFor(' + claim.id + ',' + labelId + ') non-empty string', typeof f === 'string' && f.trim().length > 0);
      ok('feedbackFor(' + claim.id + ',' + labelId + ') not a placeholder', !/TODO|TBD|lorem/i.test(f || ''));
    });
  });
  var wrongFb = L.feedbackFor(C.CLAIMS[0].id, 'model');
  ok('wrong feedback is a hint (no score language)', !/\b(wrong!|incorrect|you failed|0\/|\d+%)/i.test(wrongFb), wrongFb);
  ok('right feedback is specific', L.feedbackFor(C.CLAIMS[0].id, 'measurement').length > 20);

  // ---------- 7. validateState() ----------
  var goodState = {
    version: 1, screen: 2, firstQuestion: 'What is the Moon made of?', nextQuestion: '',
    match: 'moon', matchReason: 'moon-composition',
    answers: { c1: 'measurement', c2: null, c3: null },
    visited: { 1: true, 2: true, 3: false, 4: false, 5: false }
  };
  ok('validateState accepts a valid state', L.validateState(JSON.parse(JSON.stringify(goodState))) !== false);
  function badState(mut) { var s = JSON.parse(JSON.stringify(goodState)); mut(s); return s; }
  eq('rejects wrong version',    L.validateState(badState(function (s) { s.version = 99; })), false);
  eq('rejects bad screen 0',     L.validateState(badState(function (s) { s.screen = 0; })), false);
  eq('rejects bad screen 6',     L.validateState(badState(function (s) { s.screen = 6; })), false);
  eq('rejects non-numeric screen', L.validateState(badState(function (s) { s.screen = '2'; })), false);
  eq('rejects bad answer value', L.validateState(badState(function (s) { s.answers.c1 = 'guess'; })), false);
  eq('rejects unknown claim key', L.validateState(badState(function (s) { s.answers.c9 = 'model'; })), false);
  eq('rejects bad match',        L.validateState(badState(function (s) { s.match = 'maybe'; })), false);
  eq('rejects non-object',       L.validateState('nope'), false);
  eq('rejects null',             L.validateState(null), false);
  ok('rejects prototype-polluted answers',
     L.validateState(JSON.parse('{"version":1,"screen":1,"firstQuestion":"","nextQuestion":"","matchReason":"","match":null,"answers":{"__proto__":{"x":1}},"visited":{}}')) === false);

  // ---------- 8. readState() guards ----------
  var restored = L.readState({ version: 1, firstQuestion: 'hi', match: 'bogus', answers: { c1: 'guess' } });
  eq('readState rejects bad match', restored.match, null);
  eq('readState rejects bad answer', restored.answers.c1, null);
  eq('readState clamps long question', L.readState({ version: 1, firstQuestion: 'x'.repeat(500) }).firstQuestion.length, 240);

  // ---------- 8b. readState() enforces the reachability chain ----------
  // Regression: a stored state with screen 4/5 visited but screen 3 not
  // reached let a guard jump from screen 2 straight to screen 4.
  var skipState = L.readState({
    version: 1, firstQuestion: 'What is the Moon made of?', nextQuestion: '',
    match: 'moon', matchReason: '',
    answers: { c1: null, c2: null, c3: null },
    visited: { 1: true, 2: true, 3: false, 4: true, 5: true }
  });
  eq('readState drops unreachable screen 4', skipState.visited[4], false);
  eq('readState drops unreachable screen 5', skipState.visited[5], false);
  eq('readState keeps reachable screen 2', skipState.visited[2], true);

  var noMatch = L.readState({ version: 1, match: null, visited: { 2: true, 3: true } });
  eq('readState drops screen 2 without a Moon match', noMatch.visited[2], false);
  eq('readState drops screen 3 without a Moon match', noMatch.visited[3], false);

  var chain = L.readState({
    version: 1, firstQuestion: 'q', match: 'moon', matchReason: '',
    visited: { 1: true, 2: true, 3: true, 4: true, 5: false }
  });
  eq('readState keeps a valid chain through screen 4', chain.visited[4], true);
  eq('readState keeps screen 5 unvisited', chain.visited[5], false);

  // ---------- 9. shouldEcho() / clampInput() / isBlank() ----------
  eq('check question is not echoed', L.shouldEcho('What is the Moon made of?', C.canonicalQuestion), false);
  eq('case/punctuation variant is not echoed', L.shouldEcho('what is the MOON made of', C.canonicalQuestion), false);
  eq('own wording is echoed', L.shouldEcho('What is the Moon made of, please?', C.canonicalQuestion), true);
  eq('clampInput trims to 240', L.clampInput('a'.repeat(300), 240).length, 240);
  eq('isBlank whitespace', L.isBlank('   \n '), true);
  eq('isBlank text', L.isBlank('a'), false);

  // ---------- 10. XSS rendered as text (DOM) ----------
  var sandbox = document.createElement('div');
  document.body.appendChild(sandbox);
  var probe = document.createElement('span');
  sandbox.appendChild(probe);
  var PAYLOAD = '<img src=x onerror="window.__xss=1"><script>window.__xss=1</scr' + 'ipt>';
  probe.textContent = PAYLOAD;
  eq('XSS: textContent creates no <img>', probe.querySelectorAll('img').length, 0);
  eq('XSS: textContent creates no <script>', probe.querySelectorAll('script').length, 0);
  eq('XSS: payload is visible as text', probe.textContent, PAYLOAD);
  eq('escapeHtml neutralises the payload', L.escapeHtml(PAYLOAD).indexOf('<') , -1);
  ok('XSS: window.__xss was never set', window.__xss === undefined);
  sandbox.remove();

  // ---------- 11. T12: maxlength is 240 in the HTML ----------
  // Static assertion performed on the served file by the Node runner
  // (tests/node-check.js); recorded here as a note.
  ok('maxLength constant is 240', C.screen1.maxLength === 240);

  function uniqueCount(list) {
    var seen = {}, n = 0;
    list.forEach(function (v) { if (!seen[v]) { seen[v] = 1; n++; } });
    return n;
  }

  // ---------- REPORT ----------
  var failures = results.filter(function (r) { return !r.pass; });
  document.title = (failures.length ? 'FAIL ' : 'PASS ') + (results.length - failures.length) + '/' + results.length;
  window.HKB_TEST_RESULTS = { total: results.length, failed: failures.length, failures: failures, results: results };

  var out = document.getElementById('results');
  var summary = document.getElementById('summary');
  if (summary) {
    summary.textContent = (results.length - failures.length) + ' passed, ' + failures.length + ' failed, ' + results.length + ' checks';
    summary.className = failures.length ? 'fail' : 'pass';
  }
  if (out) {
    failures.forEach(function (f) {
      var row = document.createElement('li');
      row.className = 'fail';
      row.textContent = 'FAIL ' + f.name + ' — actual: ' + JSON.stringify(f.actual) + ', expected: ' + JSON.stringify(f.expected);
      out.appendChild(row);
    });
    if (!failures.length) {
      var li = document.createElement('li');
      li.className = 'pass';
      li.textContent = 'All checks passed.';
      out.appendChild(li);
    }
  }
  if (window.console) {
    console.log('[tests] ' + (results.length - failures.length) + '/' + results.length + ' passed');
    failures.forEach(function (f) { console.error('FAIL', f.name, 'actual=', f.actual, 'expected=', f.expected); });
  }
})();
