(() => {
  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const active = (names) => names.includes(current) ? ' aria-current="page" class="is-active"' : '';

  const header = `
    <header class="site-header" data-header>
      <a class="brand-lockup" href="index.html" aria-label="LUNGTA home">
        <img src="assets/brand/lungta-wordmark.png" alt="LUNGTA">
      </a>
      <nav class="desktop-nav" aria-label="Primary navigation">
        <a href="drop.html"${active(['drop.html','product.html'])}>DROP 01</a>
        <a href="movement.html"${active(['movement.html'])}>MOVEMENT</a>
        <a href="material.html"${active(['material.html'])}>MATERIAL</a>
        <a href="lungta.html"${active(['lungta.html'])}>LUNGTA</a>
      </nav>
      <div class="header-actions">
        <button class="header-bag" type="button" data-bag-open aria-label="Open bag">BAG <span data-bag-count>0</span></button>
        <button class="menu-toggle" type="button" data-menu-open aria-label="Open menu"><span></span><span></span></button>
      </div>
    </header>
    <div class="mobile-menu" data-menu aria-hidden="true">
      <div class="mobile-menu-top">
        <img src="assets/brand/lungta-wordmark.png" alt="LUNGTA">
        <button type="button" data-menu-close aria-label="Close menu">CLOSE</button>
      </div>
      <nav aria-label="Mobile navigation">
        <a href="drop.html"><span>01</span>DROP 01</a>
        <a href="movement.html"><span>02</span>MOVEMENT</a>
        <a href="material.html"><span>03</span>MATERIAL</a>
        <a href="lungta.html"><span>04</span>LUNGTA</a>
      </nav>
      <div class="mobile-menu-foot"><span>MADE OF MOMENTUM.</span><span>INDIA / INR</span></div>
    </div>`;

  const bag = `
    <div class="bag-backdrop" data-bag-backdrop></div>
    <aside class="bag-drawer" data-bag aria-hidden="true">
      <div class="bag-head"><span>BAG</span><button type="button" data-bag-close>CLOSE</button></div>
      <div class="bag-items" data-bag-items></div>
      <div class="bag-foot">
        <div><span>SUBTOTAL</span><strong data-bag-total>₹0</strong></div>
        <button class="button button-light button-full" type="button" data-checkout>CHECKOUT / API HOOK</button>
        <small data-checkout-note>Payment provider connects here when live credentials are supplied.</small>
      </div>
    </aside>`;

  const footer = `
    <footer class="site-footer">
      <div class="footer-callout">
        <p>NOTHING STILL.</p>
        <a href="drop.html">ENTER DROP 01 <span>↗</span></a>
      </div>
      <div class="footer-main">
        <div class="footer-name">LUNGTA</div>
        <div class="footer-columns">
          <div><span>SHOP</span><a href="drop.html">Drop 01</a><a href="product.html?p=form01">Leggings</a><a href="product.html?p=frame01">Bras</a><a href="product.html?p=line01">Outerwear</a></div>
          <div><span>WORLD</span><a href="movement.html">Movement</a><a href="material.html">Material</a><a href="lungta.html">Our system</a></div>
          <div><span>SYSTEM</span><a href="lungta.html">Identity</a><a href="material.html">Material</a><a href="movement.html">Move index</a><a href="drop.html">Drop 01</a></div>
          <div><span>STATUS</span><em>INDIA / INR</em><em>DROP 01</em><em>2026</em></div>
        </div>
      </div>
      <div class="footer-bottom"><span>© 2026 LUNGTA</span><span>INDIA / INR</span><span>MADE OF MOMENTUM.</span></div>
    </footer>`;

  const headerMount = document.querySelector('[data-site-header]');
  const footerMount = document.querySelector('[data-site-footer]');
  if (headerMount) headerMount.innerHTML = header + bag;
  if (footerMount) footerMount.innerHTML = footer;
})();
