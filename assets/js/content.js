/* Human Knowledge Bridge — content and configuration.
   Every child-facing string lives here. Claims, sources and the source
   registry follow the copy deck in the planning notes (04 §2 and §6).
   Source IDs point at NASA pages only; each one was verified by hand. */

window.HKB_CONTENT = Object.freeze({
  version: 1,
  accessed: '2026-11-14',

  title: 'Human Knowledge Bridge — The Moon Detective',
  brandLong: 'Human Knowledge Bridge',
  brandShort: 'HKB · Moon Detective',
  brandTag: 'Evidence Before Narrative',

  // Route order, the short label in the progress rail, and the flag that
  // guards the screen. Screen 3 needs screen 2's flag; screen 5 needs
  // screen 4's (03 §4).
  routes: Object.freeze([
    { route: 'question',   screen: 1, label: 'Question',  guardOn: '1' },
    { route: 'discovery',  screen: 2, label: 'Discovery', guardOn: '1' },
    { route: 'instrument', screen: 3, label: 'Detective', guardOn: '2' },
    { route: 'evidence',   screen: 4, label: 'Evidence',  guardOn: '3' },
    { route: 'next',       screen: 5, label: 'Next',      guardOn: '4' }
  ]),

  // Source registry (04 §6).
  SOURCES: Object.freeze({
    S1: { title: 'Moon Facts', publisher: 'NASA Science', url: 'https://science.nasa.gov/moon/facts/', supports: 'Layers, core, crust, regolith, formation, far-side crust', type: 'NASA science explainer', accessed: '2026-11-14' },
    S2: { title: 'Apollo 11 Seismic Experiment', publisher: 'NASA Science', url: 'https://science.nasa.gov/resource/apollo-11-seismic-experiment/', supports: 'Apollo 11 PSE: sensors, power, lifetime, later Apollo seismometers', type: 'NASA mission resource', accessed: '2026-11-14' },
    S3: { title: 'Lunar Science Priorities', publisher: 'NASA Science', url: 'https://science.nasa.gov/lunar-science/priorities/', supports: 'Giant-impact model, limits of Apollo seismic data, open questions', type: 'NASA science programme page', accessed: '2026-11-14' },
    S4: { title: 'Moon Composition & Structure', publisher: 'NASA Science', url: 'https://science.nasa.gov/moon/composition/', supports: 'Three main layers, core, mantle and crust, how scientists know', type: 'NASA science explainer', accessed: '2026-11-14' },
    S5: { title: 'Moon Formation', publisher: 'NASA Science', url: 'https://science.nasa.gov/moon/formation/', supports: 'Giant-impact evidence, 382 kg of samples, models and uncertainties', type: 'NASA science explainer', accessed: '2026-11-14' },
    S6: { title: 'Moonquakes', publisher: 'NASA Science', url: 'https://science.nasa.gov/moon/moonquakes/', supports: 'What moonquakes are and the Apollo seismometers that recorded them', type: 'NASA science explainer', accessed: '2026-11-14' },
    S7: { title: 'Apollo 11', publisher: 'NASA', url: 'https://www.nasa.gov/mission/apollo-11/', supports: 'Apollo 11 mission dates and Tranquility Base context', type: 'NASA mission page', accessed: '2026-11-14' }
  }),

  // The three Evidence Scales labels (07 D4). These ids are the values
  // stored in state.answers.
  LABELS: Object.freeze([
    { id: 'measurement', text: 'Measured evidence',   definition: 'Someone measured or recorded this directly.' },
    { id: 'inference',   text: 'Scientific conclusion', definition: 'Scientists put several kinds of evidence together to figure this out.' },
    { id: 'model',       text: 'Scientific model',    definition: 'Scientists build and test an explanation. No one has directly observed the whole thing.' }
  ]),

  // The three claims on the Evidence Scales (04 §2, screen 4). Exact copy.
  CLAIMS: Object.freeze([
    {
      id: 'c1',
      text: 'Apollo 11 recorded vibrations on the Moon.',
      correct: 'measurement',
      sourceId: 'S2',
      feedbackCorrect: 'Yes. The instrument measured vibrations. The recordings are observations.',
      feedbackTryAgain: 'Not quite. Ask: did someone measure this directly? The instrument recorded the vibrations.'
    },
    {
      id: 'c2',
      text: 'The Moon has layers inside.',
      correct: 'inference',
      sourceId: 'S4',
      feedbackCorrect: 'Yes. Scientists infer the Moon’s interior from several kinds of evidence, including seismic measurements. No one has opened the Moon to look.',
      feedbackTryAgain: 'Not quite. This is not a single measurement. Scientists put several kinds of evidence together to reach it.'
    },
    {
      id: 'c3',
      text: 'A giant impact involving Theia helped form the Moon.',
      correct: 'model',
      sourceId: 'S3',
      feedbackCorrect: 'Yes. The giant-impact explanation is a scientific model. No one directly observed it. Scientists test the model with lunar samples, physics, and computer simulations.',
      feedbackTryAgain: 'Not quite. Did anyone watch this happen? This is an explanation scientists build and test, not a direct observation.'
    }
  ]),

  // Screen 1 (04 §2)
  screen1: Object.freeze({
    eyebrow: 'Screen 1 · Your curiosity leads',
    h1: 'Every discovery begins with a question.',
    lede: 'What are you curious about?',
    label: 'Your question',
    placeholder: 'Type your question here…',
    example: 'Try an example: What is the Moon made of?',
    exampleQuestion: 'What is the Moon made of?',
    helper: 'You choose the question. This demo has one checked Moon investigation.',
    primary: 'Explore my question',
    validation: 'Please type a question first.',
    maxLength: 240
  }),

  canonicalQuestion: 'What is the Moon made of?',

  // ---- Screen 2 — The Discovery (04 §2) --------------------------------
  screen2: Object.freeze({
    eyebrow: 'Screen 2 · The Discovery',
    h1: 'What is the Moon made of?',
    echoPrefix: 'You asked: ',
    chosenPrefix: 'You chose: ',
    answer: 'The Moon is made mostly of rock. It has a dusty, rocky surface, a crust, a deep mantle, and a small metallic core.',
    layer: 'Like Earth, it has three main layers: a crust, a mantle, and a core.',
    howHeading: 'How do we know?',
    evidence: Object.freeze([
      Object.freeze({
        title: 'Moon rocks brought home',
        body: 'Apollo astronauts collected 382 kg (842 lb) of Moon rock and soil and brought it to Earth.',
        chip: 'Direct samples',
        kind: 'measured',
        sources: ['S5', 'S1']
      }),
      Object.freeze({
        title: 'Vibrations in the lunar ground',
        body: 'Seismometers recorded moonquakes and meteorite impacts. Scientists used those recordings to infer the Moon\u2019s interior.',
        chip: 'Measurements \u2192 inference',
        kind: 'inference',
        sources: ['S2', 'S6']
      })
    ]),
    clarifier: 'The surface is sampled directly. The deep interior is inferred from measurements \u2014 no one has opened the Moon to look inside.',
    farSide: 'An open question: the Moon\u2019s crust is thicker on the far side than on the near side. Scientists are still working out why.',
    cheeseHeading: 'Not cheese \u2014 Moon rock!',
    cheeseBody: 'Apollo astronauts brought home real Moon rocks. They are rock and dust, not dairy.',
    primary: 'Meet the Apollo instrument',
    back: 'Back'
  }),

  // ---- Screen 3 — A Science Detective on the Moon (04 §2) --------------
  screen3: Object.freeze({
    eyebrow: 'Screen 3 · The Science Detective',
    h1: 'A Science Detective on the Moon',
    kicker: 'Real hardware \u00b7 Apollo 11 \u00b7 1969',
    objectTitle: 'Passive Seismic Experiment (PSE)',
    definitionTerm: 'Seismometer',
    definition: 'an instrument that measures ground movement.',
    body: 'In 1969, astronauts left this instrument on the Moon. It listened for tiny vibrations in the lunar ground. Those vibrations gave scientists clues about what happens beneath the Moon\u2019s surface.',
    facts: Object.freeze(['First seismometer on the Moon', '4 sensors', 'Solar-powered', '3 weeks of data']),
    measuredHeading: 'What it measured',
    measuredBody: 'Vibrations from moonquakes and meteorite impacts.',
    didNotHeading: 'What it did not do',
    didNot: Object.freeze([
      'See inside the Moon directly.',
      'Work through the lunar night.',
      'Belong to the later Apollo network.'
    ]),
    laterHeading: 'Later missions',
    laterBody: 'More advanced seismometers were deployed at Apollo 12, 14, 15, and 16. They sent data until September 1977.',
    analogy: 'You cannot see through the Moon. But vibrations can help scientists investigate what is hidden inside.',
    mattersHeading: 'Why this matters',
    mattersBody: 'This is one of the pieces of hardware NASA left on the Moon. Its measurements gave scientists the first detailed look at the Moon\u2019s interior.',
    sourceId: 'S2',
    diagramCaption: 'How a seismometer listens: the ground moves \u2192 the sensor records \u2192 scientists study the signal.',
    smallNote: 'Apollo 11\u2019s instrument is not the same as the later Apollo seismometers.',
    primary: 'Explore the evidence',
    back: 'Back'
  }),

  // ---- Screen 4 — The Evidence Scales (04 §2) --------------------------
  screen4: Object.freeze({
    eyebrow: 'Screen 4 · Detective Toolkit',
    h1: 'The Evidence Scales',
    sub: 'How do we know what\u2019s true?',
    intro: 'Sort each claim. There is no penalty for trying. The labels describe how we know, not how important the claim is.',
    definitionTerm: 'A claim',
    definition: 'is a statement that can be checked.',
    caption: 'Different claims need different kinds of support.',
    unknownLabel: 'Open question',
    progress: function (n) { return 'Sorted ' + n + ' of 3 claims'; },
    unknownHeading: 'What we still don\u2019t know',
    unknowns: Object.freeze([
      'The exact size and makeup of Theia.',
      'The Moon\u2019s deep interior in detail.',
      'Some details of how the giant impact produced the Moon.'
    ]),
    unknownClose: 'Science has open questions. An unknown is not a fact, and it is not a failure.',
    summary: 'Case file complete. You separated what was measured, what was inferred, and what is a model.',
    small: 'A model is not a guess. It is a tool scientists build, test, and revise.',
    primary: 'Choose my next question',
    reset: 'Reset the scales'
  }),

  // ---- Screen 5 — Your Next Question (04 §2) ---------------------------
  screen5: Object.freeze({
    eyebrow: 'Screen 5 · Your investigation continues',
    h1: 'Detective, What\u2019s Your Next Question?',
    sub: 'Every answer can lead to a new question.',
    toolkitHeading: 'Your detective toolkit',
    toolkit: Object.freeze(['Look for evidence', 'Separate facts from ideas', 'Ask what we still don\u2019t know']),
    label: 'What would you like to investigate?',
    placeholder: 'Write your own question\u2026',
    helper: 'You choose the next question. No quiz, no right answer.',
    primary: 'Investigate my question',
    again: 'Explore the Moon investigation again',
    startOver: 'Start over'
  })
});

