const CCC_FORM_ACCESS_KEY = 'YOUR_ACCESS_KEY_HERE'; // replace after step below
(function(){
  'use strict';
  function getAllFormData(){
    const data = {};
    document.querySelectorAll('input, select, textarea').forEach(el => {
      if(!el.name && !el.id) return;
      const key = el.name || el.id;
      if(el.type === 'checkbox'){ data[key] = el.checked; }
      else if(el.type === 'radio'){ if(el.checked) data[key] = el.value; }
      else { if(el.value) data[key] = el.value; }
    });
    return data;
  }
  function formatForEmail(data){
    return Object.entries(data)
      .filter(([k]) => !['access_key','subject','from_name'].includes(k))
      .map(([k,v]) => `${k.replace(/_/g,' ').toUpperCase()}: ${v}`)
      .join('\n');
  }
  async function submitToWeb3Forms(fd){
    const res = await fetch('https://api.web3forms.com/submit',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        access_key: CCC_FORM_ACCESS_KEY,
        subject: `New CCC Lead — ${fd.loan_type||'Unknown'} | ${fd.full_name||'Unknown'}`,
        from_name: 'CCC Lead Capture',
        message: formatForEmail(fd),
        ...fd
      })
    });
    return (await res.json()).success;
  }
  function showSuccess(){
    (document.querySelector('form')||document.body).innerHTML = '<div style="text-align:center;padding:80px 40px;"><div style="font-size:3rem;">\u2705</div><h2>Deal Received!</h2><p>You\'ll hear from us within 15 min (M\u2013F 8am\u20136pm ET).</p><a href="/index.html" style="display:inline-block;margin-top:20px;padding:12px 28px;background:#1a1a2e;color:#fff;border-radius:6px;text-decoration:none;">Back to Home</a></div>';
  }
  document.addEventListener('click', async function(e){
    const btn = e.target.closest('button');
    if(!btn) return;
    const txt = (btn.textContent||'').toLowerCase();
    if(!txt.includes('match me') && !txt.includes('analyze') && !txt.includes('get funded') && btn.type !== 'submit') return;
    const steps = document.querySelectorAll('[data-step].active, .form-step.active, .step.active');
    const allSteps = document.querySelectorAll('[data-step], .form-step, .step');
    if(allSteps.length > 0 && steps.length > 0){
      if(Array.from(allSteps).indexOf(steps[0]) !== allSteps.length - 1) return;
    }
    const name = document.querySelector('[name="full_name"],[name="fullName"],input[placeholder*="name" i]');
    const email = document.querySelector('[name="email"],[id="email"],input[type="email"]');
    if(!name||!name.value||!email||!email.value) return;
    e.preventDefault();
    e.stopPropagation();
    btn.disabled = true;
    btn.textContent = 'Sending...';
    try {
      const fd = getAllFormData();
      fd.page_url = location.href;
      fd.submitted_at = new Date().toISOString();
      if(CCC_FORM_ACCESS_KEY === 'YOUR_ACCESS_KEY_HERE'){
        location.href = 'mailto:dandydonunhinged@gmail.com?subject=' + encodeURIComponent('New Deal Lead') + '&body=' + encodeURIComponent(formatForEmail(fd));
        return;
      }
      if(await submitToWeb3Forms(fd)){ showSuccess(); }
      else { btn.disabled=false; btn.textContent='Match Me With a Lender \u2192'; }
    } catch(err){
      btn.disabled=false;
      btn.textContent='Match Me With a Lender \u2192';
    }
  }, true);
})();
