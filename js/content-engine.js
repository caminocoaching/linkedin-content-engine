// ═══════════════════════════════════════════════════════════════
// ⚡ BUSINESS LEADERS LINKEDIN ENGINE — Content Engine
// For Craig Muirhead / Camino Coaching
// LinkedIn posts for CEOs, Founders, Senior Executives
// CTA: Free Winning Formula Assessment
// ═══════════════════════════════════════════════════════════════

// ─── 7 Content Pillars (Revised — Genuine Diversity) ──────────
// OLD: 7 variations of "work is bad for you"
// NEW: 7 genuinely different content territories
//   1 problem pillar (Hidden Cost) + 6 positive pillars
//   Each pillar has its own search category, evidence type, emotional target
export const PILLARS = [
  {
    id: 'hidden-cost',
    name: 'The Hidden Cost',
    icon: '⚠️',
    color: '#e84444',
    description: 'The cost, risk, or damage that a specific leadership behaviour is causing. The ONLY "problem" pillar. Maximum 1 post per week.',
    winningFormulaPillar: 'Clarity Under Pressure',
    searchCategory: 'Workplace productivity research, cognitive decline studies, stress impact data, decision fatigue, burnout statistics.',
    emotionalTarget: 'That is costing me more than I realised.',
    primaryChemical: 'cortisol',
    chemicalNote: 'Every Hidden Cost post should name cortisol and explain the specific damage mechanism.',
    subTopicRotation: [
      'Multitasking Mania — cognitive switching tax, 110 bits/sec conscious limit',
      'Always-On Culture — cortisol addiction, permanent emergency mode',
      'Open Door Overwhelm — 23-minute recovery cost, deep work death',
      'Decision Bottleneck — choice centre exhaustion, CEO decision fatigue',
      'Routine Stagnation — curiosity atrophy, cognitive decline from repetition',
      'Purpose Disconnection — success without meaning, hollow performance',
      'Grind Delusion — diminishing returns of overwork, energy zones vs drain zones'
    ],
    topics: [
      '683 hours of productive time lost every year to interruption recovery',
      'Your body cannot distinguish between a sabre-tooth tiger and a Slack notification',
      'CEOs make 35,000 decisions per day. By 4pm, decision quality drops 40%.',
      'Your brain literally atrophies when you stop being challenged',
      'Working 70 hours in your drain zone produces less than 40 hours in your energy zone'
    ]
  },
  {
    id: 'brain-breakthrough',
    name: 'Brain Breakthrough',
    icon: '🧠',
    color: '#ff6b35',
    description: 'New neuroscience research showing the brain can do something previously thought impossible. Discoveries that reframe what leaders believe about their own cognitive potential.',
    winningFormulaPillar: 'Focus & Flow',
    searchCategory: 'Neuroplasticity studies, cognitive enhancement research, brain imaging discoveries, acetylcholine/dopamine/serotonin breakthroughs, longevity and brain health.',
    emotionalTarget: 'I had no idea the brain could do that.',
    primaryChemical: 'rotate',
    chemicalNote: 'Rotate through all six chemicals (cortisol, dopamine, serotonin, oxytocin, testosterone, endorphins). Match the chemical to the discovery being discussed.',
    topics: [
      'An NIH-funded study just showed we can reverse cognitive aging by a decade with targeted brain exercises',
      'Your prefrontal cortex is not in permanent decline. It is in a state of underuse.',
      'Scientists discovered a new brain chemical pathway that explains why some leaders make better decisions under pressure',
      'The brain creates 700 new neurons every day in the hippocampus. Most adults kill them by lunchtime.',
      'Acetylcholine — the brain chemical nobody talks about — predicts leadership performance better than IQ'
    ]
  },
  {
    id: 'human-achievement',
    name: 'Human Achievement',
    icon: '🏆',
    color: '#ffd43b',
    description: 'Stories of well-known inventors, founders, athletes, and leaders — the specific habits or practices that drove their success, explained through the neuroscience behind WHY those habits worked.',
    winningFormulaPillar: 'Feedback & Debrief Loops',
    searchCategory: 'Famous founders cognitive habits, athletes mental preparation routines, inventors brain science, historical figures neuroscience connections.',
    emotionalTarget: 'If they did it, I can too. And now I understand WHY it works.',
    primaryChemical: 'match',
    chemicalNote: 'Match the chemical to the famous person\'s habit. Kobe = dopamine (anticipatory reward loops). Bezos = cortisol (morning low point). Beckham = endorphins (sustained practice triggering flow). Blakely = dopamine (prospective encoding). Jobs = endorphins + dopamine (bilateral movement).',
    exampleSubjects: [
      'James Dyson: 5,127 prototypes (neuroplasticity through iteration)',
      'Kobe Bryant: 4-hour pre-game film study (visual cortex pre-loading)',
      'Sara Blakely: Daily visualisation (prospective memory encoding)',
      'Jeff Bezos: No decisions after lunch (prefrontal cortex glucose depletion)',
      'Edison: Strategic napping (hypnagogic state and creative problem solving)',
      'Steve Jobs: Walking meetings (bilateral movement and cognitive flexibility)',
      'David Beckham: 2 hours extra free kick practice (myelination)'
    ],
    topics: [
      'James Dyson built 5,127 failed prototypes. Neuroscience calls that neuroplasticity in action.',
      'Jeff Bezos makes zero strategic decisions after 3pm. The brain science proves he is right.',
      'Kobe Bryant spent 4 hours studying film before every game. His visual cortex was literally pre-loading.',
      'Edison did not just nap. He engineered hypnagogic states for creative problem solving.',
      'Sara Blakely visualised every investor meeting. Neuroscience explains why it worked.'
    ]
  },
  {
    id: 'camino-data',
    name: 'Camino Data Insight',
    icon: '📊',
    color: '#4dabf7',
    description: 'A specific finding from Camino Coaching\'s proprietary dataset of 2,249 performance debriefs across 312 circuits over 57 months. NO web search needed.',
    winningFormulaPillar: 'Feedback & Debrief Loops',
    searchCategory: 'NO external search — proprietary data only.',
    emotionalTarget: 'This data is unique. Nobody else has this. And it applies directly to my leadership.',
    primaryChemical: 'match',
    chemicalNote: 'Connect debrief findings to chemicals. Confidence = serotonin + testosterone balance. Flow state = endorphins + dopamine. Inner critic = cortisol spike. Pre-session preparation = cortisol reduction + dopamine priming.',
    topics: [
      'Riders scoring 8.5+/10 confidence achieve personal bests at 2.7x the rate',
      '81% of successful sessions use box breathing preparation',
      'Athletes with 50+ debriefs achieve PB rates above 50%',
      'Cormac Buchanan: 9.11/10 flow state across 30 debriefs at World Championship level',
      'Calum Beach: 50% win rate, 85% podium from consistent debrief use'
    ]
  },
  {
    id: 'positive-edge',
    name: 'The Positive Edge',
    icon: '✨',
    color: '#9775fa',
    description: 'Research showing what high performers do differently and the positive outcomes of specific practices. What works, not what is broken.',
    winningFormulaPillar: 'Focus & Flow',
    searchCategory: 'Flow state productivity (McKinsey 500%), exercise and BDNF, sleep and executive function, meditation and prefrontal cortex, walking and creativity, nature and stress recovery.',
    emotionalTarget: 'I want that edge. And it is more accessible than I thought.',
    primaryChemical: 'dopamine,serotonin,endorphins',
    chemicalNote: 'Always name the specific chemical being boosted by the positive practice.',
    topics: [
      'Executives in flow are 500% more productive. McKinsey measured it.',
      'A 20-minute walk increases creative output by 81%. Stanford measured it. Immediately.',
      'Meditation thickens the prefrontal cortex in 8 weeks. MRI scans confirm it.',
      'Cold exposure increases norepinephrine by 530%. That is your focus chemical.',
      'Sleep is not recovery. It is when your brain consolidates the strategic thinking it did all day.'
    ]
  },
  {
    id: 'the-tool',
    name: 'The Tool',
    icon: '🔧',
    color: '#69db7c',
    description: 'One specific, actionable technique the reader can use immediately, backed by data. Give them the tool. Hold back the full system.',
    winningFormulaPillar: 'Execution Rhythm',
    searchCategory: 'Breathing protocols, focus techniques, decision frameworks, recovery strategies, preparation routines — all with research backing.',
    emotionalTarget: 'I can try this today. This person gives real value for free.',
    primaryChemical: 'match',
    chemicalNote: 'Name the specific chemical each technique targets. Box breathing = cortisol reduction. Walking = endorphin + dopamine release. Visualisation = dopamine (prospective encoding). Gratitude = serotonin boost.',
    toolsToRotate: [
      'Box breathing: 4-4-4-4 protocol, parasympathetic activation, cortisol reduction',
      'The 2-minute pre-meeting reset: centering technique before high-stakes situations',
      'The 90-minute focus block: ultradian rhythm alignment for deep work',
      'The post-decision debrief: 3 questions to ask after every major decision',
      'The evening wind-down: blue light, temperature, cognitive offloading',
      'Strategic walking: 20 minutes for 81% creative boost (Stanford)',
      'The Monday morning clarity exercise: weekly intention setting using visualisation'
    ],
    topics: [
      '81% of successful sessions start with this 2-minute technique. Here is how to do it.',
      'The 90-minute focus block that gives you 37% better decision quality',
      'One question before every meeting that changes the outcome: Is this a decision, update, or discussion?',
      'The 4-question debrief that turns every bad day into a performance upgrade',
      'Before your next board meeting, do this for 90 seconds. It changes everything.'
    ]
  },
  {
    id: 'winning-ways',
    name: 'Winning Ways',
    icon: '🌟',
    color: '#f783ac',
    description: 'Household names from sport, business, entertainment, or science whose specific habits or achievements can be explained through neuroscience and connected to the reader\'s own potential.',
    winningFormulaPillar: 'Influence & Culture',
    searchCategory: 'Well-known figures and their specific habits, routines, mental preparation, or breakthrough moments connected to neuroscience.',
    emotionalTarget: 'If [famous person] used this principle to achieve [extraordinary thing], I can use it in my business.',
    primaryChemical: 'match',
    chemicalNote: 'Match to the figure\'s specific practice. Name the chemical mechanism that made their habit work.',
    topics: [
      'Google does not give engineers 20% time because they are generous. The neuroscience explains why.',
      'Patagonia\'s CEO surfs every morning. His prefrontal cortex is the reason his company outperforms.',
      'When Satya Nadella took over Microsoft, the first thing he changed was not strategy. It was mindset.',
      'Navy SEALs perform under pressure because they have trained their prefrontal cortex to override their amygdala.',
      'Pixar redesigned their entire building to maximise unplanned collisions. Dopamine explains why it works.'
    ]
  }
];

// ─── 5 Frameworks (3S + 2F) — Alex Hormozi Style ──────────────
export const FRAMEWORKS = [
  {
    id: 'scary',
    name: 'Scary',
    icon: '😱',
    prefix: 'S',
    color: '#ff4444',
    description: 'Data-led alarm — consequence, risk, or hidden cost most leaders ignore',
    hookStyle: 'Start with a fear-inducing data point or hidden cost. "This is costing you..." / "The research is clear..."',
    example: 'Your brain makes 35,000 decisions a day. By 4pm, it is running on fumes. The research on what happens next is not pretty.'
  },
  {
    id: 'strange',
    name: 'Strange',
    icon: '🤔',
    prefix: 'S',
    color: '#ffa500',
    description: 'Counterintuitive — challenges conventional business wisdom with paradox',
    hookStyle: 'Open with something that contradicts what every leader "knows" is true. "The laziest CEO I coached..." / "The worst advice I ever got..."',
    example: 'The laziest CEO I ever coached outperformed every hustler in his industry. Here is why that matters more than you think.'
  },
  {
    id: 'sexy',
    name: 'Sexy',
    icon: '✨',
    prefix: 'S',
    color: '#ff69b4',
    description: 'Aspirational — paint the picture of calm, decisive, unshakeable leadership',
    hookStyle: 'Paint a vivid picture of what peak performance leadership LOOKS and FEELS like. "What would change if..." / "Imagine making every decision from..."',
    example: 'What would change if you could access your best thinking on demand? Not occasionally. On demand. Every board meeting. Every strategic decision.'
  },
  {
    id: 'free-value',
    name: 'Free Value',
    icon: '🎁',
    prefix: 'F',
    color: '#00cc88',
    description: 'Actionable insight they would pay for — specific protocols, frameworks, techniques',
    hookStyle: 'Lead with a practical tip, technique, or protocol they can use immediately. "Here is the exact protocol..." / "One question that changes everything..."',
    example: 'Here is the exact breathing protocol used by fighter pilots, F1 drivers, and the CEOs I coach before high-stakes decisions. Takes 90 seconds.'
  },
  {
    id: 'familiar',
    name: 'Familiar',
    icon: '🤝',
    prefix: 'F',
    color: '#4488ff',
    description: 'Reference known brands and elite performers — Google, Patagonia, F1 pit crews, Navy SEALs',
    hookStyle: 'Reference a well-known brand or figure that proves the point. "Google does not do this by accident..." / "Patagonia\'s CEO..."',
    example: 'Google does not give engineers 20% time because they are generous. They do it because the data says it produces 50% of their best innovations.'
  }
];

// ─── 4 CTA Templates — Winning Formula Assessment ────────────
export const CTAS = [
  {
    id: 'cta-a',
    name: 'Assessment Angle',
    shortName: 'CTA A: Assessment',
    frequency: '3-4x per week (workhorse CTA)',
    primary: true,
    ctaTemplate: '\n\n·· Oh, by the way. I have built a free leadership performance assessment that scores you across the 5 pillars elite performers use to stay in flow under pressure. 25 questions. 3 minutes. Instant personalised report.\n\n→ Take the Winning Formula assessment here: https://caminocoaching.co.uk/leader-assessment'
  },
  {
    id: 'cta-b',
    name: 'Data / Curiosity Angle',
    shortName: 'CTA B: Curiosity',
    frequency: '1-2x per week',
    primary: false,
    ctaTemplate: '\n\n·· Completely unrelated. I recently built an assessment based on the same mental performance protocols used by championship motorsport teams. It measures Clarity Under Pressure, Focus & Flow, Execution Rhythm, Feedback Loops, and Influence & Culture. Most leaders score below 50%. Takes 3 minutes. Free. Instant results.\n\n→ Take it here: https://caminocoaching.co.uk/leader-assessment'
  },
  {
    id: 'cta-c',
    name: 'Training Window',
    shortName: 'CTA C: Training',
    frequency: 'When training is open',
    primary: false,
    ctaTemplate: '\n\n·· Side note. Three times a year I release a free training called the Executive Flow Blueprint for business leaders who want to stop operating in survival mode and start leading from flow state. The next window just opened. Starts with a 3-minute assessment. Spots are limited.\n\n→ Start here: https://caminocoaching.co.uk/leader-assessment'
  },
  {
    id: 'cta-d',
    name: 'Short & Sharp',
    shortName: 'CTA D: Short',
    frequency: 'For variety',
    primary: false,
    ctaTemplate: '\n\n·· PS. Want to know your leadership flow score? Free 3-minute assessment. Instant report.\n\n→ https://caminocoaching.co.uk/leader-assessment'
  }
];

// ─── 5 Visual Types (Rotation System) ─────────────────────────
export const VISUAL_TYPES = {
  'data-card': {
    id: 'data-card',
    name: 'Data Card',
    icon: '📊',
    color: '#4dabf7',
    frequency: '2-3 per week',
    description: 'Dark background, one headline number, your branding. Build in Canva — swap numbers weekly.',
    guidance: 'Dark navy background (#06080e). Single bold stat in pillar accent colour. Inter Bold font. 1080×1080px square. Subtle ⚡ Camino Coaching bottom-right. Example: "699 PERSONAL BESTS. 2,249 DEBRIEFS. 57 MONTHS." or "CONFIDENCE 8.5+/10 = 2.7x MORE PERSONAL BESTS."',
    tool: 'Canva (template, swap numbers each week — 2 minutes per card)'
  },
  'paddock-photo': {
    id: 'paddock-photo',
    name: 'Real Paddock Photo',
    icon: '🏎️',
    color: '#f59f00',
    frequency: '1-2 per week',
    description: 'Real photos from 10 seasons in motorsport paddocks. Your most powerful visual asset — nobody else has these.',
    guidance: 'Use REAL photos: you on the grid, with riders, pit lane, debrief in progress. Phone-quality is fine — authenticity beats polish. A photo of you coaching in a MotoGP garage is worth more than any AI image. Proves you are real, you are there, you belong.',
    tool: 'Your phone camera roll / paddock photo archive'
  },
  'ai-image': {
    id: 'ai-image',
    name: 'AI-Generated Image',
    icon: '🤖',
    color: '#9775fa',
    frequency: '1-2 per week maximum',
    description: 'Best for neuroscience explainer posts — brain chemistry, cortisol, dopamine, prefrontal cortex. Strategic use only.',
    guidance: 'Use for neuroscience/brain science posts ONLY. Brain with lighting effects, neural pathways, data visualisations. Reinforces "this is science, not motivation" positioning. Do NOT use for every post or your feed looks like every other AI-content creator.',
    tool: 'Midjourney / DALL-E / Manus AI'
  },
  'text-quote': {
    id: 'text-quote',
    name: 'Text Quote Card',
    icon: '💬',
    color: '#69db7c',
    frequency: '1 per week maximum',
    description: 'A single line from YOUR coaching experience on a clean branded background. Not generic wisdom — YOUR data-backed words.',
    guidance: 'Clean branded background (dark navy or subtle gradient). One powerful line in large Inter Bold. Must be YOUR words backed by YOUR data. Examples: "Your prefrontal cortex is not in decline. It is in underuse." or "Confidence is not a feeling. It is a 2.7x multiplier." NOT generic motivation.',
    tool: 'Canva (simple text template — 1 minute per card)'
  },
  'carousel': {
    id: 'carousel',
    name: 'Carousel Document',
    icon: '📑',
    color: '#ff6b9d',
    frequency: '1 per week',
    description: 'LinkedIn algorithm loves document posts — highest engagement rates. 6-8 slides breaking down a data story.',
    guidance: 'Slide 1: Hook ("We tracked 2,249 debriefs. Here is what separates the winners."). Slides 2-7: One key finding per slide with clean data visuals. Slide 8: Bridge to business + CTA. Upload as PDF to LinkedIn. Gets saved, gets shared, generates maximum dwell time.',
    tool: 'Canva (presentation template) or Google Slides → export PDF'
  }
};

// ─── 7-Day Content DNA (forces genuine diversity + positivity) ─
// EMOTIONAL POLARITY RULE: Maximum 1 problem/cost post per week (Monday).
// The other 6 must lead with POSSIBILITY, not problems.
//
// Each day maps to one of the 7 NEW content pillars:
//   Mon: Hidden Cost (Scary) — the ONE problem post
//   Tue: Brain Breakthrough (Strange) — wonder/surprise
//   Wed: Human Achievement (Familiar) — aspiration/inspiration
//   Thu: Camino Data Insight (Strange/Sexy) — credibility/authority
//   Fri: The Positive Edge (Sexy) — desire/motivation
//   Sat: The Tool (Free Value) — empowerment/agency
//   Sun: Winning Ways (Familiar) — confidence/belief
export const WEEKLY_SCHEDULE = [
  {
    day: 'Monday',
    pillarId: 'hidden-cost',
    frameworkId: 'scary',
    ctaId: 'cta-a',
    visualType: 'data-card',
    postFormat: 'video',
    primaryChemical: 'cortisol',
    emotion: 'fear',
    polarity: 'negative',
    evidenceType: 'external-research',
    contentType: 'hidden-cost',
    researchCategory: 'cost-post',
    searchMandate: 'Find ONE alarming external study about cognitive damage, cortisol, burnout, chronic stress, or decision fatigue from a named university or publication. This is the ONLY problem/cost post this week. Rotate through the 7 sub-topics (multitasking, always-on, open-door, decision bottleneck, routine stagnation, purpose disconnection, grind delusion) cycling weekly.',
    searchFocus: 'workplace productivity research, cognitive decline studies, stress impact data, decision fatigue research, burnout statistics',
    dayBrief: 'The hidden cost post. VIDEO FORMAT. Scary stat as 60-second explainer. Cortisol-led. The ONLY negative post this week. Emotional target: "That is costing me more than I realised."'
  },
  {
    day: 'Tuesday',
    pillarId: 'brain-breakthrough',
    frameworkId: 'strange',
    ctaId: 'cta-b',
    visualType: 'ai-image',
    postFormat: 'video',
    primaryChemical: 'rotate',
    emotion: 'wonder',
    polarity: 'positive',
    evidenceType: 'breakthrough-science',
    contentType: 'brain-breakthrough',
    researchCategory: 'breakthroughs',
    searchMandate: 'Find a POSITIVE neuroscience breakthrough — research showing the brain can do something previously thought impossible. Neuroplasticity, cognitive enhancement, longevity. This is the viral post formula (19,845 impressions): possibility, not problems.',
    searchFocus: 'neuroplasticity breakthroughs, cognitive aging reversal, brain training discoveries, acetylcholine dopamine serotonin research',
    dayBrief: 'Brain breakthrough. VIDEO FORMAT. Neuroscience discovery as viral video. POSITIVE. Emotional target: "I had no idea the brain could do that."'
  },
  {
    day: 'Wednesday',
    pillarId: 'human-achievement',
    frameworkId: 'familiar',
    ctaId: 'cta-d',
    visualType: 'paddock-photo',
    postFormat: 'text',
    primaryChemical: 'match',
    emotion: 'aspiration',
    polarity: 'positive',
    evidenceType: 'human-achievement',
    contentType: 'achievement-neuroscience',
    researchCategory: 'human-achievement',
    searchMandate: 'Find a famous founder, inventor, athlete, or leader who achieved something extraordinary AND explain the neuroscience behind WHY. Never use the same person twice in a 4-week cycle. Rotate through sport, business, entertainment, and science.',
    searchFocus: 'famous innovators neuroscience, founders brain science, historical inventions cognitive explanation, elite performers brain chemistry',
    dayBrief: 'Human achievement through neuroscience. TEXT POST with data card or paddock photo. POSITIVE. Emotional target: "If they did it, I can too."'
  },
  {
    day: 'Thursday',
    pillarId: 'camino-data',
    frameworkId: 'strange',
    ctaId: 'cta-a',
    visualType: 'data-card',
    postFormat: 'video',
    primaryChemical: 'match',
    emotion: 'credibility',
    polarity: 'positive',
    evidenceType: 'proprietary-data',
    contentType: 'camino-data-insight',
    researchCategory: 'camino-data-wins',
    searchMandate: 'DO NOT search externally. Use ONLY Craig\'s proprietary data from 2,249 debriefs. ONE authority anchor + ONE insight hook + ONE bridge pattern. WOW not HOW.',
    searchFocus: 'NO external search — proprietary data only: confidence 2.7x, 81% box breathing, centering gap, flow improvements, win rate correlations',
    dayBrief: 'Camino Data Insight. VIDEO FORMAT. Proprietary data visualised with avatar narration. POSITIVE. Emotional target: "This data is unique. Nobody else has this."'
  },
  {
    day: 'Friday',
    pillarId: 'positive-edge',
    frameworkId: 'sexy',
    ctaId: 'cta-c',
    visualType: 'paddock-photo',
    postFormat: 'text',
    primaryChemical: 'dopamine,serotonin,endorphins',
    emotion: 'desire',
    polarity: 'positive',
    evidenceType: 'positive-performance-research',
    contentType: 'positive-edge',
    researchCategory: 'positive-performance-data',
    searchMandate: 'Find research showing what WORKS and what high performers DO differently. McKinsey flow 500%, exercise BDNF, sleep executive function, meditation prefrontal cortex, cold exposure norepinephrine. Lead with the positive outcome, NEVER the problem.',
    searchFocus: 'flow state productivity McKinsey, exercise brain BDNF, sleep executive function, meditation prefrontal cortex, walking creativity Stanford',
    dayBrief: 'The Positive Edge. TEXT POST with AI image or strong visual. POSITIVE. Emotional target: "I want that edge. And it is more accessible than I thought."'
  },
  {
    day: 'Saturday',
    pillarId: 'the-tool',
    frameworkId: 'free-value',
    ctaId: 'cta-b',
    visualType: 'carousel',
    postFormat: 'video',
    primaryChemical: 'match',
    emotion: 'empowerment',
    polarity: 'positive',
    evidenceType: 'actionable-protocol',
    contentType: 'give-the-tool',
    researchCategory: 'actionable-tools',
    searchMandate: 'DO NOT search for problems. GIVE one specific actionable technique the reader can use immediately, backed by data. Give the tool. Hold back the full system. Rotate through: box breathing, 2-min pre-meeting reset, 90-min focus block, post-decision debrief, evening wind-down, strategic walking, Monday clarity exercise.',
    searchFocus: 'breathing protocols, focus techniques, decision frameworks, recovery strategies, preparation routines — with neuroscience backing',
    dayBrief: 'The Tool. VIDEO FORMAT. Teaching technique with "try this with me" format. POSITIVE. Emotional target: "I can try this today. This person gives real value for free."'
  },
  {
    day: 'Sunday',
    pillarId: 'winning-ways',
    frameworkId: 'familiar',
    ctaId: 'cta-d',
    visualType: 'text-quote',
    postFormat: 'text',
    primaryChemical: 'match',
    emotion: 'confidence',
    polarity: 'positive',
    evidenceType: 'famous-figure-neuroscience',
    contentType: 'winning-ways',
    researchCategory: 'winning-ways',
    searchMandate: 'Find a household name from sport, business, entertainment, or science whose specific habit or achievement can be explained through neuroscience. Formula: Famous person + specific thing they did + brain science behind why + "you can apply this." Never use same person twice in 4 weeks.',
    searchFocus: 'well-known figures habits neuroscience, famous leaders routines brain science, household names mental preparation, breakthrough moments cognitive explanation',
    dayBrief: 'Winning Ways. TEXT POST with quote card or carousel. POSITIVE. Emotional target: "If [famous person] used this principle, I can use it in my business."'
  }
];

// ─── Neurochemical Reference Card ─────────────────────────────
// Every video post names at least one brain chemical.
// Text posts should include chemical references where relevant (min 4/7 per week).
export const NEUROCHEMICAL_REFERENCE = {
  cortisol: {
    name: 'Cortisol',
    label: 'The Stress Hormone',
    icon: '🔴',
    color: '#e84444',
    elevatedBy: 'Always-on culture, back-to-back meetings, sleep deprivation, constant email checking, conflict avoidance, Sunday evening dread.',
    effect: 'Shrinks prefrontal cortex with chronic exposure, impairs decision-making, suppresses creativity, triggers emotional reactivity, reduces testosterone, disrupts sleep architecture.',
    reducedBy: 'Box breathing, nature exposure, exercise, quality sleep, social connection, laughter.',
    keyInsight: 'Cortisol is the hidden tax on leadership. The CEO who is "always on" is chemically degrading the organ that built their business.',
    businessApp: 'Chronic elevation literally makes leaders measurably less intelligent over time.'
  },
  dopamine: {
    name: 'Dopamine',
    label: 'The Motivation & Reward Chemical',
    icon: '🟡',
    color: '#ffd43b',
    triggeredBy: 'Novelty, anticipation of reward, small wins, goal progress, learning something new, completing tasks.',
    effect: 'Drives focus, motivation, risk assessment, creative problem-solving, pattern recognition.',
    depletedBy: 'Constant notifications, social media scrolling, routine without variety, achieved goals without new ones.',
    keyInsight: 'Dopamine rewards ANTICIPATION more than achievement. This is why the pursuit feels better than the win.',
    businessApp: 'The best CEOs design dopamine loops into their week. Small wins on Monday. Progress milestones on Wednesday. New learning on Friday.'
  },
  serotonin: {
    name: 'Serotonin',
    label: 'The Confidence & Status Chemical',
    icon: '🟢',
    color: '#69db7c',
    boostedBy: 'Exercise, sunlight, gratitude practice, social recognition, purposeful work, adequate tryptophan intake.',
    effect: 'Emotional stability, self-worth, leadership presence, patience, long-term thinking.',
    depletedBy: 'Isolation, lack of purpose, comparison with others, poor nutrition, vitamin D deficiency.',
    keyInsight: 'Linked to social hierarchy perception. Leaders with healthy serotonin levels command rooms without raising their voice.',
    businessApp: 'Imposter syndrome has a chemical signature: low serotonin. Exercise before a board meeting changes your neurochemistry, not just your mood.'
  },
  oxytocin: {
    name: 'Oxytocin',
    label: 'The Trust & Connection Chemical',
    icon: '🔵',
    color: '#4dabf7',
    releasedBy: 'Genuine conversation, vulnerability, physical proximity, shared goals, active listening, eye contact, acts of generosity.',
    effect: 'Team cohesion, trust, collaboration, psychological safety, reduced cortisol.',
    blockedBy: 'Micromanagement, remote isolation, transactional relationships, fear-based cultures.',
    keyInsight: 'The chemical basis of high-performing teams. Trust removes the cognitive load of self-protection.',
    businessApp: 'A ten-minute genuine conversation produces more oxytocin (and better outcomes) than a sixty-minute status update meeting.'
  },
  testosterone: {
    name: 'Testosterone',
    label: 'The Confidence & Drive Chemical',
    icon: '🟠',
    color: '#ff6b35',
    boostedBy: 'Winning (even small victories), exercise, power posture, competitive success, adequate sleep, cold exposure.',
    effect: 'Risk tolerance, assertiveness, decision confidence, competitive drive, spatial reasoning.',
    depletedBy: 'Chronic stress (cortisol directly suppresses testosterone), poor sleep, sedentary lifestyle, sustained defeat without recovery.',
    keyInsight: 'Affects BOTH men\'s and women\'s leadership confidence. The winner effect is real: winning creates a testosterone spike that makes the next win more likely.',
    businessApp: 'Leaders who start their day with a physical win (exercise, cold shower) carry elevated testosterone into their first decision of the day.'
  },
  endorphins: {
    name: 'Endorphins',
    label: 'The Pain-Relief & Flow Chemical',
    icon: '🟣',
    color: '#9775fa',
    releasedBy: 'Sustained physical effort, laughter, flow states, creative expression, music, spicy food.',
    effect: 'Pain tolerance, euphoria, stress resilience, sustained focus, gateway to flow state.',
    keyInsight: 'Released approximately twenty minutes into sustained effort. This explains why the first twenty minutes of deep work feel awful but minute twenty-five feels effortless.',
    businessApp: 'The leader who exercises before work is flooding their brain with the same chemical that unlocks flow state. Exercise is the most underused leadership performance tool.'
  }
};

// ─── Video Structure (60-second format) ───────────────────────
// Production: Manus slide deck + HeyGen avatar + ElevenLabs voice
export const VIDEO_STRUCTURE = {
  targetLength: 60,
  range: { min: 30, max: 90 },
  production: 'Manus slide deck + HeyGen AI avatar (circle overlay, corner position) + ElevenLabs cloned voice narration',
  sections: [
    { name: 'Hook Slide', seconds: '1-5', description: 'One provocative statement in large text on screen. Avatar appears in corner and says it out loud. Must stop the scroll.' },
    { name: 'The Chemical', seconds: '5-15', description: 'Name the specific chemical, what it does, and the one thing most people get wrong about it. One slide with clean visual of chemical name or simple brain graphic. Avatar narrates.' },
    { name: 'The Insight', seconds: '15-40', description: 'Two to three slides walking through the key finding. Research source, specific data point, what it means for a business leader. Avatar narrates each slide transition.' },
    { name: 'The Bridge', seconds: '40-50', description: 'One slide connecting to the viewer\'s daily life. Direct, personal, specific. Avatar delivers looking at camera.' },
    { name: 'Engagement Trigger', seconds: '50-60', description: 'Final slide with a question. Avatar asks the question. CTA appears as text overlay or in post caption.' }
  ],
  slideDesign: 'Clean, minimal design. Dark backgrounds with bold white/accent text. One key number or statement per slide. Camino branding consistent across all slides. No clutter.',
  avatarPosition: 'Circle overlay in bottom-right corner.',
  elevenLabsRule: 'All numbers in the narration script must be written out in full text, not numerals. "Two thousand two hundred and forty nine" not "2,249". "Eighty one percent" not "81%".'
};


export const AUTHORITY_LINES = [
  'After 10 seasons embedded in elite motorsport paddocks, from F1 pit lanes to F4 garages, I have seen this same pattern in the boardroom too.',
  '25 years in corporate management, from BMW Dubai to Swiss private equity, taught me what the textbooks leave out about performance under pressure.',
  'Working with athletes across 312 circuits worldwide, plus CEOs running £10M+ businesses, the data on this is remarkably consistent.',
  'Pattern recognition across 2,249 performance debriefs, 699 personal bests, and 394 podiums showed me something that applies to every leader I work with.',
  '2,249 performance debriefs across 57 months, tracking everything from heart rate to decision quality, reveal the same bottleneck every time.'
];

// ─── Business Case Studies ───────────────────────────────────
export const CASE_STUDIES = [
  { name: 'Walter Alblas', role: 'CEO', result: 'Cut hours from 70 to 45 per week. Revenue went UP.', useFor: 'Grind delusion, overwork, energy management' },
  { name: 'Angela Chapman', role: 'Team leader', result: 'Transformed a struggling young team into consistent performers.', useFor: 'Team performance, delegation, psychological safety' }
];

// ─── Business Leader Data Points ─────────────────────────────
export const LEADER_INSIGHTS = [
  'McKinsey: Executives in flow are up to 500% more productive.',
  'Gallup: 84% of knowledge workers are chronically stressed.',
  'Average uninterrupted focus time: 11 minutes.',
  'Average deep work per day: 2.5 hours.',
  '56 interruptions per day on average.',
  'Email checked 36 times daily on average.',
  'CEOs make 35,000 decisions per day. By 4pm, quality drops 40%.',
  'Cortisol suppresses creative thinking by up to 40%.',
  'A £50 expense report burns the same decision muscle as an M&A call.',
  'Most leaders experience flow for less than 5% of their working day.'
];

// ─── Funnel Path ─────────────────────────────────────────────
export const FUNNEL = {
  step1: 'LinkedIn Post (value + unrelated CTA)',
  step2: 'Winning Formula Assessment (ScoreApp, 25 questions, 3 minutes)',
  step3: 'Instant personalised report (5 pillars, most score below 50%)',
  step4: 'Executive Flow Blueprint (3-day free training, opens 3x/year)',
  step5: 'Championship Strategy Call',
  step6: 'P1 Programme (£4,000, 43% close rate)'
};

// ─── Winning Formula 5 Pillars ───────────────────────────────
export const WINNING_FORMULA_PILLARS = [
  'Clarity Under Pressure',
  'Focus & Flow',
  'Execution Rhythm',
  'Feedback & Debrief Loops',
  'Influence & Culture'
];

// ─── Motorsport Bridge Lines (unique differentiator) ──────────
export const MOTORSPORT_BRIDGES = [
  'I see this in the motorsport paddock every weekend. The driver who tries hardest is almost always the one who crashes.',
  'In F1, pit crews make 80 decisions in 2.4 seconds. They do not think harder. They think less. The parallel to your boardroom is exact.',
  'I have watched drivers lose qualifying positions because their brain switched from flow to survival mode between Turns 3 and 4. The same switch happens to CEOs between agenda items.',
  'Race engineers do not tell drivers to "try harder." They say "trust the process." Your leadership is no different.',
  'After 1,800 performance debriefs with elite athletes, the number one finding is this: the best performers are the calmest under pressure. Not the hardest working.',
  'In motorsport, we measure everything. Heart rate. Reaction time. Braking points. The data always tells the same story: stress makes you slower, not faster.',
  'The difference between P1 and P5 in qualifying is rarely talent. It is mental state. The same applies to CEOs making decisions at 10am versus 4pm.'
];

// ─── 50 Opening Hooks (organised by Post Type) ───────────────
export const HOOKS = {
  scary: [
    'Your brain makes 35,000 decisions a day. By 4pm, it is running on fumes.',
    'The average executive is focused for 11 minutes before being interrupted.',
    '76% of leaders report making their worst decisions after 3pm.',
    'Every interruption costs you 23 minutes of recovery time. Not 23 seconds. Minutes.',
    'Cortisol does not care that you are in a board meeting, not a war zone.',
    'McKinsey found that executives in flow are 500% more productive. Most leaders experience flow for less than 5% of their day.',
    'Your open-door policy is destroying your team\'s ability to do deep work.',
    'The WHO just classified burnout as an occupational phenomenon. Not a personal weakness.',
    'Decision fatigue does not announce itself. It just quietly makes you worse at your job.',
    'You are not tired because you work too much. You are tired because you work in the wrong neurochemical state.'
  ],
  strange: [
    'The laziest CEO I ever coached outperformed every hustler in his industry.',
    'The best decision you will make this week is the one you do not make.',
    'What if doing less was the most productive thing you could do?',
    'The CEO who cut his hours from 70 to 45 watched his revenue grow.',
    'Your subconscious processes 4 billion bits per second. Your conscious mind handles 110. Guess which one you are using to run your company.',
    'The worst thing you can do after a bad quarter is try harder.',
    'I have spent 10 seasons in motorsport paddocks. The drivers who try hardest are the ones who crash.',
    'The reason your best ideas come in the shower is neuroscience, not coincidence.',
    'Boredom makes you more creative than brainstorming sessions. Here is the data.',
    'The most dangerous words in business: "I will sleep when I am dead."'
  ],
  sexy: [
    'What would change if you could access your best thinking on demand?',
    'Imagine making every strategic decision from a state of calm clarity instead of cortisol-fuelled urgency.',
    'The leaders I work with do not work fewer hours because they are lazy. They work fewer hours because they have optimised the hours that matter.',
    'Flow state is not a luxury. It is the operating system elite performers run on.',
    'There is a version of your leadership that is calm, decisive, and unshakeable. It is not aspirational. It is neurochemical.',
    'Walter cut 25 hours from his week. His team stopped coming to him for every decision. His revenue went up.',
    'What if the gap between you and your best performance was not effort? What if it was chemistry?',
    'Peak performance does not come from grinding harder. It comes from aligning your brain chemistry with your calendar.',
    'The leaders who dominate their industries are not working more. They are thinking better.',
    'Your next breakthrough is not hiding in another strategy document. It is hiding in your neurochemistry.'
  ],
  freeValue: [
    'Here is the exact breathing protocol used by fighter pilots, F1 drivers, and the CEOs I coach before high-stakes decisions.',
    'One question that will change your next meeting: "Is this a decision, an update, or a discussion?"',
    'The 3-minute reset that drops your cortisol and raises your cognitive clarity before any meeting.',
    'Stop starting your day with email. Here is what to do instead, and the neuroscience behind it.',
    'The simplest delegation framework I have found in 25 years of management: If someone else can do it 70% as well as you, delegate it.',
    'Before your next board meeting, do this for 90 seconds. It changes everything.',
    'Map your energy zones this week. The data will shock you.',
    'The 4-question debrief that turns every bad day into a performance upgrade.',
    'Your pre-meeting ritual matters more than your agenda. Here is why.',
    'One change to your calendar that will give you back 5 hours of deep work per week.'
  ],
  familiar: [
    'Google does not give engineers 20% time because they are generous. They do it because the data says it works.',
    'Patagonia\'s CEO surfs every morning. His company outperforms competitors who start at 6am.',
    'Pixar redesigned their entire building to maximise unplanned collisions. Not meetings. Collisions.',
    'Spotify\'s squad model is not about agility. It is about autonomy. And autonomy is a flow trigger.',
    'Jeff Bezos will not make a strategic decision after 3pm. Here is the neuroscience behind why.',
    'F1 pit crews make 80 decisions in 2.4 seconds. They do not think harder. They think less.',
    'Atlassian\'s ShipIt days generate more innovation in 24 hours than most companies produce in a quarter.',
    'Navy SEALs do not perform under pressure because they are fearless. They perform because they have trained their prefrontal cortex to override their amygdala.',
    'Ray Dalio built Bridgewater around radical transparency. The neuroscience shows why it works.',
    'When Satya Nadella took over Microsoft, the first thing he changed was not strategy. It was mindset.'
  ]
};

// ─── Neuroscience Mechanisms ─────────────────────────────────
export const MECHANISMS = [
  { name: 'Transient Hypofrontality', ref: 'Arne Dietrich 2003', description: 'Flow state = temporary down-regulation of prefrontal cortex. The inner critic goes offline. Strategic thinking becomes intuitive.' },
  { name: 'Amygdala Hijack', ref: 'Daniel Goleman', description: 'Under pressure, the amygdala overrides the prefrontal cortex. Rational, strategic thinking goes offline. Survival mode takes over.' },
  { name: 'Cortisol Flooding', ref: 'Stress physiology', description: 'Chronic stress releases cortisol, suppressing creativity by 40%, impairing decision quality, and creating the "always-on" state leaders mistake for productivity.' },
  { name: 'Decision Fatigue', ref: 'Baumeister et al.', description: 'The prefrontal cortex depletes through use. Every micro-decision drains the same resource as strategic ones. By 4pm, quality drops 40%.' },
  { name: 'The Goldilocks Zone', ref: 'Csikszentmihalyi', description: 'Peak performance occurs when challenge matches skill. Too little challenge = boredom and atrophy. Too much = anxiety and overwhelm.' },
  { name: 'Cognitive Switching Tax', ref: 'Gloria Mark, UC Irvine', description: '23 minutes to recover focus after an interruption. Average focus before distraction: 11 minutes. The maths is devastating.' }
];

// ─── Neuroscience Lexicon ────────────────────────────────────
export const LEXICON = {
  'The Drunken Monkey': 'The conscious, prefrontal cortex. Slow (110 bits/sec), anxious, overthinking, creates worst-case scenarios.',
  'The Genius Mind': 'The subconscious brain. Fast (4 billion bits/sec), intuitive, creative, capable. Where flow state operates.',
  'Flow State': 'Optimal performance state where overthinking disappears. Dopamine, norepinephrine, and acetylcholine synchronised.',
  'Amygdala Hijack': 'When the threat centre overrides rational decision-making under pressure.',
  'Transient Hypofrontality': 'Temporary down-regulation of the inner critic during flow.',
  'Survival Mode': 'Constant low-grade fight-or-flight. Cortisol-driven. 110 bits/sec. Reactive, not strategic.',
  'The 23-Minute Recovery': 'Every interruption costs 23 minutes of focus recovery. Average deep work stretch: 11 minutes.',
  'Energy Zones vs Drain Zones': 'Hours spent in high-energy alignment vs hours spent in cognitive drain. 40 energy hours outperform 70 drain hours.',
  'Decision Muscle': 'The prefrontal resource depleted by every choice. A £50 expense report uses the same muscle as M&A.',
  'Curiosity Atrophy': 'When routine removes novelty, the brain literally atrophies. Leaders become measurably less intelligent.'
};

// ─── 7-Day Campaign Arc (matches revised pillars) ────────────
export const CAMPAIGN_ARC = [
  { day: 'Monday', purpose: 'Hidden Cost (Scary)', emotion: 'Fear/Urgency: "That is costing me more than I realised"', wordCount: '200-350' },
  { day: 'Tuesday', purpose: 'Brain Breakthrough (Strange)', emotion: 'Wonder/Surprise: "I had no idea the brain could do that"', wordCount: '200-350' },
  { day: 'Wednesday', purpose: 'Human Achievement (Familiar)', emotion: 'Aspiration/Inspiration: "If they did it, I can too"', wordCount: '200-350' },
  { day: 'Thursday', purpose: 'Camino Data Insight (Strange/Sexy)', emotion: 'Credibility/Authority: "This data is unique"', wordCount: '200-350' },
  { day: 'Friday', purpose: 'The Positive Edge (Sexy)', emotion: 'Desire/Motivation: "I want that edge"', wordCount: '200-350' },
  { day: 'Saturday', purpose: 'The Tool (Free Value)', emotion: 'Empowerment/Agency: "I can try this today"', wordCount: '200-350' },
  { day: 'Sunday', purpose: 'Winning Ways (Familiar)', emotion: 'Confidence/Belief: "If they used this principle, I can too"', wordCount: '200-350' }
];

// ─── CTA Rotation Schedule (matches WEEKLY_SCHEDULE) ─────────
export const CTA_ROTATION_SCHEDULE = {
  1: 'cta-a',    // Monday: Assessment
  2: 'cta-b',    // Tuesday: Data/Curiosity
  3: 'cta-d',    // Wednesday: Short & Sharp
  4: 'cta-a',    // Thursday: Assessment
  5: 'cta-c',    // Friday: Training Window
  6: 'cta-b',    // Saturday: Data/Curiosity
  0: 'cta-d'     // Sunday: Short & Sharp
};

// ─── Seasonal CTA Logic ──────────────────────────────────────
export function getActiveCTAs() {
  // All CTAs always active for business leaders (not seasonal like racing)
  return [...CTAS];
}

// ─── Rotating CTA (follows weekly schedule) ──────────────────
let ctaRotationIndex = 0;
export function getRotatingCTA() {
  const cta = CTAS[ctaRotationIndex % CTAS.length];
  ctaRotationIndex++;
  return cta;
}

export function resetCTARotation() {
  ctaRotationIndex = 0;
}

// ─── Rotating Authority Line (no repetition) ─────────────────
let authorityRotationIndex = 0;
export function getRotatingAuthority() {
  const line = AUTHORITY_LINES[authorityRotationIndex % AUTHORITY_LINES.length];
  authorityRotationIndex++;
  return line;
}

export function resetAuthorityRotation() {
  authorityRotationIndex = 0;
}

// ─── Rotating Motorsport Bridge ──────────────────────────────
let motorsportBridgeIndex = 0;
export function getRotatingMotorsportBridge() {
  const bridge = MOTORSPORT_BRIDGES[motorsportBridgeIndex % MOTORSPORT_BRIDGES.length];
  motorsportBridgeIndex++;
  return bridge;
}

export function resetMotorsportBridgeRotation() {
  motorsportBridgeIndex = 0;
}

// ─── Weekly Helpers (use defined schedule) ────────────────────
export function getWeeklyPillars() {
  return WEEKLY_SCHEDULE.map(day => PILLARS.find(p => p.id === day.pillarId));
}

export function getWeeklyFrameworks() {
  return WEEKLY_SCHEDULE.map(day => FRAMEWORKS.find(f => f.id === day.frameworkId));
}

export function getWeeklyCTAs() {
  return WEEKLY_SCHEDULE.map(day => CTAS.find(c => c.id === day.ctaId));
}

export function getRandomPillar(exclude = []) {
  const available = PILLARS.filter(p => !exclude.includes(p.id));
  if (available.length === 0) return PILLARS[Math.floor(Math.random() * PILLARS.length)];
  return available[Math.floor(Math.random() * available.length)];
}

export function getRandomFramework(exclude = []) {
  const available = FRAMEWORKS.filter(f => !exclude.includes(f.id));
  if (available.length === 0) return FRAMEWORKS[Math.floor(Math.random() * FRAMEWORKS.length)];
  return available[Math.floor(Math.random() * available.length)];
}

// ─── Business Calendar Context ───────────────────────────────
export function getSeasonalContext(date = new Date()) {
  const month = date.getMonth();

  if (month >= 0 && month <= 2) {
    return { season: 'Q1 Planning', context: 'New year goals, Q1 planning fatigue, fresh start effect, Davos aftermath, AI adoption cognitive overload, budget season decision fatigue' };
  } else if (month >= 3 && month <= 5) {
    return { season: 'Q2 Execution', context: 'Mid-year burnout spike, Q2 performance pressure, pre-holiday executive fatigue, half-year review stress' };
  } else if (month >= 6 && month <= 8) {
    return { season: 'Q3 Pressure', context: 'Back from holiday re-engagement, Q3 performance anxiety, September surge cognitive load, budget season stress, board presentation pressure' };
  } else {
    return { season: 'Q4 Finals', context: 'End of year burnout, holiday leadership guilt, annual review anxiety, next year planning fatigue, Q4 crunch' };
  }
}

// ─── LinkedIn Safe Phrases ───────────────────────────────────
export const SAFE_PHRASES = [
  'What has been your experience with this?',
  'Does this resonate?',
  'Agree or disagree?',
  'What would you add?',
  'Have you noticed this pattern?',
  'Drop your thoughts below.'
];

export const BANNED_PHRASES = [
  'Like if you agree',
  'Share with someone who needs this',
  'Tag a friend',
  'Link in bio',
  'Double tap',
  'Follow for more'
];

// ─── AI Image Generation Prompts by Pillar (Type 3 only) ─────
export const AI_IMAGE_PROMPTS = {
  'hidden-cost': 'Neuroscience visualisation of cognitive damage from chronic stress. Brain with warm orange cortisol flooding prefrontal cortex, creative centres dimming. Dramatic medical illustration, dark background. No text, no logos. Square 1:1 format.',
  'brain-breakthrough': 'Abstract neuroscience visualisation of neuroplasticity and cognitive renewal. Bright golden new neural pathways forming across brain hemispheres. Bioluminescent growth, electric blue and gold synaptic connections. Dark background. No text, no logos. Square 1:1 format.',
  'human-achievement': 'Neuroscience visualisation of peak cognitive performance. Brain in heightened flow state with synchronised neural pathways glowing in harmonious blue-green. Pattern recognition networks illuminated. Dark background, medical illustration style. No text, no logos. Square 1:1 format.',
  'camino-data': 'Data visualisation concept showing performance metrics and brain scan overlay. Flow state measurements, biometric readouts, confidence scores displayed as glowing data points around a brain silhouette. Dark background with accent blue. No text, no logos. Square 1:1 format.',
  'positive-edge': 'Neuroscience visualisation of brain in optimal state. Prefrontal cortex fully illuminated, dopamine and norepinephrine pathways glowing. Calm, powerful, high-performance brain imagery. Dark background with electric blue and warm gold. No text, no logos. Square 1:1 format.',
  'the-tool': 'Neuroscience visualisation of parasympathetic activation through breathing. Vagus nerve illuminated with calming blue-green, prefrontal cortex brightening as amygdala dims. The brain switching from stress to clarity. Dark background. No text, no logos. Square 1:1 format.',
  'winning-ways': 'Abstract neuroscience visualisation of cognitive mastery. Brain with fully connected neural networks, flow state harmony, multiple systems working in synchrony. Aspirational, powerful, premium feel. Dark background with gold accents. No text, no logos. Square 1:1 format.'
};

// ─── Data Card Templates by Pillar (Type 1 guidance) ──────────
export const DATA_CARD_TEMPLATES = {
  'hidden-cost': { stat: '683 HOURS', subtext: 'of productive time lost every year to interruption recovery.', source: 'University of California research', accentColor: '#e84444' },
  'brain-breakthrough': { stat: 'REVERSIBLE', subtext: 'Cognitive aging can be reversed by a decade with targeted brain exercises.', source: 'NIH-funded research', accentColor: '#ff6b35' },
  'human-achievement': { stat: '5,127', subtext: 'failed prototypes before Dyson got it right. Neuroplasticity in action.', source: 'James Dyson', accentColor: '#ffd43b' },
  'camino-data': { stat: '2.7x', subtext: 'more personal bests when confidence is 8.5+/10.', source: '2,249 performance debriefs', accentColor: '#4dabf7' },
  'positive-edge': { stat: '500%', subtext: 'more productive. Executives in flow state. McKinsey measured it.', source: 'McKinsey research', accentColor: '#9775fa' },
  'the-tool': { stat: '81%', subtext: 'of successful sessions start with box breathing. 2 minutes. Free.', source: 'Camino Coaching data', accentColor: '#69db7c' },
  'winning-ways': { stat: '20%', subtext: 'of work time at Google produces 50% of their best innovations.', source: 'Google internal data', accentColor: '#f783ac' }
};

// ─── Text Quote Templates (Type 4 guidance) ──────────────────
export const TEXT_QUOTE_TEMPLATES = [
  'Your prefrontal cortex is not in decline. It is in underuse.',
  'Confidence is not a feeling. It is a 2.7x multiplier.',
  'The driver who tries hardest is the one who crashes. The leader who hustles hardest is the one who burns out.',
  'Your brain built your business. It can be rewired to build the next chapter too.',
  'Energy management is not what you do instead of work. It is what makes your work actually work.',
  'Flow is not a luxury. It is the operating system elite performers run on.',
  'The 90-minute focus block is not a productivity hack. It is a neurochemical reality.'
];

// ═══════════════════════════════════════════════════════════════
// 📊 PROPRIETARY DATA REPORT — THREE-LAYER SYSTEM
// Source: Camino Coaching Performance Debrief Data Report
// 2,249 debriefs across 57 months
// ═══════════════════════════════════════════════════════════════

// ─── LAYER 1: HEADLINE AUTHORITY ANCHORS ──────────────────────
// Big numbers that establish scale and credibility.
// Rule: Use ONE per post, max ~3 posts per week. Rotate through all.
// Appears in the first two lines as a credibility signal, NOT as the main topic.
export const AUTHORITY_ANCHORS = [
  {
    id: 'anchor-debriefs',
    stat: '2,249',
    label: 'performance debriefs',
    fullLine: 'After tracking 2,249 performance debriefs across 57 months, one pattern keeps appearing...',
    category: 'volume'
  },
  {
    id: 'anchor-circuits',
    stat: '312',
    label: 'circuits worldwide',
    fullLine: 'Across 312 circuits, from MotoGP paddocks to F4 garages, the data tells the same story.',
    category: 'breadth'
  },
  {
    id: 'anchor-months',
    stat: '57',
    label: 'months of continuous data',
    fullLine: '57 months of continuous performance data. Not theory. Not opinion. Measured outcomes.',
    category: 'duration'
  },
  {
    id: 'anchor-pbs',
    stat: '699',
    label: 'personal bests recorded',
    fullLine: '699 personal bests. Each one preceded by a pattern the athlete was not even aware of.',
    category: 'results'
  },
  {
    id: 'anchor-podiums',
    stat: '394',
    label: 'podium finishes',
    fullLine: 'What do 394 podium finishes have in common? It is not talent. It is preparation protocol.',
    category: 'results'
  },
  {
    id: 'anchor-wins',
    stat: '138',
    label: 'race wins',
    fullLine: '138 race wins. The mental state before each one was virtually identical. That is not coincidence.',
    category: 'results'
  }
];

// ─── LAYER 2: SPECIFIC INSIGHT HOOKS ──────────────────────────
// Individual data points that become the central topic of a post.
// Rule: Use ONE as the central topic per post. Never repeat in
//       consecutive posts. Rotate through all before repeating.
export const INSIGHT_HOOKS = [
  {
    id: 'insight-confidence',
    title: 'Confidence 2.7x Multiplier',
    finding: 'Riders scoring 8.5+/10 confidence achieve personal bests at 2.7x the rate of low-confidence riders.',
    stat: '2.7x',
    useFor: 'Scary posts about what low confidence is actually costing you, bridged to business leaders who underestimate the cost of self-doubt on decision quality.',
    framework: 'scary',
    businessBridge: 'When a CEO walks into a board meeting with low confidence, every decision in that room is statistically worse. The data says 2.7x worse.',
    dataCardText: 'CONFIDENCE 8.5+/10 = 2.7x MORE PERSONAL BESTS'
  },
  {
    id: 'insight-box-breathing',
    title: '81% Box Breathing Correlation',
    finding: '81% of successful sessions use box breathing preparation.',
    stat: '81%',
    useFor: 'Strange posts about a technique that takes 2 minutes but predicts session success better than talent or experience.',
    framework: 'strange',
    businessBridge: 'A 2-minute breathing exercise predicts success more reliably than talent. The question for leaders: what is your 2-minute pre-decision protocol?',
    dataCardText: '81% OF SUCCESSFUL SESSIONS START WITH BOX BREATHING'
  },
  {
    id: 'insight-centering-gap',
    title: 'Centering Gap (6.43 vs 7.5)',
    finding: 'Average centering scores are 6.43 versus optimal 7.5.',
    stat: '6.43 vs 7.5',
    useFor: 'Free Value posts giving the audience a specific benchmark to measure themselves against.',
    framework: 'free-value',
    businessBridge: 'If you scored your mental centredness right now, out of 10, would you be closer to 6.43 or 7.5? The gap between those numbers is where performance lives.',
    dataCardText: 'CENTERING SCORE: 6.43 AVERAGE vs 7.5 OPTIMAL'
  },
  {
    id: 'insight-debrief-frequency',
    title: 'PB Rate vs Debrief Frequency',
    finding: 'Athletes with 50+ debriefs achieve PB rates above 50%. Those who debrief sporadically perform significantly worse.',
    stat: '50+ debriefs = 50%+ PB rate',
    useFor: 'Scary posts about the cost of not reviewing your performance, bridged to business leaders who never debrief their own decisions.',
    framework: 'scary',
    businessBridge: 'When was the last time you sat down after a major decision and debriefed it the way an elite athlete debriefs a session? Most leaders never do. The data shows the cost.',
    dataCardText: '50+ DEBRIEFS = 50%+ PERSONAL BEST RATE'
  },
  {
    id: 'insight-flow-improvement',
    title: 'Flow Score +36% (Lavery Case Study)',
    finding: 'Calum Lavery went from 6.04 to 8.21, a 36% improvement in flow score.',
    stat: '+36%',
    useFor: 'Case study posts proving the methodology works, without naming the specific tools (WOW not HOW).',
    framework: 'sexy',
    businessBridge: 'Imagine your cognitive performance improving by 36% in 12 months. Not through working harder. Through working with your brain chemistry, not against it.',
    dataCardText: 'FLOW SCORE: 6.04 → 8.21 (+36% IMPROVEMENT)'
  },
  {
    id: 'insight-consistency-wins',
    title: 'Consistency Beats Talent (Beach)',
    finding: 'Calum Beach, 50% win rate, 85% podium rate from consistent debrief use.',
    stat: '50% wins / 85% podium',
    useFor: 'Strange posts about how the most consistent performer in the dataset is not the most talented, bridged to business where consistency beats brilliance.',
    framework: 'strange',
    businessBridge: 'The most consistent performer in our entire dataset was not the most talented. He just never stopped debriefing. In business, the leader who reviews decisions consistently will outperform the genius who does not.',
    dataCardText: '50% WIN RATE. 85% PODIUM RATE. CONSISTENCY > TALENT.'
  },
  {
    id: 'insight-elite-benchmark',
    title: 'Elite Benchmark (Buchanan 9.11/10)',
    finding: 'Cormac Buchanan scored 9.11/10 average flow across 30 debriefs at Moto3 World Championship level.',
    stat: '9.11/10',
    useFor: 'Sexy posts about what elite looks like when you measure it, bridged to what elite executive performance would look like if measured the same way.',
    framework: 'sexy',
    businessBridge: 'What would it look like if we could measure executive performance with the same precision? A CEO operating at 9.11 out of 10 cognitive flow in every board meeting. That is what elite actually looks like.',
    dataCardText: '9.11/10 FLOW SCORE. 30 DEBRIEFS. MOTO3 WORLD CHAMPIONSHIP.'
  }
];

// ─── LAYER 3: BRIDGE PATTERNS ─────────────────────────────────
// Templates for connecting motorsport data to business leaders.
// Rule: Rotate patterns. Never use the same in consecutive posts.
export const BRIDGE_PATTERNS = [
  {
    id: 'bridge-direct',
    name: 'Direct Parallel',
    prefix: 'Pattern A',
    template: 'The same pattern shows up in the boardroom. Leaders who {action} consistently {outcome}.',
    example: 'The same pattern shows up in the boardroom. Leaders who debrief their decisions weekly consistently make better calls under pressure.',
    useWhen: 'The motorsport finding has a direct business equivalent'
  },
  {
    id: 'bridge-question',
    name: 'Question Bridge',
    prefix: 'Pattern B',
    template: 'Now ask yourself: when was the last time you {comparison}?',
    example: 'Now ask yourself: when was the last time you debriefed a decision the way an elite athlete debriefs a session?',
    useWhen: 'You want the reader to reflect on their own behaviour'
  },
  {
    id: 'bridge-research',
    name: 'Research Bridge',
    prefix: 'Pattern C',
    template: 'This aligns with what {source} found about {topic}.',
    example: 'This aligns with what McKinsey found about executive decision-making under cognitive load.',
    useWhen: 'You can link the finding to well-known business research'
  },
  {
    id: 'bridge-client',
    name: 'Client Bridge',
    prefix: 'Pattern D',
    template: 'The business leaders I work with who apply this same {protocol} to their {context} consistently report {result}.',
    example: 'The business leaders I work with who apply this same debrief discipline to their weekly rhythm consistently report sharper decisions within the first month.',
    useWhen: 'You can reference real coaching outcomes'
  }
];

// ─── Data Layer Rotation Tracking ─────────────────────────────
let anchorRotationIndex = 0;
let insightRotationIndex = 0;
let bridgePatternRotationIndex = 0;
let anchorUsageThisWeek = 0;

export function getRotatingAnchor() {
  if (anchorUsageThisWeek >= 3) return null; // Max 3 per week
  const anchor = AUTHORITY_ANCHORS[anchorRotationIndex % AUTHORITY_ANCHORS.length];
  anchorRotationIndex++;
  anchorUsageThisWeek++;
  return anchor;
}

export function getRotatingInsight() {
  const insight = INSIGHT_HOOKS[insightRotationIndex % INSIGHT_HOOKS.length];
  insightRotationIndex++;
  return insight;
}

export function getRotatingBridgePattern() {
  const pattern = BRIDGE_PATTERNS[bridgePatternRotationIndex % BRIDGE_PATTERNS.length];
  bridgePatternRotationIndex++;
  return pattern;
}

export function resetDataLayerRotations() {
  anchorRotationIndex = 0;
  insightRotationIndex = 0;
  bridgePatternRotationIndex = 0;
  anchorUsageThisWeek = 0;
}

// ─── Get Data Layer Assignment for a Post ─────────────────────
// Returns which anchor, insight, and bridge pattern to use
export function getDataLayerForPost(dayIndex) {
  const insight = getRotatingInsight();
  const bridgePattern = getRotatingBridgePattern();
  // Only assign an anchor to ~3 posts per week (Mon, Wed, Fri)
  const anchorDays = [0, 2, 4]; // Mon, Wed, Fri get anchors
  const anchor = anchorDays.includes(dayIndex) ? getRotatingAnchor() : null;
  return { anchor, insight, bridgePattern };
}

// ═══════════════════════════════════════════════════════════════
// ⭐ CLIENT REVIEW LANGUAGE BANK
// Source: 84 Trustpilot reviews (4.9/5, 100% five-star)
// Plus Google reviews
// ═══════════════════════════════════════════════════════════════

// ─── Social Proof Stats ──────────────────────────────────────
// Rule: Use no more than 2x per week, typically in CTA section.
export const SOCIAL_PROOF = {
  trustpilot: {
    rating: '4.9/5',
    totalReviews: 84,
    fiveStarPercent: '100%',
    url: 'https://uk.trustpilot.com/review/caminocoaching.co.uk',
    ctaLine: '4.9/5 on Trustpilot. 84 reviews. 100% five-star.',
    shortLine: '84 five-star Trustpilot reviews'
  }
};

// ─── Client Language Patterns (USE PATTERNS, NOT QUOTES) ─────
// These are the exact thought patterns real clients use.
// The AI should MIRROR this language when describing problems
// and transformations. NEVER fabricate quotes. NEVER attribute
// specific words to named clients without permission.
export const CLIENT_LANGUAGE_PATTERNS = [
  {
    id: 'pattern-false-attribution',
    pattern: 'False Attribution',
    clientPhrase: 'I thought it was seat time or bike, but I have done both at no avail.',
    businessMirror: 'Most leaders think the problem is their strategy. Or their team. Or their workload. It is rarely any of those things.',
    useFor: 'Opening hooks that challenge the audience to question their own assumptions about what is actually holding them back.',
    source: 'Sami C'
  },
  {
    id: 'pattern-decade-breakthrough',
    pattern: 'Breakthrough After Plateau',
    clientPhrase: 'I felt new levels of both fierceness and joy which I had never before experienced during the past 10 years.',
    businessMirror: 'After a decade of running the company the same way, something shifted. Not the strategy. The operating system running the strategy.',
    useFor: 'Sexy posts about what breakthrough feels like after years of plateau. Bridge to leaders who have been running on autopilot.',
    source: 'Angela B'
  },
  {
    id: 'pattern-game-changer',
    pattern: 'Game Changer Transformation',
    clientPhrase: 'It has been a game changer. Craig does not just give generic advice. He actually takes the time to understand you.',
    businessMirror: 'The leaders who make the biggest shifts are not getting generic advice. They are getting precision diagnosis of their specific cognitive bottleneck.',
    useFor: 'Posts differentiating Craig from generic coaching. Bridge to why personalised performance diagnosis matters.',
    source: 'Harry Cook'
  },
  {
    id: 'pattern-measurable-improvement',
    pattern: 'Measurable Step Up',
    clientPhrase: 'Podiums in all four of my starts for the season. This has been a huge step up from previous seasons.',
    businessMirror: 'The difference showed up in the numbers. Not gradually. Within the first quarter.',
    useFor: 'Case study posts showing measurable results (WOW not HOW). Bridge to leaders who want proof, not promises.',
    source: 'Jonathan Prince'
  },
  {
    id: 'pattern-life-skills-crossover',
    pattern: 'Not Just Racing, Life Skills',
    clientPhrase: 'Not only does the coaching help with racing but it also provides invaluable life skills such as building mental resilience, dealing with setbacks and disappointment and emotional regulation.',
    businessMirror: 'The cognitive performance tools that work under 200mph pressure do not switch off when you walk into the boardroom. The leaders I work with apply them to quarterly reviews, difficult conversations, and strategic planning.',
    useFor: 'Bridge posts that explicitly connect motorsport coaching to business value. This language validates the crossover.',
    source: 'Parent review'
  },
  {
    id: 'pattern-mindset-control',
    pattern: 'Control Over Mindset',
    clientPhrase: 'Giving me control over my mindset and thoughts leading up to and during race meetings, which I have struggled with in years gone by.',
    businessMirror: 'What would change if you had genuine control over your mental state before every board meeting, investor call, or high-stakes negotiation?',
    useFor: 'Sexy/aspirational posts about the feeling of cognitive control. Bridge to pre-meeting anxiety leaders experience.',
    source: 'Noel Smith'
  },
  {
    id: 'pattern-negative-spiral',
    pattern: 'Breaking the Negative Spiral',
    clientPhrase: 'Before I would often have a bad session and let my negative thoughts take over me, affecting me for the rest of the weekend. That has completely changed now.',
    businessMirror: 'One bad meeting used to derail the entire week. The negative loop would compound, session by session, until Friday felt like damage control.',
    useFor: 'Scary posts about the compounding cost of unmanaged negative thought patterns. Bridge to how one bad decision spirals.',
    source: 'Rachel Robertson'
  },
  {
    id: 'pattern-fear-of-success',
    pattern: 'Fear of Success',
    clientPhrase: 'One of my personal revealings has been a fear of success. My problem is away from the machine where I have to front up to the world.',
    businessMirror: 'The surprising finding in coaching high performers: the thing holding many leaders back is not fear of failure. It is fear of the visibility that comes with success.',
    useFor: 'Strange/counterintuitive posts about hidden psychological barriers. Bridge to imposter syndrome in senior leaders.',
    source: 'Sebastian Downie'
  }
];

// ─── Anonymised Case Study Frameworks ────────────────────────
// Ready-to-use story arcs built from real reviews.
// Rules: Never name the client. Change identifying details if needed.
// Keep the transformation arc accurate. Always bridge to business.
export const ANON_CASE_STUDIES = [
  {
    id: 'case-decade-plateau',
    title: 'The 10-Year Plateau',
    setup: 'A rider came to me after 10 years on track. They had spent thousands on bikes, coaches, and track days. Nothing was shifting their lap times.',
    transformation: 'Within one module of working on their mental preparation, they felt something they had never experienced in a decade of racing.',
    businessBridge: 'The same thing happens in boardrooms every day. Leaders invest in new tools, new hires, new strategies. But the brain running the operation has not been upgraded since their last crisis rewired it for survival mode.',
    framework: 'strange'
  },
  {
    id: 'case-equipment-blame',
    title: 'The Equipment Blame',
    setup: 'One athlete had spent more money on equipment upgrades than they would like to admit. New bike, fancy parts, private coaches, race schools. The results barely moved.',
    transformation: 'When they shifted focus to the cognitive preparation, they discovered levels of performance they did not know existed. After 10 years.',
    businessBridge: 'How much have you spent on tools, software, consultants, and restructuring? What if the bottleneck was never the equipment? What if it was the operating system running it?',
    framework: 'scary'
  },
  {
    id: 'case-nervous-rider',
    title: 'The Imposter in the Paddock',
    setup: 'A rider felt they did not belong. They were a nervous wreck before every session, convinced they would never be as good as the others around them.',
    transformation: 'After completing the mental preparation protocols, they went to a track in Spain and the difference was unrecognisable. New self-belief, calm under pressure, and lap times that finally reflected their actual ability.',
    businessBridge: 'There are senior leaders sitting in board meetings right now, running successful companies, who feel exactly the same way. The imposter feeling does not scale with success. It scales with visibility.',
    framework: 'sexy'
  },
  {
    id: 'case-parent-perspective',
    title: 'The Parent Who Saw The Change',
    setup: 'A parent watched their young racer struggle with setbacks, negative spirals, and emotional reactions that ruined entire race weekends.',
    transformation: 'The coaching did not just improve lap times. It built mental resilience, emotional regulation, and the ability to recover from setbacks quickly. Skills that transfer to every part of life.',
    businessBridge: 'The cognitive skills that help a 16-year-old recover from a crashed qualifying session are the same skills that help a CEO recover from a failed product launch. The neuroscience is identical.',
    framework: 'free-value'
  },
  {
    id: 'case-professional-fun',
    title: 'The Professional Who Lost The Joy',
    setup: 'A retired professional racer was no longer having fun at track days. Performance anxiety about other riders had replaced the passion that brought them into the sport.',
    transformation: 'By restructuring their approach to track days with the same mental preparation they used as a professional, they rediscovered what it felt like to actually enjoy performing under pressure.',
    businessBridge: 'How many CEOs started their company because they loved the work, and now cannot remember the last time they enjoyed a Monday morning? The joy does not disappear. It gets buried under cortisol.',
    framework: 'strange'
  },
  {
    id: 'case-five-year-journey',
    title: 'The 5-Year Compound Effect',
    setup: 'One athlete has worked with the methodology for 5 years. From day one, they improved their mental approach and saw immediate gains.',
    transformation: 'The results compounded. Five years of consistent mental preparation turned them into one of the most consistent performers in their championship. The gains never stopped.',
    businessBridge: 'The leaders who still meditate, debrief, and protect their cognitive preparation after 5 years are not doing it because they have to. They are doing it because the compound effect is undeniable. Each year, the returns get larger.',
    framework: 'sexy'
  }
];

// ─── WOUTER ALBLAS — Business Client Bridge Validation ───────
// This review is Craig's motorsport-to-business bridge PROVEN
// by a real client who experienced both worlds.
export const WOUTER_ALBLAS_REVIEW = {
  name: 'Wouter Alblas',
  country: 'NL',
  title: 'Craig taught me to be the better version of me',
  quote: 'Focusing on growth mindset made my life more complete and successful. The moment we conquer our brain we become stronger, more resilient, happier and a lot of other things which make life more easy and complete. Growth mindset changed my life and that of my family for the better.',
  context: 'First from the motor racing paddock and now also as a life and business coach.',
  significance: 'This is Craig\'s ideal business client avatar: someone who came through motorsport and validated the crossover to business and life. Use this when bridging motorsport methodology to executive coaching.',
  useAs: 'Authority proof that the methodology crosses from track to boardroom. Wouter experienced both and confirms it works in both contexts.'
};

// ─── Review Layer Rotation Tracking ──────────────────────────
let caseStudyRotationIndex = 0;
let languagePatternRotationIndex = 0;
let socialProofUsageThisWeek = 0;

export function getRotatingCaseStudy() {
  const study = ANON_CASE_STUDIES[caseStudyRotationIndex % ANON_CASE_STUDIES.length];
  caseStudyRotationIndex++;
  return study;
}

export function getRotatingLanguagePattern() {
  const pattern = CLIENT_LANGUAGE_PATTERNS[languagePatternRotationIndex % CLIENT_LANGUAGE_PATTERNS.length];
  languagePatternRotationIndex++;
  return pattern;
}

export function canUseSocialProof() {
  if (socialProofUsageThisWeek >= 2) return false;
  socialProofUsageThisWeek++;
  return true;
}

export function resetReviewRotations() {
  caseStudyRotationIndex = 0;
  languagePatternRotationIndex = 0;
  socialProofUsageThisWeek = 0;
}
