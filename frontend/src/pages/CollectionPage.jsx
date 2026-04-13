import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../store/productSlice';
import ProductCard from '../components/ProductCard';
import { getCategoryLabel } from '../utils/helpers';

const CollectionPage = ({ category }) => {
  const dispatch = useDispatch();
  const { items, loading, pages, page } = useSelector((state) => state.products);
  const [searchParams] = useSearchParams();
  const [sort, setSort] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const search = searchParams.get('search') || '';

  useEffect(() => {
    const params = { sort };
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (search) params.search = search;
    dispatch(fetchProducts(params));
  }, [dispatch, category, sort, minPrice, maxPrice, search]);

  const title = category ? getCategoryLabel(category) : search ? `Search: "${search}"` : 'All Products';

  return (
    <div className="collection-page">
      <div className="container">
        <h1>{title.toUpperCase()}</h1>

        <div className="filters-bar">
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
            <select value={minPrice} onChange={(e) => setMinPrice(e.target.value)}>
              <option value="">Min Price</option>
              <option value="0">€0+</option>
              <option value="50">€50+</option>
              <option value="100">€100+</option>
              <option value="150">€150+</option>
            </select>
            <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}>
              <option value="">Max Price</option>
              <option value="50">Up to €50</option>
              <option value="100">Up to €100</option>
              <option value="150">Up to €150</option>
              <option value="250">Up to €250</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : items.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '80px 0', color: '#888' }}>No products found.</p>
        ) : (
          <div className="product-grid">
            {items.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
