/* =========================================================================
   The Heritage Arc — content/data layer (self-contained, editable).

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
    herd:       'images/herd.jpg'
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
    herd:       'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=2200&q=80'
  };

  var SITE = {
    name: 'The Heritage Arc',
    nameHtml: 'The Heritage <em>Arc</em>',
    tagline: 'Heritage-grade goats, sheep, and cattle raised on the high plains.',
    credo: 'We honor the lineage of the land and the animal — <em>with deliberate, daily care.</em>',
    phone: '(555) 555-0100',
    email: 'herd@heritagearc.com'
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

  // Each animal's photo is images/animals/<slug>.jpg (swap by uploading that file).
  var ANIMALS = [
    { slug:'evergreen', name:'Evergreen', species:'cattle', breed:'Aberdeen Angus', id:'CT-008', sex:'Bull', age:'5 yr', weight:'1,840 lb', status:'Available', desc:'Deep-bodied, structurally flawless bull with a proven record of easy-calving progeny.' },
    { slug:'magnolia', name:'Magnolia', species:'cattle', breed:'Hereford', id:'CT-015', sex:'Cow', age:'4 yr', weight:'1,420 lb', status:'Reserved', desc:'Classic brood cow with a quiet disposition, deep flank, and outstanding maternal instinct.' },
    { slug:'cedar', name:'Cedar', species:'cattle', breed:'Aberdeen Angus', id:'CT-022', sex:'Cow', age:'3 yr', weight:'1,510 lb', status:'Available', desc:'Stylish, moderate-framed cow with depth of rib and a faultless udder.' },
    { slug:'juniper', name:'Juniper', species:'cattle', breed:'Hereford', id:'CT-030', sex:'Heifer', age:'2 yr', weight:'1,080 lb', status:'Available', desc:'Rising heifer with length, balance, and the calm eye of her dam.' },
    { slug:'willow', name:'Willow', species:'sheep', breed:'Romney', id:'SH-004', sex:'Ewe', age:'3 yr', weight:'165 lb', status:'Available', desc:'Long-staple Romney ewe with dense, lustrous fleece and a famously gentle way.' },
    { slug:'bramble', name:'Bramble', species:'sheep', breed:'Border Leicester', id:'SH-009', sex:'Ram', age:'4 yr', weight:'220 lb', status:'Available', desc:'Border Leicester ram throwing high-crimp lambs with real fleece character.' },
    { slug:'fern', name:'Fern', species:'sheep', breed:'Romney', id:'SH-013', sex:'Ewe', age:'2 yr', weight:'150 lb', status:'Reserved', desc:'Correct, feminine ewe from our best-fleeced line.' },
    { slug:'clover', name:'Clover', species:'goats', breed:'Nubian', id:'GT-002', sex:'Doe', age:'3 yr', weight:'135 lb', status:'Available', desc:'Deep-bodied Nubian milker with butterfat to spare and a sweet, people-loving temperament.' },
    { slug:'hazel', name:'Hazel', species:'goats', breed:'Boer', id:'GT-007', sex:'Doe', age:'4 yr', weight:'175 lb', status:'Available', desc:'Heavy-boned Boer doe, an easy kidder with strong maternal instinct.' },
    { slug:'sage', name:'Sage', species:'goats', breed:'Nubian', id:'GT-011', sex:'Buck', age:'2 yr', weight:'160 lb', status:'Reserved', desc:'Flashy Nubian buck with length of bone and impeccable dairy character.' }
  ];

  var HORIZON = [
    { kicker:'Kidding Season', title:'The Goat Herd', body:'Nubian and Boer does are settled for a spring kidding window.', target:'2027-03-15', expected:'Expected March 15, 2027' },
    { kicker:'Calving Season', title:'The Cattle Herd', body:'Angus and Hereford cows bred for easy, early-spring calving.', target:'2027-02-20', expected:'Expected February 20, 2027' }
  ];

  window.HA = { SITE: SITE, SPECIES: SPECIES, ANIMALS: ANIMALS, HORIZON: HORIZON, IMG: IMG, STOCK: STOCK };
})();
