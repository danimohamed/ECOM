import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/helpers';

const ProductCard = ({ product }) => {
  const isSoldOut = product.badge === 'SOLD OUT';
  const badge = product.badge && product.badge !== 'SOLD OUT' ? product.badge : null;
  const imgUrl = product.images?.[0]?.url;

  return (
    <div className="grid-product">
      <div className="grid-product__wrapper">
        <div className="grid-product__image-wrapper">
          <Link to={`/product/${product._id}`} className="grid-product__image-link">
            <div className="reveal">
              <div className="product--wrapper">
                <div className="product--ratio">
                  {imgUrl ? (
                    <img className="product--image" src={imgUrl} alt={product.name} />
                  ) : (
                    <div className="product--gradient" style={{
                      background: product.gradient || 'linear-gradient(135deg,#1a1a1a,#3d3d3d)',
                    }} />
                  )}
                </div>
              </div>
            </div>
            {badge && <span className="grid-product__badge">{badge}</span>}
            {isSoldOut && (
              <div className="grid-product__soldout">
                <span>SOLD</span>
                <span>OUT</span>
              </div>
            )}
          </Link>
        </div>
        <Link to={`/product/${product._id}`} className="grid-product__meta">
          <span className="grid-product__title">{product.name}</span>
        </Link>
        <div className="grid-product__price">
          {product.salePrice ? (
            <>
              <span className="price">{formatPrice(product.salePrice)}</span>
              <span className="price--compare">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="price">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
