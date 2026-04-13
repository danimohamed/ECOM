import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeatured } from '../store/productSlice';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const dispatch = useDispatch();
  const { featured } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchFeatured());
  }, [dispatch]);

  return (
    <>
      {/* HERO — full-bleed product image (Taliri style, no text) */}
      <section className="hero">
        <div className="hero-image-wrap">
          {/* Replace src with your own hero images */}
          <img
            className="desktop-only"
            src="https://taliri.fr/cdn/shop/files/web.png?v=1765163259"
            alt="OPPA Collection"
          />
          <img
            className="mobile-only"
            src="https://taliri.fr/cdn/shop/files/TEL.png?v=1765163259"
            alt="OPPA Collection"
          />
        </div>
      </section>

      {/* FEATURED PRODUCTS — 3 column grid */}
      <section className="featured">
        <div className="container">
          <div className="product-grid">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter">
        <div className="container">
          <h2>Preparing new stuffs ...</h2>
          <p>Be among the first to hear about new drops, restocks, and events.</p>
          <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Thanks for subscribing!'); }}>
            <input type="email" placeholder="Rejoins la famille OPPA" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="trust-bar">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">
              <div className="trust-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
              </div>
              <h4>Customer Service.</h4>
              <p>We provide customer support from Monday to Thursday, from 8:00 a.m. to 6:00 p.m. (Paris time).</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 10h20" /></svg>
              </div>
              <h4>Secure Payment.</h4>
              <p>We use the most secure technologies in the industry.</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              </div>
              <h4>Quality Guaranteed.</h4>
              <p>We offer a money-back guarantee if our products are defective.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
