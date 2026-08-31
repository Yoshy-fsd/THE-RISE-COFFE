import React, { useEffect, useMemo, useState } from 'react';
import { checkNetworkAccess, fetchNetworkInfo, fetchSharedData, saveSharedData } from './api';

const ADMIN_MASTER_CODE = '1920';
const ADMIN_FULL_ACCESS_CODE = '2000';
const DEFAULT_WAITER_PASSWORD = '667788';
const OWNER_INSTAGRAM_CODE = '2005926';
const DEFAULT_OWNER_INSTAGRAM = 'https://www.instagram.com/neder_shh/';
const COFFEE_LOCATION_URL = 'https://maps.app.goo.gl/E3ksF3ywTqd6DWQT7';
const DEFAULT_WAITERS = [{ id: 'waiter-1', name: 'Waiter', password: DEFAULT_WAITER_PASSWORD }];
const STORAGE_KEYS = {
  settings: 'coffee-menu-settings-v1',
  groups: 'coffee-menu-groups-v1',
  products: 'coffee-menu-products-v1',
  orders: 'coffee-menu-orders-v1',
  feedback: 'coffee-menu-feedback-v1',
};

const baseGroups = [
  { id: 'g-classic-coffee', name: 'Classic Coffees', backgroundColor: '#f3e7d7', backgroundImage: '', textColor: '#211912' },
  { id: 'g-the', name: 'Thé', backgroundColor: '#dfe9d4', backgroundImage: '', textColor: '#1d261a' },
  { id: 'g-ice-the', name: 'Ice Thé', backgroundColor: '#d9f0ee', backgroundImage: '', textColor: '#132b2d' },
  { id: 'g-hot-drinks', name: 'Hot Drinks', backgroundColor: '#f0e0ce', backgroundImage: '', textColor: '#2d1c13' },
  { id: 'g-ice-coffee', name: 'Ice Coffees', backgroundColor: '#dde5d0', backgroundImage: '', textColor: '#1c2618' },
  { id: 'g-ice-matcha', name: 'Ice Matcha', backgroundColor: '#dfead9', backgroundImage: '', textColor: '#15271c' },
  { id: 'g-frappucino', name: 'Frappucino', backgroundColor: '#f2e7e2', backgroundImage: '', textColor: '#2f1a1b' },
  { id: 'g-milkshakes', name: 'Milkshakes', backgroundColor: '#f6ebd3', backgroundImage: '', textColor: '#2d1d10' },
  { id: 'g-mojito', name: 'Mojito', backgroundColor: '#dfeaf5', backgroundImage: '', textColor: '#182a3c' },
  { id: 'g-smoothies', name: 'Smoothies', backgroundColor: '#e7efd7', backgroundImage: '', textColor: '#1a2a1d' },
  { id: 'g-healthy', name: 'Healthy Blends', backgroundColor: '#e2f0dc', backgroundImage: '', textColor: '#1d2d1a' },
  { id: 'g-crepes-sucree', name: 'Crêpes Sucrée', backgroundColor: '#f3e2d4', backgroundImage: '', textColor: '#2a1a14' },
  { id: 'g-crepes-salee', name: 'Crêpes Sallée', backgroundColor: '#e4dcc6', backgroundImage: '', textColor: '#241d14' },
  { id: 'g-pancakes', name: 'Pancakes', backgroundColor: '#f5e4bf', backgroundImage: '', textColor: '#2d200d' },
  { id: 'g-gauffres', name: 'Gauffres', backgroundColor: '#efe4d3', backgroundImage: '', textColor: '#251c17' },
];

const baseProducts = [
  ['Espresso', 'g-classic-coffee', 14, '☕', 3, 'Bold and aromatic'],
  ['Latté', 'g-classic-coffee', 18, '🥛', 5, 'Smooth creamy finish'],
  ['Capuccino', 'g-classic-coffee', 19, '☕', 5, 'Classic espresso + milk foam'],
  ['Americano', 'g-classic-coffee', 16, '☕', 4, 'Light and refreshing'],
  ['Machhiato', 'g-classic-coffee', 17, '☕', 4, 'Balanced espresso'],
  ['Mocca', 'g-classic-coffee', 19, '☕', 5, 'Chocolate espresso blend'],
  ['Matcha Latte', 'g-classic-coffee', 22, '🍵', 6, 'Earthy and mellow'],
  ['Classicc Thé', 'g-the', 12, '🍃', 4, 'Fresh infusion'],
  ['Thé + Fruit secs', 'g-the', 18, '🍋', 5, 'Warm and fragrant'],
  ['Ice Thé melon', 'g-ice-the', 20, '🍉', 5, 'Cool and juicy'],
  ['Ice Thé Mango', 'g-ice-the', 22, '🥭', 5, 'Tropical and sweet'],
  ['Ice Bubble Thé', 'g-ice-the', 24, '🫧', 5, 'Tea with pearls'],
  ['Hot Choclact', 'g-hot-drinks', 20, '🍫', 6, 'Warm comfort drink'],
  ['Hot Oreo', 'g-hot-drinks', 22, '🍪', 6, 'Oreo chocolate delight'],
  ['Hot Pistachio', 'g-hot-drinks', 23, '🌰', 6, 'Nutty and creamy'],
  ['Ice Americano', 'g-ice-coffee', 18, '🧊', 5, 'Iced espresso'],
  ['Ice Latte', 'g-ice-coffee', 21, '🧊', 5, 'Refreshing milk coffee'],
  ['Ice Caramel Machhiato', 'g-ice-coffee', 24, '🥤', 6, 'Sweet caramel note'],
  ['Ice Matcha latte', 'g-ice-matcha', 25, '🍵', 6, 'Green matcha smoothness'],
  ['Ice Matcha Blueberry', 'g-ice-matcha', 27, '🫐', 6, 'Berry green tea'],
  ['Frappucino Classic', 'g-frappucino', 28, '🍦', 7, 'Creamy frozen classic'],
  ['Frappucino Caramel', 'g-frappucino', 30, '🥨', 7, 'Sweet caramel iced blend'],
  ['Frappucino Nutella', 'g-frappucino', 32, '🍫', 7, 'Hazelnut and cocoa'],
  ['Milkshakes Caramel', 'g-milkshakes', 29, '🍨', 6, 'Smooth dessert shake'],
  ['Milkshakes Nutella', 'g-milkshakes', 31, '🍫', 6, 'Creamy nutella shake'],
  ['Milkshakes Strawberry', 'g-milkshakes', 30, '🍓', 6, 'Fresh berry sweetness'],
  ['Virgin Mojito', 'g-mojito', 24, '🍋', 5, 'Fresh mint and lime'],
  ['Red Mojito', 'g-mojito', 26, '🍓', 5, 'Berry citrus sparkle'],
  ['Blue Mojito', 'g-mojito', 27, '🫐', 5, 'Cool blue berry blend'],
  ['Bannane', 'g-smoothies', 25, '🍌', 6, 'Banana comfort'],
  ['Strawberry', 'g-smoothies', 26, '🍓', 6, 'Fresh fruit blend'],
  ['Mango', 'g-smoothies', 27, '🥭', 6, 'Tropical feel'],
  ['Avocado', 'g-smoothies', 28, '🥑', 6, 'Creamy and rich'],
  ['Bannane + Oats + Honey', 'g-healthy', 29, '🌾', 7, 'Healthy energy boost'],
  ['Apple + Spinach + Lemond', 'g-healthy', 30, '🍏', 7, 'Fresh green blend'],
  ['Avocado + Milk + Honey', 'g-healthy', 31, '🥑', 7, 'Smooth and nourishing'],
  ['Chocolact', 'g-crepes-sucree', 28, '🍫', 8, 'Chocolate-filled classic'],
  ['Nutella', 'g-crepes-sucree', 30, '🍫', 8, 'Sweet hazelnut favorite'],
  ['Nutella + Bannane', 'g-crepes-sucree', 32, '🍌', 8, 'Banana-rich dessert'],
  ['Fromage', 'g-crepes-salee', 24, '🧀', 8, 'Savory cheese filling'],
  ['Fromage + Jombon', 'g-crepes-salee', 30, '🥪', 8, 'Cheese and ham'],
  ['Honey + Butter', 'g-pancakes', 22, '🍯', 8, 'Golden sweet stack'],
  ['Nutella', 'g-pancakes', 28, '🍫', 8, 'Dessert pancake'],
  ['OREO', 'g-pancakes', 29, '🍪', 8, 'Cookie crunch'],
  ['Chocolact blanc + Noir + pipetes de chocolact', 'g-gauffres', 32, '🍫', 9, 'Triple chocolate waffle'],
  ['Nutella + Chocolact Blanc', 'g-gauffres', 34, '🍫', 9, 'Classic white and dark chocolate'],
];

const defaultSettings = {
  name: 'Tabac & Bloom',
  tagline: 'Coffee, brewed with intent.',
  currency: '$',
  accent: '#7ea86b',
  background: '#e9f0e1',
  textColor: '#1f2f20',
  instagram: '@tabacandbloom',
  facebookUrl: '',
  logoText: 'T&B',
  logoUrl: '',
  allowedWifiNetwork: '',
  adminPassword: '93449919',
  waiterName: 'Waiter',
  waiterPassword: DEFAULT_WAITER_PASSWORD,
  waiters: DEFAULT_WAITERS,
  ownerInstagramUrl: DEFAULT_OWNER_INSTAGRAM,
  wifiRestrictionEnabled: false,
};

function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors silently
  }
}

function getTableFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const table = params.get('table');
  if (!table) return null;
  const cleaned = String(table).trim().replace(/[^0-9]/g, '').slice(0, 2);
  return cleaned ? cleaned : null;
}

function makeId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
}

function formatTimeAgo(dateString) {
  const diff = Math.max(1, Math.round((Date.now() - new Date(dateString).getTime()) / 60000));
  return `${diff} min ago`;
}

function normalizeOrderStatus(status) {
  const allowed = new Set(['New', 'Received', 'Preparing', 'Ready', 'Served', 'Cancelled']);
  const next = String(status || 'New');
  return allowed.has(next) ? next : 'New';
}

function normalizeOrder(order) {
  const table = order?.table === 'Walk-in' || order?.table == null ? order?.table : String(order?.table);
  return { ...order, table, status: normalizeOrderStatus(order?.status) };
}

function getLocalDateInputValue(date = new Date()) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

function getStatsRange(period, selectedDate, dayStartedAt) {
  const selected = selectedDate ? new Date(`${selectedDate}T00:00:00`) : new Date();
  selected.setHours(0, 0, 0, 0);
  const now = new Date();
  if (period === 'day') {
    const resetStart = dayStartedAt ? new Date(dayStartedAt) : selected;
    const start = selected.getTime() === new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() && resetStart > selected
      ? resetStart
      : selected;
    const end = new Date(selected);
    end.setDate(end.getDate() + 1);
    return { start, end };
  }
  if (period === 'week') {
    const start = new Date(selected);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    return { start, end };
  }
  const start = new Date(selected.getFullYear(), selected.getMonth(), 1);
  const end = new Date(selected.getFullYear(), selected.getMonth() + 1, 1);
  return { start, end };
}

function getSalesStats(orders, period, selectedDate, dayStartedAt) {
  const { start, end } = getStatsRange(period, selectedDate, dayStartedAt);
  const periodOrders = orders.filter((order) => {
    const createdAt = new Date(order.createdAt);
    return createdAt >= start && createdAt < end;
  });
  const revenue = periodOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const items = periodOrders.reduce((counts, order) => {
    order.items.forEach((item) => {
      counts[item.name] = (counts[item.name] || 0) + Number(item.qty || 0);
    });
    return counts;
  }, {});
  const topItem = Object.entries(items).sort((a, b) => b[1] - a[1])[0];

  return { revenue, orderCount: periodOrders.length, itemCount: Object.values(items).reduce((sum, count) => sum + count, 0), topItem };
}

function getWaiterShiftStats(orders) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const shiftOrders = orders.filter((order) => new Date(order.createdAt) >= start && order.status !== 'Cancelled');
  return {
    revenue: shiftOrders.reduce((sum, order) => sum + Number(order.total || 0), 0),
    orders: shiftOrders.length,
  };
}

function CustomerView({ settings, groups, products, orders, feedback, onPlaceOrder, onSubmitFeedback }) {
  const [query, setQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');
  const [cart, setCart] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [toast, setToast] = useState('');
  const table = getTableFromUrl();
  const canOrder = Boolean(table);
  const customerOrderIds = readStorage('coffee-menu-customer-orders-v1', []);
  const customerOrders = orders
    .map(normalizeOrder)
    .filter((order) => order.status !== 'Cancelled')
    .filter((order) => table
      ? String(order.table) === String(table)
      : customerOrderIds.includes(order.id))
    .slice()
    .reverse();

  const getGroupStyle = (group) => {
    const background = group.backgroundImage
      ? `linear-gradient(rgba(14, 22, 17, 0.22), rgba(14, 22, 17, 0.22)), url(${group.backgroundImage}) center/cover no-repeat`
      : group.backgroundColor || '#f4efe8';

    return {
      background,
      color: group.textColor || '#111111',
    };
  };

  const groupedProducts = useMemo(() => {
    const q = query.trim().toLowerCase();

    return groups
      .map((group) => {
        const items = products.filter((product) => {
          const matchesGroup = groupFilter === 'all' || product.groupId === groupFilter;
          const matchesQuery = !q || product.name.toLowerCase().includes(q);
          return product.groupId === group.id && matchesGroup && matchesQuery;
        });

        return { ...group, items };
      })
      .filter((group) => group.items.length > 0);
  }, [groups, products, query, groupFilter]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const addToCart = (product) => {
    if (!canOrder) {
      setToast('Scan your table QR code to order.');
      return;
    }
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...current, { ...product, qty: 1 }];
    });
  };

  const changeQty = (id, delta) => {
    setCart((current) =>
      current
        .map((item) => (item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);
  const totalPrep = cart.reduce((sum, item) => sum + Number(item.prepTime || 5) * item.qty, 0);

  const handlePlaceOrder = () => {
    if (!cart.length || !canOrder) {
      if (!canOrder) setToast('Scan your table QR code to order.');
      return;
    }
    const order = {
      id: makeId('order'),
      table: table ? String(table) : 'Walk-in',
      items: cart.map((item) => ({ id: item.id, name: item.name, qty: item.qty, price: Number(item.price), prepTime: Number(item.prepTime || 5) })),
      total,
      prepMinutes: totalPrep,
      createdAt: new Date().toISOString(),
      status: 'New',
    };
    onPlaceOrder(order);
    writeStorage('coffee-menu-customer-orders-v1', [...customerOrderIds, order.id].slice(-5));
    setCart([]);
    setToast('Order sent to the admin.');
  };

  const averageRating = feedback.length
    ? (feedback.reduce((sum, item) => sum + Number(item.rating || 0), 0) / feedback.length).toFixed(1)
    : '5.0';

  return (
    <div className="page-shell" style={{ background: settings.background }}>
      <style>{styles}</style>
      <header className="hero" style={{ background: settings.accent }}>
        <div className="hero-inner">
          <div className="brand-wrap">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt={settings.name} className="brand-logo" />
            ) : (
              <div className="brand-logo text-brand">{settings.logoText || 'T&B'}</div>
            )}
            <div>
              <h1>{settings.name}</h1>
              <p>{settings.tagline}</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="waiter-toggle" onClick={() => window.location.hash = 'waiter'}>Waiter</button>
            <button className="admin-toggle" onClick={() => window.location.hash = 'admin'}>Admin</button>
          </div>
        </div>
      </header>

      <div className="customer-main">
        <aside className="cart-panel">
          {!canOrder && <div className="scan-notice">Browse the menu freely. Scan your table QR code to order.</div>}
          <div className="panel-head">
            <h3>Your order</h3>
            <span>{cart.reduce((sum, item) => sum + item.qty, 0)} items</span>
          </div>

          {cart.length === 0 ? (
            <div className="empty-state">Add drinks or desserts from the menu to start your order.</div>
          ) : (
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div>
                    <strong>{item.name}</strong>
                    <small>{settings.currency}{Number(item.price).toFixed(2)}</small>
                  </div>
                  <div className="qty-box">
                    <button onClick={() => changeQty(item.id, -1)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => changeQty(item.id, 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="cart-total">
            <span>Estimated prep</span>
            <strong>{totalPrep} min</strong>
          </div>
          <div className="cart-total">
            <span>Total</span>
            <strong>{settings.currency}{total.toFixed(2)}</strong>
          </div>
          <button className="place-order" onClick={handlePlaceOrder} disabled={!cart.length || !canOrder}>Send order</button>

          <div className="order-status-panel">
              <div className="panel-head">
                <h3>Order status</h3>
                <span>{table ? `Table ${table}` : 'This device'}</span>
              </div>
              {customerOrders.length === 0 ? (
                <div className="empty-state">
                  {table ? 'Your order status will appear here.' : 'Open your table QR code before ordering to track your order here.'}
                </div>
              ) : (
                <div className="customer-order-list">
                  {customerOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="customer-order-status">
                      <div>
                        <strong>{order.items.reduce((sum, item) => sum + item.qty, 0)} items</strong>
                        <small>{settings.currency}{Number(order.total).toFixed(2)}</small>
                      </div>
                      <span className={`status-badge status-${String(order.status || 'New').toLowerCase()}`}>
                        {order.status === 'Preparing'
                          ? 'KAAD YAHDHER'
                          : order.status === 'Ready'
                            ? 'IJA HEZ'
                            : order.status === 'Received'
                              ? 'Order received'
                            : order.status === 'Served'
                              ? 'KN EEJBEK KHALI RATE'
                              : order.status || 'New'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
          </div>
          {settings.instagram && (
            <a
              className="instagram-link"
              href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${settings.name} on Instagram`}
            >
              <svg className="instagram-icon" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
              <span>{settings.instagram}</span>
            </a>
          )}
          <a
            className="instagram-link owner-instagram-link"
            href={settings.ownerInstagramUrl || DEFAULT_OWNER_INSTAGRAM}
            target="_blank"
            rel="noreferrer"
            aria-label="Open the website owner's Instagram"
          >
            <svg className="instagram-icon" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
            <span>Website by @neder_shh</span>
          </a>
          <a className="social-link location-link" href={COFFEE_LOCATION_URL} target="_blank" rel="noreferrer">
            <span className="social-icon" aria-hidden="true">⌖</span>
            <span>Find us at the coffee shop</span>
          </a>
          {settings.facebookUrl && (
            <a className="social-link facebook-link" href={settings.facebookUrl} target="_blank" rel="noreferrer" aria-label="Open the coffee shop Facebook page">
              <span className="facebook-icon" aria-hidden="true">f</span>
              <span>Facebook</span>
            </a>
          )}
        </aside>

        <main className="menu-panel">
          <div className="search-row">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search your favorite coffee…" />
          </div>

          <div className="chip-row">
            <button className={groupFilter === 'all' ? 'chip active' : 'chip'} onClick={() => setGroupFilter('all')}>All</button>
            {groups.map((group) => (
              <button key={group.id} className={groupFilter === group.id ? 'chip active' : 'chip'} onClick={() => setGroupFilter(group.id)}>
                {group.name}
              </button>
            ))}
          </div>

          <div className="grouped-product-layout">
            {groupedProducts.length === 0 && (
              <div className="empty-state">No products match your search.</div>
            )}

            {groupedProducts.map((group) => (
              <section key={group.id} className="grouped-section" style={getGroupStyle(group)}>
                <div className="group-section-header">
                  <h3>{group.name}</h3>
                  <span>{group.items.length} items</span>
                </div>

                <div className="product-grid">
                  {group.items.map((product) => (
                    <article key={product.id} className="product-card">
                      <div className="art" style={{ background: product.image ? 'linear-gradient(135deg, #f7f4ef, #e7e6d8)' : 'linear-gradient(135deg, #d8e3c4, #c7d4b1)' }}>
                        {product.image ? (
                          <img src={product.image} alt={product.name} />
                        ) : (
                          <span>{product.emoji || '☕'}</span>
                        )}
                      </div>
                      <div className="card-body">
                        <div className="card-head">
                          <h4>{product.name}</h4>
                          <span>{settings.currency}{Number(product.price).toFixed(2)}</span>
                        </div>
                        <p>{product.details || 'Freshly prepared for you.'}</p>
                        <div className="meta-row">
                          <span>{product.available === false ? 'Not available for now' : `⏱ ${product.prepTime || 5} min`}</span>
                          <button onClick={() => addToCart(product)} disabled={!canOrder || product.available === false}>{product.available === false ? 'Unavailable' : 'Add'}</button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section className="feedback-section">
            <div className="section-title-row">
              <h3>Customer feedback</h3>
              <span>⭐ {averageRating}/5</span>
            </div>

            <div className="rating-box">
              <div className="stars">
                {[1,2,3,4,5].map((value) => (
                  <button key={value} className={value <= rating ? 'star active' : 'star'} onClick={() => setRating(value)}>★</button>
                ))}
              </div>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Your comment helps us keep improving." />
              <button className="submit-review" onClick={() => {
                if (!comment.trim()) return;
                onSubmitFeedback({ rating, comment, createdAt: new Date().toISOString(), table: table || 'Walk-in' });
                setComment('');
                setRating(5);
                setToast('Thank you for your feedback.');
              }}>Send review</button>
            </div>

            <div className="review-list">
              {feedback.slice(0, 4).map((entry) => (
                <div key={entry.id} className="review-item">
                  <div className="review-head">
                    <strong>{entry.table === 'Walk-in' ? 'Guest' : `Table ${entry.table}`}</strong>
                    <span>{'★'.repeat(entry.rating)}{'☆'.repeat(5 - entry.rating)}</span>
                  </div>
                  <p>{entry.comment}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {settings.instagram && (
        <footer className="bottom-bar">
          <span>Follow us</span>
          <a href={`https://instagram.com/${settings.instagram.replace('@', '')}`} target="_blank" rel="noreferrer">{settings.instagram}</a>
        </footer>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function AdminAuth({ onUnlock, onChangePassword, error }) {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changeMode, setChangeMode] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (changeMode) {
      if (newPassword.length < 4) {
        setMessage('New password must have at least 4 characters.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setMessage('Passwords do not match.');
        return;
      }
      onChangePassword(newPassword);
      setCode('');
      setNewPassword('');
      setConfirmPassword('');
      setChangeMode(false);
      setMessage('New password saved. Use it to open the dashboard.');
      return;
    }

    if (code === ADMIN_MASTER_CODE) {
      setChangeMode(true);
      setMessage('Create a new admin password.');
      return;
    }

    onUnlock(code);
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2>{changeMode ? 'Change admin password' : 'Admin access'}</h2>
        <p>{changeMode ? 'Set a new password for the admin dashboard.' : 'Enter the admin password to manage the coffee shop.'}</p>
        {changeMode ? (
          <>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" />
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
          </>
        ) : (
          <input type="password" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Admin password" />
        )}
        {error && <small className="error-text">{error}</small>}
        {message && <small className="form-message">{message}</small>}
        <button onClick={handleSubmit}>{changeMode ? 'Save new password' : 'Open dashboard'}</button>
      </div>
    </div>
  );
}

function WaiterAuth({ waiters, onUnlock, error }) {
  const [code, setCode] = useState('');
  const [selectedWaiterId, setSelectedWaiterId] = useState(waiters[0]?.id || '');
  const selectedWaiter = waiters.find((waiter) => waiter.id === selectedWaiterId) || waiters[0];
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2>Waiter access</h2>
        <p>Enter the waiter password to receive and manage orders.</p>
        <select value={selectedWaiterId} onChange={(event) => setSelectedWaiterId(event.target.value)}>
          {waiters.map((waiter) => <option key={waiter.id} value={waiter.id}>{waiter.name}</option>)}
        </select>
        <input type="password" value={code} onChange={(event) => setCode(event.target.value)} placeholder="Waiter password" />
        {error && <small className="error-text">{error}</small>}
        <button onClick={() => onUnlock(code, selectedWaiter)}>Open waiter section</button>
      </div>
    </div>
  );
}

function WaiterView({ waiterName, settings, orders, onOrderStatusChange, warningMessage }) {
  const shiftStats = getWaiterShiftStats(orders);
  const activeOrders = orders
    .map(normalizeOrder)
    .filter((order) => !['Served', 'Cancelled'].includes(order.status))
    .slice()
    .reverse();

  return (
    <div className="admin-shell">
      <style>{styles}</style>
      {warningMessage && (
        <div className="auth-wrap" style={{ padding: '20px 0 0' }}>
          <div className="auth-card network-blocked-card">
            <h2>Welcome to {settings.name}</h2>
            <p>{warningMessage}</p>
          </div>
        </div>
      )}
      <header className="admin-topbar">
        <div>
          <h2>{waiterName} section</h2>
          <small>Receive orders and manage your shift</small>
        </div>
        <button className="ghost-btn" onClick={() => window.location.hash = ''}>Customer view</button>
      </header>

      <div className="waiter-summary">
        <div className="stat-box"><small>Shift revenue</small><strong>{settings.currency}{shiftStats.revenue.toFixed(2)}</strong></div>
        <div className="stat-box"><small>Shift orders</small><strong>{shiftStats.orders}</strong></div>
      </div>

      <section className="admin-card waiter-orders-card">
        <div className="section-title-row"><h3>Incoming orders</h3><span>{activeOrders.length} active</span></div>
        {activeOrders.length === 0 ? <div className="empty-state">No active orders right now.</div> : (
          <div className="orders-list">
            {activeOrders.map((order) => (
              <div key={order.id} className="order-item">
                <div className="order-item-head">
                  <strong>{order.table === 'Walk-in' ? 'Walk-in' : `Table ${order.table}`}</strong>
                  <span>{formatTimeAgo(order.createdAt)}</span>
                </div>
                <ul>{order.items.map((item) => <li key={`${order.id}-${item.id}`}>{item.qty} x {item.name}</li>)}</ul>
                <div className="order-actions">
                  <span>{settings.currency}{Number(order.total).toFixed(2)} · {order.status}</span>
                  <div className="waiter-order-buttons">
                    {order.status === 'New' && <button className="primary-btn" onClick={() => onOrderStatusChange(order.id, 'Received')}>Receive order</button>}
                    {order.status !== 'New' && (
                      <select value={order.status} onChange={(event) => onOrderStatusChange(order.id, event.target.value)} aria-label={`Change status for ${order.table}`}>
                        <option value="Received">Received</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready">Ready</option>
                        <option value="Served">Served</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function AdminView({ settings, groups, products, orders, feedback, onSettingsChange, onGroupsChange, onProductsChange, onOrderStatusChange, onOrdersChange, onSubmitFeedback, warningMessage }) {
  const [draftSettings, setDraftSettings] = useState(settings);
  const [draftGroupName, setDraftGroupName] = useState('');
  const [draftProduct, setDraftProduct] = useState({ name: '', groupId: groups[0]?.id || '', price: 0, emoji: '☕', image: '', details: '', prepTime: 5, available: true });
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id || '');
  const [brandingMessage, setBrandingMessage] = useState('');
  const [statsPeriod, setStatsPeriod] = useState('day');
  const [statsDate, setStatsDate] = useState(getLocalDateInputValue());
  const [newWaiterName, setNewWaiterName] = useState('');
  const [newWaiterPassword, setNewWaiterPassword] = useState('');
  const [ownerEditUnlocked, setOwnerEditUnlocked] = useState(false);
  const [ownerCode, setOwnerCode] = useState('');
  const [ownerMessage, setOwnerMessage] = useState('');
  const [networkInfo, setNetworkInfo] = useState({ detectedNetworks: [] });
  const [newQrName, setNewQrName] = useState('');
  const [newQrLink, setNewQrLink] = useState('');
  const [productDrafts, setProductDrafts] = useState({});
  const [selectedOrderDetailId, setSelectedOrderDetailId] = useState(null);
  const [groupStyleDraft, setGroupStyleDraft] = useState({
    backgroundColor: groups[0]?.backgroundColor || '#f4efe8',
    backgroundImage: groups[0]?.backgroundImage || '',
    textColor: groups[0]?.textColor || '#111111',
  });

  useEffect(() => {
    setDraftSettings(settings);
  }, [settings]);

  useEffect(() => {
    setProductDrafts((current) => {
      const next = {};
      products.forEach((product) => {
        next[product.id] = { ...(current[product.id] || product), ...product };
      });
      return next;
    });
  }, [products]);

  useEffect(() => {
    fetchNetworkInfo().then(setNetworkInfo).catch(() => {});
  }, []);

  useEffect(() => {
    const selected = groups.find((group) => group.id === selectedGroupId) || groups[0];
    if (!selected) return;
    setGroupStyleDraft({
      backgroundColor: selected.backgroundColor || '#f4efe8',
      backgroundImage: selected.backgroundImage || '',
      textColor: selected.textColor || '#111111',
    });
  }, [groups, selectedGroupId]);

  const totalOrders = orders.length;
  const activeQueueOrders = orders
    .map(normalizeOrder)
    .filter((order) => !['Served', 'Cancelled'].includes(order.status))
    .slice()
    .reverse();
  const servedOrders = orders
    .map(normalizeOrder)
    .filter((order) => order.status === 'Served')
    .slice()
    .reverse();
  const selectedOrderDetail = orders
    .map(normalizeOrder)
    .find((order) => order.id === selectedOrderDetailId) || null;
  const salesStats = getSalesStats(orders, statsPeriod, statsDate, settings.statsDayStartedAt);
  const avgRating = feedback.length
    ? (feedback.reduce((sum, item) => sum + Number(item.rating || 0), 0) / feedback.length).toFixed(1)
    : '5.0';

  const saveSettings = () => {
    onSettingsChange(draftSettings);
    setBrandingMessage('Branding saved. Refresh the customer view to see it.');
  };

  const unlockOwnerInstagram = () => {
    if (ownerCode === OWNER_INSTAGRAM_CODE) {
      setOwnerEditUnlocked(true);
      setOwnerMessage('Owner Instagram editing unlocked.');
    } else {
      setOwnerMessage('Incorrect owner code.');
    }
  };

  const startNewDay = () => {
    const nextSettings = { ...settings, statsDayStartedAt: new Date().toISOString() };
    onSettingsChange(nextSettings);
    setDraftSettings(nextSettings);
    setStatsPeriod('day');
  };

  const deleteOrder = (orderId) => {
    if (window.confirm('Delete this order permanently? It will also be removed from sales statistics.')) {
      onOrdersChange(orders.filter((order) => order.id !== orderId));
      if (selectedOrderDetailId === orderId) setSelectedOrderDetailId(null);
    }
  };

  const handleOrderAction = (orderId, action) => {
    if (action === 'details') {
      setSelectedOrderDetailId(orderId);
      return;
    }
    if (action === 'delete') {
      deleteOrder(orderId);
    }
  };

  const deleteSelectedPeriodOrders = () => {
    const { start, end } = getStatsRange(statsPeriod, statsDate, settings.statsDayStartedAt);
    const selectedOrders = orders.filter((order) => {
      const createdAt = new Date(order.createdAt);
      return createdAt >= start && createdAt < end;
    });
    if (!selectedOrders.length) return;
    if (window.confirm(`Delete ${selectedOrders.length} order(s) from the selected ${statsPeriod}? This also removes their money from the dashboard.`)) {
      const selectedIds = new Set(selectedOrders.map((order) => order.id));
      onOrdersChange(orders.filter((order) => !selectedIds.has(order.id)));
    }
  };

  const waiters = settings.waiters || [{ id: 'waiter-1', name: settings.waiterName || 'Waiter', password: settings.waiterPassword || DEFAULT_WAITER_PASSWORD }];

  const updateWaiter = (waiterId, patch) => {
    onSettingsChange({ ...settings, waiters: waiters.map((waiter) => waiter.id === waiterId ? { ...waiter, ...patch } : waiter) });
  };

  const addWaiter = () => {
    if (!newWaiterName.trim() || newWaiterPassword.length < 4) return;
    onSettingsChange({ ...settings, waiters: [...waiters, { id: makeId('waiter'), name: newWaiterName.trim(), password: newWaiterPassword }] });
    setNewWaiterName('');
    setNewWaiterPassword('');
  };

  const removeWaiter = (waiterId) => {
    if (waiters.length === 1) return;
    onSettingsChange({ ...settings, waiters: waiters.filter((waiter) => waiter.id !== waiterId) });
  };

  const handleLogoImageUpload = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setBrandingMessage('Only image files are allowed for the logo.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setDraftSettings((current) => ({ ...current, logoUrl: result }));
      setBrandingMessage('Logo image ready. Save branding to apply it.');
    };
    reader.readAsDataURL(file);
  };

  const saveGroup = () => {
    if (!draftGroupName.trim()) return;
    const next = [...groups, { id: makeId('group'), name: draftGroupName.trim(), backgroundColor: '#f4efe8', backgroundImage: '', textColor: '#111111' }];
    onGroupsChange(next);
    setDraftGroupName('');
  };

  const updateGroupStyle = (groupId, patch) => {
    onGroupsChange(groups.map((group) => (group.id === groupId ? { ...group, ...patch } : group)));
  };

  const applySelectedGroupBackground = () => {
    if (!selectedGroupId) return;
    updateGroupStyle(selectedGroupId, groupStyleDraft);
  };

  const applyBackgroundToAllGroups = () => {
    onGroupsChange(groups.map((group) => ({ ...group, ...groupStyleDraft })));
  };

  const handleGroupImageUpload = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setGroupStyleDraft((current) => ({ ...current, backgroundImage: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleProductImageUpload = (productId, event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setBrandingMessage('Only image files are allowed for product photos.');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      updateProduct(productId, { image: result });
    };
    reader.readAsDataURL(file);
  };

  const handleNewProductImageUpload = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setBrandingMessage('Only image files are allowed for product photos.');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setDraftProduct((current) => ({ ...current, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const saveProduct = () => {
    if (!draftProduct.name.trim()) return;
    const next = [
      ...products,
      {
        id: makeId('product'),
        name: draftProduct.name.trim(),
        groupId: draftProduct.groupId,
        price: Number(draftProduct.price || 0),
        emoji: draftProduct.emoji || '☕',
        image: draftProduct.image || '',
        details: draftProduct.details || '',
        prepTime: Number(draftProduct.prepTime || 5),
        available: draftProduct.available !== false,
      },
    ];
    onProductsChange(next);
    setDraftProduct({ name: '', groupId: groups[0]?.id || '', price: 0, emoji: '☕', image: '', details: '', prepTime: 5, available: true });
  };

  const updateProduct = (productId, patch) => {
    setProductDrafts((current) => ({
      ...current,
      [productId]: { ...(current[productId] || products.find((product) => product.id === productId) || {}), ...patch },
    }));
  };

  const saveProductEdits = (productId) => {
    const draft = productDrafts[productId];
    if (!draft) return;
    onProductsChange(products.map((product) => (product.id === productId ? { ...product, ...draft } : product)));
  };

  const removeProduct = (productId) => {
    onProductsChange(products.filter((product) => product.id !== productId));
  };

  const menuBaseUrl = new URL('./', window.location.href).href;
  const tableQrLinks = draftSettings.tableQrLinks || {};
  const customQrCodes = draftSettings.customQrCodes || [];

  const getTableUrl = (table) => tableQrLinks[table] || `${menuBaseUrl}?table=${table}`;

  const updateTableQrLink = (table, link) => {
    setDraftSettings((current) => ({ ...current, tableQrLinks: { ...(current.tableQrLinks || {}), [table]: link } }));
  };

  const addCustomQrCode = () => {
    if (!newQrName.trim() || !newQrLink.trim()) return;
    setDraftSettings((current) => ({
      ...current,
      customQrCodes: [...(current.customQrCodes || []), { id: makeId('qr'), name: newQrName.trim(), link: newQrLink.trim() }],
    }));
    setNewQrName('');
    setNewQrLink('');
  };

  const removeCustomQrCode = (qrId) => {
    setDraftSettings((current) => ({ ...current, customQrCodes: (current.customQrCodes || []).filter((qr) => qr.id !== qrId) }));
  };

  return (
    <div className="admin-shell">
      <style>{styles}</style>
      {warningMessage && (
        <div className="auth-wrap" style={{ padding: '20px 0 0' }}>
          <div className="auth-card network-blocked-card">
            <h2>Welcome to {settings.name}</h2>
            <p>{warningMessage}</p>
          </div>
        </div>
      )}
      <header className="admin-topbar">
        <div>
          <h2>Admin dashboard</h2>
          <small>{totalOrders} orders · {feedback.length} reviews</small>
        </div>
        <button className="ghost-btn" onClick={() => window.location.hash = ''}>Customer view</button>
      </header>

      <div className="admin-grid">
        <section className="admin-card dashboard-card wide-card">
          <div className="section-title-row">
            <div>
              <h3>Sales dashboard</h3>
              <small>Money and orders from the selected period</small>
            </div>
            <button className="ghost-btn" onClick={startNewDay}>Start new day</button>
          </div>
          <div className="stats-periods">
            {['day', 'week', 'month'].map((period) => (
              <button key={period} className={statsPeriod === period ? 'chip active' : 'chip'} onClick={() => setStatsPeriod(period)}>
                {period[0].toUpperCase() + period.slice(1)}
              </button>
            ))}
            <label className="stats-date-picker">Date
              <input type="date" value={statsDate} onChange={(event) => setStatsDate(event.target.value)} />
            </label>
          </div>
          <div className="stats-grid">
            <div className="stat-box"><small>Revenue</small><strong>{settings.currency}{salesStats.revenue.toFixed(2)}</strong></div>
            <div className="stat-box"><small>Orders</small><strong>{salesStats.orderCount}</strong></div>
            <div className="stat-box"><small>Items sold</small><strong>{salesStats.itemCount}</strong></div>
            <div className="stat-box"><small>Top item</small><strong>{salesStats.topItem ? `${salesStats.topItem[0]} (${salesStats.topItem[1]})` : 'No sales yet'}</strong></div>
          </div>
          <button className="danger-btn dashboard-delete-btn" onClick={deleteSelectedPeriodOrders} disabled={!salesStats.orderCount}>Delete selected period orders</button>
        </section>

        <section className="admin-card">
          <div className="section-title-row">
            <h3>Brand settings</h3>
            <span>⭐ {avgRating}/5</span>
          </div>
          <div className="settings-grid">
            <label>Shop name<input value={draftSettings.name} onChange={(e) => setDraftSettings({ ...draftSettings, name: e.target.value })} /></label>
            <label>Tagline<input value={draftSettings.tagline} onChange={(e) => setDraftSettings({ ...draftSettings, tagline: e.target.value })} /></label>
            <label>Instagram<a href="https://instagram.com" target="_blank" rel="noreferrer">@</a><input value={draftSettings.instagram} onChange={(e) => setDraftSettings({ ...draftSettings, instagram: e.target.value })} /></label>
            <label>Facebook page URL<input value={draftSettings.facebookUrl || ''} onChange={(e) => setDraftSettings({ ...draftSettings, facebookUrl: e.target.value })} placeholder="https://facebook.com/your-page" /></label>
            <label>Logo text<input value={draftSettings.logoText} onChange={(e) => setDraftSettings({ ...draftSettings, logoText: e.target.value })} /></label>
            <label>Logo image URL<input value={draftSettings.logoUrl} onChange={(e) => setDraftSettings({ ...draftSettings, logoUrl: e.target.value })} /></label>
            <label>Upload logo photo<input type="file" accept="image/*" onChange={handleLogoImageUpload} /></label>
            <label>Waiter name<input value={draftSettings.waiterName || ''} onChange={(e) => setDraftSettings({ ...draftSettings, waiterName: e.target.value })} /></label>
            <label>Waiter password<input type="password" value={draftSettings.waiterPassword || ''} onChange={(e) => setDraftSettings({ ...draftSettings, waiterPassword: e.target.value })} /></label>
            <label>Website owner Instagram
              <input value={draftSettings.ownerInstagramUrl || DEFAULT_OWNER_INSTAGRAM} disabled={!ownerEditUnlocked} onChange={(e) => setDraftSettings({ ...draftSettings, ownerInstagramUrl: e.target.value })} />
            </label>
            {!ownerEditUnlocked && <div className="owner-code-row"><input type="password" value={ownerCode} onChange={(e) => setOwnerCode(e.target.value)} placeholder="Owner code" /><button className="ghost-btn" onClick={unlockOwnerInstagram}>Unlock</button></div>}
            {ownerMessage && <small className={ownerMessage === 'Incorrect owner code.' ? 'error-text' : 'form-message'}>{ownerMessage}</small>}
            <label>Allowed coffee Wi-Fi network<input value={draftSettings.allowedWifiNetwork || ''} onChange={(e) => setDraftSettings({ ...draftSettings, allowedWifiNetwork: e.target.value })} placeholder="Example: 192.168.1" /></label>
            <label className="switch-label"><input type="checkbox" checked={draftSettings.wifiRestrictionEnabled === true} onChange={(e) => setDraftSettings({ ...draftSettings, wifiRestrictionEnabled: e.target.checked })} /> Restrict website to coffee Wi-Fi</label>
            <small className="field-help">Detected network: {networkInfo.detectedNetworks?.length ? networkInfo.detectedNetworks.join(', ') : 'not available'}. Enter the first three numbers, such as 192.168.1, then save branding.</small>
            <label>Accent color<input type="color" value={draftSettings.accent} onChange={(e) => setDraftSettings({ ...draftSettings, accent: e.target.value })} /></label>
            <label>Background color<input type="color" value={draftSettings.background} onChange={(e) => setDraftSettings({ ...draftSettings, background: e.target.value })} /></label>
            <label>Text color<input type="color" value={draftSettings.textColor} onChange={(e) => setDraftSettings({ ...draftSettings, textColor: e.target.value })} /></label>
          </div>
          {brandingMessage && <div className="form-message">{brandingMessage}</div>}
          <button className="primary-btn" onClick={saveSettings}>Save branding</button>
          <div className="waiter-management">
            <h4>Waiter accounts</h4>
            <div className="field-row">
              <input value={newWaiterName} onChange={(event) => setNewWaiterName(event.target.value)} placeholder="New waiter name" />
              <input type="password" value={newWaiterPassword} onChange={(event) => setNewWaiterPassword(event.target.value)} placeholder="Password" />
              <button className="primary-btn" onClick={addWaiter}>Add waiter</button>
            </div>
            <div className="waiter-list">
              {waiters.map((waiter) => (
                <div key={waiter.id} className="waiter-row">
                  <input value={waiter.name} onChange={(event) => updateWaiter(waiter.id, { name: event.target.value })} />
                  <input type="password" value={waiter.password} onChange={(event) => updateWaiter(waiter.id, { password: event.target.value })} />
                  <button className="danger-btn" onClick={() => removeWaiter(waiter.id)} disabled={waiters.length === 1}>Remove</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="admin-card">
          <h3>Table QR codes</h3>
          <div className="qr-grid">
            {Array.from({ length: 20 }, (_, index) => {
              const table = index + 1;
              const tableUrl = getTableUrl(table);
              const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(tableUrl)}`;
              return (
                <div key={table} className="qr-box">
                  <img src={qrUrl} alt={`Table ${table} QR`} />
                  <span>Table {table}</span>
                  <input value={tableUrl} onChange={(event) => updateTableQrLink(table, event.target.value)} aria-label={`Table ${table} QR link`} />
                </div>
              );
            })}
          </div>
          <div className="custom-qr-editor">
            <h4>Additional QR codes</h4>
            <div className="field-row">
              <input value={newQrName} onChange={(event) => setNewQrName(event.target.value)} placeholder="QR name" />
              <input value={newQrLink} onChange={(event) => setNewQrLink(event.target.value)} placeholder="Destination link" />
              <button className="primary-btn" onClick={addCustomQrCode}>Add QR</button>
            </div>
            <div className="qr-grid">
              {customQrCodes.map((qr) => (
                <div key={qr.id} className="qr-box">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qr.link)}`} alt={`${qr.name} QR`} />
                  <span>{qr.name}</span>
                  <input value={qr.link} onChange={(event) => setDraftSettings((current) => ({ ...current, customQrCodes: (current.customQrCodes || []).map((item) => item.id === qr.id ? { ...item, link: event.target.value } : item) }))} aria-label={`${qr.name} link`} />
                  <button className="danger-btn" onClick={() => removeCustomQrCode(qr.id)}>Remove</button>
                </div>
              ))}
            </div>
            <button className="primary-btn" onClick={saveSettings}>Save QR links</button>
          </div>
        </section>

        <section className="admin-card">
          <h3>Groups</h3>
          <div className="field-row">
            <input value={draftGroupName} onChange={(e) => setDraftGroupName(e.target.value)} placeholder="Add a new menu group" />
            <button className="primary-btn" onClick={saveGroup}>Add group</button>
          </div>
          <div className="group-editor">
            <select value={selectedGroupId} onChange={(e) => setSelectedGroupId(e.target.value)}>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
            <label>Group background color<input type="color" value={groupStyleDraft.backgroundColor} onChange={(e) => setGroupStyleDraft({ ...groupStyleDraft, backgroundColor: e.target.value })} /></label>
            <label>Text color<input type="color" value={groupStyleDraft.textColor} onChange={(e) => setGroupStyleDraft({ ...groupStyleDraft, textColor: e.target.value })} /></label>
            <label>Background photo URL<input value={groupStyleDraft.backgroundImage} onChange={(e) => setGroupStyleDraft({ ...groupStyleDraft, backgroundImage: e.target.value })} /></label>
            <label>Upload background photo<input type="file" accept="image/*" onChange={handleGroupImageUpload} /></label>
            <div className="group-editor-actions">
              <button className="primary-btn" onClick={applySelectedGroupBackground}>Apply to selected group</button>
              <button className="ghost-btn" onClick={applyBackgroundToAllGroups}>Apply to all groups</button>
            </div>
          </div>
          <ul className="simple-list">
            {groups.map((group) => (
              <li key={group.id} style={{ background: group.backgroundImage ? 'linear-gradient(rgba(0,0,0,0.18), rgba(0,0,0,0.18)), url(' + group.backgroundImage + ') center/cover no-repeat' : group.backgroundColor || '#ebf0e7', color: group.textColor || '#111111' }}>{group.name}</li>
            ))}
          </ul>
        </section>

        <section className="admin-card wide-card">
          <h3>Products</h3>
          <div className="product-form-grid">
            <input placeholder="Product name" value={draftProduct.name} onChange={(e) => setDraftProduct({ ...draftProduct, name: e.target.value })} />
            <select value={draftProduct.groupId} onChange={(e) => setDraftProduct({ ...draftProduct, groupId: e.target.value })}>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
            <input type="number" min="0" step="0.01" placeholder="Price" value={draftProduct.price} onChange={(e) => setDraftProduct({ ...draftProduct, price: Number(e.target.value) })} />
            <input placeholder="Emoji (☕)" value={draftProduct.emoji} onChange={(e) => setDraftProduct({ ...draftProduct, emoji: e.target.value })} />
            <input placeholder="Image URL" value={draftProduct.image} onChange={(e) => setDraftProduct({ ...draftProduct, image: e.target.value })} />
            <label>Upload product photo<input type="file" accept="image/*" onChange={handleNewProductImageUpload} /></label>
            <input type="number" min="1" step="1" placeholder="Prep min" value={draftProduct.prepTime} onChange={(e) => setDraftProduct({ ...draftProduct, prepTime: Number(e.target.value) })} />
            <textarea placeholder="Product details" value={draftProduct.details} onChange={(e) => setDraftProduct({ ...draftProduct, details: e.target.value })} />
            <label className="availability-toggle"><input type="checkbox" checked={draftProduct.available} onChange={(e) => setDraftProduct({ ...draftProduct, available: e.target.checked })} /> Available now</label>
          </div>
          <button className="primary-btn" onClick={saveProduct}>Add product</button>

          <div className="product-editor-list">
            {products.map((product) => {
              const draft = productDrafts[product.id] || product;
              return (
                <div key={product.id} className="product-editor-item">
                  <div className="product-mini-art">{draft.image ? <img src={draft.image} alt={draft.name} /> : <span>{draft.emoji || '☕'}</span>}</div>
                  <div className="product-edit-fields">
                    <input value={draft.name} onChange={(e) => updateProduct(product.id, { name: e.target.value })} />
                    <input type="number" value={draft.price} onChange={(e) => updateProduct(product.id, { price: Number(e.target.value) })} />
                    <input type="number" value={draft.prepTime || 5} onChange={(e) => updateProduct(product.id, { prepTime: Number(e.target.value) })} />
                    <input value={draft.image || ''} onChange={(e) => updateProduct(product.id, { image: e.target.value })} placeholder="Image URL" />
                    <label>Upload photo<input type="file" accept="image/*" onChange={(event) => handleProductImageUpload(product.id, event)} /></label>
                    <label className="availability-toggle"><input type="checkbox" checked={draft.available !== false} onChange={(e) => updateProduct(product.id, { available: e.target.checked })} /> Available</label>
                  </div>
                  <div className="product-edit-actions">
                    <button className="primary-btn" onClick={() => saveProductEdits(product.id)}>Save</button>
                    <button className="danger-btn" onClick={() => removeProduct(product.id)}>Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {selectedOrderDetail && (
          <section className="admin-card wide-card">
            <div className="section-title-row">
              <h3>Order details</h3>
              <button className="ghost-btn" onClick={() => setSelectedOrderDetailId(null)}>Close</button>
            </div>
            <div className="order-actions" style={{ justifyContent: 'flex-start', gap: '18px', marginTop: '12px', flexWrap: 'wrap' }}>
              <span><strong>Table:</strong> {selectedOrderDetail.table === 'Walk-in' ? 'Walk-in' : `Table ${selectedOrderDetail.table}`}</span>
              <span><strong>Status:</strong> {selectedOrderDetail.status}</span>
              <span><strong>Total:</strong> {settings.currency}{Number(selectedOrderDetail.total).toFixed(2)}</span>
            </div>
            <ul style={{ marginTop: '16px' }}>
              {selectedOrderDetail.items.map((item) => (
                <li key={`${selectedOrderDetail.id}-${item.id}`}>
                  {item.qty} × {item.name} · {settings.currency}{Number(item.price).toFixed(2)} each
                </li>
              ))}
            </ul>
            <small>Created: {new Date(selectedOrderDetail.createdAt).toLocaleString()}</small>
          </section>
        )}

        <section className="admin-card wide-card">
          <h3>Served orders dashboard</h3>
          {servedOrders.length === 0 ? (
            <div className="empty-state">No served orders yet.</div>
          ) : (
            <div className="orders-list">
              {servedOrders.map((order) => (
                <div key={order.id} className="order-item">
                  <div className="order-item-head">
                    <strong>{order.table === 'Walk-in' ? 'Walk-in' : `Table ${order.table}`}</strong>
                    <span>{formatTimeAgo(order.createdAt)}</span>
                  </div>
                  <ul>
                    {order.items.map((item) => (
                      <li key={`${order.id}-${item.id}`}>{item.qty} × {item.name}</li>
                    ))}
                  </ul>
                  <div className="order-actions">
                    <span>{settings.currency}{Number(order.total).toFixed(2)}</span>
                    <select defaultValue="" onChange={(event) => {
                      const action = event.target.value;
                      if (!action) return;
                      handleOrderAction(order.id, action);
                      event.target.value = '';
                    }}>
                      <option value="">Actions</option>
                      <option value="details">View details</option>
                      <option value="delete">Delete</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="admin-card wide-card">
          <h3>Orders queue</h3>
          {activeQueueOrders.length === 0 ? (
            <div className="empty-state">No active orders yet.</div>
          ) : (
            <div className="orders-list">
              {activeQueueOrders.map((order) => (
                <div key={order.id} className="order-item">
                  <div className="order-item-head">
                    <strong>{order.table === 'Walk-in' ? 'Walk-in' : `Table ${order.table}`}</strong>
                    <span>{formatTimeAgo(order.createdAt)}</span>
                  </div>
                  <ul>
                    {order.items.map((item) => (
                      <li key={`${order.id}-${item.id}`}>{item.qty} × {item.name}</li>
                    ))}
                  </ul>
                  <div className="order-actions">
                    <span>{settings.currency}{Number(order.total).toFixed(2)}</span>
                    <select value={order.status} onChange={(e) => onOrderStatusChange(order.id, e.target.value)}>
                      <option value="New">New</option>
                      <option value="Received">Received</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Ready">Ready</option>
                      <option value="Served">Served</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <select defaultValue="" onChange={(event) => {
                      const action = event.target.value;
                      if (!action) return;
                      handleOrderAction(order.id, action);
                      event.target.value = '';
                    }}>
                      <option value="">Actions</option>
                      <option value="details">View details</option>
                      <option value="delete">Delete</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="admin-card wide-card">
          <h3>Reviews</h3>
          {feedback.length === 0 ? (
            <div className="empty-state">No customer review yet.</div>
          ) : (
            <div className="review-list admin-review-list">
              {feedback.slice().reverse().map((entry) => (
                <div key={entry.id} className="review-item">
                  <div className="review-head">
                    <strong>{entry.table === 'Walk-in' ? 'Guest' : `Table ${entry.table}`}</strong>
                    <span>{'★'.repeat(entry.rating)}{'☆'.repeat(5 - entry.rating)}</span>
                  </div>
                  <p>{entry.comment}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function App() {
  const [settings, setSettings] = useState(() => {
    const saved = readStorage(STORAGE_KEYS.settings, defaultSettings);
    return { ...defaultSettings, ...saved, wifiRestrictionEnabled: false };
  });
  const [groups, setGroups] = useState(() => readStorage(STORAGE_KEYS.groups, baseGroups));
  const [products, setProducts] = useState(() => readStorage(STORAGE_KEYS.products, baseProducts.map(([name, groupId, price, emoji, prepTime, details], index) => ({
    id: `p-${index + 1}`,
    name,
    groupId,
    price,
    emoji,
    image: '',
    prepTime,
    details,
  }))));
  const [orders, setOrders] = useState(() => readStorage(STORAGE_KEYS.orders, []));
  const [feedback, setFeedback] = useState(() => readStorage(STORAGE_KEYS.feedback, []));
  const [isAdmin, setIsAdmin] = useState(false);
  const [authError, setAuthError] = useState('');
  const [currentView, setCurrentView] = useState('customer');
  const [isWaiter, setIsWaiter] = useState(false);
  const [activeWaiter, setActiveWaiter] = useState(null);
  const [backendReady, setBackendReady] = useState(false);
  const [networkAllowed, setNetworkAllowed] = useState(null);

  useEffect(() => {
    let mounted = true;

    checkNetworkAccess()
      .then((access) => {
        if (mounted) setNetworkAllowed(access.allowed === true);
      })
      .catch(() => {
        if (mounted) setNetworkAllowed(true);
      });

    fetchSharedData()
      .then((data) => {
        if (!mounted) return;

        if (data?.settings) setSettings({ ...defaultSettings, ...data.settings, wifiRestrictionEnabled: false });
        if (data?.groups) setGroups(data.groups);
        if (data?.products) setProducts(data.products);
        if (data?.orders) setOrders(data.orders.map(normalizeOrder));
        if (data?.feedback) setFeedback(data.feedback);
        setBackendReady(true);
      })
      .catch(() => {
        if (!mounted) return;
        setBackendReady(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!backendReady) return undefined;

    const refreshOrders = () => {
      fetchSharedData()
        .then((data) => {
          if (data?.orders) setOrders(data.orders.map(normalizeOrder));
        })
        .catch(() => {});
    };

    const intervalId = window.setInterval(refreshOrders, 5000);
    return () => window.clearInterval(intervalId);
  }, [backendReady]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.settings, settings);
  }, [settings]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.groups, groups);
  }, [groups]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.products, products);
  }, [products]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.orders, orders);
  }, [orders]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.feedback, feedback);
  }, [feedback]);

  useEffect(() => {
    if (!backendReady) return;

    saveSharedData({ settings, groups, products, orders, feedback }).catch(() => {
      // fallback silently if backend is unavailable
    });
  }, [settings, groups, products, orders, feedback, backendReady]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const nextView = hash === 'admin' || hash === 'waiter' ? hash : 'customer';
      setCurrentView(nextView);
      setAuthError('');
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const placeOrder = (order) => {
    setOrders((current) => [...current, normalizeOrder(order)]);
  };

  const submitFeedback = (entry) => {
    setFeedback((current) => [...current, { ...entry, id: makeId('review') }]);
  };

  const unlockAdmin = (code) => {
    if (String(code) === ADMIN_FULL_ACCESS_CODE || String(code) === String(settings.adminPassword || defaultSettings.adminPassword)) {
      setIsAdmin(true);
      setCurrentView('admin');
      window.location.hash = '#admin';
      setAuthError('');
      return;
    }
    setAuthError('Incorrect admin code.');
  };

  const unlockWaiter = (code, waiter) => {
    if (waiter && String(code) === String(waiter.password || DEFAULT_WAITER_PASSWORD)) {
      setIsWaiter(true);
      setActiveWaiter(waiter);
      setCurrentView('waiter');
      setAuthError('');
      return;
    }
    setAuthError('Incorrect waiter password.');
  };

  const changeAdminPassword = (password) => {
    setSettings((current) => ({ ...current, adminPassword: password }));
    setAuthError('');
  };

  const changeOrderStatus = (orderId, status) => {
    setOrders((current) => current.map((order) => (order.id === orderId ? normalizeOrder({ ...order, status }) : normalizeOrder(order))));
  };

  const wifiWarningMessage = 'This ordering page works only while connected to the coffee shop Wi-Fi.';
  const isStaffView = currentView === 'admin' || currentView === 'waiter';
  const wifiRestricted = settings.wifiRestrictionEnabled === true;

  if (wifiRestricted && networkAllowed === false && !isStaffView) {
    return (
      <div className="auth-wrap">
        <div className="auth-card network-blocked-card">
          <h2>Welcome to {settings.name}</h2>
          <p>{wifiWarningMessage}</p>
          <button onClick={() => window.location.reload()}>Check connection again</button>
        </div>
      </div>
    );
  }

  return currentView === 'admin' && !isAdmin ? (
    <AdminAuth onUnlock={unlockAdmin} onChangePassword={changeAdminPassword} error={authError} />
  ) : currentView === 'waiter' && !isWaiter ? (
    <WaiterAuth waiters={settings.waiters || [{ id: 'waiter-1', name: settings.waiterName || defaultSettings.waiterName, password: settings.waiterPassword || DEFAULT_WAITER_PASSWORD }]} onUnlock={unlockWaiter} error={authError} />
  ) : currentView === 'admin' ? (
    <AdminView
      settings={settings}
      groups={groups}
      products={products}
      orders={orders}
      feedback={feedback}
      onSettingsChange={setSettings}
      onGroupsChange={setGroups}
      onProductsChange={setProducts}
      onOrderStatusChange={changeOrderStatus}
      onOrdersChange={setOrders}
      onSubmitFeedback={submitFeedback}
      warningMessage={wifiRestricted && networkAllowed === false ? wifiWarningMessage : ''}
    />
  ) : currentView === 'waiter' ? (
    <WaiterView waiterName={activeWaiter?.name || settings.waiterName || defaultSettings.waiterName} settings={settings} orders={orders} onOrderStatusChange={changeOrderStatus} warningMessage={wifiRestricted && networkAllowed === false ? wifiWarningMessage : ''} />
  ) : (
    <CustomerView
      settings={settings}
      groups={groups}
      products={products}
      orders={orders}
      feedback={feedback}
      onPlaceOrder={placeOrder}
      onSubmitFeedback={submitFeedback}
    />
  );
}

const styles = `
  * { box-sizing: border-box; }
  html, body, #root { margin: 0; min-height: 100%; font-family: Inter, Arial, sans-serif; }
  body { background: #f4efe8; }
  a { color: inherit; text-decoration: none; }
  button, input, textarea, select { font: inherit; }
  .page-shell { min-height: 100vh; color: #182a1b; }
  .hero { padding: 22px 28px; }
  .hero-inner { max-width: 1220px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
  .brand-wrap { display: flex; align-items: center; gap: 16px; }
  .brand-logo {
    width: 68px; height: 68px; border-radius: 18px; display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.28); color: white; font-weight: 800; font-size: 1.1rem;
  }
  .brand-logo img { width: 100%; height: 100%; object-fit: cover; border-radius: 18px; }
  .text-brand { background: rgba(255,255,255,0.2); }
  .brand-wrap h1 { margin: 0; font-size: clamp(2rem, 3vw, 3rem); }
  .brand-wrap p { margin: 6px 0 0; opacity: 0.8; }
  .admin-toggle, .ghost-btn, .primary-btn, .danger-btn, .place-order, .submit-review {
    border: none; border-radius: 12px; padding: 0.85rem 1.2rem; cursor: pointer; font-weight: 700; transition: 0.2s ease;
  }
  .admin-toggle, .primary-btn, .place-order, .submit-review { background: #1c2a1d; color: white; }
  .header-actions { display: flex; gap: 10px; align-items: center; }
  .waiter-toggle { border: none; border-radius: 12px; padding: 0.85rem 1.2rem; cursor: pointer; font-weight: 700; background: #e6c36a; color: #2d2410; }
  .admin-toggle:hover, .primary-btn:hover, .place-order:hover, .submit-review:hover { filter: brightness(1.05); }
  .ghost-btn { background: rgba(255,255,255,0.18); color: #1a1a1a; }
  .customer-main { max-width: 1220px; margin: 24px auto; padding: 0 18px 40px; display: grid; grid-template-columns: 320px minmax(0, 1fr); gap: 24px; }
  .cart-panel, .menu-panel, .admin-card, .auth-card { background: rgba(255,255,255,0.72); backdrop-filter: blur(8px); border: 1px solid rgba(24,42,27,0.08); border-radius: 24px; box-shadow: 0 10px 30px rgba(20,40,25,0.06); }
  .cart-panel { position: sticky; top: 18px; align-self: start; padding: 20px; }
  .panel-head, .section-title-row, .order-item-head, .review-head { display: flex; justify-content: space-between; align-items: center; }
  .panel-head h3, .section-title-row h3 { margin: 0; }
  .empty-state { padding: 20px 0; color: rgba(24,42,27,0.7); }
  .cart-items { display: flex; flex-direction: column; gap: 12px; margin-top: 18px; }
  .cart-item { display: flex; justify-content: space-between; gap: 10px; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(24,42,27,0.08); }
  .cart-item strong { display: block; }
  .cart-item small { color: rgba(24,42,27,0.7); }
  .qty-box { display: flex; align-items: center; gap: 10px; }
  .qty-box button { width: 28px; height: 28px; border: none; border-radius: 10px; background: #e6eedf; cursor: pointer; }
  .cart-total { display: flex; justify-content: space-between; padding: 14px 0; border-top: 1px solid rgba(24,42,27,0.08); }
  .place-order { width: 100%; margin-top: 16px; }
  .scan-notice { margin-bottom: 16px; padding: 11px 12px; border-radius: 12px; background: #f5e7c8; color: #664d1e; font-size: 0.85rem; font-weight: 700; }
  .order-status-panel { margin-top: 22px; padding-top: 18px; border-top: 1px solid rgba(24,42,27,0.1); }
  .customer-order-list { display: grid; gap: 10px; margin-top: 12px; }
  .customer-order-status { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px; border-radius: 12px; background: rgba(126,168,107,0.1); }
  .customer-order-status strong, .customer-order-status small { display: block; }
  .customer-order-status small { margin-top: 4px; color: rgba(24,42,27,0.65); }
  .status-badge { padding: 0.45rem 0.6rem; border-radius: 999px; font-size: 0.75rem; font-weight: 800; text-align: center; }
  .status-new { background: #eee8d3; color: #6b5311; }
  .status-preparing { background: #dbe8f4; color: #24516f; }
  .status-ready { background: #dcefdc; color: #21602b; }
  .status-served { background: #e6e6e6; color: #4d4d4d; }
  .instagram-link { display: flex; align-items: center; justify-content: center; gap: 9px; margin-top: 18px; padding: 11px 12px; border-radius: 12px; color: #8b3158; background: #f5e3eb; font-weight: 800; transition: 0.2s ease; }
  .instagram-link:hover { background: #efd0de; transform: translateY(-1px); }
  .owner-instagram-link { color: #36506d; background: #e2ebf5; }
  .owner-instagram-link:hover { background: #d2e1f0; }
  .instagram-icon { width: 22px; height: 22px; }
  .social-link { display: flex; align-items: center; justify-content: center; gap: 9px; margin-top: 10px; padding: 11px 12px; border-radius: 12px; font-weight: 800; transition: 0.2s ease; }
  .location-link { color: #69552c; background: #f5edcf; }
  .location-link:hover { background: #eee2b5; transform: translateY(-1px); }
  .facebook-link { color: #234f91; background: #e1eafa; }
  .facebook-link:hover { background: #d0ddf3; transform: translateY(-1px); }
  .social-icon, .facebook-icon { display: grid; width: 22px; height: 22px; place-items: center; border-radius: 50%; font-size: 1.15rem; }
  .facebook-icon { color: white; background: #1877f2; font-family: Arial, sans-serif; }
  .menu-panel { padding: 18px; }
  .search-row input, .admin-card input, .admin-card textarea, .admin-card select { width: 100%; border: 1px solid rgba(24,42,27,0.14); border-radius: 12px; padding: 0.8rem 0.9rem; background: rgba(255,255,255,0.72); }
  .search-row input { font-size: 1rem; }
  .chip-row { display: flex; flex-wrap: wrap; gap: 8px; margin: 18px 0 20px; }
  .chip { background: rgba(130,160,117,0.12); color: #273f2b; border: none; border-radius: 999px; padding: 0.6rem 0.9rem; cursor: pointer; font-weight: 600; }
  .chip.active { background: #7ea86b; color: white; }
  .grouped-product-layout { display: grid; gap: 20px; }
  .grouped-section { padding: 18px; border-radius: 20px; border: 1px solid rgba(24,42,27,0.08); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.12); }
  .group-section-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 18px; }
  .group-section-header h3 { margin: 0; font-size: 1.5rem; }
  .group-section-header span { font-size: 0.8rem; opacity: 0.8; }
  .product-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px; }
  .product-card { overflow: hidden; border: 1px solid rgba(24,42,27,0.08); border-radius: 18px; background: rgba(255,255,255,0.7); }
  .art { height: 150px; display: flex; align-items: center; justify-content: center; font-size: 4rem; }
  .art img { width: 100%; height: 100%; object-fit: cover; }
  .card-body { padding: 16px; }
  .card-head { display: flex; justify-content: space-between; gap: 12px; align-items: center; }
  .card-head h4 { margin: 0; font-size: 1.08rem; }
  .card-body p { color: rgba(24,42,27,0.7); margin: 8px 0; min-height: 42px; }
  .meta-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
  .meta-row button { border: none; background: #1c2a1d; color: white; padding: 0.65rem 0.9rem; border-radius: 10px; cursor: pointer; }
  .meta-row button:disabled, .place-order:disabled { cursor: not-allowed; opacity: 0.45; }
  .feedback-section { margin-top: 30px; }
  .rating-box { margin-top: 14px; background: rgba(24,42,27,0.03); border: 1px solid rgba(24,42,27,0.08); border-radius: 16px; padding: 16px; }
  .stars { display: flex; gap: 8px; margin-bottom: 12px; }
  .star { background: transparent; border: none; font-size: 1.7rem; color: #d0c9b7; cursor: pointer; }
  .star.active { color: #f4bf4f; }
  .rating-box textarea { min-height: 110px; resize: vertical; }
  .submit-review { margin-top: 12px; }
  .review-list { display: grid; gap: 12px; margin-top: 16px; }
  .review-item { background: rgba(255,255,255,0.6); border: 1px solid rgba(24,42,27,0.08); border-radius: 14px; padding: 12px 14px; }
  .review-item p { margin: 10px 0 0; color: rgba(24,42,27,0.72); }
  .bottom-bar { max-width: 1220px; margin: 0 auto 30px; padding: 0 18px; display: flex; justify-content: center; gap: 12px; align-items: center; }
  .toast {
    position: fixed; right: 22px; bottom: 22px; background: #1b2d1d; color: white; border-radius: 12px; padding: 0.8rem 1rem; box-shadow: 0 20px 30px rgba(0,0,0,0.18);
  }
  .auth-wrap { min-height: 100vh; display: grid; place-items: center; padding: 18px; background: linear-gradient(135deg, #edf4e6, #dfead4); }
  .auth-card { width: min(420px, 100%); padding: 24px; }
  .auth-card h2 { margin-top: 0; }
  .auth-card input { margin-top: 12px; }
  .auth-card button { margin-top: 16px; width: 100%; }
  .error-text { display: block; margin-top: 12px; color: #a72d2d; }
  .network-blocked-card { text-align: center; }
  .admin-shell { min-height: 100vh; padding: 20px 18px 40px; background: #f5f2eb; }
  .admin-topbar { max-width: 1400px; margin: 0 auto 18px; display: flex; justify-content: space-between; align-items: center; }
  .admin-topbar h2 { margin: 0; }
  .admin-grid { max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 20px; }
  .admin-card { padding: 18px; }
  .wide-card { grid-column: span 2; }
  .dashboard-card { background: #1c2a1d; color: white; }
  .dashboard-card small { color: rgba(255,255,255,0.7); }
  .dashboard-card .ghost-btn { color: white; background: rgba(255,255,255,0.14); }
  .stats-periods { display: flex; gap: 8px; margin: 18px 0 14px; }
  .dashboard-card .chip { color: white; background: rgba(255,255,255,0.12); }
  .dashboard-card .chip.active { background: #7ea86b; }
  .stats-date-picker { display: flex; align-items: center; gap: 8px; margin-left: auto; color: rgba(255,255,255,0.75); font-size: 0.85rem; }
  .stats-date-picker input { width: 150px; padding: 0.58rem 0.65rem; border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; color: white; background: rgba(255,255,255,0.12); }
  .stats-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
  .stat-box { min-height: 92px; padding: 14px; border: 1px solid rgba(255,255,255,0.14); border-radius: 14px; background: rgba(255,255,255,0.08); }
  .stat-box strong { display: block; margin-top: 10px; font-size: 1.25rem; overflow-wrap: anywhere; }
  .dashboard-delete-btn { margin-top: 14px; }
  .waiter-summary { max-width: 1400px; margin: 0 auto 20px; display: grid; grid-template-columns: repeat(2, minmax(0, 220px)); gap: 12px; }
  .waiter-summary .stat-box { background: #1c2a1d; color: white; }
  .waiter-summary .stat-box small { color: rgba(255,255,255,0.7); }
  .waiter-orders-card { max-width: 1400px; margin: 0 auto; }
  .waiter-order-buttons { display: flex; gap: 8px; }
  .waiter-order-buttons button { padding: 0.6rem 0.8rem; }
  .settings-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; margin-top: 14px; }
  .settings-grid label { display: flex; flex-direction: column; gap: 8px; font-size: 0.9rem; color: rgba(24,42,27,0.85); }
  .field-help { display: block; margin-top: -6px; color: rgba(24,42,27,0.62); font-size: 0.8rem; }
  .switch-label { display: flex; align-items: center; gap: 8px; margin-top: 8px; font-weight: 700; }
  .switch-label input { width: auto; }
  .owner-code-row { display: flex; align-items: end; gap: 8px; }
  .owner-code-row input { flex: 1; }
  .owner-code-row button { white-space: nowrap; }
  .form-message { margin: 10px 0 12px; padding: 10px 12px; border-radius: 10px; background: #edf7ec; color: #214c2d; font-size: 0.9rem; }
  .field-row { display: flex; gap: 10px; margin-bottom: 12px; }
  .field-row input { flex: 1; }
  .waiter-management { margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(24,42,27,0.1); }
  .waiter-management h4 { margin: 0 0 12px; }
  .waiter-list { display: grid; gap: 8px; }
  .waiter-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto; gap: 8px; align-items: center; }
  .waiter-row button { padding: 0.65rem 0.8rem; }
  .simple-list { list-style: none; padding: 0; margin: 14px 0 0; display: flex; flex-wrap: wrap; gap: 8px; }
  .simple-list li { padding: 0.55rem 0.8rem; border-radius: 999px; background: #ebf0e7; }
  .group-editor { display: grid; gap: 12px; margin-top: 14px; }
  .group-editor-actions { display: flex; gap: 10px; flex-wrap: wrap; }
  .product-form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-top: 14px; }
  .product-form-grid textarea { grid-column: 1 / -1; min-height: 90px; }
  .qr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 14px; margin-top: 14px; }
  .qr-box { display: grid; gap: 8px; align-content: start; padding: 10px; border: 1px solid rgba(24,42,27,0.1); border-radius: 14px; background: rgba(255,255,255,0.5); text-align: center; }
  .qr-box img { width: 140px; height: 140px; margin: 0 auto; }
  .qr-box span { font-weight: 800; }
  .qr-box input { min-width: 0; font-size: 0.75rem; }
  .custom-qr-editor { margin-top: 20px; padding-top: 18px; border-top: 1px solid rgba(24,42,27,0.1); }
  .custom-qr-editor h4 { margin: 0 0 12px; }
  .product-editor-list { display: flex; flex-direction: column; gap: 12px; margin-top: 18px; }
  .product-editor-item { display: grid; grid-template-columns: 74px minmax(0, 1fr) 100px; gap: 12px; align-items: center; border: 1px solid rgba(24,42,27,0.08); border-radius: 14px; padding: 10px; background: rgba(255,255,255,0.45); }
  .product-mini-art { width: 74px; height: 74px; display: grid; place-items: center; border-radius: 12px; background: linear-gradient(135deg, #e6efdd, #dfe8cd); font-size: 2rem; overflow: hidden; }
  .product-mini-art img { width: 100%; height: 100%; object-fit: cover; }
  .product-edit-fields { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px; }
  .availability-toggle { display: flex; align-items: center; gap: 7px; font-size: 0.85rem; font-weight: 700; }
  .availability-toggle input { width: auto; }
  .danger-btn { background: #a74444; color: white; }
  .qr-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 12px; margin-top: 14px; }
  .qr-box { background: rgba(255,255,255,0.7); border: 1px solid rgba(24,42,27,0.08); border-radius: 12px; padding: 8px; text-align: center; }
  .qr-box img { width: 100%; display: block; }
  .orders-list { display: grid; gap: 12px; }
  .order-item { background: rgba(255,255,255,0.6); border: 1px solid rgba(24,42,27,0.08); border-radius: 14px; padding: 12px; }
  .order-item ul { margin: 12px 0; padding-left: 18px; }
  .order-actions { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
  .order-actions select { max-width: 150px; }
  @media (max-width: 920px) {
    .customer-main { grid-template-columns: 1fr; }
    .cart-panel { position: static; }
    .wide-card { grid-column: span 1; }
    .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .stats-date-picker { width: 100%; margin-left: 0; }
    .waiter-summary { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 560px) {
    .hero-inner, .admin-topbar { align-items: flex-start; flex-direction: column; }
    .header-actions { width: 100%; }
    .header-actions button { flex: 1; }
    .waiter-summary { grid-template-columns: 1fr; }
    .order-actions { align-items: flex-start; flex-direction: column; }
    .field-row, .waiter-row { display: grid; grid-template-columns: 1fr; }
  }
`;
