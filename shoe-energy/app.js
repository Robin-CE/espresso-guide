
(()=>{'use strict';
const D=window.SHOE_DATA,S=D.shoes,stats=D.stats;let state={lab:'rtings',zone:'forefoot',sort:'ratio',q:'',category:'all',brand:'all',plate:'all',eligibility:'screened_non_eva',wmin:null,wmax:null,stackzone:'heel',smin:null,smax:null,page:'ranking'},selected=[];const $=id=>document.getElementById(id),f=(n,d=1)=>n==null?'—':Number(n).toFixed(d),fmt=(n,u,d=1)=>n==null?'Not reported':f(n,d)+' '+u,escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),safeurl=url=>/^https:\/\/(www\.)?(rtings\.com|runrepeat\.com)\//i.test(url||'')?url:null;const validRatio=(shoe,source,zone)=>{
 const l=shoe?.labs?.[source],er=l?.[zone],weight=l?.weight;
 if(!Number.isFinite(er)||!Number.isFinite(weight)||weight<=0)return null;
 const ratio=er/weight,stored=l?.[zone+'_ratio'];
 // Both observations must be paired within their original laboratory.
 if(stored==null||!Number.isFinite(stored)||Math.abs(stored-ratio)>0.0001)return null;
 return ratio;
};
const combinedRatio=(shoe,zone)=>{
 const rt=validRatio(shoe,'rtings',zone),rr=validRatio(shoe,'runrepeat',zone);
 return rt!=null&&rr!=null?(rt+rr)/2:null;
};
const labName=()=>state.lab==='combined'?'Combined':state.lab==='rtings'?'RTINGS':'RunRepeat';
const data=shoe=>state.lab==='combined'?{
 forefoot_ratio:combinedRatio(shoe,'forefoot'),heel_ratio:combinedRatio(shoe,'heel'),
 forefoot:null,heel:null,weight:null,evidence:'cross_lab_ratio_only'
}:shoe.labs[state.lab];
const val=shoe=>{
 const l=data(shoe);
 return state.sort==='ratio'?l[state.zone+'_ratio']:
        state.sort==='er'?l[state.zone]:
        state.sort==='weight'?l.weight:
        state.sort==='stack-high'||state.sort==='stack-low'?(shoe.stack?.[state.stackzone]??null):null;
};
$('n-shoes').textContent=stats.shoes;$('n-rt').textContent=stats.rtings_energy;$('n-rr').textContent=stats.runrepeat_energy;$('n-both').textContent=stats.both;
$('coverage-description').textContent=`Purpose labels: ${stats.category_counts?.supershoe??0} supershoes, ${stats.category_counts?.supertrainer??0} supertrainers (including performance-oriented training models) and ${stats.category_counts?.eva_other_daily_trainers??0} EVA/other daily trainers (including unverified eligibility). ${stats.shoes} shoe identities, ${stats.measurements} preserved individual measurements; ${stats.table_rows} additional RTINGS table rows (awaiting review revision IDs), ${stats.runrepeat_energy} RunRepeat shoes, ${stats.both} both labs. ${stats.foam_observations} sourced foam records. Eligibility: ${stats.eligibility?.screened_non_eva??0} preliminarily eligible, ${stats.eligibility?.pending_foam??0} foam unresolved, ${stats.eligibility?.excluded_eva??0} EVA-only, ${stats.eligibility?.below_30??0} below stack threshold.`;
$('snapshot-details').textContent=`Built from ${D.snapshot}. Generated ${new Date(D.built_utc).toLocaleString()}. The original immutable parent is not altered.`;
[...new Set(S.map(x=>x.brand))].sort((a,b)=>a.localeCompare(b)).forEach(b=>{let o=document.createElement('option');o.value=b;o.textContent=b;$('brand-select').appendChild(o)});
function available(x){let l=data(x);return state.sort==='name'||val(x)!=null}
function inRange(v,lo,hi){return lo==null&&hi==null||v!=null&&(lo==null||v>=lo)&&(hi==null||v<=hi)}
function filtered(){
 return S.filter(x=>{
   if(state.eligibility!=='all'&&x.eligibility!==state.eligibility)return false;
   if(state.category!=='all'&&x.category!==state.category)return false;
   if(state.brand!=='all'&&x.brand!==state.brand)return false;
   if(state.plate!=='all'&&!(state.plate==='carbon'?x.plate_as_recorded==='carbon':state.plate==='none'?x.plate_as_recorded==='none':x.plate_as_recorded!=='carbon'&&x.plate_as_recorded!=='none'))return false;
   if(state.q&&!(x.name+' '+x.brand).toLowerCase().includes(state.q.toLowerCase()))return false;
   // Combined requires both labs for the SELECTED zone, even when sorting by name or stack.
   if(state.lab==='combined'&&combinedRatio(x,state.zone)==null)return false;
   if(state.lab==='combined'){
      if(!inRange(x.labs.rtings.weight,state.wmin,state.wmax)||!inRange(x.labs.runrepeat.weight,state.wmin,state.wmax))return false;
   }else if(!inRange(data(x).weight,state.wmin,state.wmax))return false;
   return inRange(x.stack?.[state.stackzone],state.smin,state.smax);
 }).sort((a,b)=>{
    if(state.sort==='name')return a.name.localeCompare(b.name);
    const va=val(a),vb=val(b);
    if(va==null)return 1;if(vb==null)return -1;
    return state.sort==='weight'||state.sort==='stack-low'?va-vb:vb-va||a.name.localeCompare(b.name);
 });
}
function metricHtml(x){
 const l=data(x);
 if(state.sort==='ratio'||state.sort==='name'){
   const z=l[state.zone+'_ratio'];
   return `<div class="big">${f(z,3)}</div><div class="tinyunit">${state.lab==='combined'?'avg · % points / g':'% points / g'}</div>`;
 }
 if(state.sort==='er')return `<div class="big">${f(l[state.zone],1)}${l[state.zone]==null?'':'%'}</div><div class="tinyunit">${state.zone} ER</div>`;
 if(state.sort==='weight')return `<div class="big">${f(l.weight,1)}</div><div class="tinyunit">grams</div>`;
 if(state.sort==='stack-high'||state.sort==='stack-low')return `<div class="big">${f(x.stack?.[state.stackzone],1)}</div><div class="tinyunit">${state.stackzone} mm · sourced</div>`;
 return `<div class="big">${f(l[state.zone+'_ratio'],3)}</div><div class="tinyunit">% points / g</div>`;
}
function updateFilterSummary(){
 const lab=labName();
 const zone=state.zone==='forefoot'?'Forefoot':'Heel';
 const eligibility={screened_non_eva:'Eligible',all:'All shoes',pending_foam:'Pending foam',excluded_eva:'EVA only',below_30:'Below 30 mm',pending_stack:'Stack missing'}[state.eligibility]||state.eligibility;
 const purpose={all:'All purposes',supershoe:'Supershoes',supertrainer:'Supertrainers',eva_other_daily_trainers:'EVA/other daily trainers'}[state.category]||state.category;
 const active=[lab,zone,eligibility,purpose];
 if(state.brand!=='all')active.push(state.brand);
 if(state.plate!=='all')active.push(({carbon:'Carbon plate',none:'No plate',other:'Other plate'})[state.plate]||state.plate);
 if(state.wmin!=null||state.wmax!=null)active.push((state.wmin!=null?state.wmin:'Any')+'–'+(state.wmax!=null?state.wmax:'Any')+' g');
 if(state.smin!=null||state.smax!=null)active.push((state.stackzone==='heel'?'Heel':'Forefoot')+' stack '+(state.smin!=null?state.smin:'Any')+'–'+(state.smax!=null?state.smax:'Any')+' mm');
 if(state.q.trim())active.push('Search: '+state.q.trim());
 const summary=active.join(' · ');$('active-filter-summary').textContent=summary;$('active-filter-summary').title=summary;
 const n=Number(state.brand!=='all')+Number(state.plate!=='all')+Number(state.wmin!=null||state.wmax!=null)+Number(state.smin!=null||state.smax!=null);
 const badge=$('advanced-filter-count');badge.textContent=n+' active';badge.hidden=!n;
}
function render(){
 document.querySelectorAll('[data-lab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lab===state.lab)));
 document.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===state.category)));
 document.querySelectorAll('[data-zone]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.zone===state.zone)));
 // Combined does not create a cross-lab raw ER% or combined whole-shoe weight.
 for(const o of $('sort-select').options){if(o.value==='er'||o.value==='weight')o.disabled=state.lab==='combined'}
 if(state.lab==='combined'&&(state.sort==='er'||state.sort==='weight'))state.sort='ratio';
 $('sort-select').value=state.sort;
 $('combined-lab-note').hidden=state.lab!=='combined';
 $('weight-source-label').textContent=state.lab==='combined'?'Both laboratories · g':'Selected laboratory · g';
 $('eligibility-select').value=state.eligibility;
 $('selected-count').textContent=selected.length;
 $('rank-desc').textContent=labName()+' '+state.zone+(state.lab==='combined'?' · NOT_HARMONIZED':'')+(state.sort.startsWith('stack')?' · '+state.stackzone+' stack':'');
 updateFilterSummary();
 const arr=filtered(),count=arr.filter(available).length;
 $('result-count').textContent=`${count} ranked / ${arr.length} found`;
 let max=Math.max(0.00001,...arr.map(x=>val(x)||0).filter(n=>n>0));
 $('shoe-list').innerHTML=arr.length?arr.map((x,i)=>{
  const l=data(x),v=val(x),has=available(x),isSelected=selected.includes(x.slug),rt=x.labs.rtings,rr=x.labs.runrepeat;
  const detail=state.lab==='combined'?
   `${f(validRatio(x,'rtings',state.zone),3)} RTINGS · ${f(validRatio(x,'runrepeat',state.zone),3)} RunRepeat`:
   `${l[state.zone]==null?'ER missing':f(l[state.zone],1)+'% ER'} · ${l.weight==null?'weight missing':f(l.weight,1)+' g'}`;
  const note=state.lab==='combined'?'<span class="combined-tag">NOT_HARMONIZED</span>':
   x.comparability==='NOT_HARMONIZED'?'<span class="pill">2 labs</span>':'';
  return `<article class="shoe"><div class="shoe-top"><div class="rank">${has?String(i+1).padStart(2,'0'):'—'}</div><div style="flex:1;min-width:0"><div class="shoe-name">${escape(x.name)}</div><div class="subtitle">${escape(x.brand)} · ${escape(x.category_label||'Unclassified')} · ${detail} · ${x.stack?.heel==null?'stack missing':f(x.stack.heel,1)+' mm heel stack*'}</div></div><div class="shoe-val">${metricHtml(x)}</div></div><div class="shoe-bottom"><span class="pill">${escape(x.plate_as_recorded||'plate unknown')}</span>${note}${x.issues.length?`<span class="pill warn">${x.issues.length} flags</span>`:''}${(state.lab==='runrepeat'||state.lab==='combined')&&rr.evidence==='third_party_mirror'?'<span class="pill warn">RunRepeat mirror</span>':''}${(state.lab==='rtings'||state.lab==='combined')&&x.table?'<span class="pill warn">RTINGS table · provisional</span>':''}</div><div class="mini-bar"><span style="width:${has&&v!=null&&state.sort!=='name'?Math.min(100,Math.max(0,Math.round((state.sort==='weight'||state.sort==='stack-low'?max-v+10:v)/max*100))):0}%"></span></div><div class="shoe-actions"><button data-open="${escape(x.slug)}">View lab data</button><button class="primary ${isSelected?'selected':''}" data-add="${escape(x.slug)}" aria-label="${isSelected?'Remove':'Add'} ${escape(x.name)} ${isSelected?'from':'to'} compare">${isSelected?'✓ Selected':'+ Compare'}</button></div></article>`;
 }).join(''):`<div class="empty">No shoes with measurements matching these filters. Combined requires BOTH laboratory ratios in the selected zone.</div>`;
 renderCompare();
}
function renderCompare(){
 const list=selected.map(slug=>S.find(x=>x.slug===slug)).filter(Boolean);
 $('compare-list').innerHTML=list.length?list.map(x=>{
  const l=data(x),rt=x.labs.rtings,rr=x.labs.runrepeat,avg=combinedRatio(x,state.zone);
  if(state.lab==='combined'){
    const body=avg==null?'<div class="note warning">No combined result: both laboratories need same-zone ER and their own shoe weight.</div>':
      `<div class="comp-ratio">${f(avg,3)}</div><div class="smallmuted">Average ${state.zone} ER/g · % points/g · NOT_HARMONIZED</div>`;
    return `<article class="comparison-card"><h3>${escape(x.name)}</h3><div class="smallmuted">${escape(x.brand)} · Combined</div>${body}<div class="comp-metrics"><div class="comp-cell"><span>RTINGS ${state.zone} ER/g</span><strong>${f(validRatio(x,'rtings',state.zone),3)}</strong></div><div class="comp-cell"><span>RunRepeat ${state.zone} ER/g</span><strong>${f(validRatio(x,'runrepeat',state.zone),3)}</strong></div><div class="comp-cell"><span>RTINGS weight</span><strong>${fmt(rt.weight,'g',1)}</strong></div><div class="comp-cell"><span>RunRepeat weight</span><strong>${fmt(rr.weight,'g',1)}</strong></div><div class="comp-cell"><span>Heel stack*</span><strong>${fmt(x.stack?.heel,'mm',1)}</strong></div><div class="comp-cell"><span>Forefoot stack*</span><strong>${fmt(x.stack?.forefoot,'mm',1)}</strong></div></div><button data-remove="${escape(x.slug)}">Remove from comparison</button></article>`;
  }
  return `<article class="comparison-card"><h3>${escape(x.name)}</h3><div class="smallmuted">${escape(x.brand)} · ${labName()}</div><div class="comp-ratio">${f(l[state.zone+'_ratio'],3)}</div><div class="smallmuted">${state.zone} ER percentage points / g</div><div class="comp-metrics"><div class="comp-cell"><span>Forefoot ER</span><strong>${fmt(l.forefoot,'%',1)}</strong></div><div class="comp-cell"><span>Heel ER</span><strong>${fmt(l.heel,'%',1)}</strong></div><div class="comp-cell"><span>Lab weight</span><strong>${fmt(l.weight,'g',1)}</strong></div><div class="comp-cell"><span>Heel stack*</span><strong>${fmt(x.stack?.heel,'mm',1)}</strong></div><div class="comp-cell"><span>Forefoot stack*</span><strong>${fmt(x.stack?.forefoot,'mm',1)}</strong></div><div class="comp-cell"><span>Other lab ER</span><strong>${fmt(x.labs[state.lab==='rtings'?'runrepeat':'rtings'][state.zone],'%',1)}</strong></div></div><button data-remove="${escape(x.slug)}">Remove from comparison</button></article>`;
 }).join(''):`<div class="empty">No shoes selected yet. Go to Rankings and tap <b>+ Compare</b> on up to three shoes.</div>`;
}
function add(slug){let i=selected.indexOf(slug);if(i>=0)selected.splice(i,1);else if(selected.length<3)selected.push(slug);else {alert('Compare up to 3 shoes. Remove one first.');return}render()}
function switchpage(p){state.page=p;document.querySelectorAll('.page').forEach(el=>el.classList.toggle('active',el.id===p+'-page'));document.querySelectorAll('[data-page]').forEach(el=>el.classList.toggle('active',el.dataset.page===p));if(p==='compare')renderCompare();window.scrollTo({top:0,behavior:'instant'})}
function sourceHref(url,label){const safe=safeurl(url);return safe?`<a class="source-link" href="${escape(safe)}" target="_blank" rel="noopener noreferrer"><span>${escape(label)}</span><strong>Open original ↗</strong></a>`:''}
function combinedDetail(x){
 const ff=combinedRatio(x,'forefoot'),h=combinedRatio(x,'heel');
 if(ff==null&&h==null)return '<div class="note">No combined ratio available: both laboratories must report ER and shoe weight for the same zone.</div>';
 return `<div class="combined-summary"><strong>Combined ER/g · NOT_HARMONIZED</strong><div class="big">${f(ff,3)} <span style="font-size:12px">forefoot</span> · ${f(h,3)} <span style="font-size:12px">heel</span></div><dl class="data-list"><div><dt>RTINGS forefoot / heel</dt><dd>${f(validRatio(x,'rtings','forefoot'),3)} / ${f(validRatio(x,'rtings','heel'),3)}</dd></div><div><dt>RunRepeat forefoot / heel</dt><dd>${f(validRatio(x,'runrepeat','forefoot'),3)} / ${f(validRatio(x,'runrepeat','heel'),3)}</dd></div></dl><div class="smallmuted">Each ER% divided by the SAME lab's weight first; then average the two ratios equally. Not calibrated between laboratories.</div></div>`;
}
function showDetails(slug){let x=S.find(z=>z.slug===slug);if(!x)return;let r=x.labs.rtings,rr=x.labs.runrepeat;$('detail-title').textContent=x.name;$('detail-eyebrow').textContent=(x.category_label||x.category)+' · '+(x.plate_as_recorded||'plate unreported');let card=(l,label)=>`<div class="data-card"><div class="source">${label}</div><div class="big">${f(l.forefoot_ratio,3)}</div><div class="smallmuted">Forefoot % points/g</div><dl class="data-list"><div><dt>Forefoot</dt><dd>${fmt(l.forefoot,'%',2)}</dd></div><div><dt>Heel</dt><dd>${fmt(l.heel,'%',2)}</dd></div><div><dt>Weight</dt><dd>${fmt(l.weight,'g',1)}</dd></div><div><dt>Heel ER/g</dt><dd>${f(l.heel_ratio,3)}</dd></div></dl></div>`;
let delta=x.cross_lab_deltas?`<div class="note warning"><strong>NOT_HARMONIZED · Lab differences</strong><div>Forefoot: ${x.cross_lab_deltas.forefoot==null?'N/A':f(x.cross_lab_deltas.forefoot,2)+' pp'} · Heel: ${x.cross_lab_deltas.heel==null?'N/A':f(x.cross_lab_deltas.heel,2)+' pp'} · Weight: ${x.cross_lab_deltas.weight==null?'N/A':f(x.cross_lab_deltas.weight,1)+' g'}</div>These tests are not equivalent. Only an explicitly NOT_HARMONIZED average of the two independently calculated ER/g ratios is offered as a comparison.</div>`:'';
let tablefoam=x.table?`<div class="note warning"><strong>RTINGS table primary foam:</strong> ${escape(x.table.foam||'not reported')}. User-supplied snapshot; individual source attribution may still require verification.</div>`:'';let status=x.foams.length?x.foams.map(y=>`<p>${escape(y.component)}: ${escape(y.branded_foam_name||'Branded name not reported')} · chemistry: ${escape(y.chemistry_family||y.chemistry_status)}</p>`).join(''):'<div class="note">Individual-review foam details <strong>not collected</strong> in the audited database. Branded names and polymer chemistry remain unreported here, not inferred.</div>';
let quality=['rtings','runrepeat'].map(s=>{let l=x.labs[s];return l.forefoot==null&&l.heel==null?'':`<div class="provenance"><b>${s.toUpperCase()}</b> · ${escape(l.evidence||'evidence unreported')} · verified ${escape(l.verified_at?new Date(l.verified_at).toLocaleDateString():'not recorded')} · methodology ${escape(l.test_version||'not recorded')}${l.legacy_pairing?' · legacy observations (revision keys absent)':''}</div>`}).join('');
$('detail-content').innerHTML=`<div class="detail-section" style="border:0;padding-top:12px"><div class="data-grid">${card(r,'RTINGS')}${card(rr,'RUNREPEAT')}</div>${combinedDetail(x)}${delta}<div class="smallmuted" style="margin-top:12px">Individual ratios use their respective lab weights. The optional Combined figure is the arithmetic mean of those two ratios and is NOT_HARMONIZED.</div></div><div class="detail-section"><h3>Stack height*</h3><dl class="data-list"><div><dt>Heel stack</dt><dd>${fmt(x.stack?.heel,'mm',1)}</dd></div><div><dt>Forefoot stack</dt><dd>${fmt(x.stack?.forefoot,'mm',1)}</dd></div></dl><div class="smallmuted">Heel stack is RTINGS table when available, otherwise provisional RunRepeat mirror. Forefoot stack comes from RunRepeat mirror only. The table's misnamed forefoot column reports heel-to-toe drop (displayed in RTINGS import below).</div></div><div class="detail-section"><h3>Foam identification</h3>${tablefoam}${status}</div><div class="detail-section"><h3>RTINGS table import</h3>${x.table?`<div class="note warning"><strong>Table snapshot · review revision pending</strong><p>Lab method: ${escape(x.table.version||'unreported')}. Review publication date not provided. RTINGS heel: ${fmt(x.table.heel_stack,'mm',1)}; <strong>drop</strong>: ${fmt(x.table.heel_drop,'mm',1)} (the pasted column was mislabeled). Heel absorbed at 1900 N: ${fmt(x.table.heel_absorbed_j,'J',2)}; forefoot at 2050 N: ${fmt(x.table.forefoot_absorbed_j,'J',2)}. This snapshot is not a verified new revision of an individual review.</p></div>`:'<p>No RTINGS table row in this snapshot.</p>'}<div class="smallmuted">Eligibility: ${escape(x.eligibility||'unreported')} · ${escape(x.eligibility_evidence||'')}</div></div><div class="detail-section"><h3>Sources & provenance</h3>${sourceHref(r.source_url||x.rtings_url,x.table?'RTINGS source / comparison-table snapshot':'RTINGS individual review')}${sourceHref(rr.source_url||x.runrepeat_url,'RunRepeat original review')}${quality}</div><div class="detail-section"><h3>Quality flags</h3>${x.issues.length?x.issues.map(i=>`<div class="note warning"><strong>${escape(i.issue_code)}</strong> · ${escape(i.status)}<p>${escape(i.detail)}</p></div>`).join(''):'<div class="note">No shoe-specific audit flags recorded. This does not mean every source measurement has been independently reverified.</div>'}</div><div class="detail-section"><h3>Identity & classification</h3><dl class="data-list"><div><dt>Purpose label</dt><dd>${escape(x.category_label||x.category)} (provisional)</dd></div><div><dt>Purpose evidence</dt><dd>${escape(x.category_evidence?.type||"not recorded")}</dd></div><div><dt>Rationale</dt><dd>${escape(x.category_evidence?.note||"not recorded")}</dd></div><div><dt>Purpose source</dt><dd>${x.category_evidence?.source_url?sourceHref(x.category_evidence.source_url,"Open cited review or source"):"Not recorded"}</dd></div><div><dt>Eligibility status</dt><dd>${escape(x.eligibility||"not recorded")}</dd></div><div><dt>Plate</dt><dd>${escape(x.plate_as_recorded||'not recorded')}</dd></div><div><dt>Identity audit</dt><dd>${escape(x.identity?.identity_status||'unreported')}</dd></div><div><dt>Release date value</dt><dd>${escape(x.release_date_source_value||'not recorded')}</dd></div></dl></div>`;
$('dialog-overlay').classList.add('open');document.body.style.overflow='hidden';$('close-dialog').focus()}
function close(){ $('dialog-overlay').classList.remove('open');document.body.style.overflow=''}
document.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>switchpage(b.dataset.page)));document.querySelectorAll('[data-lab]').forEach(b=>b.addEventListener('click',()=>{state.lab=b.dataset.lab;if(state.lab==='combined'&&(state.sort==='er'||state.sort==='weight'))state.sort='ratio';render()}));document.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',()=>{state.category=b.dataset.category;if(state.category!=='all'){state.eligibility='all';$('eligibility-select').value='all'}render()}));document.querySelectorAll('[data-zone]').forEach(b=>b.addEventListener('click',()=>{state.zone=b.dataset.zone;render()}));$('sort-select').addEventListener('change',e=>{state.sort=e.target.value;render()});let searchTimer=null;$('search').addEventListener('input',e=>{state.q=e.target.value;clearTimeout(searchTimer);searchTimer=setTimeout(render,150)});$('brand-select').addEventListener('change',e=>{state.brand=e.target.value;render()});$('plate-select').addEventListener('change',e=>{state.plate=e.target.value;render()});$('eligibility-select').addEventListener('change',e=>{state.eligibility=e.target.value;render()});
for(let [id,key] of [['weight-min','wmin'],['weight-max','wmax'],['stack-min','smin'],['stack-max','smax']])$(id).addEventListener('input',e=>{let raw=e.target.value.trim(),n=Number(raw);state[key]=raw!==''&&Number.isFinite(n)&&n>=0?n:null;render()});
$('stack-zone').addEventListener('change',e=>{state.stackzone=e.target.value;render()});$('reset').addEventListener('click',()=>{clearTimeout(searchTimer);state.q='';state.lab='rtings';state.zone='forefoot';state.sort='ratio';state.category='all';state.brand='all';state.plate='all';state.eligibility='screened_non_eva';state.wmin=null;state.wmax=null;state.smin=null;state.smax=null;state.stackzone='heel';$('search').value='';$('sort-select').value='ratio';$('eligibility-select').value='screened_non_eva';$('brand-select').value='all';$('plate-select').value='all';$('stack-zone').value='heel';['weight-min','weight-max','stack-min','stack-max'].forEach(id=>$(id).value='');render()});$('read-method').addEventListener('click',e=>{e.preventDefault();switchpage('about')});$('shoe-list').addEventListener('click',e=>{let p=e.target.closest('[data-add]'),d=e.target.closest('[data-open]');if(p)add(p.dataset.add);else if(d)showDetails(d.dataset.open)});$('compare-list').addEventListener('click',e=>{let b=e.target.closest('[data-remove]');if(b)add(b.dataset.remove)});$('close-dialog').addEventListener('click',close);$('dialog-overlay').addEventListener('click',e=>{if(e.target===$('dialog-overlay'))close()});document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});render();
})();