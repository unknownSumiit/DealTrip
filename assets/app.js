
(() => {
  const toggle = document.querySelector('.nav-toggle');
  if (toggle) toggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

  const homeInput = document.querySelector('[data-home-search]');
  const homeButton = document.getElementById('home-search-button');
  if (homeInput && homeButton) {
    const syncHome = () => {
      const q = homeInput.value.trim();
      homeButton.href = '/deals/' + (q ? '?q=' + encodeURIComponent(q) : '');
    };
    homeInput.addEventListener('input', syncHome);
    homeInput.addEventListener('keydown', e => { if (e.key === 'Enter') { syncHome(); location.href = homeButton.href; } });
  }
  const queryValue = new URLSearchParams(location.search).get('q');
  if (queryValue) {
    const dealSearchInput = document.querySelector('[data-deal-search]');
    if (dealSearchInput) dealSearchInput.value = queryValue;
  }

  const containers = document.querySelectorAll('[data-deals]');
  if (!containers.length) return;
  fetch('/assets/deals.json').then(r => r.json()).then(deals => {
    containers.forEach(container => {
      const presetCategory = container.dataset.category || '';
      const minAgePreset = Number(container.dataset.minAge || 0);
      const search = document.querySelector('[data-deal-search]');
      const age = document.querySelector('[data-age-filter]');
      const category = document.querySelector('[data-category-filter]');
      const count = document.querySelector('[data-result-count]');
      const render = () => {
        const q = (search?.value || '').trim().toLowerCase();
        const ageValue = Number(age?.value || minAgePreset || 0);
        const catValue = category?.value || presetCategory;
        const filtered = deals.filter(d => {
          const hay = `${d.merchant} ${d.title} ${d.category} ${d.summary}`.toLowerCase();
          const qok = !q || hay.includes(q);
          const aok = !ageValue || d.age >= ageValue;
          const cok = !catValue || d.category === catValue;
          return qok && aok && cok;
        });
        container.innerHTML = filtered.length ? filtered.map(card).join('') : `<div class="empty"><strong>No matching deals.</strong><br>Try a different keyword or filter.</div>`;
        if (count) count.textContent = `${filtered.length} verified starter deal${filtered.length === 1 ? '' : 's'} shown`;
      };
      [search,age,category].forEach(el => el?.addEventListener(el.tagName === 'INPUT' ? 'input':'change', render));
      render();
    });
  }).catch(() => {
    containers.forEach(c => c.innerHTML = '<div class="empty">Deals could not be loaded. Please refresh the page.</div>');
  });
  function card(d){
    const initial = d.merchant.slice(0,1).toUpperCase();
    return `<article class="deal-card">
      <div class="deal-top"><div class="merchant-logo" aria-hidden="true">${esc(initial)}</div><div class="deal-main">
      <div class="deal-meta"><span class="tag tag-age">${esc(d.badge)}</span><span class="tag">${esc(d.category)}</span><span class="tag">${esc(d.type)}</span></div>
      <h3>${esc(d.title)}</h3><p><strong>${esc(d.merchant)}</strong> · ${esc(d.summary)}</p></div></div>
      <div class="deal-details"><div><strong>Eligibility</strong><span>Age ${d.age}+</span></div><div><strong>Where</strong><span>${esc(d.availability)}</span></div><div><strong>Important</strong><span>${esc(d.terms)}</span></div></div>
      <div class="deal-actions"><span class="verified">Checked ${esc(d.verified)}</span><a class="btn btn-primary" href="${escAttr(d.url)}" target="_blank" rel="noopener">View official offer <span aria-hidden="true">↗</span></a></div>
    </article>`;
  }
  function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function escAttr(s){return esc(s)}
})();
