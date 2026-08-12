/* =========================================================================
   Wallace Family Farms — built-in content editor.
   Edits animals + site details in the browser and SAVES straight to GitHub
   (which redeploys the live site). Needs a one-time GitHub access token,
   stored only in this browser. Falls back to downloading the file.
   ========================================================================= */
(function () {
  var HA = window.HA;
  var state = JSON.parse(JSON.stringify({
    IMG: HA.IMG, STOCK: HA.STOCK, SITE: HA.SITE, SPECIES: HA.SPECIES,
    ANIMALS: HA.ANIMALS, HORIZON: HA.HORIZON, COPY: HA.COPY || {},
    EVENTS: HA.EVENTS || [], PRODUCTS: HA.PRODUCTS || []
  }));

  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c];}); }
  function byId(id){ return document.getElementById(id); }
  function slugify(s){ return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }

  var SPECIES = ['cattle','sheep','goats'];
  var STATUS = ['Available','Reserved','Sold','Herd Sire','Foundation Cow','Not For Sale'];

  function opt(list, val){ return list.map(function(o){ return '<option'+(o===val?' selected':'')+'>'+esc(o)+'</option>'; }).join(''); }

  function animalRow(a, i){
    return '<div class="ed-card" data-i="'+i+'">'+
      '<div class="ed-row"><label>Name<input data-f="name" value="'+esc(a.name)+'"></label>'+
        '<label>Nickname / photo name<input data-f="slug" value="'+esc(a.slug||'')+'" placeholder="auto"></label></div>'+
      '<div class="ed-row"><label>Kind<select data-f="species">'+opt(SPECIES,a.species)+'</select></label>'+
        '<label>Breed<input data-f="breed" value="'+esc(a.breed)+'"></label>'+
        '<label>ID<input data-f="id" value="'+esc(a.id)+'"></label></div>'+
      '<div class="ed-row"><label>Sex<input data-f="sex" value="'+esc(a.sex)+'"></label>'+
        '<label>Age<input data-f="age" value="'+esc(a.age)+'"></label>'+
        '<label>Status<select data-f="status">'+opt(STATUS,a.status)+'</select></label></div>'+
      '<label class="ed-full">Description<textarea data-f="desc" rows="2">'+esc(a.desc)+'</textarea></label>'+
      '<button class="ed-del" data-del="'+i+'">Remove this animal</button>'+
    '</div>';
  }

  function renderAnimals(){
    byId('edAnimals').innerHTML = state.ANIMALS.map(animalRow).join('');
    byId('edCount').textContent = state.ANIMALS.length + ' animal' + (state.ANIMALS.length===1?'':'s');
  }

  function renderSite(){
    var s = state.SITE;
    byId('edSite').innerHTML =
      '<div class="ed-row"><label>Ranch name<input data-s="name" value="'+esc(s.name)+'"></label>'+
        '<label>Phone<input data-s="phone" value="'+esc(s.phone)+'"></label>'+
        '<label>Email<input data-s="email" value="'+esc(s.email)+'"></label></div>'+
      '<label class="ed-full">Tagline<input data-s="tagline" value="'+esc(s.tagline)+'"></label>'+
      '<label class="ed-full">Address (footer)<input data-s="address" value="'+esc(s.address||'')+'"></label>'+
      '<div class="ed-row"><label>Hours (footer)<input data-s="hours" value="'+esc(s.hours||'')+'"></label>'+
        '<label>Instagram link<input data-s="instagram" value="'+esc(s.instagram||'')+'"></label>'+
        '<label>Facebook link<input data-s="facebook" value="'+esc(s.facebook||'')+'"></label></div>';
  }

  // ---------- website wording ----------
  var COPY_LABELS = {
    heroOverline:  'Home · small line above the headline',
    heroHeadline:  'Home · big headline',
    heroSub:       'Home · paragraph under the headline',
    storyKicker:   'Home · story label',
    storyHeading:  'Home · story headline',
    storyP1:       'Home · story paragraph 1',
    storyP2:       'Home · story paragraph 2',
    horizonHeading:'Home · "counting down" headline',
    nextHeading:   'Home · "next steps" headline',
    availHeading:      'Available Stock · headline',
    eventsKicker:      'Events · small label',
    eventsHeading:     'Events · hero headline',
    eventsIntroHeading:'Events · intro headline',
    eventsIntro:       'Events · intro paragraph',
    storeKicker:       'Store · small label',
    storeHeading:      'Store · hero headline',
    storeIntroHeading: 'Store · intro headline',
    storeIntro:        'Store · intro paragraph',
    storeCta:          'Store · bottom banner line',
    inquireHeading:    'Inquire · headline'
  };
  function fieldFor(key, label, val, big){
    return '<label class="ed-full">'+esc(label)+ (big
      ? '<textarea data-w="'+key+'" rows="3">'+esc(val)+'</textarea>'
      : '<input data-w="'+key+'" value="'+esc(val)+'">') + '</label>';
  }
  function renderWording(){
    var host = byId('edWording'); if(!host) return;
    var html = '<p style="color:var(--muted);font-size:.88rem;margin-bottom:1rem">Tip: wrap a word in <code>&lt;em&gt;word&lt;/em&gt;</code> to make it italic, like the site does.</p>';
    Object.keys(COPY_LABELS).forEach(function(k){
      html += fieldFor(k, COPY_LABELS[k], state.COPY[k]!=null?state.COPY[k]:'', /(Sub|P1|P2|Intro)$/.test(k));
    });
    html += '<label class="ed-full">Footer credo line<input data-s="credo" value="'+esc(state.SITE.credo)+'"></label>';
    ['cattle','sheep','goats'].forEach(function(sp){
      var s = state.SPECIES[sp];
      html += '<div class="ed-card"><b style="font-family:var(--serif);font-size:1.15rem">The '+esc(s.plural)+'</b>'+
        '<label class="ed-full" style="margin-top:.6rem">Home headline<input data-ws="'+sp+'|title" value="'+esc(s.title)+'"></label>'+
        '<label class="ed-full">Home paragraph<textarea data-ws="'+sp+'|body" rows="3">'+esc(s.body)+'</textarea></label>'+
        '<label class="ed-full">Their page title<input data-ws="'+sp+'|heroTitle" value="'+esc(s.heroTitle)+'"></label></div>';
    });
    host.innerHTML = html;
  }

  // ---------- countdowns / events / products ----------
  function renderHorizonEd(){
    var host = byId('edHorizon'); if(!host) return;
    host.innerHTML = state.HORIZON.map(function(h,i){
      return '<div class="ed-card">'+
        '<div class="ed-row"><label>Small label<input data-h="'+i+'|kicker" value="'+esc(h.kicker)+'"></label>'+
          '<label>Title<input data-h="'+i+'|title" value="'+esc(h.title)+'"></label></div>'+
        '<label class="ed-full">Note<input data-h="'+i+'|body" value="'+esc(h.body)+'"></label>'+
        '<div class="ed-row"><label>Date (YYYY-MM-DD)<input data-h="'+i+'|target" value="'+esc(h.target)+'"></label>'+
          '<label>"Expected" line<input data-h="'+i+'|expected" value="'+esc(h.expected)+'"></label></div></div>';
    }).join('');
  }
  function renderEventsEd(){
    var host = byId('edEvents'); if(!host) return;
    host.innerHTML = state.EVENTS.map(function(e,i){
      return '<div class="ed-card">'+
        '<div class="ed-row"><label>When<input data-ev="'+i+'|when" value="'+esc(e.when)+'"></label>'+
          '<label>Title<input data-ev="'+i+'|title" value="'+esc(e.title)+'"></label>'+
          '<label>Button text<input data-ev="'+i+'|cta" value="'+esc(e.cta||'')+'"></label></div>'+
        '<label class="ed-full">Details<textarea data-ev="'+i+'|body" rows="2">'+esc(e.body)+'</textarea></label>'+
        '<button class="ed-del" data-evdel="'+i+'">Remove this event</button></div>';
    }).join('');
  }
  function renderStoreEd(){
    var host = byId('edStore'); if(!host) return;
    host.innerHTML = state.PRODUCTS.map(function(pr,i){
      return '<div class="ed-card">'+
        '<div class="ed-row"><label>Name<input data-pr="'+i+'|name" value="'+esc(pr.name)+'"></label>'+
          '<label>Price<input data-pr="'+i+'|price" value="'+esc(pr.price)+'"></label>'+
          '<label>Photo name<input data-pr="'+i+'|img" value="'+esc(pr.img)+'"></label></div>'+
        '<label class="ed-full">Description<textarea data-pr="'+i+'|blurb" rows="2">'+esc(pr.blurb)+'</textarea></label>'+
        '<button class="ed-del" data-prdel="'+i+'">Remove this product</button></div>';
    }).join('');
  }

  document.addEventListener('input', function(e){
    var t = e.target;
    if (t.hasAttribute && t.hasAttribute('data-f')) {
      var card = t.closest('.ed-card'); var i = +card.getAttribute('data-i');
      state.ANIMALS[i][t.getAttribute('data-f')] = t.value;
    } else if (t.hasAttribute && t.hasAttribute('data-s')) {
      state.SITE[t.getAttribute('data-s')] = t.value;
    } else if (t.hasAttribute && t.hasAttribute('data-w')) {
      state.COPY[t.getAttribute('data-w')] = t.value;
    } else if (t.hasAttribute && t.hasAttribute('data-ws')) {
      var ps = t.getAttribute('data-ws').split('|'); state.SPECIES[ps[0]][ps[1]] = t.value;
    } else if (t.hasAttribute && t.hasAttribute('data-h')) {
      var ph = t.getAttribute('data-h').split('|'); state.HORIZON[+ph[0]][ph[1]] = t.value;
    } else if (t.hasAttribute && t.hasAttribute('data-ev')) {
      var pe = t.getAttribute('data-ev').split('|'); state.EVENTS[+pe[0]][pe[1]] = t.value;
    } else if (t.hasAttribute && t.hasAttribute('data-pr')) {
      var pp = t.getAttribute('data-pr').split('|'); state.PRODUCTS[+pp[0]][pp[1]] = t.value;
    }
  });
  document.addEventListener('click', function(e){
    var t = e.target; if(!t.getAttribute) return;
    if (t.getAttribute('data-del') !== null)   { state.ANIMALS.splice(+t.getAttribute('data-del'), 1); renderAnimals(); }
    if (t.getAttribute('data-evdel') !== null) { state.EVENTS.splice(+t.getAttribute('data-evdel'), 1); renderEventsEd(); }
    if (t.getAttribute('data-prdel') !== null) { state.PRODUCTS.splice(+t.getAttribute('data-prdel'), 1); renderStoreEd(); }
  });

  function addAnimal(){
    state.ANIMALS.push({ slug:'', name:'New Animal', species:'cattle', breed:'', id:'', sex:'', age:'', status:'Available', desc:'' });
    renderAnimals();
    var cards = byId('edAnimals').querySelectorAll('.ed-card'); cards[cards.length-1].scrollIntoView({behavior:'smooth', block:'center'});
  }
  function addEvent(){ state.EVENTS.push({ when:'', title:'New event', body:'', cta:'RSVP' }); renderEventsEd(); }
  function addProduct(){ state.PRODUCTS.push({ name:'New product', price:'', blurb:'', img:'wool' }); renderStoreEd(); }

  function generate(){
    state.ANIMALS.forEach(function(a){ if(!a.slug) a.slug = slugify(a.name); });
    function o(x){ return JSON.stringify(x, null, 2); }
    return '/* Wallace Family Farms — content (generated by the built-in editor). */\n' +
      '(function(){\n' +
      '  var IMG = ' + o(state.IMG) + ';\n' +
      '  var STOCK = ' + o(state.STOCK) + ';\n' +
      '  var SITE = ' + o(state.SITE) + ';\n' +
      '  var SPECIES = ' + o(state.SPECIES) + ';\n' +
      '  var COPY = ' + o(state.COPY) + ';\n' +
      '  var EVENTS = ' + o(state.EVENTS) + ';\n' +
      '  var PRODUCTS = ' + o(state.PRODUCTS) + ';\n' +
      '  var ANIMALS = ' + o(state.ANIMALS) + ';\n' +
      '  var HORIZON = ' + o(state.HORIZON) + ';\n' +
      '  window.HA = { SITE: SITE, SPECIES: SPECIES, ANIMALS: ANIMALS, HORIZON: HORIZON, IMG: IMG, STOCK: STOCK, COPY: COPY, EVENTS: EVENTS, PRODUCTS: PRODUCTS };\n' +
      '})();\n';
  }

  // ---------- fallback download ----------
  function download(){
    var blob = new Blob([generate()], { type: 'text/javascript' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = 'data.js'; document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
    status('Downloaded data.js — upload it to your project\'s assets folder on GitHub to publish.', 'ok');
  }

  // ---------- publish straight to GitHub ----------
  var CFG_KEY = 'wff_publish_cfg';
  function loadCfg(){ try { return JSON.parse(localStorage.getItem(CFG_KEY)) || {}; } catch(e){ return {}; } }
  function saveCfg(c){ try { localStorage.setItem(CFG_KEY, JSON.stringify(c)); } catch(e){} }
  var DEFAULTS = { owner:'mallory-byte', repo:'wallace-family-farms', branch:'main' };

  function b64(str){ return btoa(unescape(encodeURIComponent(str))); }
  function status(msg, kind){ var el = byId('pubStatus'); if(!el) return; el.textContent = msg; el.className = 'pub-status ' + (kind||''); el.style.display = 'block'; }

  function publish(){
    var token = byId('pubToken').value.trim();
    var owner = (byId('pubOwner').value.trim() || DEFAULTS.owner);
    var repo  = (byId('pubRepo').value.trim()  || DEFAULTS.repo);
    var branch= (byId('pubBranch').value.trim()|| DEFAULTS.branch);
    var path  = 'assets/data.js';
    if(!token){ status('Paste your GitHub access key first (see "How to get your key" above).', 'err'); return; }
    saveCfg({ owner:owner, repo:repo, branch:branch, token: byId('pubRemember').checked ? token : '' });

    status('Saving to your site…', 'busy');
    var api = 'https://api.github.com/repos/'+owner+'/'+repo+'/contents/'+path;
    var headers = { 'Authorization':'Bearer '+token, 'Accept':'application/vnd.github+json', 'X-GitHub-Api-Version':'2022-11-28' };

    fetch(api+'?ref='+encodeURIComponent(branch)+'&t='+Date.now(), { headers: headers, cache:'no-store' })
      .then(function(g){
        if(g.status===401) throw {msg:'That key was rejected. Copy it again fully — and check it hasn\'t expired.'};
        if(g.status===404) return null; // file will be created
        if(g.status!==200) throw {msg:'Couldn\'t reach your project (error '+g.status+'). Check the repo name below.'};
        return g.json();
      })
      .then(function(gj){
        var body = { message:'Update site content via the editor', content:b64(generate()), branch:branch };
        if(gj && gj.sha) body.sha = gj.sha;
        return fetch(api, { method:'PUT', headers: headers, body: JSON.stringify(body) });
      })
      .then(function(put){
        if(put.status===200 || put.status===201){ status('✓ Saved! Your live site updates in about a minute. Refresh it shortly.', 'ok'); return; }
        if(put.status===401 || put.status===403){ throw {msg:'Save was blocked (error '+put.status+'). Your key needs "Contents: Read and write" on this repository.'}; }
        if(put.status===409){ throw {msg:'The file just changed elsewhere — click Save changes again.'}; }
        return put.json().then(function(pj){ throw {msg:'Save failed (error '+put.status+'). '+(pj.message||'')}; });
      })
      .catch(function(e){ status((e && e.msg) || 'Network error — check your connection and try again.', 'err'); });
  }

  document.addEventListener('DOMContentLoaded', function(){
    renderSite(); renderWording(); renderHorizonEd(); renderEventsEd(); renderStoreEd(); renderAnimals();
    byId('edAdd').addEventListener('click', addAnimal);
    byId('edAddEvent').addEventListener('click', addEvent);
    byId('edAddProduct').addEventListener('click', addProduct);
    byId('edDownload').addEventListener('click', download);
    byId('edPublish').addEventListener('click', publish);
    // restore saved publish settings
    var cfg = loadCfg();
    byId('pubOwner').value  = cfg.owner  || DEFAULTS.owner;
    byId('pubRepo').value   = cfg.repo   || DEFAULTS.repo;
    byId('pubBranch').value = cfg.branch || DEFAULTS.branch;
    if(cfg.token){ byId('pubToken').value = cfg.token; byId('pubRemember').checked = true; }
  });
})();
