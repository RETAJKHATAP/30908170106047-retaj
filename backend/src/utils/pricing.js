/**
 * Pure pricing helpers used by the order/cart controllers.
 * Kept side-effect free so they can be unit tested in isolation.
 */

const round2 = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

const calculateItemsPrice = (items = []) =>
  round2(items.reduce((sum, item) => sum + item.price * item.quantity, 0));

const calculateShippingPrice = (itemsPrice) => {
  if (itemsPrice <= 0) return 0;
  return itemsPrice >= 100 ? 0 : 9.99;
};

const calculateTaxPrice = (itemsPrice, taxRate = 0.08) => round2(itemsPrice * taxRate);

const calculateTotalPrice = (itemsPrice, shippingPrice, taxPrice) =>
  round2(itemsPrice + shippingPrice + taxPrice);

const buildOrderPricing = (items) => {
  const itemsPrice = calculateItemsPrice(items);
  const shippingPrice = calculateShippingPrice(itemsPrice);
  const taxPrice = calculateTaxPrice(itemsPrice);
  const totalPrice = calculateTotalPrice(itemsPrice, shippingPrice, taxPrice);
  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};

module.exports = {
  round2,
  calculateItemsPrice,
  calculateShippingPrice,
  calculateTaxPrice,
  calculateTotalPrice,
  buildOrderPricing,
};
