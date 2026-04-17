(function(){
  document.addEventListener('DOMContentLoaded', function(){
    // Remove NMLS
    document.querySelectorAll('*').forEach(function(el){
      if(el.children.length === 0 && el.textContent.includes('NMLS')){
        const tag = el.tagName.toLowerCase();
        if(['span','div','small'].includes(tag)) el.remove();
        else el.textContent = el.textContent.replace(/NMLS\s*#?\w\d*(\(Placeholder\))?/,'').trim();
      }
    });
    // Fix dead footer links
    document.querySelectorAll('a').forEach(function(a){
      const text = a.textContent.trim().toLowerCase();
      if(text === 'privacy policy' && a.getAttribute('href') === '#') a.setAttribute('href','/privacy.html');
      if(text === 'terms of service' && a.getAttribute('href') === '#') a.setAttribute('href','/terms.html');
      if(text === 'equal housing lender' && a.getAttribute('href') === '#'){
        a.setAttribute('href','https://www.hud.gov/program_offices/fair_housing_equal_opp');
        a.setAttribute('target','_blank');
      }
    });
    // Replace fake phone with email
    document.querySelectorAll('*').forEach(function(el){
      if(el.children.length === 0 && el.textContent.includes('(888) 555-0199')){
        el.textContent = el.textContent.replace('(888) 555-0199','dandydonunhinged@gmail.com');
      }
    });
    document.querySelectorAll('a[href*="555-0199"]').forEach(function(a){
      a.setAttribute('href','mailto:dandydonunhinged@gmail.com');
      a.textContent = 'dandydonunhinged@gmail.com';
    });
  });
})();
