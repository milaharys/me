// Tiny stable entry: reads the build version, then loads the stylesheet and the app with that version in the URL,
// so every publish busts browser and CDN caches without touching the Tilda block.
// Every step has a timeout and retries: on a slow or flaky link (VPN, mobile) a stalled request must not leave a blank page.
(async () => {
  const base = (window.MH_BASE || new URL('../../', import.meta.url).href).replace(/\/?$/, '/');
  const timed = (url, ms, opts = {}) => { const c = new AbortController(), t = setTimeout(() => c.abort(), ms); return fetch(url, { ...opts, signal: c.signal }).finally(() => clearTimeout(t)); };
  // the version stamped into the page's own stylesheet link is the fallback when version.txt does not answer in time
  const own = document.querySelector('link[rel="stylesheet"][href*="assets/style.css?v="]');
  let v = own ? new URL(own.href).searchParams.get('v') : '';
  // our own page is served no-cache, so its stamped version is current; only an embed elsewhere asks version.txt (one round trip saved)
  if (!v) try { const r = await timed(base + 'data/version.txt', 4000, { cache: 'no-store' }); if (r.ok) v = (await r.text()).trim(); } catch {}
  v ||= Date.now().toString(36);
  window.MH_BASE = base; window.MH_V = v;
  if (!document.querySelector('link[data-mh-css]') && !own) {   // embedded without our page: bring the stylesheet along
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = base + 'assets/style.css?v=' + v; l.dataset.mhCss = '1';
    const ready = new Promise(res => { l.onload = l.onerror = res; setTimeout(res, 1500); });
    document.head.appendChild(l); await ready;
  }
  // a failed module import is remembered per URL, so each retry asks with its own URL
  for (let n = 0; n < 3; n++) {
    try { await import(base + 'assets/js/main.js?v=' + v + (n ? '&r=' + n : '')); return; }
    catch (e) { console.error(e); await new Promise(r => setTimeout(r, 800 * (n + 1))); }
  }
  const m = document.createElement('p');
  m.className = 'mh-fail';
  m.innerHTML = 'the connection dropped while loading. <a href="">reload</a>';
  document.body.appendChild(m);
})();
