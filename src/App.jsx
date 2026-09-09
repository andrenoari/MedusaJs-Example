import { useMemo, useState } from 'react'
import './App.css'

const products = [
  { id: 'p-1', name: 'Linen overshirt', category: 'Apparel', price: 98, oldPrice: 120, badge: 'Best seller', color: 'Clay', sizes: ['XS', 'S', 'M', 'L'], image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85' },
  { id: 'p-2', name: 'Everyday tote', category: 'Accessories', price: 64, badge: 'New', color: 'Natural', sizes: ['One size'], image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=85' },
  { id: 'p-3', name: 'Ribbed knit set', category: 'Apparel', price: 142, color: 'Oat', sizes: ['S', 'M', 'L'], image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85' },
  { id: 'p-4', name: 'Studio runners', category: 'Footwear', price: 118, oldPrice: 145, badge: '20% off', color: 'Mist', sizes: ['6', '7', '8', '9', '10'], image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85' },
  { id: 'p-5', name: 'Soft leather wallet', category: 'Accessories', price: 52, color: 'Espresso', sizes: ['One size'], image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85' },
  { id: 'p-6', name: 'Relaxed cotton tee', category: 'Apparel', price: 48, color: 'Cloud', sizes: ['XS', 'S', 'M', 'L', 'XL'], image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=85' },
]

const categories = ['All products', 'Apparel', 'Accessories', 'Footwear']

function App() {
  const [activeCategory, setActiveCategory] = useState('All products')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('Featured')
  const [cart, setCart] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [promo, setPromo] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [view, setView] = useState('shop')

  const visibleProducts = useMemo(() => {
    const result = products.filter((product) => {
      const categoryMatch = activeCategory === 'All products' || product.category === activeCategory
      const searchMatch = product.name.toLowerCase().includes(search.toLowerCase())
      return categoryMatch && searchMatch
    })
    if (sort === 'Price: low to high') return [...result].sort((a, b) => a.price - b.price)
    if (sort === 'Price: high to low') return [...result].sort((a, b) => b.price - a.price)
    return result
  }, [activeCategory, search, sort])

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = subtotal >= 150 || subtotal === 0 ? 0 : 8

  function addToCart(product, size = product.sizes[0]) {
    setCart((items) => {
      const existing = items.find((item) => item.id === product.id && item.size === size)
      if (existing) return items.map((item) => item === existing ? { ...item, quantity: item.quantity + 1 } : item)
      return [...items, { ...product, size, quantity: 1 }]
    })
    setSelectedProduct(null)
    setCartOpen(true)
  }

  function updateQuantity(id, size, change) {
    setCart((items) => items.map((item) => item.id === id && item.size === size ? { ...item, quantity: item.quantity + change } : item).filter((item) => item.quantity > 0))
  }

  return (
    <div className="storefront">
      <div className="announcement">Free shipping on orders over $150 <span>•</span> Carbon-neutral delivery, always</div>
      <header className="site-header">
        <button className="wordmark" onClick={() => { setView('shop'); setActiveCategory('All products') }}>Morrow<span>®</span></button>
        <nav className="main-nav" aria-label="Main navigation"><button className={view === 'shop' ? 'active' : ''} onClick={() => setView('shop')}>Shop</button><button className={view === 'orders' ? 'active' : ''} onClick={() => setView('orders')}>Orders</button><button className={view === 'about' ? 'active' : ''} onClick={() => setView('about')}>Our story</button></nav>
        <div className="header-actions"><button className="icon-button" aria-label="Search" onClick={() => document.querySelector('.search-input')?.focus()}>⌕</button><button className="bag-button" onClick={() => setCartOpen(true)}>Bag <span>{cartCount}</span></button></div>
      </header>

      {view === 'shop' && <>
        <main><section className="hero-section"><div className="hero-copy"><p className="eyebrow">The everyday edit / 04</p><h1>Objects for<br /><em>living well.</em></h1><p className="hero-description">Thoughtful essentials for slower mornings, open windows, and everything in between.</p><button className="text-link" onClick={() => document.querySelector('.catalog')?.scrollIntoView({ behavior: 'smooth' })}>Explore the collection <span>↘</span></button></div><div className="hero-image"><img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=90" alt="A person wearing a relaxed neutral outfit" /><div className="image-note">New season /<br />quiet forms</div></div></section>
          <section className="catalog" id="catalog"><div className="catalog-heading"><div><p className="eyebrow">Curated for now</p><h2>All the good things</h2></div><p className="catalog-count">{visibleProducts.length} products</p></div><div className="catalog-controls"><div className="category-tabs">{categories.map((category) => <button key={category} className={activeCategory === category ? 'selected' : ''} onClick={() => setActiveCategory(category)}>{category}</button>)}</div><div className="control-right"><label className="search-box"><span>⌕</span><input className="search-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" /></label><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products"><option>Featured</option><option>Price: low to high</option><option>Price: high to low</option></select></div></div><div className="product-grid">{visibleProducts.map((product) => <article className="product-card" key={product.id}><button className="product-image" onClick={() => { setSelectedProduct(product); setSelectedSize(product.sizes[0]) }}><img src={product.image} alt={product.name} />{product.badge && <span className="product-badge">{product.badge}</span>}<span className="quick-add">Quick add +</span></button><div className="product-info"><div><h3>{product.name}</h3><p>{product.color}</p></div><div className="price"><strong>${product.price}</strong>{product.oldPrice && <del>${product.oldPrice}</del>}</div></div></article>)}</div></section>
          <section className="feature-band"><div className="feature-art"><img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85" alt="Model in a timeless layered outfit" /></div><div className="feature-copy"><p className="eyebrow">Made to keep</p><h2>Less, but<br /><em>better.</em></h2><p>We make pieces that earn their place. Natural materials, considered details, and a point of view that gets better with time.</p><button className="outline-button" onClick={() => setView('about')}>Read our story <span>↗</span></button></div></section></main>
        <footer><div className="footer-brand">Morrow<span>®</span><p>Good objects for ordinary days.</p></div><div className="footer-links"><div><small>Explore</small><button onClick={() => setActiveCategory('All products')}>Shop all</button><button onClick={() => setActiveCategory('Apparel')}>Apparel</button><button onClick={() => setActiveCategory('Accessories')}>Accessories</button></div><div><small>Help</small><button>Shipping & returns</button><button>Contact us</button><button>Instagram ↗</button></div></div><p className="copyright">© 2024 Morrow. Demo storefront powered by Medusa.</p></footer>
      </>}
      {view === 'orders' && <section className="page-state"><p className="eyebrow">Your account</p><h1>Order history</h1><p>Sign in to see your orders, saved details, and delivery updates.</p><button className="dark-button" onClick={() => setView('shop')}>Continue shopping</button></section>}
      {view === 'about' && <section className="page-state about-state"><p className="eyebrow">Our point of view</p><h1>Good design<br /><em>stays useful.</em></h1><p>We believe the things around us should feel considered, not complicated. Morrow is a small collection of clothes and objects designed for a life well lived.</p><button className="dark-button" onClick={() => setView('shop')}>Shop the collection</button></section>}

      {selectedProduct && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setSelectedProduct(null)}><div className="product-modal"><button className="close-button" onClick={() => setSelectedProduct(null)}>×</button><img src={selectedProduct.image} alt={selectedProduct.name} /><div className="modal-details"><p className="eyebrow">{selectedProduct.category}</p><h2>{selectedProduct.name}</h2><div className="modal-price">${selectedProduct.price} {selectedProduct.oldPrice && <del>${selectedProduct.oldPrice}</del>}</div><p className="modal-copy">A considered essential in {selectedProduct.color.toLowerCase()}. Made for repeat wear and easy days.</p><div className="size-label"><span>Select size</span><span>{selectedProduct.sizes.length === 1 ? 'One size' : 'Required'}</span></div><div className="sizes">{selectedProduct.sizes.map((size) => <button className={selectedSize === size ? 'chosen' : ''} key={size} onClick={() => setSelectedSize(size)}>{size}</button>)}</div><button className="dark-button full" onClick={() => addToCart(selectedProduct, selectedSize)}>Add to bag <span>↗</span></button></div></div></div>}
      {cartOpen && <div className="drawer-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setCartOpen(false)}><aside className="cart-drawer"><div className="drawer-header"><div><p className="eyebrow">Your selection</p><h2>Bag <span>({cartCount})</span></h2></div><button className="close-button" onClick={() => setCartOpen(false)}>×</button></div>{cart.length === 0 ? <div className="empty-cart"><p>Your bag is waiting.</p><button className="text-link" onClick={() => setCartOpen(false)}>Keep browsing <span>↘</span></button></div> : <><div className="cart-items">{cart.map((item) => <div className="cart-item" key={`${item.id}-${item.size}`}><img src={item.image} alt="" /><div className="cart-item-details"><h3>{item.name}</h3><p>{item.size} / {item.color}</p><div className="cart-item-bottom"><div className="quantity"><button onClick={() => updateQuantity(item.id, item.size, -1)}>−</button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, item.size, 1)}>+</button></div><strong>${item.price * item.quantity}</strong></div></div></div>)}</div><div className="cart-footer"><label className="promo-field"><input placeholder="Promo code" value={promo} onChange={(event) => setPromo(event.target.value)} /><button onClick={() => setPromoApplied(promo.trim().length > 0)}>{promoApplied ? 'Added' : 'Apply'}</button></label><div className="summary-line"><span>Subtotal</span><strong>${subtotal}</strong></div><div className="summary-line"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping}`}</span></div><div className="summary-line total"><span>Total</span><strong>${subtotal + shipping}</strong></div><button className="dark-button full" onClick={() => { setCartOpen(false); setCheckoutOpen(true) }}>Checkout <span>↗</span></button><p className="secure-note">Secure checkout · taxes calculated at checkout</p></div></>}</aside></div>}
      {checkoutOpen && <div className="modal-backdrop"><div className="checkout-modal"><button className="close-button" onClick={() => setCheckoutOpen(false)}>×</button><div className="success-mark">✓</div><p className="eyebrow">Demo checkout</p><h2>You're all set.</h2><p>This is where Medusa's payment and fulfillment flows connect. Your demo order is ready to be submitted.</p><button className="dark-button full" onClick={() => { setCheckoutOpen(false); setCart([]); setView('orders') }}>Place demo order <span>↗</span></button></div></div>}
    </div>
  )
}

export default App