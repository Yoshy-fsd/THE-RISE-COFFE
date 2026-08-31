import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, 'data.json');

const defaultData = {
  settings: {
    name: 'Tabac & Bloom',
    tagline: 'Coffee, brewed with intent.',
    currency: '$',
    accent: '#7ea86b',
    background: '#e9f0e1',
    textColor: '#1f2f20',
    instagram: '@tabacandbloom',
    logoText: 'T&B',
    logoUrl: '',
    allowedWifiNetwork: '',
    wifiRestrictionEnabled: false,
  },
  groups: [
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
  ],
  products: [
    { id: 'p-1', name: 'Espresso', groupId: 'g-classic-coffee', price: 14, emoji: '☕', image: '', details: 'Bold and aromatic', prepTime: 3 },
    { id: 'p-2', name: 'Latté', groupId: 'g-classic-coffee', price: 18, emoji: '🥛', image: '', details: 'Smooth creamy finish', prepTime: 5 },
    { id: 'p-3', name: 'Capuccino', groupId: 'g-classic-coffee', price: 19, emoji: '☕', image: '', details: 'Classic espresso + milk foam', prepTime: 5 },
    { id: 'p-4', name: 'Americano', groupId: 'g-classic-coffee', price: 16, emoji: '☕', image: '', details: 'Light and refreshing', prepTime: 4 },
    { id: 'p-5', name: 'Machhiato', groupId: 'g-classic-coffee', price: 17, emoji: '☕', image: '', details: 'Balanced espresso', prepTime: 4 },
    { id: 'p-6', name: 'Mocca', groupId: 'g-classic-coffee', price: 19, emoji: '☕', image: '', details: 'Chocolate espresso blend', prepTime: 5 },
    { id: 'p-7', name: 'Matcha Latte', groupId: 'g-classic-coffee', price: 22, emoji: '🍵', image: '', details: 'Earthy and mellow', prepTime: 6 },
    { id: 'p-8', name: 'Classicc Thé', groupId: 'g-the', price: 12, emoji: '🍃', image: '', details: 'Fresh infusion', prepTime: 4 },
    { id: 'p-9', name: 'Thé + Fruit secs', groupId: 'g-the', price: 18, emoji: '🍋', image: '', details: 'Warm and fragrant', prepTime: 5 },
    { id: 'p-10', name: 'Ice Thé melon', groupId: 'g-ice-the', price: 20, emoji: '🍉', image: '', details: 'Cool and juicy', prepTime: 5 },
    { id: 'p-11', name: 'Ice Thé Mango', groupId: 'g-ice-the', price: 22, emoji: '🥭', image: '', details: 'Tropical and sweet', prepTime: 5 },
    { id: 'p-12', name: 'Ice Bubble Thé', groupId: 'g-ice-the', price: 24, emoji: '🫧', image: '', details: 'Tea with pearls', prepTime: 5 },
    { id: 'p-13', name: 'Hot Choclact', groupId: 'g-hot-drinks', price: 20, emoji: '🍫', image: '', details: 'Warm comfort drink', prepTime: 6 },
    { id: 'p-14', name: 'Hot Oreo', groupId: 'g-hot-drinks', price: 22, emoji: '🍪', image: '', details: 'Oreo chocolate delight', prepTime: 6 },
    { id: 'p-15', name: 'Hot Pistachio', groupId: 'g-hot-drinks', price: 23, emoji: '🌰', image: '', details: 'Nutty and creamy', prepTime: 6 },
    { id: 'p-16', name: 'Ice Americano', groupId: 'g-ice-coffee', price: 18, emoji: '🧊', image: '', details: 'Iced espresso', prepTime: 5 },
    { id: 'p-17', name: 'Ice Latte', groupId: 'g-ice-coffee', price: 21, emoji: '🧊', image: '', details: 'Refreshing milk coffee', prepTime: 5 },
    { id: 'p-18', name: 'Ice Caramel Machhiato', groupId: 'g-ice-coffee', price: 24, emoji: '🥤', image: '', details: 'Sweet caramel note', prepTime: 6 },
    { id: 'p-19', name: 'Ice Matcha latte', groupId: 'g-ice-matcha', price: 25, emoji: '🍵', image: '', details: 'Green matcha smoothness', prepTime: 6 },
    { id: 'p-20', name: 'Ice Matcha Blueberry', groupId: 'g-ice-matcha', price: 27, emoji: '🫐', image: '', details: 'Berry green tea', prepTime: 6 },
    { id: 'p-21', name: 'Frappucino Classic', groupId: 'g-frappucino', price: 28, emoji: '🍦', image: '', details: 'Creamy frozen classic', prepTime: 7 },
    { id: 'p-22', name: 'Frappucino Caramel', groupId: 'g-frappucino', price: 30, emoji: '🥨', image: '', details: 'Sweet caramel iced blend', prepTime: 7 },
    { id: 'p-23', name: 'Frappucino Nutella', groupId: 'g-frappucino', price: 32, emoji: '🍫', image: '', details: 'Hazelnut and cocoa', prepTime: 7 },
    { id: 'p-24', name: 'Milkshakes Caramel', groupId: 'g-milkshakes', price: 29, emoji: '🍨', image: '', details: 'Smooth dessert shake', prepTime: 6 },
    { id: 'p-25', name: 'Milkshakes Nutella', groupId: 'g-milkshakes', price: 31, emoji: '🍫', image: '', details: 'Creamy nutella shake', prepTime: 6 },
    { id: 'p-26', name: 'Milkshakes Strawberry', groupId: 'g-milkshakes', price: 30, emoji: '🍓', image: '', details: 'Fresh berry sweetness', prepTime: 6 },
    { id: 'p-27', name: 'Virgin Mojito', groupId: 'g-mojito', price: 24, emoji: '🍋', image: '', details: 'Fresh mint and lime', prepTime: 5 },
    { id: 'p-28', name: 'Red Mojito', groupId: 'g-mojito', price: 26, emoji: '🍓', image: '', details: 'Berry citrus sparkle', prepTime: 5 },
    { id: 'p-29', name: 'Blue Mojito', groupId: 'g-mojito', price: 27, emoji: '🫐', image: '', details: 'Cool blue berry blend', prepTime: 5 },
    { id: 'p-30', name: 'Bannane', groupId: 'g-smoothies', price: 25, emoji: '🍌', image: '', details: 'Banana comfort', prepTime: 6 },
    { id: 'p-31', name: 'Strawberry', groupId: 'g-smoothies', price: 26, emoji: '🍓', image: '', details: 'Fresh fruit blend', prepTime: 6 },
    { id: 'p-32', name: 'Mango', groupId: 'g-smoothies', price: 27, emoji: '🥭', image: '', details: 'Tropical feel', prepTime: 6 },
    { id: 'p-33', name: 'Avocado', groupId: 'g-smoothies', price: 28, emoji: '🥑', image: '', details: 'Creamy and rich', prepTime: 6 },
    { id: 'p-34', name: 'Bannane + Oats + Honey', groupId: 'g-healthy', price: 29, emoji: '🌾', image: '', details: 'Healthy energy boost', prepTime: 7 },
    { id: 'p-35', name: 'Apple + Spinach + Lemond', groupId: 'g-healthy', price: 30, emoji: '🍏', image: '', details: 'Fresh green blend', prepTime: 7 },
    { id: 'p-36', name: 'Avocado + Milk + Honey', groupId: 'g-healthy', price: 31, emoji: '🥑', image: '', details: 'Smooth and nourishing', prepTime: 7 },
    { id: 'p-37', name: 'Chocolact', groupId: 'g-crepes-sucree', price: 28, emoji: '🍫', image: '', details: 'Chocolate-filled classic', prepTime: 8 },
    { id: 'p-38', name: 'Nutella', groupId: 'g-crepes-sucree', price: 30, emoji: '🍫', image: '', details: 'Sweet hazelnut favorite', prepTime: 8 },
    { id: 'p-39', name: 'Nutella + Bannane', groupId: 'g-crepes-sucree', price: 32, emoji: '🍌', image: '', details: 'Banana-rich dessert', prepTime: 8 },
    { id: 'p-40', name: 'Fromage', groupId: 'g-crepes-salee', price: 24, emoji: '🧀', image: '', details: 'Savory cheese filling', prepTime: 8 },
    { id: 'p-41', name: 'Fromage + Jombon', groupId: 'g-crepes-salee', price: 30, emoji: '🥪', image: '', details: 'Cheese and ham', prepTime: 8 },
    { id: 'p-42', name: 'Honey + Butter', groupId: 'g-pancakes', price: 22, emoji: '🍯', image: '', details: 'Golden sweet stack', prepTime: 8 },
    { id: 'p-43', name: 'Nutella', groupId: 'g-pancakes', price: 28, emoji: '🍫', image: '', details: 'Dessert pancake', prepTime: 8 },
    { id: 'p-44', name: 'OREO', groupId: 'g-pancakes', price: 29, emoji: '🍪', image: '', details: 'Cookie crunch', prepTime: 8 },
    { id: 'p-45', name: 'Chocolact blanc + Noir + pipetes de chocolact', groupId: 'g-gauffres', price: 32, emoji: '🍫', image: '', details: 'Triple chocolate waffle', prepTime: 9 },
    { id: 'p-46', name: 'Nutella + Chocolact Blanc', groupId: 'g-gauffres', price: 34, emoji: '🍫', image: '', details: 'Classic white and dark chocolate', prepTime: 9 },
  ],
  orders: [],
  feedback: [],
};

function ensureData() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify(defaultData, null, 2));
  }
}

function normalizeStoredOrders(orders) {
  if (!Array.isArray(orders)) return [];
  return orders.map((order) => ({
    ...order,
    table: order?.table === 'Walk-in' || order?.table == null ? order?.table : String(order.table),
    status: ['New', 'Received', 'Preparing', 'Ready', 'Served', 'Cancelled'].includes(String(order?.status || 'New')) ? String(order.status) : 'New',
  }));
}

function readData() {
  ensureData();
  try {
    const parsed = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    const sanitized = {
      ...parsed,
      orders: normalizeStoredOrders(parsed.orders),
      settings: {
        ...(parsed.settings || {}),
        wifiRestrictionEnabled: false,
      },
    };
    return sanitized;
  } catch {
    return JSON.parse(JSON.stringify({ ...defaultData, settings: { ...defaultData.settings, wifiRestrictionEnabled: false }, orders: [] }));
  }
}

function writeData(data) {
  const cleaned = {
    ...data,
    orders: normalizeStoredOrders(data?.orders),
    settings: {
      ...(data?.settings || {}),
      wifiRestrictionEnabled: false,
    },
  };
  fs.writeFileSync(dataFile, JSON.stringify(cleaned, null, 2));
}

const app = express();
const PORT = process.env.PORT || 3001;
const clientDist = path.join(__dirname, '..', 'dist');

function getLocalIpv4Addresses() {
  return Object.values(os.networkInterfaces())
    .flat()
    .filter((entry) => entry && entry.family === 'IPv4' && !entry.internal)
    .map((entry) => entry.address);
}

function isOnCoffeeWifi(req) {
  const data = readData();
  if (data.settings?.wifiRestrictionEnabled === false) return true;
  const remoteAddress = (req.socket.remoteAddress || '').replace(/^::ffff:/, '');
  if (remoteAddress === '127.0.0.1' || remoteAddress === '::1') return true;
  const clientParts = remoteAddress.split('.');
  const configuredNetwork = String(readData().settings?.allowedWifiNetwork || '').trim().replace(/\/24$/, '').replace(/\.0$/, '');
  if (configuredNetwork) return clientParts.length === 4 && clientParts.slice(0, 3).join('.') === configuredNetwork;
  return clientParts.length === 4 && getLocalIpv4Addresses().some((address) => {
    const hostParts = address.split('.');
    return hostParts.length === 4 && hostParts.slice(0, 3).join('.') === clientParts.slice(0, 3).join('.');
  });
}

function requireCoffeeWifi(req, res, next) {
  const data = readData();
  if (data.settings?.wifiRestrictionEnabled === false) {
    return next();
  }
  if (!isOnCoffeeWifi(req)) {
    return res.status(403).json({ error: 'Connect to the coffee shop Wi-Fi to use this website.' });
  }
  return next();
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(clientDist));

app.get('/api/access', (req, res) => {
  const addresses = getLocalIpv4Addresses();
  const data = readData();
  res.json({
    allowed: isOnCoffeeWifi(req),
    restrictionEnabled: data.settings?.wifiRestrictionEnabled !== false,
    configuredNetwork: data.settings?.allowedWifiNetwork || '',
    detectedNetworks: addresses.map((address) => address.split('.').slice(0, 3).join('.')),
  });
});

app.get('/api/data', requireCoffeeWifi, (req, res) => {
  res.json(readData());
});

app.post('/api/data', requireCoffeeWifi, (req, res) => {
  const body = req.body || {};
  const current = readData();
  const next = { ...current, ...body };
  writeData(next);
  res.json(next);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Shared coffee menu backend running on http://0.0.0.0:${PORT}`);
});
