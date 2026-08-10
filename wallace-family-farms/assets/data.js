/* =========================================================================
   Wallace Family Farms — self-contained data layer.
   This mirrors the requested "Animals" table schema exactly, so it can be
   swapped for a live Airtable base later with no template changes.

   Animal fields: name, barnName, species, sex, registrationNumber, registry,
   dob (YYYY-MM-DD), sire, dam, color, status, price (nullable / hideable),
   story, photos[], featured (Featured on homepage).
   ========================================================================= */
(function () {
  // Placeholder photography — swap these for real herd photos.
  // Grouped so each animal can carry a small gallery.
  var IMG = {
    heroPasture: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=2000&q=80',
    pasture1:    'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1400&q=80',
    pasture2:    'https://images.unsplash.com/photo-1449057528837-7ca097b3520c?auto=format&fit=crop&w=1400&q=80',
    highland1:   'https://images.unsplash.com/photo-1533318087102-b3ad366ed041?auto=format&fit=crop&w=1200&q=80',
    highland2:   'https://images.unsplash.com/photo-1560743641-3914f2c45636?auto=format&fit=crop&w=1200&q=80',
    highland3:   'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&w=1200&q=80',
    highland4:   'https://images.unsplash.com/photo-1595857661466-91d7f0b3b3d6?auto=format&fit=crop&w=1200&q=80',
    calf1:       'https://images.unsplash.com/photo-1526318472351-c75fcf070305?auto=format&fit=crop&w=1200&q=80',
    barn1:       'https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1200&q=80',
    field1:      'https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?auto=format&fit=crop&w=1400&q=80',
    hens1:       'https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=1200&q=80',
    dog1:        'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?auto=format&fit=crop&w=1200&q=80',
    goat1:       'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=1200&q=80',
    morning1:    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1400&q=80'
  };

  var SITE = {
    name: 'Wallace Family Farms',
    shortName: 'Wallace Family Farms',
    town: 'Fulton',
    state: 'Mississippi',
    region: 'North Mississippi',
    tagline: 'Registered Highland cattle, raised slow in the North Mississippi hills.',
    email: 'mallory@tyleighcapital.com',
    phone: '(662) 555-0148',
    registry: 'American Highland Cattle Association',
    registryShort: 'AHCA',
    journalName: 'Notes from the Pasture',
    nextCalving: '2027-02-15',
    calvingYearLabel: '2027',
    social: { instagram: '#', facebook: '#' },
    images: IMG
  };

  // ---- Animals ("table") -------------------------------------------------
  var ANIMALS = [
    {
      slug: 'august-rush',
      name: 'August Rush',
      barnName: '',
      species: 'Highland Cattle',
      sex: 'Bull',
      registrationNumber: 'AHCA 61204',
      registry: 'American Highland Cattle Association',
      dob: '2019-08-14',
      sire: 'Angus Og of Rannoch',
      dam: 'Bonnie of Cedar Ridge',
      color: 'Red',
      status: 'Herd Sire',
      price: null, priceHidden: true,
      featured: true,
      photos: [IMG.highland2, IMG.pasture1, IMG.field1, IMG.highland1],
      story: "August is the quiet center of the whole place. A big red bull with a horn spread wider than a doorway, and yet the gentlest animal we own — he'll lower his head for a scratch and stand there until you get tired first. We chose him for temperament as much as his papers, and he's passed both down. Every calf on this farm has a little of his calm in it. When the herd moves at dusk, he brings up the rear like he's counting them."
    },
    {
      slug: 'nestle',
      name: 'Nestle',
      barnName: '',
      species: 'Highland Cattle',
      sex: 'Cow',
      registrationNumber: 'AHCA 58231',
      registry: 'American Highland Cattle Association',
      dob: '2017-04-03',
      sire: 'Hamish of Glenfinnan',
      dam: 'Heather Rose 2nd',
      color: 'Dun',
      status: 'Foundation Cow',
      price: null, priceHidden: true,
      featured: true,
      photos: [IMG.highland1, IMG.pasture2, IMG.highland3, IMG.morning1],
      story: "Nestle was the first cow we ever brought home, and everything here started with her. She's a dun-colored matriarch with a long honey fringe and the manners of a house cat — she follows you along the fence line, leans in for chin scratches, and mothers every calf whether it's hers or not. If you want to understand why we fell in love with Highlands, spend ten minutes with Nestle. She'll do the convincing for us."
    },
    {
      slug: 'nemo-poppy',
      name: 'Nemo',
      barnName: 'Poppy',
      species: 'Highland Cattle',
      sex: 'Cow',
      registrationNumber: 'AHCA 58490',
      registry: 'American Highland Cattle Association',
      dob: '2017-09-21',
      sire: 'Duncan of Blackwater',
      dam: 'Marigold of the Glen',
      color: 'Red',
      status: 'Foundation Cow',
      price: null, priceHidden: true,
      featured: true,
      photos: [IMG.highland3, IMG.highland4, IMG.pasture1, IMG.field1],
      story: "Registered as Nemo, known to everyone as Poppy, and quietly in charge of all of it. She's a bright red cow who decided some years ago that she runs the fold, and honestly she does — she picks the shade tree, she picks the grazing order, and the others go along with it. Poppy is bold where Nestle is soft. She'll walk right up to a visitor to see what they've got. First to the gate, last to admit she likes you, and worth every bit of the trouble."
    },
    {
      slug: 'moonshadow',
      name: 'Moonshadow',
      barnName: '',
      species: 'Highland Cattle',
      sex: 'Cow',
      registrationNumber: 'AHCA 59107',
      registry: 'American Highland Cattle Association',
      dob: '2018-05-30',
      sire: 'Silver Birk of Loch Ard',
      dam: 'Willow of Cedar Ridge',
      color: 'Silver',
      status: 'Foundation Cow',
      price: null, priceHidden: true,
      featured: true,
      photos: [IMG.highland4, IMG.morning1, IMG.pasture2, IMG.highland2],
      story: "Moonshadow is the beauty of the group and she knows it. Pale silver, with a fringe so long she peers out from under it like she's deciding whether to trust you. She's our shy one — slow to come close, but once she does she's steady as anything. On foggy mornings she'll materialize out of the low pasture like something from an old story, which is more or less how she got her name."
    },
    {
      slug: 'thistle',
      name: 'Thistle',
      barnName: '',
      species: 'Highland Cattle',
      sex: 'Heifer',
      registrationNumber: 'AHCA 63788',
      registry: 'American Highland Cattle Association',
      dob: '2024-03-11',
      sire: 'August Rush',
      dam: 'Nestle',
      color: 'Red',
      status: 'Available',
      price: 3200, priceHidden: false,
      featured: false,
      photos: [IMG.calf1, IMG.highland1, IMG.field1],
      story: "Thistle is Nestle's daughter and August's first heifer, which is about the best pedigree we can offer from our own gate. She's a little red firecracker — curious, springy, always the first to investigate a new bucket. She has her mother's easy way with people already. She'd make a wonderful foundation heifer for someone starting their own fold, and it's hard to say that out loud because we'd keep her if we could keep them all."
    },
    {
      slug: 'juniper',
      name: 'Juniper',
      barnName: '',
      species: 'Highland Cattle',
      sex: 'Heifer',
      registrationNumber: 'AHCA 63790',
      registry: 'American Highland Cattle Association',
      dob: '2024-04-02',
      sire: 'August Rush',
      dam: 'Moonshadow',
      color: 'Dun',
      status: 'Reserved',
      price: 3200, priceHidden: true,
      featured: false,
      photos: [IMG.calf1, IMG.pasture2, IMG.highland3],
      story: "Juniper is a soft dun heifer out of Moonshadow, with the same long fringe and quiet nature. She's spoken for — headed to a family building a small fold of their own an hour south of us — but we're leaving her here on the page because we're proud of her and because reservations sometimes shift. If you'd like to be next in line for a heifer like her, the waitlist is the place to be."
    },
    {
      slug: 'rowan',
      name: 'Rowan',
      barnName: '',
      species: 'Highland Cattle',
      sex: 'Steer',
      registrationNumber: 'AHCA 62155',
      registry: 'American Highland Cattle Association',
      dob: '2022-03-19',
      sire: 'August Rush',
      dam: 'Nemo',
      color: 'Red',
      status: 'Sold',
      price: null, priceHidden: true,
      featured: false,
      photos: [IMG.highland2, IMG.field1, IMG.pasture1],
      story: "Rowan went to a family just down the road who wanted a gentle pasture companion, and he was exactly the right one for it. A calm red steer with Poppy's confidence and none of her bossiness. We still see him over the fence when we drive by, fat and happy under their oak trees. That's the best kind of sale — the kind you get to keep visiting."
    },
    {
      slug: 'maple',
      name: 'Maple',
      barnName: '',
      species: 'Highland Cattle',
      sex: 'Cow',
      registrationNumber: 'AHCA 60022',
      registry: 'American Highland Cattle Association',
      dob: '2020-06-08',
      sire: 'Hamish of Glenfinnan',
      dam: 'Heather Rose 2nd',
      color: 'Yellow',
      status: 'Sold',
      price: null, priceHidden: true,
      featured: false,
      photos: [IMG.highland4, IMG.pasture2, IMG.morning1],
      story: "Maple was foundation-quality through and through, and she left here to become the cornerstone of a new fold in Tennessee. It's a bittersweet thing to sell a cow that good — but starting other people off with strong, gentle stock is a lot of why we do this. Last we heard she'd had a fine heifer calf of her own. The line keeps going."
    }
  ];

  // ---- Journal ("Notes from the Pasture") --------------------------------
  var JOURNAL = [
    {
      slug: 'why-we-chose-highlands',
      title: 'Why we chose Highlands',
      date: '2026-07-28',
      photo: IMG.highland1,
      excerpt: "People ask why a family in Fulton runs a Scottish mountain breed. The short answer is temperament. The long answer took us a few years to learn.",
      body: [
        "When we started looking for cattle, we weren't looking to fill a pasture — we were looking for animals our kids could grow up around. Highlands kept coming up in the same breath as the words gentle and hardy, and both turned out to be true.",
        "They handle our Mississippi summers better than anyone warned us they would. That famous long coat sheds out and works like an open weave in the heat. And the temperament is the real gift: raised with a little attention, a Highland becomes a genuinely friendly animal.",
        "We chose them slowly, one cow at a time, and we've never once regretted it."
      ]
    },
    {
      slug: 'the-morning-poppy-took-charge',
      title: 'The morning Poppy decided she was in charge',
      date: '2026-06-15',
      photo: IMG.highland3,
      excerpt: "Every fold has a boss. Ours campaigned for the job the day she arrived and has held office ever since.",
      body: [
        "Nemo — Poppy to us — came off the trailer, took one long look at the other cows, and walked straight to the best shade tree on the property. Nobody argued. Nobody has argued since.",
        "There's a real hierarchy in a fold, and watching it settle is one of the quiet pleasures of this life. Poppy picks the grazing order. Nestle keeps the peace. August brings up the rear and counts heads at dusk.",
        "It's a small society out there in the grass, and it runs better than most."
      ]
    },
    {
      slug: 'getting-ready-for-calving',
      title: 'Getting ready for calving season',
      date: '2026-05-30',
      photo: IMG.calf1,
      excerpt: "Late winter brings the calves. Here's what the weeks before look like around here, and how to get on the list for one.",
      body: [
        "By February the pasture starts filling up with the wobbly-legged and the brand new. Highland calves come small, which makes for easy calving, and they're up and nursing and causing trouble almost immediately.",
        "We spend the weeks beforehand walking fence, freshening bedding in the loafing shed, and getting the calving pasture close to the house so we can keep an eye on things at night.",
        "If you'd like a calf from this coming season, now is the time to reach out. The gentlest ones tend to be spoken for early."
      ]
    }
  ];

  window.WFF = { SITE: SITE, ANIMALS: ANIMALS, JOURNAL: JOURNAL, IMG: IMG };
})();
