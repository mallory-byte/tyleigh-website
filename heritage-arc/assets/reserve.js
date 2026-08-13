/* =========================================================================
   Wallace Family Farms — reservation application (multi-step wizard).
   Choose an animal, step through the questions, watch the progress bar fill.
   ========================================================================= */
(function () {
  var host = document.getElementById('reserveApp');
  if (!host || !window.HA) return;
  var SP = window.HA.SPECIES, IMG = window.HA.IMG, STOCK = window.HA.STOCK;

  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c];}); }

  // grammar per species so the questions read naturally
  var GRAMMAR = {
    cattle: { one:'cow',   many:'cattle', male:'bulls', shear:false, famacha:false },
    sheep:  { one:'sheep', many:'sheep',  male:'rams',  shear:true,  famacha:true  },
    goats:  { one:'goat',  many:'goats',  male:'bucks', shear:true,  famacha:true  }
  };
  function g(key){ return GRAMMAR[key] || { one:'animal', many:'animals', male:'intact males', shear:false, famacha:false }; }
  function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }

  // fill {a}=singular, {p}=plural, {P}=Plural, {male}=male word, {famacha}=... into a label
  function sub(str, key){
    var gg = g(key);
    return str
      .replace(/\{a\}/g, gg.one)
      .replace(/\{p\}/g, gg.many)
      .replace(/\{P\}/g, cap(gg.many))
      .replace(/\{male\}/g, gg.male)
      .replace(/\{famacha\}/g, gg.famacha ? 'checking their FAMACHA, ' : '');
  }

  // ----- the question steps -----
  var STEPS = [
    { id:'pick',  title:'Choose your animal' },
    { id:'details', title:'Your details', fields:[
      { name:'firstName',   label:'First Name', type:'text', half:true, req:true },
      { name:'lastName',    label:'Last Name',  type:'text', half:true, req:true },
      { name:'farmName',    label:'Farm Name',  type:'text', half:true },
      { name:'email',       label:'Email',      type:'email', half:true, req:true },
      { name:'address',     label:'Address',    type:'text', half:true },
      { name:'cityStateZip',label:'City, State, Zip Code', type:'text', half:true },
      { name:'animalNames', label:'Name(s) of {p} to reserve', type:'text' }
    ]},
    { id:'setup', title:'Your set-up', fields:[
      { name:'currentStock', label:'Do you currently have {p}? How many?', type:'text' },
      { name:'setup',        label:'What is your current set-up / living conditions for {p}? (Barn, acreage, fencing, dry lot, etc.)', type:'area' },
      { name:'predators',    label:'How will you provide protection from predators?', type:'area' },
      { name:'vet',          label:"What is your veterinarian's name and phone number?", type:'text' },
      { name:'shearer',      label:'Do you have a shearer available to you? {P} must be sheared annually.', type:'yn', shearOnly:true }
    ]},
    { id:'care', title:'Care & commitment', fields:[
      { name:'lifetime',   label:'Are you willing and prepared to care for a {a} for its entire life, including ensuring it always has another {a} companion?', type:'yn', req:true },
      { name:'healthcare', label:'Are you prepared to provide routine healthcare — {famacha}trimming hooves, deworming, and yearly vaccinations?', type:'yn', req:true },
      { name:'males',      label:'Are you aware intact males ({male}) may become aggressive to people and other animals as they mature and should never be treated as pets?', type:'yn' },
      { name:'zoned',      label:'Is your home and land zoned for livestock?', type:'select', options:['Yes','No','Not sure'], req:true },
      { name:'deposit',    label:"Do you agree that your deposit is non-refundable if the buyer's circumstances change, and that all transportation is the buyer's responsibility during the agreed-upon timeframe?", type:'yn', req:true },
      { name:'payment',    label:'Payment Preference', type:'select', options:['Cash','Check','Venmo','PayPal','Zelle','Other'], req:true }
    ]},
    { id:'review', title:'Review & send' }
  ];

  var order = ['cattle','sheep','goats'].filter(function(k){ return SP[k]; });
  var state = { step:0, species:'', data:{} };

  // ----- field rendering -----
  function fieldHTML(f, key){
    if (f.shearOnly && !g(key).shear) return '';   // shearing only applies to sheep / fiber goats
    var label = esc(sub(f.label, key));
    var val = state.data[f.name] || '';
    var req = f.req ? ' data-req="1"' : '';
    var inner;
    if (f.type === 'area') {
      inner = '<textarea name="'+f.name+'" rows="3"'+req+'>'+esc(val)+'</textarea>';
    } else if (f.type === 'yn') {
      inner = '<select name="'+f.name+'"'+req+'><option value="" disabled'+(val?'':' selected')+'>Choose an option</option>'+
        ['Yes','No'].map(function(o){ return '<option'+(o===val?' selected':'')+'>'+o+'</option>'; }).join('')+'</select>';
    } else if (f.type === 'select') {
      inner = '<select name="'+f.name+'"'+req+'><option value="" disabled'+(val?'':' selected')+'>Choose an option</option>'+
        f.options.map(function(o){ return '<option'+(o===val?' selected':'')+'>'+esc(o)+'</option>'; }).join('')+'</select>';
    } else {
      inner = '<input type="'+(f.type==='email'?'email':'text')+'" name="'+f.name+'" value="'+esc(val)+'"'+req+'>';
    }
    return '<div class="line-field'+(f.half?' wz-half':'')+'"><label>'+label+(f.req?' <span class="wz-req">*</span>':'')+'</label>'+inner+'</div>';
  }

  function stepBody(s){
    if (s.id === 'pick') {
      return '<p class="wz-lead">Which of our animals are you hoping to bring home?</p>'+
        '<div class="wz-picks">'+ order.map(function(k){
          var sp = SP[k];
          return '<button type="button" class="wz-pick'+(state.species===k?' sel':'')+'" data-sp="'+k+'">'+
            '<span class="wz-pic"><img alt="'+esc(sp.plural)+'" src="'+esc(IMG[sp.imageKey]||'')+'" data-fb="'+esc(STOCK[sp.imageKey]||'')+'"></span>'+
            '<span class="wz-cap"><b>'+esc(sp.plural)+'</b><span>'+esc(sp.label)+'</span></span>'+
          '</button>';
        }).join('') +'</div>';
    }
    if (s.id === 'review') {
      var rows = '';
      STEPS.forEach(function(st){
        if(!st.fields) return;
        st.fields.forEach(function(f){
          if (f.shearOnly && !g(state.species).shear) return;
          var v = state.data[f.name];
          if (v==null || v==='') return;
          rows += '<div class="wz-rev-row"><dt>'+esc(sub(f.label, state.species).replace(/\s*\([^)]*\)/,''))+'</dt><dd>'+esc(v)+'</dd></div>';
        });
      });
      return '<p class="wz-lead">Reserving a <b>'+esc(g(state.species).one)+'</b> from our '+esc((SP[state.species]||{}).plural||'')+'. '+
        'Please look over your answers, then send.</p>'+
        '<dl class="wz-review">'+(rows||'<div class="wz-rev-row"><dd>No answers yet.</dd></div>')+'</dl>';
    }
    // question steps
    var group = '<div class="wz-fields">'+ s.fields.map(function(f){ return fieldHTML(f, state.species); }).join('') +'</div>';
    return group;
  }

  // ----- shell + progress -----
  function render(){
    var total = STEPS.length;
    var s = STEPS[state.step];
    var pct = state.step/(total-1)*100;
    host.innerHTML =
      '<div class="wizard">'+
        '<div class="wz-progress">'+
          '<div class="wz-meta"><span>Step '+(state.step+1)+' of '+total+'</span><span>'+esc(s.title)+'</span></div>'+
          '<div class="wz-bar"><div class="wz-fill" style="width:'+pct+'%"></div></div>'+
        '</div>'+
        '<div class="wz-step active"><h2 class="wz-h">'+esc(s.title)+'</h2>'+
          '<div class="wz-err" id="wzErr" hidden>Please answer the required questions (marked *) before continuing.</div>'+
          stepBody(s)+
        '</div>'+
        '<div class="wz-nav">'+
          '<button type="button" class="wz-back"'+(state.step===0?' hidden':'')+'>← Back</button>'+
          (s.id==='review'
            ? '<button type="button" class="btn on-dark wz-next" id="wzSend">Send application →</button>'
            : '<button type="button" class="btn on-dark wz-next" id="wzNext">Continue →</button>')+
        '</div>'+
        '<div class="form-note" id="wzNote">Thank you — your reservation application is on its way to the ranch. We\'ll contact you by email to discuss the next steps.</div>'+
      '</div>';
    // image fallbacks
    host.querySelectorAll('img[data-fb]').forEach(function(im){
      im.onerror = function(){ var f=im.getAttribute('data-fb'); if(f){ im.removeAttribute('data-fb'); im.src=f; } else { im.style.display='none'; } };
    });
    wire();
    host.scrollIntoView({ behavior:'smooth', block:'start' });
  }

  function collect(){
    host.querySelectorAll('.wz-fields [name]').forEach(function(n){ state.data[n.getAttribute('name')] = n.value; });
  }
  function validate(){
    var ok = true;
    host.querySelectorAll('.wz-fields [data-req]').forEach(function(n){
      if(!String(n.value||'').trim()){ ok = false; n.classList.add('wz-bad'); }
      else n.classList.remove('wz-bad');
    });
    return ok;
  }

  function wire(){
    var s = STEPS[state.step];
    // species picks
    host.querySelectorAll('.wz-pick').forEach(function(b){
      b.addEventListener('click', function(){
        state.species = b.getAttribute('data-sp');
        state.step++; render();
      });
    });
    var back = host.querySelector('.wz-back');
    if(back) back.addEventListener('click', function(){ collect(); state.step = Math.max(0, state.step-1); render(); });

    var next = host.querySelector('#wzNext');
    if(next) next.addEventListener('click', function(){
      collect();
      if(!validate()){ host.querySelector('#wzErr').hidden = false; return; }
      state.step++; render();
    });

    var send = host.querySelector('#wzSend');
    if(send) send.addEventListener('click', function(){
      var note = host.querySelector('#wzNote');
      host.querySelectorAll('.wz-nav, .wz-review, .wz-lead').forEach(function(n){ n.style.display='none'; });
      if(note){ note.classList.add('show'); note.scrollIntoView({behavior:'smooth', block:'center'}); }
    });
  }

  render();
})();
