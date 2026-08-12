/* =========================================================================
   Wallace Family Farms — content/data layer (self-contained, editable).

   HOW TO CHANGE A PHOTO (no code needed):
   Every picture is a file in the /images folder. To swap one, upload your
   own photo to /images with the SAME filename (see PHOTOS.md). Until you do,
   the site shows a tasteful stock photo automatically, then a monogram panel.
   ========================================================================= */
(function () {
  // Local photo files you can replace (drag your own into /images, same name).
  var IMG = {
    hero:       'images/hero.jpg',
    philosophy: 'images/philosophy.jpg',
    cattle:     'images/cattle.jpg',
    cattleWide: 'images/cattle-wide.jpg',
    sheep:      'images/sheep.jpg',
    goats:      'images/goats.jpg',
    ranch:      'images/ranch.jpg',
    herd:       'images/herd.jpg',
    events:     'images/events.jpg',
    wool:       'images/wool.jpg',
    yarn:       'images/yarn.jpg',
    soap:       'images/soap.jpg',
    honey:      'images/honey.jpg'
  };
  // Automatic fallbacks (used only if the file above is missing). Swappable too.
  var STOCK = {
    hero:       'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=2200&q=80',
    philosophy: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=1400&q=80',
    cattle:     'https://images.unsplash.com/photo-1560743641-3914f2c45636?auto=format&fit=crop&w=1400&q=80',
    cattleWide: 'https://images.unsplash.com/photo-1546445317-29d45f9a4a0d?auto=format&fit=crop&w=1800&q=80',
    sheep:      'https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=1400&q=80',
    goats:      'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=1400&q=80',
    ranch:      'https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1800&q=80',
    herd:       'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=2200&q=80',
    events:     'https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1800&q=80',
    wool:       'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=1200&q=80',
    yarn:       'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=1200&q=80',
    soap:       'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&w=1200&q=80',
    honey:      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=80'
  };

  var SITE = {
    name: 'Wallace Family Farms',
    nameHtml: 'Wallace Family <em>Farms</em>',
    tagline: 'Heritage-grade goats, sheep, and cattle raised on the high plains.',
    credo: 'We honor the lineage of the land and the animal — <em>with deliberate, daily care.</em>',
    phone: '(555) 555-0100',
    email: 'hello@wallacefamilyfarms.com'
  };

  // species: imageKey/heroKey point at IMG (local) + STOCK (fallback)
  var SPECIES = {
    cattle: { key:'cattle', plural:'Cattle', kicker:'The Cattle', label:'Our Herd', heroTitle:'The Cattle Herd', crumb:'Cattle',
      title:'Deep-bodied, quiet <em>cattle</em>.',
      body:'Aberdeen Angus and Hereford lines bred for easy calving, deep constitution, and a temperament that makes them a pleasure to work. Every cow is known, every calf is recorded.',
      imageKey:'cattle', heroKey:'cattleWide' },
    sheep: { key:'sheep', plural:'Sheep', kicker:'The Sheep', label:'Our Flock', heroTitle:'The Flock', crumb:'Sheep',
      title:'Lustrous, gentle <em>sheep</em>.',
      body:'Romney and Border Leicester sheep chosen for their long-staple, high-crimp fleece and famously gentle disposition. A flock that thrives on attention and open ground.',
      imageKey:'sheep', heroKey:'sheep' },
    goats: { key:'goats', plural:'Goats', kicker:'The Goats', label:'Our Herd', heroTitle:'The Goat Herd', crumb:'Goats',
      title:'Maternal, sound <em>goats</em>.',
      body:'Nubian and Boer goats selected for maternal instinct and structural soundness — milkers with character and breeding stock with impeccable lines.',
      imageKey:'goats', heroKey:'goats' }
  };

  // Editable page wording (change these in the editor's "Website wording" tab).
  // <em>...</em> makes a word italic in the display serif.
  var COPY = {
    heroOverline:  'Goats · Sheep · Cattle',
    heroHeadline:  'Bloodlines kept for the <em>long</em> arc of a breed.',
    heroSub:       'A sanctuary of heritage husbandry where goats, sheep, and cattle are raised as breeding stock, fiber, and dairy — known by name, recorded for life, and stewarded with quiet care.',
    storyKicker:   'The Philosophy',
    storyHeading:  'We raise livestock as <em>heritage</em>, not as commodity.',
    storyP1:       'From the first acre we fenced, we have tended this high-plains pasture with deliberate care — keeping meticulous records of every bloodline, every temperament, every season. The result is livestock of uncommon constitution and quiet dignity.',
    storyP2:       'Our approach is unhurried by design. We breed for longevity, structural soundness, and the kind of maternal instinct that only attentive, daily stewardship can cultivate. Each animal is known by name, observed daily, and held to a standard worthy of the land they graze.',
    horizonHeading:'Counting down to <em>new life</em>.',
    nextHeading:   'However you\'d like to <em>begin</em>.',
    availHeading:      'Animals ready for their <em>next home</em>.',
    eventsKicker:      'On the Calendar',
    eventsHeading:     'Gather with us <em>through the seasons</em>.',
    eventsIntroHeading:'Come see the farm through the year.',
    eventsIntro:       'A handful of days each season when the gates open — to meet the new kids and calves, watch the shearing, or find your next animal. Most are casual; a couple ask that you let us know you\'re coming.',
    storeKicker:       'The Farm Store',
    storeHeading:      'From the flock and the <em>hearth</em>.',
    storeIntroHeading: 'Small-batch goods from our animals.',
    storeIntro:        'Fleece from the flock, milk soap from the does, honey from the hedgerows — made in small runs and sold as the seasons allow. To buy, send a note and we\'ll set it aside; pickup at the farm or the Saturday market.',
    storeCta:          'Want something you don\'t see here? <em>Just ask.</em>',
    inquireHeading:    'Begin a conversation about <em>your next animal</em>.'
  };

  // Events (shown on the Events page). Edit in the editor's "Events" section.
  var EVENTS = [
    { when:'March 14–15, 2027', title:'Spring Kidding Weekend', body:'Meet the Nubian and Boer kids their very first weekend on the ground. Bring the family — the little ones are hard to leave.', cta:'RSVP' },
    { when:'May 3, 2027', title:'Open Barn Day', body:'Walk the pasture, meet the herd and flock, and talk husbandry over coffee. No appointment needed — just come by.', cta:'Ask us more' },
    { when:'June 7, 2027', title:'Shearing Day', body:'Watch the Romney and Border Leicester flock get their summer haircut. Fresh fleece and roving available at the store table.', cta:'RSVP' },
    { when:'October 18, 2027', title:'Fall Production Sale', body:'Our best available stock, offered by private treaty. A quiet day among good animals and good people. RSVP appreciated.', cta:'RSVP' }
  ];

  // Store products. "img" is a photo key from IMG above (or a filename in /images).
  var PRODUCTS = [
    { name:'Raw Fleece & Roving', price:'$18', blurb:'Long-staple Romney and Border Leicester fleece, skirted and ready to spin.', img:'wool' },
    { name:'Hand-spun Yarn', price:'$26', blurb:'Our own fleece, washed, carded, and spun into soft worsted skeins.', img:'yarn' },
    { name:'Goat Milk Soap', price:'$8', blurb:'Creamy bars from our Nubian does\' milk, scented with herbs from the garden.', img:'soap' },
    { name:'Wildflower Honey', price:'$12', blurb:'Raw and unfiltered, from hives along the creek. A jar of the whole season.', img:'honey' }
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // THE ANIMALS.  To ADD one: copy a line below, paste it as a new line, and
  // change the values (keep the quotes and the comma at the end).
  //   slug     : lowercase id, no spaces — also the photo filename
  //   species  : must be exactly  cattle  |  sheep  |  goats
  //   status   : Available | Reserved | Sold  (Available/Reserved show on the
  //              Available Stock page; anything shows on the species page)
  // Then (optional) upload a photo to  images/animals/<slug>.jpg
  // TEMPLATE (copy this line):
  // { slug:'rosie', name:'Rosie', species:'cattle', breed:'Hereford', id:'CT-041', sex:'Cow', age:'3 yr', status:'Available', desc:'A sentence about her.' },
  // ─────────────────────────────────────────────────────────────────────────
  var ANIMALS = [
    { slug:'evergreen', name:'Evergreen', species:'cattle', breed:'Aberdeen Angus', id:'CT-008', sex:'Bull', age:'5 yr', status:'Available', desc:'Deep-bodied, structurally flawless bull with a proven record of easy-calving progeny.' },
    { slug:'magnolia', name:'Magnolia', species:'cattle', breed:'Hereford', id:'CT-015', sex:'Cow', age:'4 yr', status:'Reserved', desc:'Classic brood cow with a quiet disposition, deep flank, and outstanding maternal instinct.' },
    { slug:'cedar', name:'Cedar', species:'cattle', breed:'Aberdeen Angus', id:'CT-022', sex:'Cow', age:'3 yr', status:'Available', desc:'Stylish, moderate-framed cow with depth of rib and a faultless udder.' },
    { slug:'juniper', name:'Juniper', species:'cattle', breed:'Hereford', id:'CT-030', sex:'Heifer', age:'2 yr', status:'Available', desc:'Rising heifer with length, balance, and the calm eye of her dam.' },
    { slug:'willow', name:'Willow', species:'sheep', breed:'Romney', id:'SH-004', sex:'Ewe', age:'3 yr', status:'Available', desc:'Long-staple Romney ewe with dense, lustrous fleece and a famously gentle way.' },
    { slug:'bramble', name:'Bramble', species:'sheep', breed:'Border Leicester', id:'SH-009', sex:'Ram', age:'4 yr', status:'Available', desc:'Border Leicester ram throwing high-crimp lambs with real fleece character.' },
    { slug:'fern', name:'Fern', species:'sheep', breed:'Romney', id:'SH-013', sex:'Ewe', age:'2 yr', status:'Reserved', desc:'Correct, feminine ewe from our best-fleeced line.' },
    { slug:'clover', name:'Clover', species:'goats', breed:'Nubian', id:'GT-002', sex:'Doe', age:'3 yr', status:'Available', desc:'Deep-bodied Nubian milker with butterfat to spare and a sweet, people-loving temperament.' },
    { slug:'hazel', name:'Hazel', species:'goats', breed:'Boer', id:'GT-007', sex:'Doe', age:'4 yr', status:'Available', desc:'Heavy-boned Boer doe, an easy kidder with strong maternal instinct.' },
    { slug:'sage', name:'Sage', species:'goats', breed:'Nubian', id:'GT-011', sex:'Buck', age:'2 yr', status:'Reserved', desc:'Flashy Nubian buck with length of bone and impeccable dairy character.' }
    // ↑ To add an animal, put a comma after the last line above, then paste
    //   your new line here (see the TEMPLATE near the top of this list).
  ];

  var HORIZON = [
    { kicker:'Kidding Season', title:'The Goat Herd', body:'Nubian and Boer does are settled for a spring kidding window.', target:'2027-03-15', expected:'Expected March 15, 2027' },
    { kicker:'Calving Season', title:'The Cattle Herd', body:'Angus and Hereford cows bred for easy, early-spring calving.', target:'2027-02-20', expected:'Expected February 20, 2027' }
  ];

  window.HA = { SITE: SITE, SPECIES: SPECIES, ANIMALS: ANIMALS, HORIZON: HORIZON, IMG: IMG, STOCK: STOCK, COPY: COPY, EVENTS: EVENTS, PRODUCTS: PRODUCTS };
})();
