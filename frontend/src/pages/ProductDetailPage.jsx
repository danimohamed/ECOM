import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct, clearCurrent, fetchProducts } from '../store/productSlice';
import { addToCart, openCart } from '../store/cartSlice';
import { formatPrice, getStockStatus } from '../utils/helpers';
import ProductCard from '../components/ProductCard';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: product, loading, items: relatedProducts } = useSelector((state) => state.products);
  const [selectedSize, setSelectedSize] = useState('');
  const [activeAccordion, setActiveAccordion] = useState(null);

  useEffect(() => {
    dispatch(fetchProduct(id));
    return () => { dispatch(clearCurrent()); };
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      dispatch(fetchProducts({ category: product.category, limit: 4 }));
    }
  }, [dispatch, product]);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    dispatch(addToCart({ product, size: selectedSize }));
    dispatch(openCart());
  };

  if (loading || !product) return <div className="spinner" />;

  const stockStatus = getStockStatus(product.sizes);
  const selectedSizeData = product.sizes?.find((s) => s.size === selectedSize);
  const canAdd = selectedSize && selectedSizeData && selectedSizeData.stock > 0;

  return (
    <div className="product-detail">
      <div className="container">
        <div className="product-detail-grid">
          {/* Gallery */}
          <div className="product-gallery" style={{
            background: product.images?.[0]?.url
              ? `url(${product.images[0].url}) center/cover`
              : product.gradient || 'linear-gradient(135deg,#1a1a1a,#3d3d3d)',
          }} />

          {/* Info */}
          <div className="product-info">
            <h1>{product.name}</h1>
            <div className="price">
              {product.salePrice ? (
                <>
                  <span className="sale-price">{formatPrice(product.salePrice)}</span>
                  <span className="old-price">{formatPrice(product.price)}</span>
                </>
              ) : (
                formatPrice(product.price)
              )}
            </div>

            {/* Size Selector */}
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>Size</p>
            <div className="size-selector">
              {product.sizes?.map((s) => (
                <button
                  key={s.size}
                  className={`size-btn ${selectedSize === s.size ? 'active' : ''} ${s.stock === 0 ? 'disabled' : ''}`}
                  onClick={() => s.stock > 0 && setSelectedSize(s.size)}
                  disabled={s.stock === 0}
                >
                  {s.size}
                </button>
              ))}
            </div>

            <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={!canAdd}>
              {product.badge === 'SOLD OUT' ? 'SOLD OUT' : product.badge === 'PRE-ORDER' ? 'PRE-ORDER NOW' : 'ADD TO CART'}
            </button>

            <p className={`stock-status ${stockStatus.class}`}>{stockStatus.text}</p>

            {/* Description */}
            <div className="product-meta">
              <h4>Description</h4>
              <p>{product.description}</p>

              {product.materials && (
                <>
                  <h4>Materials</h4>
                  <p>{product.materials}</p>
                </>
              )}

              <h4>Shipping</h4>
              <p>{product.shippingInfo}</p>
            </div>

            {/* FAQ Accordion */}
            <div style={{ marginTop: 24 }}>
              {[
                { q: 'Why pre-order?', a: 'Pre-ordering guarantees your size and helps us produce responsibly. Items ship within 2-4 weeks.' },
                { q: 'Sizing guide', a: 'OPPA pieces are designed with an oversized fit. We recommend going true to size for the intended silhouette, or sizing down for a more fitted look.' },
              ].map((faq, i) => (
                <div key={i} className="accordion-item">
                  <div className={`accordion-header ${activeAccordion === i ? 'open' : ''}`} onClick={() => setActiveAccordion(activeAccordion === i ? null : i)}>
                    <span>{faq.q}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                  </div>
                  {activeAccordion === i && <div className="accordion-body">{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: 80 }}>
            <div className="section-head">
              <h2>YOU MAY ALSO LIKE</h2>
            </div>
            <div className="product-grid">
              {relatedProducts.filter(p => p._id !== product._id).slice(0, 4).map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
