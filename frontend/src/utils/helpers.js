export const formatPrice = (n) => `€${n.toFixed(2)}`;

export const getStockStatus = (sizes) => {
  const total = sizes?.reduce((sum, s) => sum + s.stock, 0) || 0;
  if (total === 0) return { text: 'Out of Stock', class: 'out-of-stock' };
  if (total <= 5) return { text: `Low Stock – ${total} left`, class: 'low-stock' };
  return { text: 'In Stock', class: 'in-stock' };
};

export const getCategoryLabel = (cat) => {
  const labels = { upperwear: 'Upperwear', lowerwear: 'Lowerwear', flexgear: 'Flex Gear' };
  return labels[cat] || cat;
};
