import React, { useState, useEffect, useMemo } from "react";

/* ---------------------------------------------------------
   SEED DATA — the real menu. Prices start at 0 on purpose;
   set them in the admin app. Admin edits are read from shared
   storage; this seed only fires the very first time storage
   is empty.
--------------------------------------------------------- */
const SEED_GROUPS = [
  { id: "g-classic-coffee", name: "Classic Coffees" },
  { id: "g-the", name: "Thé" },
  { id: "g-ice-the", name: "Ice Thé" },
  { id: "g-hot-drinks", name: "Hot Drinks" },
  { id: "g-ice-coffee", name: "Ice Coffees" },
  { id: "g-ice-matcha", name: "Ice Matcha" },
  { id: "g-frappucino", name: "Frappucino" },
  { id: "g-milkshakes", name: "Milkshakes" },
  { id: "g-mojito", name: "Mojito" },
  { id: "g-smoothies", name: "Smoothies" },
  { id: "g-healthy", name: "Healthy Blends" },
  { id: "g-crepes-sucree", name: "Crêpes Sucrée" },
  { id: "g-crepes-salee", name: "Crêpes Sallée" },
  { id: "g-pancakes", name: "Pancakes" },
  { id: "g-gauffres", name: "Gauffres" },
];

const SEED_PRODUCTS = [
  // Classic Coffees
  ["Espresso", "g-classic-coffee"],
  ["Latté", "g-classic-coffee"],
  ["Capuccino", "g-classic-coffee"],
  ["Americano", "g-classic-coffee"],
  ["Machhiato", "g-classic-coffee"],
  ["Mocca", "g-classic-coffee"],
  ["Capucin", "g-classic-coffee"],
  ["Matcha Latte", "g-classic-coffee"],
  ["Avocado", "g-classic-coffee"],
  ["Café Turc", "g-classic-coffee"],
  // Thé
  ["Classicc Thé", "g-the"],
  ["Thé + Fruit secs", "g-the"],
  ["Thé + amand", "g-the"],
  ["Thé Infision", "g-the"],
  ["Thé Kyufi", "g-the"],
  // Ice Thé
  ["Classic Ice Thé", "g-ice-the"],
  ["Ice Thé melon", "g-ice-the"],
  ["Ice Thé Fruit de passion", "g-ice-the"],
  ["Ice Thé Blueberry", "g-ice-the"],
  ["Ice Thé Mango", "g-ice-the"],
  ["Ice Bubble Thé", "g-ice-the"],
  // Hot Drinks
  ["Hot Choclact", "g-hot-drinks"],
  ["Hot Choclact Caramel", "g-hot-drinks"],
  ["Hot Choclact Vanille", "g-hot-drinks"],
  ["Hot Choclact Marshmello", "g-hot-drinks"],
  ["Hot Oreo", "g-hot-drinks"],
  ["Hot Pistachio", "g-hot-drinks"],
  ["Hot Spéc", "g-hot-drinks"],
  ["Mixed Hot Choclact", "g-hot-drinks"],
  // Ice Coffees
  ["Ice Americano", "g-ice-coffee"],
  ["Ice Latte", "g-ice-coffee"],
  ["Ice Spanish Latte", "g-ice-coffee"],
  ["Ice Caramel Machhiato", "g-ice-coffee"],
  ["Ice Choclact", "g-ice-coffee"],
  ["Ice special coffe", "g-ice-coffee"],
  ["Ice Mocca", "g-ice-coffee"],
  // Ice Matcha
  ["Ice Matcha latte", "g-ice-matcha"],
  ["Ice Matcha Blueberry", "g-ice-matcha"],
  ["Ice Matcha Strawberry", "g-ice-matcha"],
  ["Ice Matcha Caramel", "g-ice-matcha"],
  ["Ice Matcha Nutella", "g-ice-matcha"],
  ["Ice Matcha Vanille", "g-ice-matcha"],
  ["Ice Matcha Mango", "g-ice-matcha"],
  // Frappucino
  ["Frappucino Classic", "g-frappucino"],
  ["Frappucino Caramel", "g-frappucino"],
  ["Frappucino Vanille", "g-frappucino"],
  ["Frappucino Nutella", "g-frappucino"],
  ["Frappucino chocolact", "g-frappucino"],
  ["Frappucino Oreo", "g-frappucino"],
  ["Frappucino Pistachio", "g-frappucino"],
  ["Frappucino Spec", "g-frappucino"],
  ["Frappucino Strawberry", "g-frappucino"],
  // Milkshakes
  ["Milkshakes Caramel", "g-milkshakes"],
  ["Milkshakes Vanille", "g-milkshakes"],
  ["Milkshakes Bannane", "g-milkshakes"],
  ["Milkshakes Nutella", "g-milkshakes"],
  ["Milkshakes chocolact", "g-milkshakes"],
  ["Milkshakes Oreo", "g-milkshakes"],
  ["Milkshakes Ferrero Rocher", "g-milkshakes"],
  ["Milkshakes Pistachio", "g-milkshakes"],
  ["Milkshakes Spec", "g-milkshakes"],
  ["Milkshakes Strawberry", "g-milkshakes"],
  // Mojito
  ["Virgin Mojito", "g-mojito"],
  ["Red Mojito", "g-mojito"],
  ["Blue Mojito", "g-mojito"],
  ["Blue Ice Mint Mojito", "g-mojito"],
  ["Mojito Fruit de boix", "g-mojito"],
  ["Mojito fruit de passion", "g-mojito"],
  ["Apple Mojito", "g-mojito"],
  ["Pinacolada Mojito", "g-mojito"],
  ["Blueberry Mojito", "g-mojito"],
  ["Mango Mojito", "g-mojito"],
  ["Pasteich Mojito", "g-mojito"],
  ["Coffe Mojito", "g-mojito"],
  ["Candy Mojito", "g-mojito"],
  // Smoothies
  ["Bannane", "g-smoothies"],
  ["Bannane + Dattes", "g-smoothies"],
  ["Bannane + fruit secs", "g-smoothies"],
  ["Bannane + Dattes + fruit secs", "g-smoothies"],
  ["Bannane + Kiwi", "g-smoothies"],
  ["Strawberry", "g-smoothies"],
  ["Strawberry + Lemon", "g-smoothies"],
  ["Strawberry + Bannane", "g-smoothies"],
  ["Lemon Mint", "g-smoothies"],
  ["Lemon + Almond", "g-smoothies"],
  ["Kiwi", "g-smoothies"],
  ["Peach + Mango", "g-smoothies"],
  ["Pinacolda", "g-smoothies"],
  ["Mango", "g-smoothies"],
  ["Avogado", "g-smoothies"],
  ["Cocktail (mélange de fruit de saisons)", "g-smoothies"],
  // Healthy Blends
  ["Bannane + Oats + Honey", "g-healthy"],
  ["Apple + Spinach + Lemond", "g-healthy"],
  ["Avocado + Milk + Honey", "g-healthy"],
  ["Peanut Butter + Bannane", "g-healthy"],
  // Crêpes Sucrée (Cl+T+J)
  ["Chocolact", "g-crepes-sucree"],
  ["Nutella", "g-crepes-sucree"],
  ["Nutella + Bannane", "g-crepes-sucree"],
  ["Nutella + Strawberry", "g-crepes-sucree"],
  ["Nutella + fruit séc", "g-crepes-sucree"],
  ["Nutella + OREO", "g-crepes-sucree"],
  ["Nutella + PISTACHIO", "g-crepes-sucree"],
  ["Nutella + Spéc", "g-crepes-sucree"],
  ["Nutella + Kinder", "g-crepes-sucree"],
  ["Nutella + Marshemello", "g-crepes-sucree"],
  ["Nutella + Whipped Cream + Biscuit", "g-crepes-sucree"],
  // Crêpes Sallée
  ["Fromage", "g-crepes-salee"],
  ["Fromage + Jombon", "g-crepes-salee"],
  ["Fromage + Thon", "g-crepes-salee"],
  ["Fromage + Jombon + Thon", "g-crepes-salee"],
  ["Tunisien (Fromage + Slice + Jombon ou Thon + ouefs)", "g-crepes-salee"],
  // Pancakes
  ["Honey + Butter", "g-pancakes"],
  ["Honey + butter + fruit secs", "g-pancakes"],
  ["Nutella", "g-pancakes"],
  ["Nutella + fruits sec", "g-pancakes"],
  ["OREO", "g-pancakes"],
  ["PISTACHIO", "g-pancakes"],
  ["Spéc", "g-pancakes"],
  // Gauffres
  ["Chocolact blanc + Noir + pipetes de chocolact", "g-gauffres"],
  ["Nutella + Chocolact Blanc", "g-gauffres"],
  ["Nutella + pistachio", "g-gauffres"],
  ["Nutella + OREO", "g-gauffres"],
  ["Nutella + Spéc", "g-gauffres"],
  ["Nutella + Glaces", "g-gauffres"],
  ["Nutella + Kinder", "g-gauffres"],
  ["Nutella + Candy", "g-gauffres"],
  ["Nutella + Whiped Cream + Biscuit", "g-gauffres"],
].map(([name, groupId], i) => ({
  id: `p-${i}`,
  name,
  groupId,
  price: 0,
  details: "",
}));

const SEED_SETTINGS = {
  name: "Tabac & Bloom",
  tagline: "Coffee, brewed with intent.",
  currency: "$",
};

async function loadOrSeed() {
  let settings, groups, products;
  try {
    const r = await window.storage.get("shop-settings", true);
    settings = JSON.parse(r.value);
  } catch {
    settings = SEED_SETTINGS;
    try { await window.storage.set("shop-settings", JSON.stringify(settings), true); } catch {}
  }
  try {
    const r = await window.storage.get("menu-groups", true);
    groups = JSON.parse(r.value);
  } catch {
    groups = SEED_GROUPS;
    try { await window.storage.set("menu-groups", JSON.stringify(groups), true); } catch {}
  }
  try {
    const r = await window.storage.get("menu-products", true);
    products = JSON.parse(r.value);
  } catch {
    products = SEED_PRODUCTS;
    try { await window.storage.set("menu-products", JSON.stringify(products), true); } catch {}
  }
  return { settings, groups, products };
}

function getTableFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("table");
    return t ? t.replace(/[^a-zA-Z0-9-]/g, "").slice(0, 6) : null;
  } catch {
    return null;
  }
}

export default function CoffeeMenu() {
  const [state, setState] = useState({ settings: SEED_SETTINGS, groups: SEED_GROUPS, products: SEED_PRODUCTS });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);
  const table = useMemo(getTableFromUrl, []);

  useEffect(() => {
    let mounted = true;
    loadOrSeed().then((data) => {
      if (mounted) {
        setState(data);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.groups.map((g) => ({
      ...g,
      items: state.products
        .filter((p) => p.groupId === g.id)
        .filter((p) =>
          !q || p.name.toLowerCase().includes(q) || (p.details || "").toLowerCase().includes(q)
        ),
    })).filter((g) => g.items.length > 0);
  }, [state, query]);

  const scrollTo = (id) => {
    const el = document.getElementById(`sec-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="menu-root">
      <style>{CSS}</style>

      <header className="hero">
        <div className="hero-inner">
          <div className="brand">
            <div className="brand-name">{state.settings.name}</div>
            <div className="brand-tag">{state.settings.tagline}</div>
          </div>
          {table && (
            <div className="stub" aria-label={`Table ${table}`}>
              <div className="stub-label">TABLE</div>
              <div className="stub-num">{table}</div>
            </div>
          )}
          {!table && (
            <div className="stub stub-muted">
              <div className="stub-label">WELCOME</div>
              <div className="stub-num">—</div>
            </div>
          )}
        </div>
      </header>

      <div className="controls">
        <input
          className="search"
          type="text"
          placeholder="Find something on the menu…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search menu"
        />
        <nav className="chips" aria-label="Jump to category">
          {state.groups.map((g) => (
            <button key={g.id} className="chip" onClick={() => scrollTo(g.id)}>
              {g.name}
            </button>
          ))}
        </nav>
      </div>

      <main className="sections">
        {loading && <div className="empty">Loading menu…</div>}
        {!loading && grouped.length === 0 && (
          <div className="empty">Nothing matches "{query}". Try another search.</div>
        )}
        {!loading &&
          grouped.map((g) => (
            <section key={g.id} id={`sec-${g.id}`} className="section">
              <div className="section-head">
                <h2>{g.name}</h2>
                <span className="count">{g.items.length} items</span>
              </div>
              <ul className="items">
                {g.items.map((p) => {
                  const open = openId === p.id;
                  return (
                    <li key={p.id} className={"item" + (open ? " open" : "")}>
                      <button
                        className="item-row"
                        onClick={() => setOpenId(open ? null : p.id)}
                        aria-expanded={open}
                      >
                        <span className="item-name">{p.name}</span>
                        <span className="leader" />
                        <span className="item-price">
                          {state.settings.currency}{Number(p.price).toFixed(2)}
                        </span>
                      </button>
                      {open && p.details && <p className="item-details">{p.details}</p>}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
      </main>

      <footer className="foot">
        <span>{state.settings.name} · scan, sip, stay a while.</span>
      </footer>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

.menu-root {
  --bg: #1E1712;
  --bg-card: #241B15;
  --parchment: #E7E0D1;
  --ink: #221A14;
  --ink-soft: rgba(34,26,20,0.62);
  --copper: #BE7C4D;
  --rust: #9C4221;
  --sage: #6E7F63;
  --line: rgba(34,26,20,0.14);
  background: var(--parchment);
  color: var(--ink);
  min-height: 100%;
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
}

.hero {
  background: var(--bg);
  color: var(--parchment);
  padding: clamp(20px, 5vw, 40px) clamp(16px, 5vw, 40px);
}
.hero-inner {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.brand-name {
  font-family: 'Fraunces', serif;
  font-weight: 700;
  font-size: clamp(28px, 6vw, 42px);
  letter-spacing: -0.01em;
  line-height: 1.05;
}
.brand-tag {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--copper);
  margin-top: 6px;
}
.stub {
  position: relative;
  background: var(--copper);
  color: var(--bg);
  padding: 10px 18px;
  min-width: 92px;
  text-align: center;
  border-radius: 3px;
  -webkit-mask-image: radial-gradient(circle 4px at 0 50%, transparent 4px, black 4.5px),
                       radial-gradient(circle 4px at 100% 50%, transparent 4px, black 4.5px);
  mask-image: radial-gradient(circle 4px at 0 50%, transparent 4px, black 4.5px),
              radial-gradient(circle 4px at 100% 50%, transparent 4px, black 4.5px);
}
.stub-muted { background: rgba(231,224,209,0.14); color: var(--parchment); }
.stub-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  opacity: 0.8;
}
.stub-num {
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 500;
  font-size: 24px;
  line-height: 1.2;
}

.controls {
  position: sticky;
  top: 0;
  z-index: 5;
  background: var(--parchment);
  border-bottom: 1px solid var(--line);
  padding: 14px clamp(16px, 5vw, 40px) 10px;
}
.search {
  display: block;
  width: 100%;
  max-width: 720px;
  margin: 0 auto 10px;
  padding: 11px 14px;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: var(--ink);
}
.search:focus-visible { outline: 2px solid var(--copper); outline-offset: 1px; }
.chips {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: thin;
}
.chip {
  flex: 0 0 auto;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: transparent;
  border: 1px solid var(--line);
  color: var(--ink-soft);
  padding: 6px 12px;
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
}
.chip:hover { border-color: var(--copper); color: var(--rust); }
.chip:focus-visible { outline: 2px solid var(--copper); outline-offset: 1px; }

.sections { max-width: 720px; margin: 0 auto; padding: 8px clamp(16px, 5vw, 40px) 40px; }
.section { padding-top: 34px; }
.section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  border-bottom: 2px solid var(--ink);
  padding-bottom: 8px;
  margin-bottom: 6px;
}
.section-head h2 {
  font-family: 'Fraunces', serif;
  font-weight: 600;
  font-size: clamp(20px, 4vw, 26px);
  margin: 0;
}
.count {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  color: var(--ink-soft);
}
.items { list-style: none; margin: 0; padding: 0; }
.item { border-bottom: 1px dashed var(--line); }
.item-row {
  width: 100%;
  display: flex;
  align-items: baseline;
  gap: 8px;
  background: none;
  border: none;
  padding: 13px 0;
  cursor: pointer;
  text-align: left;
  font-family: 'Inter', sans-serif;
}
.item-row:focus-visible { outline: 2px solid var(--copper); outline-offset: 2px; }
.item-name { font-weight: 500; font-size: 15px; color: var(--ink); flex: 0 0 auto; }
.leader {
  flex: 1 1 auto;
  border-bottom: 1px dotted var(--ink-soft);
  margin-bottom: 5px;
  min-width: 16px;
}
.item-price {
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 500;
  font-size: 14px;
  color: var(--rust);
  flex: 0 0 auto;
}
.item-details {
  margin: 0 0 14px;
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--ink-soft);
  max-width: 60ch;
}
.item.open .item-name { color: var(--rust); }

.empty {
  text-align: center;
  padding: 60px 20px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  color: var(--ink-soft);
}

.foot {
  text-align: center;
  padding: 20px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--ink-soft);
  border-top: 1px solid var(--line);
}

@media (prefers-reduced-motion: reduce) {
  * { scroll-behavior: auto !important; }
}
`;
