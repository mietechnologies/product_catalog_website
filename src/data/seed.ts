import { BaseItem, CreatureType, Product } from "@/lib/types";

/** Seed miniatures are written without the generic product fields; asMiniature() fills them in. */
type MiniatureSeed = Omit<Product, "productType" | "category" | "collections"> & {
  creatureType: CreatureType;
};
type MiniatureItemSeed = Omit<BaseItem, "productType" | "category" | "collections" | "variants"> & {
  creatureType: CreatureType;
  variants: Product[];
};

function asMiniature<T extends { creatureType: CreatureType }>(seed: T) {
  return {
    ...seed,
    productType: "miniature" as const,
    category: seed.creatureType,
    collections: [] as string[],
  };
}

/**
 * Seed data for the MIETech product catalog POC.
 *
 * Product code format: M-[two-letter creature type]-[4-digit number]
 * Creature type codes:
 *   RD = Red Dragon, ZM = Zombie, OW = Owlbear, GR = Griffon,
 *   MN = Minotaur, BH = Beholder, GL = Golem, BD = Blue Dragon,
 *   SK = Skeleton, IF = Imp/Fiend, EL = Elemental, GH = Ghost
 */

// ── Red Dragon (base item with 4 age-category variants) ─────────────
const redDragonVariants: Product[] = ([
  {
    slug: "red-dragon-wyrmling",
    name: "Red Dragon Wyrmling",
    productCode: "M-RD-0001",
    price: 8.99,
    description:
      "A freshly hatched red dragon wyrmling, barely larger than a housecat but already fierce. Perched on a rocky outcrop with wings spread wide, this highly detailed miniature captures the menace of dragonkind in its earliest stage.",
    images: ["/images/red-dragon-wyrmling-1.jpg"],
    size: "Small",
    creatureType: "Dragon",
    attributes: {
      "Age Category": "Wyrmling",
      "Base Size": "25mm round",
      Material: "Resin",
      "Layer Height": "0.05mm",
    },
    parentItemSlug: "red-dragon",
  },
  {
    slug: "red-dragon-young",
    name: "Young Red Dragon",
    productCode: "M-RD-0002",
    price: 18.99,
    description:
      "A young red dragon rearing on its hind legs, unleashing a torrent of flame. This dynamic pose showcases the creature's growing power. Detailed scales, horns, and wing membranes bring this classic D&D monster to life on your tabletop.",
    images: ["/images/red-dragon-young-1.jpg", "/images/red-dragon-young-2.jpg"],
    size: "Large",
    creatureType: "Dragon",
    attributes: {
      "Age Category": "Young",
      "Base Size": "50mm round",
      Material: "Resin",
      "Layer Height": "0.05mm",
    },
    parentItemSlug: "red-dragon",
  },
  {
    slug: "red-dragon-adult",
    name: "Adult Red Dragon",
    productCode: "M-RD-0003",
    price: 34.99,
    description:
      "The terror of the mountains. This adult red dragon towers over adventurers, wings fully spread and jaws open in a thunderous roar. Intricate scale textures and battle scars tell stories of centuries of dominance.",
    images: [
      "/images/red-dragon-adult-1.jpg",
      "/images/red-dragon-adult-2.jpg",
      "/images/red-dragon-adult-3.jpg",
    ],
    size: "Huge",
    creatureType: "Dragon",
    attributes: {
      "Age Category": "Adult",
      "Base Size": "75mm round",
      Material: "Resin",
      "Layer Height": "0.05mm",
    },
    parentItemSlug: "red-dragon",
  },
  {
    slug: "red-dragon-ancient",
    name: "Ancient Red Dragon",
    productCode: "M-RD-0004",
    price: 54.99,
    description:
      "The apex predator of the D&D world. This ancient red dragon centerpiece miniature features a massive wingspan, layered horn crown, and a base littered with treasure and fallen heroes. A true showpiece for any collection.",
    images: [
      "/images/red-dragon-ancient-1.jpg",
      "/images/red-dragon-ancient-2.jpg",
      "/images/red-dragon-ancient-3.jpg",
      "/images/red-dragon-ancient-4.jpg",
    ],
    size: "Huge",
    creatureType: "Dragon",
    attributes: {
      "Age Category": "Ancient",
      "Base Size": "100mm round",
      Material: "Resin",
      "Layer Height": "0.05mm",
    },
    parentItemSlug: "red-dragon",
  },
] satisfies MiniatureSeed[] as MiniatureSeed[]).map(asMiniature);

// ── Zombie (base item with 3 sculpt variants) ───────────────────────
const zombieVariants: Product[] = ([
  {
    slug: "zombie-shambler",
    name: "Zombie Shambler",
    productCode: "M-ZM-0001",
    price: 5.99,
    description:
      "A classic shambling zombie with outstretched arms and tattered clothing. Perfect for filling your undead hordes. Features exposed bone, rotting flesh details, and a lurching pose.",
    images: ["/images/zombie-shambler-1.jpg"],
    size: "Medium",
    creatureType: "Undead",
    attributes: {
      Sculpt: "Shambler",
      "Base Size": "25mm round",
      Material: "Resin",
      "Layer Height": "0.05mm",
    },
    parentItemSlug: "zombie",
  },
  {
    slug: "zombie-brute",
    name: "Zombie Brute",
    productCode: "M-ZM-0002",
    price: 7.99,
    description:
      "A hulking zombie brute, bloated and powerful. This variant features a massive frame, bulging muscles twisted by undeath, and a menacing pose ready to crush anything in its path.",
    images: ["/images/zombie-brute-1.jpg", "/images/zombie-brute-2.jpg"],
    size: "Large",
    creatureType: "Undead",
    attributes: {
      Sculpt: "Brute",
      "Base Size": "50mm round",
      Material: "Resin",
      "Layer Height": "0.05mm",
    },
    parentItemSlug: "zombie",
  },
  {
    slug: "zombie-crawler",
    name: "Zombie Crawler",
    productCode: "M-ZM-0003",
    price: 5.99,
    description:
      "A legless zombie dragging itself across the ground with grasping hands. An unsettling addition to any encounter. Features detailed ground debris and drag marks on the integrated base.",
    images: ["/images/zombie-crawler-1.jpg"],
    size: "Small",
    creatureType: "Undead",
    attributes: {
      Sculpt: "Crawler",
      "Base Size": "25mm round",
      Material: "Resin",
      "Layer Height": "0.05mm",
    },
    parentItemSlug: "zombie",
  },
] satisfies MiniatureSeed[] as MiniatureSeed[]).map(asMiniature);

// ── Base Items ───────────────────────────────────────────────────────
export const baseItems: BaseItem[] = ([
  {
    slug: "red-dragon",
    name: "Red Dragon",
    description:
      "The iconic red dragon in all its glory. Choose from four age categories, each capturing a different stage of this fearsome creature's life cycle. From the feisty wyrmling to the earth-shaking ancient, these miniatures bring the king of chromatic dragons to your table.",
    image: "/images/red-dragon-adult-1.jpg",
    creatureType: "Dragon",
    size: "Huge",
    hasVariants: true,
    variants: redDragonVariants,
    priceRange: { min: 8.99, max: 54.99 },
    attribution: {
      creator: "Example Sculpts",
      modelUrl: "https://www.example.com/models/red-dragon",
    },
  },
  {
    slug: "zombie",
    name: "Zombie Horde Collection",
    description:
      "No dungeon is complete without the shambling dead. This collection offers three distinct zombie sculpts, from the classic shambler to the terrifying brute. Mix and match to build your own undead army.",
    image: "/images/zombie-shambler-1.jpg",
    creatureType: "Undead",
    size: "Medium",
    hasVariants: true,
    variants: zombieVariants,
    priceRange: { min: 5.99, max: 7.99 },
  },
] satisfies MiniatureItemSeed[] as MiniatureItemSeed[]).map(asMiniature);

// ── Standalone Products (no variants) ────────────────────────────────
const standaloneMiniatures: Product[] = ([
  {
    slug: "owlbear",
    name: "Owlbear",
    productCode: "M-OW-0001",
    price: 14.99,
    description:
      "Part owl, part bear, all terror. This owlbear miniature captures the creature mid-charge, feathered head lowered and claws extended. A must-have for any wilderness encounter.",
    images: ["/images/owlbear-1.jpg", "/images/owlbear-2.jpg"],
    size: "Large",
    creatureType: "Beast",
    attributes: {
      "Base Size": "50mm round",
      Material: "Resin",
      "Layer Height": "0.05mm",
    },
  },
  {
    slug: "griffon",
    name: "Griffon",
    productCode: "M-GR-0001",
    price: 16.99,
    description:
      "A majestic griffon with wings spread wide, perched atop a ruined column. This dynamic miniature works as both a fierce monster and a noble mount. Exquisite feather and fur texturing throughout.",
    images: ["/images/griffon-1.jpg"],
    size: "Large",
    creatureType: "Beast",
    attributes: {
      "Base Size": "50mm round",
      Material: "Resin",
      "Layer Height": "0.05mm",
    },
  },
  {
    slug: "minotaur-warrior",
    name: "Minotaur Warrior",
    productCode: "M-MN-0001",
    price: 12.99,
    description:
      "A fearsome minotaur wielding a massive greataxe. This labyrinthine guardian stands ready for battle with detailed musculature, fur textures, and ornate armor pieces.",
    images: ["/images/minotaur-1.jpg", "/images/minotaur-2.jpg"],
    size: "Large",
    creatureType: "Humanoid",
    attributes: {
      "Base Size": "50mm round",
      Material: "Resin",
      "Layer Height": "0.05mm",
      Weapon: "Greataxe",
    },
  },
  {
    slug: "beholder",
    name: "Beholder",
    productCode: "M-BH-0001",
    price: 22.99,
    description:
      "The iconic eye tyrant, floating menacingly with all eleven eye stalks posed in different directions. This spherical horror features a gaping maw filled with teeth and an intricate textured hide. Mounted on a clear flight stand.",
    images: [
      "/images/beholder-1.jpg",
      "/images/beholder-2.jpg",
      "/images/beholder-3.jpg",
    ],
    size: "Large",
    creatureType: "Aberration",
    attributes: {
      "Base Size": "50mm round",
      Material: "Resin",
      "Layer Height": "0.05mm",
      "Includes Stand": "Yes",
    },
  },
  {
    slug: "iron-golem",
    name: "Iron Golem",
    productCode: "M-GL-0001",
    price: 19.99,
    description:
      "A towering iron golem, forged in ancient magic. This imposing construct features riveted plates, glowing rune inscriptions, and a powerful stance. The perfect guardian for any wizard's tower.",
    images: ["/images/iron-golem-1.jpg"],
    size: "Huge",
    creatureType: "Construct",
    attributes: {
      "Base Size": "75mm round",
      Material: "Resin",
      "Layer Height": "0.05mm",
    },
  },
  {
    slug: "blue-dragon-adult",
    name: "Adult Blue Dragon",
    productCode: "M-BD-0001",
    price: 36.99,
    description:
      "A regal adult blue dragon crouched atop a sand dune, lightning crackling between its massive horn. This desert predator features sleek scales, folded wings, and an imposing presence that dominates the battlefield.",
    images: [
      "/images/blue-dragon-1.jpg",
      "/images/blue-dragon-2.jpg",
      "/images/blue-dragon-3.jpg",
    ],
    size: "Huge",
    creatureType: "Dragon",
    attributes: {
      "Age Category": "Adult",
      "Base Size": "75mm round",
      Material: "Resin",
      "Layer Height": "0.05mm",
    },
  },
  {
    slug: "skeleton-warrior",
    name: "Skeleton Warrior",
    productCode: "M-SK-0001",
    price: 5.99,
    description:
      "A skeletal warrior risen from the grave, armed with a rusty sword and battered shield. Ideal for building encounters or populating crypts. Clean bone detail and a dynamic combat pose.",
    images: ["/images/skeleton-1.jpg"],
    size: "Medium",
    creatureType: "Undead",
    attributes: {
      "Base Size": "25mm round",
      Material: "Resin",
      "Layer Height": "0.05mm",
      Weapon: "Sword & Shield",
    },
  },
  {
    slug: "fire-elemental",
    name: "Fire Elemental",
    productCode: "M-EL-0001",
    price: 11.99,
    description:
      "A swirling vortex of living flame. This fire elemental features dynamic flame tendrils, a molten core, and a translucent-ready design perfect for printing in clear resin with LED backlighting.",
    images: ["/images/fire-elemental-1.jpg", "/images/fire-elemental-2.jpg"],
    size: "Large",
    creatureType: "Elemental",
    attributes: {
      "Base Size": "50mm round",
      Material: "Resin",
      "Layer Height": "0.05mm",
      "LED Compatible": "Yes",
    },
  },
  {
    slug: "imp",
    name: "Imp",
    productCode: "M-IF-0001",
    price: 4.99,
    description:
      "A mischievous imp perched on a skull, tail curled and wings folded. This tiny fiend is full of personality despite its small stature. Perfect as a familiar or minor encounter.",
    images: ["/images/imp-1.jpg"],
    size: "Small",
    creatureType: "Fiend",
    attributes: {
      "Base Size": "25mm round",
      Material: "Resin",
      "Layer Height": "0.05mm",
    },
  },
  {
    slug: "ghost",
    name: "Spectral Ghost",
    productCode: "M-GH-0001",
    price: 9.99,
    description:
      "A haunting spectral figure rising from the ground, tattered robes flowing in an ethereal wind. Designed with a translucent-ready profile for clear resin printing. Includes a wispy base effect.",
    images: ["/images/ghost-1.jpg", "/images/ghost-2.jpg"],
    size: "Medium",
    creatureType: "Undead",
    attributes: {
      "Base Size": "25mm round",
      Material: "Resin",
      "Layer Height": "0.05mm",
      "Translucent Ready": "Yes",
    },
  },
] satisfies MiniatureSeed[] as MiniatureSeed[]).map(asMiniature);

// ── Prints (figurines, toys, decor — no variants) ────────────────────
const prints: Product[] = [
  {
    slug: "P-DE-0001",
    name: "Grinning Jack-o'-Lantern",
    productCode: "P-DE-0001",
    productType: "print",
    category: "Decor",
    collections: ["Halloween", "Trunk or Treat"],
    price: 6.99,
    description:
      "A classic carved pumpkin with a hollow core sized for a battery tealight. Prints without supports and looks great in orange PLA.",
    images: [],
    attributes: {
      Category: "Decor",
      Height: "90mm",
      Material: "PLA",
    },
  },
  {
    slug: "P-TY-0001",
    name: "Articulated Bat",
    productCode: "P-TY-0001",
    productType: "print",
    category: "Toy",
    collections: ["Halloween", "Trunk or Treat"],
    price: 4.99,
    description:
      "A print-in-place bat with flapping, jointed wings. A quick print and a crowd favourite with kids.",
    images: [],
    attributes: {
      Category: "Toy",
      Wingspan: "120mm",
      Material: "PLA",
    },
  },
  {
    slug: "P-FG-0001",
    name: "Skeleton Cat Figurine",
    productCode: "P-FG-0001",
    productType: "print",
    category: "Figurine",
    collections: ["Halloween"],
    price: 8.99,
    description:
      "A sitting cat skeleton with a curled tail, perfect for a shelf or a spooky table display.",
    images: [],
    attributes: {
      Category: "Figurine",
      Height: "75mm",
      Material: "PLA",
    },
  },
];

export const standaloneProducts: Product[] = [...standaloneMiniatures, ...prints];
