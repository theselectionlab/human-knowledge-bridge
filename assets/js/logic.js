/* Human Knowledge Bridge — pure logic.
   No DOM access. Every function here is exercised by tests/tests.html.
   The matcher is the locked 89-case version from 03 §5 (revised 14 Nov).
   Do not add synonyms without adding a test case first. */

(function () {
  'use strict';

  function normalize(raw) {
    return String(raw == null ? '' : raw)
      .normalize('NFKC')
      .toLowerCase()
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[?.!,;:"']/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  var MOON = /\bmoon\b/;

  var COMPOSITION = /\b(made|make|makes|composed|composition|consists?|inside|inner|interior|layer|layers|core|crust|mantle|rock|rocky|structure|surface|cheese)\b/;

  var OFF_TOPIC_MOON = /\b(distance|far|away|phase|phases|shine|shines|shining|light|craters?|landing|land|landed|walk|orbit|gravity|size|big|age|formed|formation|from|created|born|water|round|different)\b/;

  var AGE_CUE = /\b(age|old|older|how long ago|when was)\b/;

  var COMPOUND = /\bmoon\b[^?]*\b(and|but)\b[^?]*\b(how far|how big|how old|why|where)\b/;

  var THEIA = /\btheia\b/;
  var GIANT_IMPACT = /\bgiant impact\b/;
  var CHEESE = /\bcheese\b/;

  /* Returns one of:
       { intent: 'empty' }
       { intent: 'moon-composition', variant: 'standard' | 'cheese' }
       { intent: 'unknown', reason: 'theia' | 'moon-other' | 'not-moon', offerMoonRoute? } */
  function classifyQuestion(raw) {
    var q = normalize(raw);
    if (!q) return { intent: 'empty' };

    if (THEIA.test(q) || GIANT_IMPACT.test(q)) {
      return { intent: 'unknown', reason: 'theia', offerMoonRoute: true };
    }
    if (AGE_CUE.test(q)) return { intent: 'unknown', reason: 'moon-other' };
    if (COMPOUND.test(q)) return { intent: 'unknown', reason: 'moon-other' };
    if (!MOON.test(q)) return { intent: 'unknown', reason: 'not-moon' };
    if (COMPOSITION.test(q) && !OFF_TOPIC_MOON.test(q)) {
      return { intent: 'moon-composition', variant: CHEESE.test(q) ? 'cheese' : 'standard' };
    }
    return { intent: 'unknown', reason: 'moon-other' };
  }

  function clampInput(raw, maxLength) {
    var s = String(raw == null ? '' : raw);
    return s.length > maxLength ? s.slice(0, maxLength) : s;
  }

  function isBlank(raw) {
    return normalize(raw) === '';
  }

  /* True when the child's own words should be echoed back as "You asked: …".
     The canonical wording is not echoed; nor is a question that only differs
     by case, punctuation or spacing. */
  function shouldEcho(question, canonical) {
    if (!question || !canonical) return false;
    return normalize(question) !== normalize(canonical);
  }

  function escapeHtml(raw) {
    return String(raw == null ? '' : raw)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function readState(raw) {
    var initial = {
      version: 1,
      firstQuestion: '',
      nextQuestion: '',
      match: null,
      matchReason: '',
      answers: { c1: null, c2: null, c3: null },
      visited: { 1: true, 2: false, 3: false, 4: false, 5: false }
    };
    if (!raw || typeof raw !== 'object' || raw.version !== 1) return initial;

    var out = JSON.parse(JSON.stringify(initial));
    if (typeof raw.firstQuestion === 'string') out.firstQuestion = raw.firstQuestion.slice(0, 240);
    if (typeof raw.nextQuestion === 'string') out.nextQuestion = raw.nextQuestion.slice(0, 240);
    if (raw.match === 'moon' || raw.match === 'unknown') out.match = raw.match;
    if (typeof raw.matchReason === 'string') out.matchReason = raw.matchReason;

    var validAnswers = { measurement: 1, inference: 1, model: 1 };
    ['c1', 'c2', 'c3'].forEach(function (id) {
      var v = raw.answers && raw.answers[id];
      if (validAnswers[v]) out.answers[id] = v;
    });

    ['1', '2', '3', '4', '5'].forEach(function (k) {
      if (raw.visited && raw.visited[k] === true) out.visited[k] = true;
    });
    out.visited[1] = true;

    // A screen is only reached if the child reached every screen before it.
    // A stored flag whose predecessor is missing is stale (an older tab, or
    // a half-written state) and would let a guard skip a screen.
    for (var step = 2; step <= 5; step++) {
      if (!out.visited[step - 1]) out.visited[step] = false;
    }
    // Screen 2 is reachable only with a matched Moon question; without one,
    // nothing past screen 1 is reachable and the whole walk is cleared.
    if (out.match !== 'moon') {
      out.visited[2] = out.visited[3] = out.visited[4] = out.visited[5] = false;
    }

    return out;
  }

  var VALID_LABELS = { measurement: 1, inference: 1, model: 1 };
  var KNOWN_CLAIMS = { c1: 1, c2: 1, c3: 1 };

  /* Returns true for a restorable state, false for anything else. The app
     never renders a screen from a state that fails this. */
  function validateState(s) {
    if (!s || typeof s !== 'object' || Array.isArray(s)) return false;
    if (s.version !== 1) return false;
    if (typeof s.screen !== 'number' || s.screen < 1 || s.screen > 5) return false;
    if (typeof s.firstQuestion !== 'string') return false;
    if (typeof s.nextQuestion !== 'string') return false;
    if (s.match !== null && s.match !== 'moon' && s.match !== 'unknown') return false;
    if (typeof s.matchReason !== 'string') return false;
    if (!s.answers || typeof s.answers !== 'object') return false;
    if (!s.visited || typeof s.visited !== 'object') return false;

    var answerKeys = Object.keys(s.answers);
    for (var i = 0; i < answerKeys.length; i++) {
      var key = answerKeys[i];
      if (!Object.prototype.hasOwnProperty.call(KNOWN_CLAIMS, key)) return false;
      var value = s.answers[key];
      if (value !== null && !Object.prototype.hasOwnProperty.call(VALID_LABELS, value)) return false;
    }
    return true;
  }

  function claimById(id) {
    var claims = (window.HKB_CONTENT && window.HKB_CONTENT.CLAIMS) || [];
    for (var i = 0; i < claims.length; i++) {
      if (claims[i].id === id) return claims[i];
    }
    return null;
  }

  function isCorrect(claimId, labelId) {
    var claim = claimById(claimId);
    if (!claim) return false;
    return claim.correct === labelId;
  }

  function feedbackFor(claimId, labelId) {
    var claim = claimById(claimId);
    if (!claim) return '';
    return claim.correct === labelId ? claim.feedbackCorrect : claim.feedbackTryAgain;
  }

  window.HKB_LOGIC = Object.freeze({
    validateState: validateState,
    claimById: claimById,
    isCorrect: isCorrect,
    feedbackFor: feedbackFor,
    normalize: normalize,
    classifyQuestion: classifyQuestion,
    clampInput: clampInput,
    isBlank: isBlank,
    shouldEcho: shouldEcho,
    escapeHtml: escapeHtml,
    readState: readState
  });
})();
