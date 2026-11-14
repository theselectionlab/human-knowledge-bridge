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

  canonicalQuestion: 'What is the Moon made of?'
});
