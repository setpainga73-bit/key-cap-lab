// Keycap Lab - Products Data
window.KeycapProducts = [
  {
    id: "starter-65-kit",
    name: "Starter 65% Kit",
    subtitle: "65% / hotswap / linear",
    category: "kits",
    layout: "65",
    price: 129,
    rating: 4.9,
    reviewsCount: 38,
    badge: "Popular",
    image: "../IMG/top-view-white-keyboard-desk.jpg",
    rootImage: "./IMG/top-view-white-keyboard-desk.jpg",
    description:
      "The Starter 65% Kit is an all-in-one package designed for beginners and enthusiasts alike. Everything you need to build your dream keyboard arrives in a single box: aluminum case, hotswap PCB, pre-lubed linear switches, and thick dye-sub PBT keycaps.",
    features: [
      "Compact 65% layout with dedicated arrow keys",
      "Kailh hotswap sockets (no soldering required)",
      "Factory-lubed linear switches (smooth 50g actuation)",
      "PBT dye-sublimated keycaps (Cherry profile)",
      "Sound-dampening EVA case foam & silicone gaskets",
      "QMK and VIA firmware support for full remapping",
    ],
    variants: [
      {
        name: "Switch Type",
        options: [
          "Gateron Linear (Red)",
          "Silent Peach Linear",
          "Boba U4T Tactile",
        ],
      },
      {
        name: "Case Color",
        options: ["Matte Black", "Lunar Grey", "Frosted Ice"],
      },
    ],
    inStock: true,
  },
  {
    id: "quiet-office-kit",
    name: "Quiet Office Kit",
    subtitle: "75% / tactile / foam",
    category: "kits",
    layout: "75",
    price: 189,
    rating: 4.8,
    reviewsCount: 24,
    badge: "Quiet",
    image: "../IMG/daniel-korpai-8GDCzWrcE3M-unsplash.jpg",
    rootImage: "./IMG/daniel-korpai-8GDCzWrcE3M-unsplash.jpg",
    description:
      "Engineered specifically for shared workplaces and late-night typing sessions. The Quiet Office Kit combines dual-layer acoustic dampening with cushioned tactile switches to deliver a tactile feel without the audible clatter.",
    features: [
      "75% layout with full function row and navigation column",
      "Multi-layer Poron sheet & molded silicone bottom pad",
      "Silent tactile switches with integrated silencing pads",
      "Thick PBT keycaps with sound-absorbing internal ribs",
      "Rotary media knob for effortless volume adjustments",
      "Bluetooth 5.1, 2.4GHz wireless, and USB-C wired connection",
    ],
    variants: [
      {
        name: "Switch Weight",
        options: ["55g Medium Tactile", "65g Heavy Tactile"],
      },
      {
        name: "Knob Finish",
        options: ["Brass Gold", "Anodized Slate", "Ruby Red"],
      },
    ],
    inStock: true,
  },
  {
    id: "compact-60-kit",
    name: "Compact 60% Kit",
    subtitle: "60% / hotswap / clicky",
    category: "kits",
    layout: "60",
    price: 149,
    rating: 4.7,
    reviewsCount: 19,
    badge: "Compact",
    image: "../IMG/hero-keyboard.webp",
    rootImage: "./IMG/hero-keyboard.webp",
    description:
      "Maximum desk space meets high performance. The Compact 60% Kit strips away unnecessary bulk while retaining full programmability via layer keys. Perfect for competitive gaming and travel setups.",
    features: [
      "Ultra-compact 60% footprint fits any backpack or small desk",
      "Universal ANSI layout with 61 key layout",
      "Clicky switches with satisfying acoustic feedback",
      "South-facing per-key RGB backlighting with 18 dynamic effects",
      "CNC milled anodized aluminum bevels",
      "Detachable braided USB Type-C cable included",
    ],
    variants: [
      {
        name: "Switch Type",
        options: ["Clicky Blue (55g)", "Speed Silver Linear (45g)"],
      },
      {
        name: "Plate Material",
        options: ["FR4 Composite", "Brass (+ $15)", "Polycarbonate"],
      },
    ],
    inStock: true,
  },
  {
    id: "alu-65-case",
    name: "Studio 65% Aluminum Case",
    subtitle: "65% / CNC anodized / gasket mount",
    category: "cases",
    layout: "65",
    price: 110,
    rating: 4.9,
    reviewsCount: 52,
    badge: "Premium",
    image: "../IMG/top-view-white-keyboard-desk.jpg",
    rootImage: "./IMG/top-view-white-keyboard-desk.jpg",
    description:
      "Precision-machined from solid 6063 aerospace aluminum blocks, sandblasted and anodized to an ultra-smooth finish. Includes an internal brass weight bar for substantial desk presence and resonant acoustics.",
    features: [
      "Compatible with standard 65% PCB mountings",
      "Gasket isolation mount system with silicone socks",
      "Polished mirror PVD brass weight (1.2 kg assembled)",
      "7-degree ergonomic typing slope",
    ],
    variants: [
      { name: "Color", options: ["Anodized Black", "Deep Navy", "Space Grey"] },
    ],
    inStock: true,
  },
  {
    id: "poly-65-case",
    name: "Frosted Polycarbonate Case",
    subtitle: "65% / frosted diffuse / lightweight",
    category: "cases",
    layout: "65",
    price: 75,
    rating: 4.6,
    reviewsCount: 14,
    badge: "RGB Friendly",
    image: "../IMG/hero-keyboard.webp",
    rootImage: "./IMG/hero-keyboard.webp",
    description:
      "A semi-translucent frosted polycarbonate case that catches and beautifully diffuses per-key and underglow RGB lighting, producing a warm ambient glow across your desk surface.",
    features: [
      "Ultra-durable CNC frosted polycarbonate",
      "Deep, thocky sound signature characteristic of PC",
      "Integrated brass screw threads prevent stripping",
      "Includes non-slip silicone feet",
    ],
    variants: [{ name: "Finish", options: ["Frosted Smoke", "Frosted Clear"] }],
    inStock: true,
  },
  {
    id: "walnut-60-case",
    name: "Walnut Hardwood 60% Case",
    subtitle: "60% / solid walnut / natural oil",
    category: "cases",
    layout: "60",
    price: 105,
    rating: 4.8,
    reviewsCount: 31,
    badge: "Wood",
    image: "../IMG/top-view-white-keyboard-desk.jpg",
    rootImage: "./IMG/top-view-white-keyboard-desk.jpg",
    description:
      "Hand-finished natural American walnut wood casing. Each unit features unique grain patterns and is conditioned with organic wood wax to ensure lasting beauty and a deep organic sound.",
    features: [
      "Fits standard GH60, DZ60, and universal 60% PCBs",
      "Integrated ergonomic wrist slope",
      "Sound-absorbing natural wood resonance",
      "Pre-installed brass standoff inserts",
    ],
    variants: [
      { name: "Wood Stain", options: ["Natural Walnut", "Dark Espresso"] },
    ],
    inStock: true,
  },
  {
    id: "hotswap-65-pcb",
    name: "Hotswap 65% RGB PCB",
    subtitle: "65% / Kailh sockets / VIA support",
    category: "pcbs",
    layout: "65",
    price: 55,
    rating: 4.9,
    reviewsCount: 40,
    badge: "Hotswap",
    image: "../IMG/hero-keyboard.webp",
    rootImage: "./IMG/hero-keyboard.webp",
    description:
      "Industry-standard Kailh hot-swap sockets rated for over 100 switch swaps. South-facing SMD RGB LEDs eliminate switch interference with Cherry profile keycaps.",
    features: [
      "Instant key mapping via QMK and Web VIA",
      "South-facing per-key RGB backlighting",
      "ESD static protection chip built-in",
      "USB Type-C daughterboard connection supported",
    ],
    variants: [
      {
        name: "Version",
        options: ["RGB South-Facing", "Non-RGB Solderable ($45)"],
      },
    ],
    inStock: true,
  },
  {
    id: "hotswap-75-pcb",
    name: "Hotswap 75% Rotary PCB",
    subtitle: "75% / rotary encoder / VIA support",
    category: "pcbs",
    layout: "75",
    price: 62,
    rating: 4.8,
    reviewsCount: 29,
    badge: "Encoder",
    image: "../IMG/daniel-korpai-8GDCzWrcE3M-unsplash.jpg",
    rootImage: "./IMG/daniel-korpai-8GDCzWrcE3M-unsplash.jpg",
    description:
      "A feature-packed 75% PCB equipped with pre-soldered Kailh hot-swap sockets, south-facing RGB, and a high-precision rotary encoder for tactile volume and scrub control.",
    features: [
      "Rotary encoder knob included with push-button click",
      "Supports ANSI layout with arrow and nav keys",
      "Fully compatible with VIA real-time configuration",
      "Gold-plated pads for long-term corrosion resistance",
    ],
    variants: [
      { name: "Underglow", options: ["Per-Key + Underglow", "Per-Key Only"] },
    ],
    inStock: true,
  },
  {
    id: "oil-king-switches",
    name: "Gateron Oil King Linear (70x)",
    subtitle: "Linear / 55g / factory lubed",
    category: "switches",
    layout: "all",
    price: 45,
    rating: 5.0,
    reviewsCount: 68,
    badge: "Best Seller",
    image: "../IMG/daniel-korpai-8GDCzWrcE3M-unsplash.jpg",
    rootImage: "./IMG/daniel-korpai-8GDCzWrcE3M-unsplash.jpg",
    description:
      "Gateron Oil Kings are celebrated for their ultra-smooth glide straight from the factory. Featuring a nylon PA66 upper housing, INK composite bottom housing, and POM stem.",
    features: [
      "Pack of 70 switches (enough for up to 65% boards)",
      "Operating force: 55gf ± 5gf, bottom-out 65gf",
      "5-pin PCB mount (can be clipped for 3-pin plates)",
      "Deep, low-pitch acoustic clack",
    ],
    variants: [
      {
        name: "Pack Size",
        options: [
          "70 Switches ($45)",
          "90 Switches ($58)",
          "110 Switches ($70)",
        ],
      },
    ],
    inStock: true,
  },
  {
    id: "boba-u4t-switches",
    name: "Boba U4T Tactile (70x)",
    subtitle: "Tactile / 62g / crisp bump",
    category: "switches",
    layout: "all",
    price: 52,
    rating: 4.9,
    reviewsCount: 84,
    badge: "Tactile",
    image: "../IMG/top-view-white-keyboard-desk.jpg",
    rootImage: "./IMG/top-view-white-keyboard-desk.jpg",
    description:
      "The gold standard of tactile switches. Boba U4T switches feature a prominent 'D-shaped' tactile bump right at the top of the keystroke with zero pre-travel wobble.",
    features: [
      "Pack of 70 mechanical switches",
      "62g Korean stainless steel spring",
      "Custom Gazzew blend housing plastic",
      "Remarkable tactile responsiveness",
    ],
    variants: [{ name: "Spring Weight", options: ["62g Medium", "68g Heavy"] }],
    inStock: true,
  },
  {
    id: "silent-peach-switches",
    name: "Silent Peach Linear (70x)",
    subtitle: "Silent Linear / 35g / quiet office",
    category: "switches",
    layout: "all",
    price: 38,
    rating: 4.7,
    reviewsCount: 27,
    badge: "Silent",
    image: "../IMG/hero-keyboard.webp",
    rootImage: "./IMG/hero-keyboard.webp",
    description:
      "Whisper-quiet typing for library and conference call environments. Integrated silicone dampening buffers cushion both the downstroke and return stroke.",
    features: [
      "Pack of 70 silent linear switches",
      "Featherlight 35gf actuation force",
      "Dual silicone silencing dampeners",
      "Translucent housing allows RGB shine-through",
    ],
    variants: [
      {
        name: "Pack Size",
        options: ["70 Switches ($38)", "90 Switches ($49)"],
      },
    ],
    inStock: true,
  },
  {
    id: "pbt-minimalist-caps",
    name: "Minimalist Dark PBT Keycaps",
    subtitle: "PBT / Cherry profile / dye-sub",
    category: "keycaps",
    layout: "all",
    price: 65,
    rating: 4.9,
    reviewsCount: 43,
    badge: "PBT",
    image: "../IMG/top-view-white-keyboard-desk.jpg",
    rootImage: "./IMG/top-view-white-keyboard-desk.jpg",
    description:
      "Crafted from heavy 1.5mm PBT plastic with a subtle textured matte finish that resists fingerprint oils and shine over years of heavy daily typing.",
    features: [
      "142-key set fits 60%, 65%, 75%, TKL, and Full Size layouts",
      "Ergonomic Cherry height profile",
      "Dye-sublimated legends will never fade or wear off",
      "Includes 1.75u Shift, split spacebars, and MAC modifier keys",
    ],
    variants: [
      {
        name: "Color Accent",
        options: ["Amber Accent Keys", "Monochrome Slate", "Cyan Accent"],
      },
    ],
    inStock: true,
  },
  {
    id: "retro-classic-caps",
    name: "Retro Classic Keycap Set",
    subtitle: "PBT / Vintage beige / ISO+ANSI",
    category: "keycaps",
    layout: "all",
    price: 58,
    rating: 4.8,
    reviewsCount: 36,
    badge: "Retro",
    image: "../IMG/hero-keyboard.webp",
    rootImage: "./IMG/hero-keyboard.webp",
    description:
      "Classic 1980s industrial workstation aesthetic with two-tone beige and stone grey keycaps accented by rich vintage red and amber novelty keys.",
    features: [
      "150-key comprehensive compatibility set",
      "Crisp dark grey dye-sub legends",
      "Includes stepped Caps Lock and multiple spacebar sizes",
      "Reinforced stem structure resists warping",
    ],
    variants: [
      {
        name: "Profile",
        options: ["Cherry Profile", "OEM Profile", "XDA Uniform Profile"],
      },
    ],
    inStock: true,
  },
  {
    id: "deskmat-graphite",
    name: "Keycap Lab Desk Mat - Graphite",
    subtitle: "900x400mm / micro-weave cloth / stitched",
    category: "accessories",
    layout: "all",
    price: 25,
    rating: 4.9,
    reviewsCount: 92,
    badge: "Accessory",
    image: "../IMG/daniel-korpai-8GDCzWrcE3M-unsplash.jpg",
    rootImage: "./IMG/daniel-korpai-8GDCzWrcE3M-unsplash.jpg",
    description:
      "An expansive 900x400mm desk mat engineered to cushion mechanical keyboard typing vibrations and give your mouse a smooth, consistent tracking surface.",
    features: [
      "Large 900 x 400 x 4mm dimensions cover entire keyboard & mouse zone",
      "Dense 4mm thickness dampens keyboard resonance and echo",
      "Reinforced 360-degree anti-fray stitched perimeter borders",
      "Textured non-slip natural rubber backing grips desktop",
    ],
    variants: [
      {
        name: "Pattern",
        options: [
          "Minimal Graphite Grid",
          "Keycap Blueprint Diagram",
          "Stealth Blackout",
        ],
      },
    ],
    inStock: true,
  },
];

const productImages = {
  "starter-65-kit": "keyboard-retro.jpg",
  "quiet-office-kit": "keyboard-desk-setup.jpg",
  "compact-60-kit": "keyboard-compact.jpg",
  "alu-65-case": "keyboard-minimal.jpg",
  "poly-65-case": "keyboard-rgb.jpg",
  "hotswap-65-pcb": "keyboard-rgb.jpg",
  "hotswap-75-pcb": "keyboard-desk-setup.jpg",
  "oil-king-switches": "keyboard-compact.jpg",
  "boba-u4t-switches": "keyboard-compact.jpg",
  "silent-peach-switches": "keyboard-rgb.jpg",
  "pbt-minimalist-caps": "keyboard-compact.jpg",
  "retro-classic-caps": "keyboard-retro.jpg",
  "deskmat-graphite": "keyboard-workstation.jpg",
};

window.KeycapProducts.forEach(function (product) {
  const image = productImages[product.id];
  if (!image) return;
  product.image = "../IMG/" + image;
  product.rootImage = "./IMG/" + image;
});

// Helper to look up a product by ID
window.getProductById = function (id) {
  if (!id) return null;
  return (
    window.KeycapProducts.find(function (p) {
      return p.id === id;
    }) || null
  );
};
