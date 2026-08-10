/* =========================================================================
   Wallace Family Farms — shared behavior + rendering (vanilla, no build).
   Warm & personal: hand-drawn cow emblem, illustrated photo panels that
   look lovely even before a photo loads, family signature.
   ========================================================================= */
(function () {
  var S = window.WFF.SITE, ANIMALS = window.WFF.ANIMALS, JOURNAL = window.WFF.JOURNAL;

  // ---------- helpers ----------
  function el(html) { var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }
  function byId(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  function fmtDate(iso) {
    if (!iso) return '';
    var p = iso.split('-'); var m = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return m[parseInt(p[1], 10) - 1] + ' ' + parseInt(p[2], 10) + ', ' + p[0];
  }
  function fmtDateShort(iso) {
    if (!iso) return '';
    var p = iso.split('-'); var m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return m[parseInt(p[1], 10) - 1] + ' ' + parseInt(p[2], 10) + ', ' + p[0];
  }
  function statusClass(st) {
    st = (st || '').toLowerCase();
    if (st === 'available') return 'available';
    if (st === 'reserved') return 'reserved';
    if (st === 'sold') return 'sold';
    return '';
  }
  function firstSentence(t) {
    var line = t.split('. ')[0];
    if (line.length > 92) return line.slice(0, 89) + '…';
    return line + '.';
  }
  function animalBySlug(slug) { for (var i = 0; i < ANIMALS.length; i++) if (ANIMALS[i].slug === slug) return ANIMALS[i]; return null; }
  function postBySlug(slug) { for (var i = 0; i < JOURNAL.length; i++) if (JOURNAL[i].slug === slug) return JOURNAL[i]; return null; }
  function qs(name) { var m = new RegExp('[?&]' + name + '=([^&]+)').exec(location.search); return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : ''; }

  // hide a broken image so the warm illustrated panel shows through
  function imgTag(url, alt) {
    return '<img src="' + url + '" alt="' + esc(alt) + '" loading="lazy" onerror="this.style.display=&quot;none&quot;">';
  }
  // a photo box that always has a warm cow-panel behind it
  function photo(url, alt, cls) { return '<div class="ph ' + (cls || '') + '">' + imgTag(url, alt) + '</div>'; }
  // scrapbook-framed photo
  function snap(url, alt, tiltClass) {
    return '<div class="snap ' + (tiltClass || '') + '">' + photo(url, alt) + '</div>';
  }

  // hand-drawn Highland cow emblem (colored, for the logo)
  var COW_BADGE = '<span class="cow-badge" aria-hidden="true"><svg viewBox="0 0 120 96" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M58 42C40 36 30 20 12 20c8 10 12 14 30 24" fill="#EAC98A" stroke="#6E5138" stroke-width="2.5" stroke-linejoin="round"/>' +
    '<path d="M62 42c18-6 28-22 46-22-8 10-12 14-30 24" fill="#EAC98A" stroke="#6E5138" stroke-width="2.5" stroke-linejoin="round"/>' +
    '<path d="M60 30c-17 0-26 13-24 32 2 17 13 28 24 28s22-11 24-28c2-19-7-32-24-32Z" fill="#A85B37"/>' +
    '<path d="M43 45c2 9 1 15-1 22M52 43c1 10 1 16 0 24M60 42c0 10 0 17 0 25M68 43c-1 10-1 16 0 24M77 45c-2 9-1 15 1 22" stroke="#EAC98A" stroke-width="4" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="60" cy="76" rx="14" ry="10" fill="#C98A5E"/>' +
    '<circle cx="54" cy="75" r="2.6" fill="#352A20"/><circle cx="66" cy="75" r="2.6" fill="#352A20"/>' +
    '</svg></span>';

  // ---------- header + footer ----------
  var NAV = [
    ['fold.html', 'our fold'],
    ['available.html', 'available'],
    ['the-farm.html', 'the farm'],
    ['journal.html', 'notes'],
    ['reserve.html', 'how to reserve']
  ];
  var here = location.pathname.split('/').pop() || 'index.html';

  function brand() {
    return '<a class="brand" href="index.html">' + COW_BADGE +
      '<span class="wordmark-txt">' + esc(S.name) + '<small>' + esc(S.town.toLowerCase()) + ', mississippi</small></span></a>';
  }

  function headerHTML() {
    var links = NAV.map(function (l) {
      var active = (l[0] === here) ? ' class="active"' : '';
      return '<a href="' + l[0] + '"' + active + '>' + l[1] + '</a>';
    }).join('');
    var mlinks = NAV.map(function (l) { return '<a href="' + l[0] + '">' + l[1] + '</a>'; }).join('') +
      '<a href="inquire.html">inquire</a>';
    return '' +
      '<header class="site-header">' +
        '<div class="nav">' + brand() +
          '<nav class="nav-links">' + links +
            '<a class="btn nav-cta" href="inquire.html">inquire</a></nav>' +
          '<button class="nav-toggle" id="navToggle" aria-label="Menu">' +
            '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>' +
          '</button>' +
        '</div>' +
        '<div class="mobile-nav" id="mobileNav">' + mlinks + '</div>' +
      '</header>';
  }

  function footerHTML() {
    var strip = [S.images.pasture1, S.images.highland1, S.images.calf1, S.images.field1]
      .map(function (u) { return photo(u, S.name); }).join('');
    return '' +
      '<footer class="site-footer">' +
        '<div class="foot-strip">' + strip + '</div>' +
        '<div class="wrap foot-main">' +
          '<div>' + brand() +
            '<p class="muted" style="margin-top:1rem;max-width:36ch;font-size:.96rem">' + esc(S.tagline) + '</p>' +
            '<div class="signature">— the Wallace family</div>' +
          '</div>' +
          '<div class="foot-col">' +
            '<h4>the farm</h4>' +
            '<ul>' +
              '<li><a href="fold.html">our fold</a></li>' +
              '<li><a href="highlands.html">about highlands</a></li>' +
              '<li><a href="the-farm.html">the farm</a></li>' +
              '<li><a href="calving.html">calving season</a></li>' +
              '<li><a href="journal.html">' + esc(S.journalName.toLowerCase()) + '</a></li>' +
            '</ul>' +
          '</div>' +
          '<div class="foot-col">' +
            '<h4>bringing one home</h4>' +
            '<ul>' +
              '<li><a href="available.html">available stock</a></li>' +
              '<li><a href="reserve.html">how to reserve</a></li>' +
              '<li><a href="pricing.html">pricing &amp; purchasing</a></li>' +
              '<li><a href="registration.html">registration &amp; papers</a></li>' +
              '<li><a href="sold.html">previously sold</a></li>' +
              '<li><a href="inquire.html">inquire</a></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="wrap"><div class="foot-bottom">' +
          '<span>&copy; 2026 ' + esc(S.name) + ' &middot; ' + esc(S.town) + ', ' + esc(S.state) + '</span>' +
          '<span><a href="' + S.social.instagram + '">instagram</a> &nbsp;&middot;&nbsp; <a href="' + S.social.facebook + '">facebook</a></span>' +
        '</div></div>' +
      '</footer>';
  }

  function mountChrome() {
    document.body.insertBefore(el(headerHTML()), document.body.firstChild);
    document.body.appendChild(el(footerHTML()));
    var t = byId('navToggle'), m = byId('mobileNav');
    if (t && m) {
      t.addEventListener('click', function () { m.classList.toggle('open'); });
      m.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { m.classList.remove('open'); }); });
    }
  }

  // ---------- animal card ----------
  function animalCard(a) {
    var barn = a.barnName ? ' <span class="barn">“' + esc(a.barnName) + '”</span>' : '';
    var tag = ''; var sc = statusClass(a.status);
    if (sc) tag = '<span class="status-tag ' + sc + '">' + esc(a.status.toLowerCase()) + '</span>';
    var tilt = (a.slug.length % 2) ? 'tilt-l' : 'tilt-r';
    return '' +
      '<a class="animal-card" href="animal.html?a=' + a.slug + '">' +
        '<div class="snap ' + tilt + '"><div class="ph">' + tag + imgTag(a.photos[0], a.name) + '</div></div>' +
        '<div class="cap">' +
          '<h3>' + esc(a.name) + barn + '</h3>' +
          '<div class="meta">' + esc(a.color.toLowerCase()) + ' &middot; ' + esc(a.sex.toLowerCase()) + '</div>' +
          '<p>' + esc(firstSentence(a.story)) + '</p>' +
        '</div>' +
      '</a>';
  }

  // ---------- renderers (run if the container exists) ----------
  function renderFeaturedFold() {
    var host = byId('featuredFold'); if (!host) return;
    host.innerHTML = ANIMALS.filter(function (a) { return a.featured; }).slice(0, 4).map(animalCard).join('');
  }

  function renderFold() {
    var host = byId('foldGroups'); if (!host) return;
    var groups = [
      ['our herd sire', 'The bull of the place', function (a) { return a.status === 'Herd Sire' || (a.sex === 'Bull'); }],
      ['our girls', 'The cows', function (a) { return a.sex === 'Cow'; }],
      ['the young ones', 'Heifers & calves', function (a) { return a.sex === 'Heifer' || a.sex === 'Calf' || a.sex === 'Steer'; }]
    ];
    var used = {}, html = '';
    groups.forEach(function (g) {
      var members = ANIMALS.filter(function (a) {
        if (used[a.slug]) return false;
        if (a.status === 'Sold') return false;
        return g[2](a);
      });
      members.forEach(function (a) { used[a.slug] = true; });
      if (!members.length) return;
      html += '<div class="fold-group">' +
        '<span class="label">' + g[0] + '</span>' +
        '<h2>' + g[1] + '</h2>' +
        '<div class="card-grid">' + members.map(animalCard).join('') + '</div>' +
        '</div>';
    });
    host.innerHTML = html;
  }

  function renderAvailable() {
    var host = byId('availableGrid'); if (!host) return;
    var list = ANIMALS.filter(function (a) { return a.status === 'Available' || a.status === 'Reserved'; });
    var empty = byId('availableEmpty');
    if (!list.length) { host.classList.add('hidden'); if (empty) empty.classList.remove('hidden'); return; }
    if (empty) empty.classList.add('hidden');
    host.innerHTML = list.map(animalCard).join('');
  }

  function renderSold() {
    var host = byId('soldGrid'); if (!host) return;
    var list = ANIMALS.filter(function (a) { return a.status === 'Sold'; });
    if (!list.length) { host.innerHTML = '<p class="muted">Our first calves go home soon — check back for the track record.</p>'; return; }
    host.innerHTML = list.map(animalCard).join('');
  }

  function renderAnimalDetail() {
    var host = byId('animalDetail'); if (!host) return;
    var a = animalBySlug(qs('a'));
    if (!a) { host.innerHTML = '<div class="wrap section center"><p class="muted">We couldn\'t find that one. <a class="textlink" href="fold.html">Back to our fold</a>.</p></div>'; return; }
    document.title = a.name + ' — ' + S.name;
    var barn = a.barnName ? ' <span style="font-family:var(--script);color:var(--honey);font-size:.62em"> “' + esc(a.barnName) + '”</span>' : '';

    var thumbs = a.photos.map(function (p, i) {
      return '<button class="thumb' + (i === 0 ? ' active' : '') + '" data-src="' + p + '">' + photo(p, '') + '</button>';
    }).join('');

    var priceRow = (!a.priceHidden && a.price) ? '<tr><th>price</th><td>$' + a.price.toLocaleString() + '</td></tr>' : '';
    var inquire = (a.status === 'Available')
      ? '<a class="btn" style="margin-top:1.8rem" href="inquire.html?about=' + encodeURIComponent(a.name) + '">inquire about ' + esc(a.name.toLowerCase()) + '</a>'
      : (a.status === 'Reserved'
        ? '<p class="muted" style="margin-top:1.5rem;font-style:italic">' + esc(a.name) + ' is reserved. <a class="textlink" href="inquire.html?about=' + encodeURIComponent('Calving waitlist') + '">join the waitlist</a> for one like this.</p>'
        : (a.status === 'Sold'
          ? '<p class="muted" style="margin-top:1.5rem;font-style:italic">' + esc(a.name) + ' has found a good home. See <a class="textlink" href="available.html">who\'s available</a>.</p>'
          : '<p class="muted" style="margin-top:1.5rem;font-style:italic">Part of our foundation and not for sale — but <a class="textlink" href="available.html">the line is</a>.</p>'));

    var sc = statusClass(a.status);
    var tag = sc ? '<span class="status-tag ' + sc + '" style="position:static;display:inline-block;margin-bottom:1rem">' + esc(a.status.toLowerCase()) + '</span>' : '<span class="eyebrow">' + esc(a.status.toLowerCase()) + '</span>';

    host.innerHTML = '' +
      '<div class="wrap section">' +
        '<a class="textlink" href="fold.html" style="display:inline-block;margin-bottom:2rem">&larr; back to our fold</a>' +
        '<div class="detail-grid">' +
          '<div>' +
            '<div class="snap"><div class="gallery-main ph"><img id="galImg" src="' + a.photos[0] + '" alt="' + esc(a.name) + '" onerror="this.style.display=&quot;none&quot;"></div></div>' +
            '<div class="gallery-thumbs" id="galThumbs">' + thumbs + '</div>' +
          '</div>' +
          '<div>' +
            tag +
            '<h1 class="display" style="font-size:clamp(2.4rem,6vw,3.7rem)">' + esc(a.name) + barn + '</h1>' +
            '<div class="meta" style="margin:.6rem 0 1.6rem;color:var(--sage);letter-spacing:.1em;text-transform:uppercase;font-size:.76rem">' +
              esc(a.species.toLowerCase()) + ' &middot; ' + esc(a.sex.toLowerCase()) + ' &middot; ' + esc(a.color.toLowerCase()) + '</div>' +
            '<div class="stack">' + a.story.split('\n').map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div>' +
            '<table class="spec-table">' +
              '<tr><th>registration no.</th><td>' + esc(a.registrationNumber) + '</td></tr>' +
              '<tr><th>registry</th><td>' + esc(a.registry) + '</td></tr>' +
              '<tr><th>date of birth</th><td>' + fmtDate(a.dob) + '</td></tr>' +
              '<tr><th>sire</th><td>' + esc(a.sire) + '</td></tr>' +
              '<tr><th>dam</th><td>' + esc(a.dam) + '</td></tr>' +
              '<tr><th>color</th><td>' + esc(a.color) + '</td></tr>' +
              '<tr><th>status</th><td>' + esc(a.status) + '</td></tr>' +
              priceRow +
            '</table>' +
            inquire +
          '</div>' +
        '</div>' +
      '</div>';

    var galImg = byId('galImg'), thumbEls = host.querySelectorAll('.thumb');
    thumbEls.forEach(function (b) {
      b.addEventListener('click', function () {
        if (galImg) { galImg.style.display = ''; galImg.src = b.getAttribute('data-src'); }
        thumbEls.forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
      });
    });
  }

  function journalItem(p, flat) {
    return '<a class="journal-item"' + (flat ? ' style="border-bottom:0;padding-bottom:0"' : '') + ' href="post.html?p=' + p.slug + '">' +
      '<div class="snap tilt-l">' + photo(p.photo, p.title) + '</div>' +
      '<div>' +
        '<div class="date">' + fmtDate(p.date) + '</div>' +
        '<h3>' + esc(p.title) + '</h3>' +
        '<p>' + esc(p.excerpt) + '</p>' +
        '<span class="textlink" style="display:inline-block;margin-top:.8rem;font-size:.92rem">keep reading &rarr;</span>' +
      '</div>' +
    '</a>';
  }
  function renderJournalList() { var host = byId('journalList'); if (!host) return; host.innerHTML = JOURNAL.map(function (p) { return journalItem(p, false); }).join(''); }
  function renderJournalPreview() { var host = byId('journalPreview'); if (!host) return; host.innerHTML = journalItem(JOURNAL[0], true); }

  function renderPost() {
    var host = byId('postBody'); if (!host) return;
    var p = postBySlug(qs('p')) || JOURNAL[0];
    document.title = p.title + ' — ' + S.name;
    host.innerHTML =
      '<div class="wrap narrow section">' +
        '<a class="textlink" href="journal.html" style="display:inline-block;margin-bottom:1.5rem">&larr; ' + esc(S.journalName.toLowerCase()) + '</a>' +
        '<div class="date" style="font-family:var(--script);color:var(--honey);font-size:1.3rem">' + fmtDate(p.date) + '</div>' +
        '<h1 class="page-title" style="margin:.3rem 0 1.8rem">' + esc(p.title) + '</h1>' +
        '<div class="snap" style="margin-bottom:2.5rem">' + photo(p.photo, p.title, 'imgband') + '</div>' +
        '<div class="prose">' + p.body.map(function (para) { return '<p>' + esc(para) + '</p>'; }).join('') + '</div>' +
        '<hr class="rule" style="margin:3rem 0 2rem">' +
        '<p class="muted">Want a calf from the coming season? <a class="textlink" href="inquire.html?about=' + encodeURIComponent('Calving waitlist') + '">Get on the list &rarr;</a></p>' +
      '</div>';
  }

  // ---------- countdown ----------
  function renderCountdown() {
    document.querySelectorAll('[data-countdown]').forEach(function (host) {
      var target = new Date(S.nextCalving + 'T00:00:00');
      var now = new Date();
      var days = Math.max(0, Math.ceil((target - now) / 86400000));
      var weeks = Math.floor(days / 7);
      host.innerHTML =
        '<div><div class="num">' + days + '</div><div class="u">days</div></div>' +
        '<div><div class="num">' + weeks + '</div><div class="u">weeks</div></div>' +
        '<div><div class="num">' + fmtDateShort(S.nextCalving).split(' ')[0].toLowerCase() + '</div><div class="u">' + S.calvingYearLabel + '</div></div>';
    });
  }

  // ---------- inquiry form ----------
  function initForm() {
    var form = byId('inquireForm'); if (!form) return;
    var about = qs('about');
    var sel = form.querySelector('select[name="interest"]');
    if (about && sel) {
      var match = ANIMALS.filter(function (a) { return a.name.toLowerCase() === about.toLowerCase(); })[0];
      if (match) {
        var opt = document.createElement('option');
        opt.value = match.name; opt.textContent = match.name + ' (' + match.sex.toLowerCase() + ')';
        sel.insertBefore(opt, sel.firstChild.nextSibling);
        sel.value = match.name;
        var msg = form.querySelector('textarea[name="message"]');
        if (msg && !msg.value) msg.value = "I'd love to hear more about " + match.name + ".";
      } else {
        for (var i = 0; i < sel.options.length; i++) {
          if (sel.options[i].value.toLowerCase() === about.toLowerCase()) { sel.selectedIndex = i; break; }
        }
      }
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = byId('formNote');
      form.querySelectorAll('input,select,textarea,button').forEach(function (n) { n.setAttribute('disabled', 'disabled'); });
      if (note) { note.classList.add('show'); note.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    });
  }

  // ---------- scroll reveal ----------
  function initReveal() {
    if (!('IntersectionObserver' in window)) { document.querySelectorAll('.reveal').forEach(function (n) { n.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (n) { io.observe(n); });
    // safety net: never let a section stay hidden if the observer misses it
    setTimeout(function () { document.querySelectorAll('.reveal').forEach(function (n) { n.classList.add('in'); }); }, 2200);
  }

  // ---------- fill tokens + images ----------
  function fillTokens() {
    document.querySelectorAll('[data-site="name"]').forEach(function (n) { n.textContent = S.name; });
    document.querySelectorAll('[data-site="town"]').forEach(function (n) { n.textContent = S.town; });
    document.querySelectorAll('[data-site="tagline"]').forEach(function (n) { n.textContent = S.tagline; });
    document.querySelectorAll('[data-site="journal"]').forEach(function (n) { n.textContent = S.journalName; });
    document.querySelectorAll('[data-site="email"]').forEach(function (n) { n.textContent = S.email; if (n.tagName === 'A') n.href = 'mailto:' + S.email; });
    document.querySelectorAll('[data-site="phone"]').forEach(function (n) { n.textContent = S.phone; });
    document.querySelectorAll('[data-site="calvingYear"]').forEach(function (n) { n.textContent = S.calvingYearLabel; });
    // hero: layer photo over a warm fallback gradient (defined in CSS) so it's never empty
    document.querySelectorAll('[data-hero]').forEach(function (n) {
      var url = S.images[n.getAttribute('data-hero')];
      n.classList.add('has-photo');
      n.style.backgroundImage = "linear-gradient(180deg, rgba(53,42,32,.2), rgba(53,42,32,.62)), url('" + url + "')";
    });
    // decorative photo panels: drop a real <img> into any .ph[data-img]
    document.querySelectorAll('[data-img]').forEach(function (n) {
      n.classList.add('ph');
      n.innerHTML = imgTag(S.images[n.getAttribute('data-img')], S.name);
    });
  }

  // ---------- boot ----------
  document.addEventListener('DOMContentLoaded', function () {
    mountChrome();
    fillTokens();
    renderFeaturedFold();
    renderFold();
    renderAvailable();
    renderSold();
    renderAnimalDetail();
    renderJournalList();
    renderJournalPreview();
    renderPost();
    renderCountdown();
    initForm();
    initReveal();
  });
})();
