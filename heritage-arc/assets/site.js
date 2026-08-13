/* =========================================================================
   Wallace Family Farms — shared behavior + rendering (vanilla, no build).
   ========================================================================= */
(function () {
  var S = window.HA.SITE, SP = window.HA.SPECIES, ANIMALS = window.HA.ANIMALS, HORIZON = window.HA.HORIZON;
  var IMG = window.HA.IMG, STOCK = window.HA.STOCK, COPY = window.HA.COPY || {};
  var EVENTS = window.HA.EVENTS || [], PRODUCTS = window.HA.PRODUCTS || [];

  function el(h){ var d=document.createElement('div'); d.innerHTML=h.trim(); return d.firstChild; }
  function byId(id){ return document.getElementById(id); }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c];}); }
  function qs(n){ var m=new RegExp('[?&]'+n+'=([^&]+)').exec(location.search); return m?decodeURIComponent(m[1].replace(/\+/g,' ')):''; }
  // <img> that tries the local file, then the stock fallback, then hides (revealing the monogram panel)
  function imgTag(src,alt,fb){
    return '<img src="'+src+'" alt="'+esc(alt)+'" loading="lazy" data-fb="'+(fb||'')+'" '+
      'onerror="var f=this.getAttribute(&quot;data-fb&quot;);if(f){this.removeAttribute(&quot;data-fb&quot;);this.src=f;}else{this.style.display=&quot;none&quot;;}">';
  }
  function img2(key,alt){ return imgTag(IMG[key], alt||S.name, STOCK[key]); }
  function animalCover(a){ return a.photo || (a.gallery && a.gallery[0]) || ('images/animals/'+a.slug+'.jpg'); }
  function animalImg(a){ return imgTag(animalCover(a), a.name, STOCK[a.species]); }
  // every photo for an animal's own page: cover first, then any gallery extras (deduped)
  function animalGallery(a){
    var list = [];
    if(a.photo) list.push(a.photo);
    if(Array.isArray(a.gallery)) a.gallery.forEach(function(s){ if(s && list.indexOf(s)===-1) list.push(s); });
    if(!list.length) list.push('images/animals/'+a.slug+'.jpg');
    return list;
  }
  function photo(src,alt,cls,fb){ return '<div class="ph '+(cls||'')+'">'+imgTag(src,alt,fb)+'</div>'; }
  function photoKey(key,alt,cls){ return '<div class="ph '+(cls||'')+'">'+img2(key,alt)+'</div>'; }
  function photoAnimal(a,cls){ return '<div class="ph '+(cls||'')+'">'+animalImg(a)+'</div>'; }
  function animalBySlug(s){ for(var i=0;i<ANIMALS.length;i++) if(ANIMALS[i].slug===s) return ANIMALS[i]; return null; }
  var here = location.pathname.split('/').pop() || 'index.html';

  // ---------- header ----------
  function headerHTML(){
    return '<header class="site-header" id="siteHeader">'+
      '<div class="nav">'+
        '<a class="wordmark" href="index.html">'+S.nameHtml+'</a>'+
        '<nav class="nav-links">'+
          '<span class="ha-drop"><a href="species.html?s=cattle">Our Animals ⌄</a>'+
            '<span class="ha-menu">'+
              '<a href="species.html?s=cattle">Cattle</a>'+
              '<a href="species.html?s=sheep">Sheep</a>'+
              '<a href="species.html?s=goats">Goats</a>'+
            '</span></span>'+
          '<a href="available.html">Available Stock</a>'+
          '<a href="events.html">Events</a>'+
          '<a href="store.html">Store</a>'+
          '<a href="inquire.html">Inquire</a>'+
        '</nav>'+
        '<a class="reserve-btn" href="reserve.html">Reserve</a>'+
        '<button class="nav-toggle" id="navToggle" aria-label="Menu"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg></button>'+
      '</div>'+
      '<div class="mobile-nav" id="mobileNav">'+
        '<a href="species.html?s=cattle">Cattle</a>'+
        '<a href="species.html?s=sheep">Sheep</a>'+
        '<a href="species.html?s=goats">Goats</a>'+
        '<a href="available.html">Available Stock</a>'+
        '<a href="events.html">Events</a>'+
        '<a href="store.html">Store</a>'+
        '<a href="inquire.html">Inquire</a>'+
        '<a href="reserve.html">Reserve</a>'+
      '</div>'+
    '</header>';
  }

  function footerHTML(){
    return ''+
      '<section class="credo"><div class="wrap section"><h2 class="big serif">'+S.credo+'</h2></div></section>'+
      '<footer class="site-footer"><div class="wrap">'+
        '<div class="foot-grid">'+
          '<div>'+
            '<span class="wordmark">'+S.nameHtml+'</span>'+
            '<p>'+esc(S.tagline)+'</p>'+
            (S.instagram||S.facebook ? '<div class="foot-social">'+
              (S.instagram?'<a href="'+S.instagram+'" target="_blank" rel="noopener">Instagram</a>':'')+
              (S.facebook?'<a href="'+S.facebook+'" target="_blank" rel="noopener">Facebook</a>':'')+
            '</div>' : '')+
          '</div>'+
          '<div class="foot-col"><h4>Explore</h4><ul>'+
            '<li><a href="species.html?s=cattle">Our Animals</a></li>'+
            '<li><a href="available.html">Available Stock</a></li>'+
            '<li><a href="events.html">Events</a></li>'+
            '<li><a href="store.html">Store</a></li>'+
            '<li><a href="reserve.html">Reserve</a></li>'+
            '<li><a href="index.html#join">Join our list</a></li>'+
            '<li><a href="inquire.html">Inquire</a></li>'+
          '</ul></div>'+
          '<div class="foot-col"><h4>Visit</h4><ul>'+
            '<li>'+esc(S.address)+'</li>'+
            '<li>'+esc(S.hours)+'</li>'+
          '</ul></div>'+
          '<div class="foot-col"><h4>Contact</h4><ul>'+
            '<li><a href="tel:'+S.phone.replace(/[^\d+]/g,'')+'">'+esc(S.phone)+'</a></li>'+
            '<li><a href="mailto:'+S.email+'">'+esc(S.email)+'</a></li>'+
          '</ul></div>'+
        '</div>'+
        '<div class="foot-bottom"><span>© 2026 '+esc(S.name)+' · '+esc(S.address)+'</span><span>Heritage husbandry · raised slow</span></div>'+
      '</div></footer>';
  }

  function mountChrome(){
    document.body.insertBefore(el(headerHTML()), document.body.firstChild);
    // footerHTML() has two top-level pieces (credo band + footer) — append both
    var fw = document.createElement('div'); fw.innerHTML = footerHTML();
    while (fw.firstChild) document.body.appendChild(fw.firstChild);
    var hdr = byId('siteHeader');
    var hero = document.body.classList.contains('has-hero');
    function onScroll(){ hdr.classList.toggle('solid', !hero || window.scrollY > 40); }
    if(!hero){ hdr.classList.add('solid'); }
    function sizeHeader(){ var h = hdr.offsetHeight || 64; document.documentElement.style.setProperty('--hdr', h + 'px'); if(!hero) document.body.style.paddingTop = h + 'px'; }
    sizeHeader(); window.addEventListener('load', sizeHeader); window.addEventListener('resize', sizeHeader);
    onScroll(); window.addEventListener('scroll', onScroll, {passive:true});
    var t=byId('navToggle'), m=byId('mobileNav');
    if(t&&m){ t.addEventListener('click',function(){ m.classList.toggle('open'); }); }
  }

  // ---------- animal card ----------
  // Status only shows for animals that are for sale / spoken for.
  function showStatus(a){ return /^(available|sold|reserved)$/i.test(String(a.status||'').trim()); }
  function statusSpec(a){
    if(!showStatus(a)) return '';
    return '<div class="spec spec-1"><div><div class="k">Status</div><div class="v">'+esc(a.status)+'</div></div></div>';
  }
  function statusClass(s){ return 's-'+String(s||'').toLowerCase().replace(/[^a-z]+/g,'-').replace(/^-|-$/g,''); }
  function beastCard(a){
    var can = showStatus(a);                                   // Available / Reserved / Sold → clickable page
    var badge = can
      ? '<span class="beast-badge '+statusClass(a.status)+'">'+esc(a.status)+'</span>'
      : '<span class="beast-badge s-herd">Our herd</span>';
    var meta = [a.sex, a.dob ? 'Born '+a.dob : ''].filter(Boolean).join('  ·  ');
    var inner =
      '<div class="ph beast-ph"><span class="tag">'+esc(SP[a.species].plural)+'</span>'+badge+animalImg(a)+'</div>'+
      '<div class="body">'+
        '<div class="top"><h3>'+esc(a.name)+'</h3>'+(a.id?'<span class="id">'+esc(a.id)+'</span>':'')+'</div>'+
        (a.breed?'<div class="breed">'+esc(a.breed)+'</div>':'')+
        (meta?'<div class="beast-meta">'+esc(meta)+'</div>':'')+
        (a.price?'<div class="beast-price">'+esc(a.price)+'</div>':'')+
        (a.desc?'<div class="desc">'+esc(a.desc)+'</div>':'')+
        (can?'<div class="beast-more">See '+esc(a.name)+'’s page →</div>':'')+
      '</div>';
    return can
      ? '<a class="beast" href="animal.html?a='+a.slug+'">'+inner+'</a>'
      : '<div class="beast beast-static">'+inner+'</div>';
  }

  // ---------- home: countdown board ----------
  function tick(){
    document.querySelectorAll('[data-target]').forEach(function(n){
      var t=new Date(n.getAttribute('data-target')+'T00:00:00').getTime();
      var d=Math.max(0, t-Date.now());
      var days=Math.floor(d/86400000), h=Math.floor(d/3600000)%24, m=Math.floor(d/60000)%60, s=Math.floor(d/1000)%60;
      function pad(x){ return (x<10?'0':'')+x; }
      n.innerHTML='<div class="u"><div class="n">'+days+'</div><div class="l">days</div></div>'+
        '<div class="sep">:</div><div class="u"><div class="n">'+pad(h)+'</div><div class="l">hours</div></div>'+
        '<div class="sep">:</div><div class="u"><div class="n">'+pad(m)+'</div><div class="l">min</div></div>'+
        '<div class="sep">:</div><div class="u"><div class="n">'+pad(s)+'</div><div class="l">sec</div></div>';
    });
  }
  function renderHorizon(){
    var host=byId('horizonBoard'); if(!host) return;
    host.innerHTML=HORIZON.map(function(h){
      return '<div class="cell"><span class="eyebrow">'+esc(h.kicker)+'</span><h3>'+esc(h.title)+'</h3>'+
        '<p>'+esc(h.body)+'</p><div class="countdown" data-target="'+h.target+'"></div>'+
        '<div class="expected">'+esc(h.expected)+'</div></div>';
    }).join('');
    tick(); setInterval(tick,1000);
  }

  // ---------- species page ----------
  function renderSpecies(){
    var host=byId('speciesPage'); if(!host) return;
    var sp=SP[qs('s')]||SP.cattle;
    document.title=sp.heroTitle+' — '+S.name;
    var herd=ANIMALS.filter(function(a){ return a.species===sp.key; });
    host.innerHTML=''+
      '<section class="page-hero">'+photoKey(sp.heroKey,sp.heroTitle)+'<div class="scrim"></div>'+
        '<div class="ph-inner wrap"><div class="breadcrumb"><a href="index.html">Home</a> / '+esc(sp.crumb)+'</div>'+
        '<h1>'+esc(sp.heroTitle)+'</h1></div></section>'+
      '<section class="section"><div class="wrap"><div class="split">'+
        '<div class="col-img">'+photoKey(sp.imageKey,sp.plural)+'</div>'+
        '<div class="feature-copy"><span class="kicker">'+esc(sp.kicker)+'</span>'+
          '<div class="eyebrow" style="margin:.9rem 0 .3rem">'+esc(sp.label)+'</div>'+
          '<h2>'+sp.title+'</h2><p class="lede">'+esc(sp.body)+'</p></div>'+
      '</div></div></section>'+
      '<section class="section" style="padding-top:0"><div class="wrap">'+
        '<div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:2.5rem">'+
          '<div><span class="kicker">The Full Herd</span><h2 class="big" style="margin-top:.6rem">Every animal in the herd</h2></div>'+
          '<div class="muted" style="font-size:.9rem">'+herd.length+' head</div></div>'+
        '<div class="beast-grid">'+herd.map(beastCard).join('')+'</div>'+
      '</div></section>';
  }

  // ---------- available page ----------
  function renderAvailable(){
    var host=byId('availableGrid'); if(!host) return;
    var list=ANIMALS.filter(function(a){ return a.status==='Available'||a.status==='Reserved'; });
    var cats=['All','Goats','Sheep','Cattle'];
    var f=byId('availableFilters');
    if(f){ f.innerHTML=cats.map(function(c,i){ return '<button class="'+(i===0?'active':'')+'" data-cat="'+c+'">'+c+'</button>'; }).join(''); }
    function draw(cat){
      var l = cat==='All'?list:list.filter(function(a){ return SP[a.species].plural===cat; });
      host.innerHTML = l.length ? l.map(beastCard).join('') : '<p class="muted">Nothing in that pen right now — <a class="arrow rust" href="inquire.html">start an inquiry</a> and we\'ll write when one is ready.</p>';
    }
    if(f){ f.addEventListener('click',function(e){ var b=e.target.closest('button'); if(!b) return;
      f.querySelectorAll('button').forEach(function(x){x.classList.remove('active');}); b.classList.add('active'); draw(b.getAttribute('data-cat')); }); }
    draw('All');
  }

  // ---------- animal detail ----------
  function fact(k, v){ return v ? '<div class="fact"><dt>'+esc(k)+'</dt><dd>'+esc(v)+'</dd></div>' : ''; }
  function renderAnimal(){
    var host=byId('animalDetail'); if(!host) return;
    var a=animalBySlug(qs('a'));
    if(!a){ host.innerHTML='<div class="wrap section"><p class="muted">We couldn\'t find that one. <a class="arrow rust" href="available.html">See available stock</a>.</p></div>'; return; }
    document.title=a.name+' — '+S.name;
    var sp=SP[a.species];
    var cta = (a.status==='Available')
      ? '<a class="btn" style="margin-top:2rem" href="inquire.html?about='+encodeURIComponent(a.name)+'">Inquire about '+esc(a.name)+'</a>'
      : (showStatus(a)
          ? '<p class="muted" style="margin-top:1.6rem"><em>'+esc(a.name)+' is '+esc(a.status.toLowerCase())+'.</em> <a class="arrow rust" href="available.html">See who\'s available</a></p>'
          : '');

    var pics = animalGallery(a);
    var galleryHTML =
      '<div class="gallery">'+
        '<div class="gallery-main">'+imgTag(pics[0], a.name, STOCK[a.species])+'</div>'+
        (pics.length>1
          ? '<div class="gallery-thumbs">'+pics.map(function(s,i){
              return '<button type="button" class="gthumb'+(i===0?' active':'')+'" data-src="'+esc(s)+'">'+imgTag(s, a.name, STOCK[a.species])+'</button>';
            }).join('')+'</div>'
          : '')+
      '</div>';

    var facts =
      fact('Status',           showStatus(a)?a.status:'') +
      fact('Sex',              a.sex) +
      fact('Breed',            a.breed) +
      fact('Date of birth',    a.dob) +
      fact('Weaned / ready',   a.ready) +
      fact('Dam (mother)',     a.dam) +
      fact('Sire (father)',    a.sire) +
      fact('Color / markings', a.color) +
      fact('Registration',     a.id) +
      fact('Price',            a.price);

    host.innerHTML=''+
      '<section class="page-hero">'+photo(animalCover(a), a.name, '', STOCK[a.species])+'<div class="scrim"></div>'+
        '<div class="ph-inner wrap"><div class="breadcrumb"><a href="index.html">Home</a> / <a href="species.html?s='+sp.key+'">'+esc(sp.crumb)+'</a> / '+esc(a.name)+'</div>'+
        '<h1>'+esc(a.name)+'</h1></div></section>'+
      '<section class="section"><div class="wrap"><div class="animal-detail-grid">'+
        '<div>'+galleryHTML+'</div>'+
        '<div class="animal-info">'+
          '<span class="kicker">'+esc(sp.kicker)+'</span>'+
          '<h2 style="font-size:clamp(2rem,4vw,3rem);margin:.7rem 0 .3rem">'+esc(a.name)+'</h2>'+
          (a.breed||a.sex?'<div class="breed" style="font-family:var(--serif);font-style:italic;color:var(--muted);font-size:1.15rem;margin-bottom:1.3rem">'+esc([a.breed,a.sex].filter(Boolean).join(' · '))+'</div>':'')+
          (a.desc?'<p class="lede">'+esc(a.desc)+'</p>':'')+
          (facts?'<dl class="facts">'+facts+'</dl>':'')+
          cta+
        '</div>'+
      '</div></div></section>';

    // thumbnail → swap the main photo
    var mainImg = host.querySelector('.gallery-main img');
    host.querySelectorAll('.gthumb').forEach(function(btn){
      btn.addEventListener('click', function(){
        host.querySelectorAll('.gthumb').forEach(function(x){ x.classList.remove('active'); });
        btn.classList.add('active');
        var im = btn.querySelector('img');
        if(mainImg && im){ mainImg.src = im.currentSrc || im.src; mainImg.style.display=''; }
      });
    });
  }

  // ---------- events ----------
  function renderEvents(){
    var host = byId('eventsList'); if(!host) return;
    host.innerHTML = EVENTS.map(function(e){
      return '<div class="event"><div class="when">'+esc(e.when)+'</div>'+
        '<div class="what"><h3>'+esc(e.title)+'</h3><p>'+esc(e.body)+'</p></div>'+
        '<div><a class="btn" href="inquire.html?about=Events">'+esc(e.cta||'RSVP')+'</a></div></div>';
    }).join('');
  }

  // ---------- store ----------
  function renderStore(){
    var host = byId('storeGrid'); if(!host) return;
    host.innerHTML = PRODUCTS.map(function(pr){
      var im = IMG[pr.img] ? img2(pr.img, pr.name) : imgTag(pr.img, pr.name, '');
      return '<div class="product"><div class="ph">'+im+'</div>'+
        '<div class="body"><div class="top"><h3>'+esc(pr.name)+'</h3><span class="price">'+esc(pr.price)+'</span></div>'+
        '<p>'+esc(pr.blurb)+'</p>'+
        '<a class="arrow rust" href="inquire.html?about=Store">Inquire to purchase →</a></div></div>';
    }).join('');
  }

  // ---------- join the list (email / text signup) ----------
  function signupHTML(){
    return '<div class="wrap section center">'+
      '<span class="kicker center">Stay in the loop</span>'+
      '<h2 class="big" style="margin-top:1rem">Be first to know when <em>new arrivals</em> hit the ground.</h2>'+
      '<p class="lede" style="margin:1rem auto 2rem;max-width:54ch">Join our list and we\'ll send word the moment lambs, kids, and calves are born and when stock becomes available — by email or text, whichever you prefer.</p>'+
      '<form class="join-form" novalidate>'+
        '<div class="join-row">'+
          '<input name="name" placeholder="First name" aria-label="First name">'+
          '<input type="email" name="email" placeholder="Email address" aria-label="Email" required>'+
          '<input type="tel" name="phone" placeholder="Phone (for texts)" aria-label="Phone">'+
          '<select name="preference" aria-label="How should we reach you?"><option value="Email or text">Email or text</option><option value="Email only">Email only</option><option value="Text only">Text only</option></select>'+
          '<button class="btn" type="submit">Join the list</button>'+
        '</div>'+
        '<div class="join-fine">No spam, ever — just farm news. Unsubscribe anytime.</div>'+
        '<div class="form-note">You\'re on the list! We\'ll be in touch when there\'s news from the farm.</div>'+
      '</form>'+
    '</div>';
  }
  function renderSignup(){
    var hosts = document.querySelectorAll('[data-join]'); if(!hosts.length) return;
    hosts.forEach(function(host){
      host.innerHTML = signupHTML();
      var form = host.querySelector('.join-form');
      var note = host.querySelector('.form-note');
      form.addEventListener('submit', function(e){
        e.preventDefault();
        var email = form.querySelector('[name=email]');
        if(email && !email.value.trim()){ email.focus(); return; }
        function done(){
          form.querySelectorAll('input,select,button').forEach(function(n){ n.setAttribute('disabled','disabled'); });
          if(note){ note.classList.add('show'); }
        }
        var ep = S.listEndpoint;
        if(!ep){ done(); return; }   // demo mode until a service is connected
        var btn = form.querySelector('button'); if(btn){ btn.textContent = 'Joining…'; }
        fetch(ep, { method:'POST', body: new FormData(form), headers:{ 'Accept':'application/json' } })
          .then(function(){ done(); })
          .catch(function(){ done(); });
      });
    });
  }

  // ---------- forms ----------
  function initForms(){
    // visit form + generic confirm
    document.querySelectorAll('form[data-confirm]').forEach(function(form){
      form.addEventListener('submit',function(e){ e.preventDefault();
        form.querySelectorAll('input,select,textarea,button').forEach(function(n){ n.setAttribute('disabled','disabled'); });
        var note=form.querySelector('.form-note'); if(note){ note.classList.add('show'); note.scrollIntoView({behavior:'smooth',block:'center'}); }
      });
    });
    // inquire prefill
    var about=qs('about'); if(about){
      var msel=document.querySelector('#mlSpecies');
      var match=ANIMALS.filter(function(a){return a.name.toLowerCase()===about.toLowerCase();})[0];
      if(match&&msel){ for(var i=0;i<msel.options.length;i++){ if(msel.options[i].value.toLowerCase()===SP[match.species].plural.toLowerCase()){ msel.selectedIndex=i; } } }
    }
  }

  function initReveal(){
    if(!('IntersectionObserver' in window)){ document.querySelectorAll('.reveal').forEach(function(n){n.classList.add('in');}); return; }
    var io=new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } }); },{threshold:.12});
    document.querySelectorAll('.reveal').forEach(function(n){ io.observe(n); });
    setTimeout(function(){ document.querySelectorAll('.reveal').forEach(function(n){n.classList.add('in');}); },2200);
  }

  function fillTokens(){
    document.querySelectorAll('[data-img]').forEach(function(n){ n.classList.add('ph'); n.innerHTML=img2(n.getAttribute('data-img')); });
    document.querySelectorAll('[data-hero-img]').forEach(function(n){ n.innerHTML=img2(n.getAttribute('data-hero-img')); });
    // editable page wording
    document.querySelectorAll('[data-copy]').forEach(function(n){ var v=COPY[n.getAttribute('data-copy')]; if(v!=null) n.innerHTML=v; });
    // home animal blurbs, filled from SPECIES (edit once, updates home + species page)
    document.querySelectorAll('[data-species]').forEach(function(n){
      var sp=SP[n.getAttribute('data-species')]; if(!sp) return;
      function put(sel,val,html){ var e=n.querySelector(sel); if(e){ if(html) e.innerHTML=val; else e.textContent=val; } }
      put('[data-sp-kicker]', sp.kicker); put('[data-sp-label]', sp.label);
      put('[data-sp-title]', sp.title, true); put('[data-sp-body]', sp.body);
    });
  }

  document.addEventListener('DOMContentLoaded',function(){
    mountChrome(); fillTokens();
    renderHorizon(); renderSpecies(); renderAvailable(); renderAnimal();
    renderEvents(); renderStore(); renderSignup();
    initForms(); initReveal();
  });
})();
