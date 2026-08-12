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
  function animalImg(a){ return imgTag('images/animals/'+a.slug+'.jpg', a.name, STOCK[a.species]); }
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
        '<a class="reserve-btn" href="inquire.html?about=Reserve">Reserve</a>'+
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
        '<a href="inquire.html?about=Reserve">Reserve</a>'+
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
  function beastCard(a){
    return '<a class="beast" href="animal.html?a='+a.slug+'">'+
      '<div class="ph" style="position:relative"><span class="tag">'+esc(SP[a.species].plural)+'</span>'+animalImg(a)+'</div>'+
      '<div class="body">'+
        '<div class="top"><h3>'+esc(a.name)+'</h3><span class="id">'+esc(a.id)+'</span></div>'+
        '<div class="breed">'+esc(a.breed)+'</div>'+
        '<div class="spec"><div><div class="k">Age</div><div class="v">'+esc(a.age)+'</div></div>'+
          '<div><div class="k">Status</div><div class="v">'+esc(a.status)+'</div></div></div>'+
        '<div class="desc">'+esc(a.desc)+'</div>'+
      '</div></a>';
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
  function renderAnimal(){
    var host=byId('animalDetail'); if(!host) return;
    var a=animalBySlug(qs('a'));
    if(!a){ host.innerHTML='<div class="wrap section"><p class="muted">We couldn\'t find that one. <a class="arrow rust" href="available.html">See available stock</a>.</p></div>'; return; }
    document.title=a.name+' — '+S.name;
    var sp=SP[a.species];
    var cta = (a.status==='Available')
      ? '<a class="btn" style="margin-top:2rem" href="inquire.html?about='+encodeURIComponent(a.name)+'">Inquire about '+esc(a.name)+'</a>'
      : '<p class="muted" style="margin-top:1.5rem"><em>'+esc(a.name)+' is '+a.status.toLowerCase()+'.</em> <a class="arrow rust" href="available.html">See who\'s available</a></p>';
    host.innerHTML=''+
      '<section class="page-hero">'+photoAnimal(a)+'<div class="scrim"></div>'+
        '<div class="ph-inner wrap"><div class="breadcrumb"><a href="index.html">Home</a> / <a href="species.html?s='+sp.key+'">'+esc(sp.crumb)+'</a> / '+esc(a.name)+'</div>'+
        '<h1>'+esc(a.name)+'</h1></div></section>'+
      '<section class="section"><div class="wrap"><div class="split">'+
        '<div class="col-img">'+photoAnimal(a)+'</div>'+
        '<div><span class="kicker">'+esc(sp.kicker)+'</span>'+
          '<h2 style="font-size:clamp(2rem,4vw,3rem);margin:.8rem 0 .3rem">'+esc(a.name)+'</h2>'+
          '<div class="breed" style="font-family:var(--serif);font-style:italic;color:var(--muted);font-size:1.15rem;margin-bottom:1.4rem">'+esc(a.breed)+' · '+esc(a.sex)+'</div>'+
          '<p class="lede">'+esc(a.desc)+'</p>'+
          '<div class="spec" style="max-width:420px;margin-top:1.8rem">'+
            '<div><div class="k">Age</div><div class="v">'+esc(a.age)+'</div></div>'+
            '<div><div class="k">Status</div><div class="v">'+esc(a.status)+'</div></div></div>'+
          '<table style="width:100%;max-width:420px;border-collapse:collapse;margin-top:1.4rem;font-size:.95rem">'+
            '<tr><td style="padding:.5rem 0;color:var(--muted);border-bottom:1px solid var(--line)">Registry ID</td><td style="text-align:right;border-bottom:1px solid var(--line)">'+esc(a.id)+'</td></tr>'+
            '<tr><td style="padding:.5rem 0;color:var(--muted);border-bottom:1px solid var(--line)">Breed</td><td style="text-align:right;border-bottom:1px solid var(--line)">'+esc(a.breed)+'</td></tr>'+
          '</table>'+cta+
        '</div></div></div></section>';
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
    renderEvents(); renderStore();
    initForms(); initReveal();
  });
})();
