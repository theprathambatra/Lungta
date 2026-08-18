(() => {
  const products=window.LUNGTA_PRODUCTS||{};
  const params=new URLSearchParams(location.search);
  const slug=params.get('p')||'form01';
  const p=products[slug]||products.form01;
  const $=(s,r=document)=>r.querySelector(s);
  const set=(s,v)=>{const e=$(s);if(e)e.textContent=v};
  const img=(s,src,alt)=>{const e=$(s);if(e){e.src=src;e.alt=alt||''}};

  document.title=`${p.name} | LUNGTA`;
  set('[data-product-index]',`${p.index} / DROP 01`);
  set('[data-product-name]',p.name);
  set('[data-product-price]',p.priceText);
  set('[data-product-line]',p.line);
  set('[data-product-description]',p.description);
  set('[data-product-material]',p.material);
  set('[data-product-fit]',p.fit);
  set('[data-product-finish]',p.finish);
  img('[data-product-image]',p.image,p.name);
  img('[data-product-alt-image]',p.altImage,p.name);
  $('[data-product-notes]').innerHTML=p.notes.map((n,i)=>`<li><span>0${i+1}</span>${n}</li>`).join('');
  const sizes=$('[data-product-sizes]');
  sizes.innerHTML=p.sizes.map((s,i)=>`<button type="button" data-size="${s}" class="${i===1?'is-active':''}">${s}</button>`).join('');
  let selected=p.sizes[1]||p.sizes[0];
  sizes.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
    sizes.querySelectorAll('button').forEach(x=>x.classList.toggle('is-active',x===b));selected=b.dataset.size;
  }));
  $('[data-product-add]')?.addEventListener('click',()=>document.dispatchEvent(new CustomEvent('lungta:add-to-bag',{detail:{slug:p.slug,size:selected}})));

  const other=Object.values(products).filter(x=>x.slug!==p.slug).slice(0,3);
  const related=$('[data-related]');
  if(related)related.innerHTML=other.map(x=>`<a class="related-card" href="product.html?p=${x.slug}"><div><img src="${x.imageSmall||x.image}" alt="${x.name}"></div><span>${x.index} / DROP 01</span><h3>${x.name}</h3><p>${x.priceText}</p></a>`).join('');
})();
