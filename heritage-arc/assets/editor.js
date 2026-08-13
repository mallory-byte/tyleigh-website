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
  // gallery photos are stored as plain strings in data.js; work with {src} objects while editing
  state.ANIMALS.forEach(function(a){
    a.gallery = (a.gallery || []).map(function(s){ return typeof s === 'string' ? { src: s } : s; });
  });

  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c];}); }
  function byId(id){ return document.getElementById(id); }
  function slugify(s){ return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }

  var SPECIES = ['cattle','sheep','goats'];
  var STATUS = ['Available','Reserved','Sold','Herd Sire','Foundation Cow','Not For Sale'];

  function opt(list, val){ return list.map(function(o){ return '<option'+(o===val?' selected':'')+'>'+esc(o)+'</option>'; }).join(''); }

  function animalPhotoSrc(a){ return a.photo || (a.gallery && a.gallery[0] && a.gallery[0].src) || ('images/animals/'+(a.slug||'')+'.jpg'); }

  function gThumbs(a){
    return (a.gallery || []).map(function(g, gi){
      return '<div class="ed-gthumb"><img src="'+esc(g.src)+'" alt="" onerror="this.style.display=&#39;none&#39;">'+
        '<button type="button" class="ed-gdel" data-gdel="'+gi+'" title="Remove">×</button></div>';
    }).join('');
  }

  function animalRow(a, i){
    var can = /^(available|sold|reserved)$/i.test(String(a.status||'').trim());
    return '<div class="ed-card" data-i="'+i+'">'+
      '<div class="ed-photo">'+
        '<div class="ed-thumb"><span class="ed-thumb-ph">No photo yet</span>'+
          '<img src="'+esc(animalPhotoSrc(a))+'" alt="" onerror="this.style.display=&#39;none&#39;">'+
        '</div>'+
        '<div class="ed-photo-side">'+
          '<label class="btn ghost ed-photo-btn">Choose cover photo<input type="file" accept="image/*" data-photo="1"></label>'+
          '<div class="ed-photo-note">'+(a.photo?'Cover photo set.':'The cover photo shown on the card. A stock photo fills in until you add one.')+'</div>'+
        '</div>'+
      '</div>'+
      '<div class="ed-row"><label>Name<input data-f="name" value="'+esc(a.name)+'"></label>'+
        '<label>Nickname / photo name<input data-f="slug" value="'+esc(a.slug||'')+'" placeholder="auto"></label></div>'+
      '<div class="ed-row"><label>Kind<select data-f="species">'+opt(SPECIES,a.species)+'</select></label>'+
        '<label>Breed<input data-f="breed" value="'+esc(a.breed)+'"></label>'+
        '<label>Registration / ID<input data-f="id" value="'+esc(a.id)+'"></label></div>'+
      '<div class="ed-row"><label>Sex<input data-f="sex" value="'+esc(a.sex)+'"></label>'+
        '<label>Status<select data-f="status">'+opt(STATUS,a.status)+'</select></label></div>'+
      '<p class="ed-hint">'+(can
          ? 'This animal is for sale, so it gets its own page (buyers can click in). Fill in the details below.'
          : 'This is one of your keepers — its card won\'t be clickable and shows no status. Set it to Available to give it a full page.')+'</p>'+
      '<div class="ed-row"><label>Date of birth<input data-f="dob" value="'+esc(a.dob||'')+'" placeholder="e.g. March 3, 2026"></label>'+
        '<label>Weaned / ready date<input data-f="ready" value="'+esc(a.ready||'')+'" placeholder="e.g. May 2026"></label></div>'+
      '<div class="ed-row"><label>Dam (mother)<input data-f="dam" value="'+esc(a.dam||'')+'"></label>'+
        '<label>Sire (father)<input data-f="sire" value="'+esc(a.sire||'')+'"></label></div>'+
      '<div class="ed-row"><label>Color / markings<input data-f="color" value="'+esc(a.color||'')+'"></label>'+
        '<label>Price<input data-f="price" value="'+esc(a.price||'')+'" placeholder="optional"></label></div>'+
      '<label class="ed-full">Description<textarea data-f="desc" rows="2">'+esc(a.desc)+'</textarea></label>'+
      '<div class="ed-gallery">'+
        '<div class="ed-glabel">Photo gallery (shown on the animal\'s own page — add 5 or more!)</div>'+
        '<div class="ed-gthumbs">'+gThumbs(a)+'</div>'+
        '<label class="btn ghost ed-photo-btn ed-gadd">+ Add photos<input type="file" accept="image/*" multiple data-gallery="1"></label>'+
      '</div>'+
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
    inquireHeading:    'Inquire · headline',
    reserveHeading:    'Reserve · headline',
    reserveIntro:      'Reserve · intro paragraphs'
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
  // ---------- photo picking (downscale in-browser, upload on Save) ----------
  function processImage(file, cb){
    var reader = new FileReader();
    reader.onload = function(){
      var img = new Image();
      img.onload = function(){
        var max = 1600, w = img.width, h = img.height;
        if (w > max){ h = Math.round(h * max / w); w = max; }
        var cv = document.createElement('canvas'); cv.width = w; cv.height = h;
        cv.getContext('2d').drawImage(img, 0, 0, w, h);
        var url = cv.toDataURL('image/jpeg', 0.85);
        cb(url, url.split(',')[1], 'jpg');
      };
      img.onerror = function(){ // non-decodable (rare) — send the raw file through as-is
        var ext = (file.name.split('.').pop() || 'jpg').toLowerCase(); if (ext === 'jpeg') ext = 'jpg';
        cb(reader.result, reader.result.split(',')[1], ext);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function renderGThumbs(card){
    var a = state.ANIMALS[+card.getAttribute('data-i')];
    var wrap = card.querySelector('.ed-gthumbs'); if (wrap) wrap.innerHTML = gThumbs(a);
  }

  document.addEventListener('change', function(e){
    var t = e.target; if (!t.getAttribute) return;
    var card = t.closest('.ed-card'); if (!card) return;
    var a = state.ANIMALS[+card.getAttribute('data-i')];

    // cover photo
    if (t.hasAttribute('data-photo')) {
      var file = t.files && t.files[0]; if (!file) return;
      var note = card.querySelector('.ed-photo-note'); if (note) note.textContent = 'Reading photo…';
      processImage(file, function(url, base64, ext){
        a.photo = url;
        a._up = { base64: base64, ext: ext };
        var img = card.querySelector('.ed-thumb img');
        if (img){ img.src = url; img.style.display = ''; }
        if (note) note.textContent = 'New cover photo ready — it uploads when you Save.';
      });
      return;
    }

    // gallery photos (multiple)
    if (t.hasAttribute('data-gallery')) {
      var files = t.files ? Array.prototype.slice.call(t.files) : []; if (!files.length) return;
      var chain = Promise.resolve();
      files.forEach(function(f){
        chain = chain.then(function(){
          return new Promise(function(res){
            processImage(f, function(url, base64, ext){
              a.gallery.push({ src: url, _up: { base64: base64, ext: ext } });
              renderGThumbs(card); res();
            });
          });
        });
      });
      chain.then(function(){ t.value = ''; });
      return;
    }
  });

  document.addEventListener('click', function(e){
    var t = e.target; if(!t.getAttribute) return;
    if (t.getAttribute('data-gdel') !== null) {
      var card = t.closest('.ed-card'); var a = state.ANIMALS[+card.getAttribute('data-i')];
      a.gallery.splice(+t.getAttribute('data-gdel'), 1); renderGThumbs(card); return;
    }
    if (t.getAttribute('data-del') !== null)   { state.ANIMALS.splice(+t.getAttribute('data-del'), 1); renderAnimals(); }
    if (t.getAttribute('data-evdel') !== null) { state.EVENTS.splice(+t.getAttribute('data-evdel'), 1); renderEventsEd(); }
    if (t.getAttribute('data-prdel') !== null) { state.PRODUCTS.splice(+t.getAttribute('data-prdel'), 1); renderStoreEd(); }
  });

  function addAnimal(){
    state.ANIMALS.push({ slug:'', name:'New Animal', species:'cattle', breed:'', id:'', sex:'', status:'Available',
      dob:'', ready:'', dam:'', sire:'', color:'', price:'', desc:'', gallery:[] });
    renderAnimals();
    var cards = byId('edAnimals').querySelectorAll('.ed-card'); cards[cards.length-1].scrollIntoView({behavior:'smooth', block:'center'});
  }
  function addEvent(){ state.EVENTS.push({ when:'', title:'New event', body:'', cta:'RSVP' }); renderEventsEd(); }
  function addProduct(){ state.PRODUCTS.push({ name:'New product', price:'', blurb:'', img:'wool' }); renderStoreEd(); }

  function cleanAnimals(){
    return state.ANIMALS.map(function(a){
      var c = {};
      for (var k in a){ if (k === '_up' || k === 'gallery') continue; c[k] = a[k]; }
      c.gallery = (a.gallery || []).map(function(g){ return typeof g === 'string' ? g : g.src; }).filter(Boolean);
      return c;
    });
  }
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
      '  var ANIMALS = ' + o(cleanAnimals()) + ';\n' +
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
    if(!token){ status('Paste your GitHub access key first (see "How to get your key" above).', 'err'); return; }
    saveCfg({ owner:owner, repo:repo, branch:branch, token: byId('pubRemember').checked ? token : '' });

    var headers = { 'Authorization':'Bearer '+token, 'Accept':'application/vnd.github+json', 'X-GitHub-Api-Version':'2022-11-28' };
    function cpath(p){ return 'https://api.github.com/repos/'+owner+'/'+repo+'/contents/'+p; }
    // GET current sha (if any), then PUT the new content — works for text and binary (base64).
    function ghPut(p, contentB64, message){
      var url = cpath(p);
      return fetch(url+'?ref='+encodeURIComponent(branch)+'&t='+Date.now(), { headers: headers, cache:'no-store' })
        .then(function(g){
          if(g.status===401) throw {msg:'That key was rejected. Copy it again fully — and check it hasn\'t expired.'};
          if(g.status===404) return null; // file will be created
          if(g.status!==200) throw {msg:'Couldn\'t reach your project (error '+g.status+'). Check the repo name below.'};
          return g.json();
        })
        .then(function(gj){
          var body = { message:message, content:contentB64, branch:branch };
          if(gj && gj.sha) body.sha = gj.sha;
          return fetch(url, { method:'PUT', headers: headers, body: JSON.stringify(body) });
        })
        .then(function(put){
          if(put.status===200 || put.status===201) return;
          if(put.status===401 || put.status===403) throw {msg:'Save was blocked (error '+put.status+'). Your key needs "Contents: Read and write" on this repository.'};
          if(put.status===409) throw {msg:'Something changed at the same time — click Save changes again.'};
          return put.json().then(function(pj){ throw {msg:'Save failed (error '+put.status+'). '+(pj.message||'')}; });
        });
    }

    status('Saving to your site…', 'busy');
    state.ANIMALS.forEach(function(a){ if(!a.slug) a.slug = slugify(a.name); });

    // 1) upload any newly-chosen animal photos as their own files, 2) then save data.js
    var chain = Promise.resolve();
    state.ANIMALS.forEach(function(a){
      if(a._up){
        chain = chain.then(function(){
          var p = 'images/animals/'+a.slug+'.'+a._up.ext;
          status('Uploading ' + (a.name || 'animal') + '’s cover photo…', 'busy');
          return ghPut(p, a._up.base64, 'Add photo for ' + (a.name || a.slug)).then(function(){
            a.photo = p; delete a._up;
          });
        });
      }
      (a.gallery || []).forEach(function(g, gi){
        if(!g._up) return;
        chain = chain.then(function(){
          var p = 'images/animals/'+a.slug+'-g'+(gi+1)+'.'+g._up.ext;
          status('Uploading a gallery photo for ' + (a.name || 'animal') + '…', 'busy');
          return ghPut(p, g._up.base64, 'Add gallery photo for ' + (a.name || a.slug)).then(function(){
            g.src = p; delete g._up;
          });
        });
      });
    });
    chain
      .then(function(){ status('Saving your changes…', 'busy'); return ghPut('assets/data.js', b64(generate()), 'Update site content via the editor'); })
      .then(function(){ status('✓ Saved! Your live site updates in about a minute. Refresh it shortly.', 'ok'); renderAnimals(); })
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
