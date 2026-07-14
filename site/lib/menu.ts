// Lima's Kitchen — canonical menu. Prices are the FRIENDS (real) prices in pence.
// The site shows +20% to everyone unless the friends code is applied.

export const FRIENDS_CODE = "LIMAFRIENDS";
export const PUBLIC_MARKUP = 0.2;
export const MIN_LEAD_HOURS = 48;

export type Variant = { size: string; label_en: string; label_bn: string; price: number };
export type CategoryKey =
  | "noodles" | "biryani" | "rice" | "curries" | "sides" | "sweets" | "preorder";

export type Item = {
  key: string;
  name_en: string;
  name_bn: string;
  category: CategoryKey;
  allergens: string[];
  spice?: boolean;
  note_en?: string;
  note_bn?: string;
  variants: Variant[];
};

const S3 = { size: "3", label_en: "Serves ~3", label_bn: "≈৩ জনের" };
const S6 = { size: "6", label_en: "Serves ~6", label_bn: "≈৬ জনের" };
const S10 = { size: "10", label_en: "Serves ~10", label_bn: "≈১০ জনের" };

export const MENU: Item[] = [
  { key: "chicken-noodles", name_en: "Chicken noodles", name_bn: "চিকেন নুডলস", category: "noodles",
    allergens: ["gluten", "soy", "egg"],
    variants: [{ ...S3, price: 1500 }, { ...S6, price: 2500 }, { ...S10, price: 3600 }] },
  { key: "veg-noodles", name_en: "Vegetable noodles", name_bn: "সবজি নুডলস", category: "noodles",
    allergens: ["gluten", "soy"],
    variants: [{ ...S3, price: 1200 }, { ...S6, price: 2000 }, { ...S10, price: 3000 }] },
  { key: "prawn-noodles", name_en: "Prawn noodles", name_bn: "চিংড়ি নুডলস", category: "noodles",
    allergens: ["gluten", "soy", "crustaceans", "egg"],
    variants: [{ ...S3, price: 2000 }, { ...S6, price: 3400 }, { ...S10, price: 5200 }] },
  { key: "chicken-fried-rice", name_en: "Chicken fried rice", name_bn: "চিকেন ফ্রাইড রাইস", category: "noodles",
    allergens: ["soy", "egg"],
    variants: [{ ...S3, price: 1500 }, { ...S6, price: 2500 }, { ...S10, price: 3600 }] },
  { key: "veg-fried-rice", name_en: "Vegetable fried rice", name_bn: "সবজি ফ্রাইড রাইস", category: "noodles",
    allergens: ["soy", "egg"],
    variants: [{ ...S3, price: 1200 }, { ...S6, price: 2000 }, { ...S10, price: 3000 }] },
  { key: "prawn-fried-rice", name_en: "Prawn fried rice", name_bn: "চিংড়ি ফ্রাইড রাইস", category: "noodles",
    allergens: ["soy", "egg", "crustaceans"],
    variants: [{ ...S3, price: 2000 }, { ...S6, price: 3400 }, { ...S10, price: 5200 }] },
  { key: "party-noodles", name_en: "Party Noodles (chicken & veg mix)", name_bn: "পার্টি নুডলস", category: "noodles",
    allergens: ["gluten", "soy", "egg"],
    note_en: "Prawn upgrade +£15", note_bn: "চিংড়ি যোগ +£১৫",
    variants: [{ ...S10, price: 4000 }] },

  { key: "chicken-dum-biryani", name_en: "Chicken Dum Biryani", name_bn: "চিকেন দম বিরিয়ানি", category: "biryani",
    allergens: ["milk"],
    variants: [{ ...S3, price: 2200 }, { ...S6, price: 3800 }, { ...S10, price: 5500 }] },
  { key: "beef-tehari", name_en: "Beef Tehari", name_bn: "গরুর তেহারি", category: "biryani",
    allergens: [],
    variants: [{ ...S3, price: 2600 }, { ...S6, price: 4500 }, { ...S10, price: 6500 }] },
  { key: "dhakai-kacchi", name_en: "Dhakai Kacchi Biryani (lamb)", name_bn: "ঢাকাই কাচ্চি বিরিয়ানি", category: "biryani",
    allergens: ["milk", "tree nuts"],
    variants: [{ ...S3, price: 3000 }, { ...S6, price: 5200 }, { ...S10, price: 7800 }] },
  { key: "shobji-biryani", name_en: "Shobji Biryani (veg)", name_bn: "সবজি বিরিয়ানি", category: "biryani",
    allergens: ["milk"],
    variants: [{ ...S3, price: 1800 }, { ...S6, price: 3200 }, { ...S10, price: 4800 }] },
  { key: "bhuna-khichuri", name_en: "Bhuna Khichuri (seasonal)", name_bn: "ভুনা খিচুড়ি", category: "biryani",
    allergens: [],
    variants: [{ ...S3, price: 2000 }, { ...S6, price: 3600 }, { ...S10, price: 5400 }] },

  { key: "steamed-rice", name_en: "Plain steamed rice", name_bn: "সাদা ভাত", category: "rice",
    allergens: [],
    variants: [{ ...S3, price: 600 }, { ...S6, price: 1000 }, { ...S10, price: 1500 }] },
  { key: "plain-pulao", name_en: "Plain pulao", name_bn: "সাদা পোলাও", category: "rice",
    allergens: [],
    variants: [{ ...S3, price: 900 }, { ...S6, price: 1600 }, { ...S10, price: 2400 }] },
  { key: "ghee-pulao", name_en: "Ghee pulao", name_bn: "ঘি পোলাও", category: "rice",
    allergens: ["milk"],
    variants: [{ ...S3, price: 1100 }, { ...S6, price: 1900 }, { ...S10, price: 2900 }] },

  { key: "chicken-bhuna", name_en: "Chicken Bhuna", name_bn: "চিকেন ভুনা", category: "curries", spice: true,
    allergens: [],
    variants: [{ ...S3, price: 1200 }, { ...S6, price: 2000 }, { ...S10, price: 3200 }] },
  { key: "beef-bhuna", name_en: "Beef Bhuna (slow-cooked)", name_bn: "বিফ ভুনা", category: "curries", spice: true,
    allergens: [],
    variants: [{ ...S3, price: 1500 }, { ...S6, price: 2600 }, { ...S10, price: 4000 }] },
  { key: "lamb-kosha", name_en: "Lamb Kosha", name_bn: "ল্যাম্ব কষা", category: "curries", spice: true,
    allergens: [],
    variants: [{ ...S3, price: 1700 }, { ...S6, price: 3000 }, { ...S10, price: 4600 }] },
  { key: "shobji-torkari", name_en: "Shobji Torkari (mixed veg)", name_bn: "সবজি তরকারি", category: "curries", spice: true,
    allergens: [],
    variants: [{ ...S3, price: 900 }, { ...S6, price: 1500 }, { ...S10, price: 2400 }] },
  { key: "machher-jhol", name_en: "Machher Jhol (seasonal fish)", name_bn: "মাছের ঝোল", category: "curries", spice: true,
    allergens: ["fish"],
    variants: [{ ...S3, price: 1600 }, { ...S6, price: 2800 }, { ...S10, price: 4400 }] },

  { key: "samosas", name_en: "Samosas (chicken / lamb / veg)", name_bn: "সমুচা", category: "sides",
    allergens: ["gluten"], note_en: "Packed vented — crisp at home", note_bn: "খোলা প্যাকে — বাড়িতে মচমচে",
    variants: [
      { size: "20", label_en: "20 pieces", label_bn: "২০ টি", price: 2000 },
      { size: "30", label_en: "30 pieces", label_bn: "৩০ টি", price: 2800 },
      { size: "50", label_en: "50 pieces", label_bn: "৫০ টি", price: 4500 },
    ] },
  { key: "chicken-rolls", name_en: "Chicken rolls", name_bn: "চিকেন রোল", category: "sides",
    allergens: ["gluten", "egg"],
    variants: [{ size: "20", label_en: "20 pieces", label_bn: "২০ টি", price: 3200 }] },
  { key: "aloo-bhorta", name_en: "Aloo Bhorta", name_bn: "আলু ভর্তা", category: "sides",
    allergens: [],
    variants: [{ ...S3, price: 500 }, { ...S6, price: 800 }] },
  { key: "deshi-salad", name_en: "Deshi salad", name_bn: "দেশি সালাদ", category: "sides",
    allergens: [],
    variants: [{ ...S6, price: 500 }] },

  { key: "chaler-paesh", name_en: "Chaler Paesh (rice kheer)", name_bn: "চালের পায়েস", category: "sweets",
    allergens: ["milk", "tree nuts"],
    variants: [{ ...S3, price: 1200 }, { ...S6, price: 2000 }, { ...S10, price: 3000 }] },
  { key: "shemai", name_en: "Shemai", name_bn: "সেমাই", category: "sweets",
    allergens: ["milk", "gluten", "tree nuts"],
    variants: [{ ...S3, price: 1000 }, { ...S6, price: 1700 }, { ...S10, price: 2600 }] },
  { key: "pudding", name_en: "Homemade pudding", name_bn: "পুডিং", category: "sweets",
    allergens: ["milk", "egg"],
    variants: [{ ...S3, price: 1000 }, { ...S6, price: 1600 }, { ...S10, price: 2400 }] },
  { key: "bhapa-pitha", name_en: "Bhapa Pitha (winter special)", name_bn: "ভাপা পিঠা", category: "sweets",
    allergens: [],
    variants: [
      { size: "10", label_en: "10 pieces", label_bn: "১০ টি", price: 1800 },
      { size: "20", label_en: "20 pieces", label_bn: "২০ টি", price: 3200 },
    ] },

  { key: "halim", name_en: "Halim (slow-cooked)", name_bn: "হালিম", category: "preorder",
    allergens: ["gluten"], note_en: "Advance notice needed", note_bn: "আগাম অর্ডার লাগবে",
    variants: [{ ...S3, price: 1400 }, { ...S6, price: 2400 }, { ...S10, price: 3800 }] },
];

export type Bundle = {
  key: string; name_en: string; name_bn: string;
  serves_en: string; serves_bn: string;
  contents_en: string; contents_bn: string;
  price: number; allergens: string[];
};

export const BUNDLES: Bundle[] = [
  { key: "noodle-night", name_en: "Noodle Night", name_bn: "নুডল নাইট",
    serves_en: "Serves ~10", serves_bn: "≈১০ জনের",
    contents_en: "Party Noodles + 20 samosas + deshi salad",
    contents_bn: "পার্টি নুডলস + ২০ সমুচা + দেশি সালাদ",
    price: 5500, allergens: ["gluten", "soy", "egg"] },
  { key: "family-biryani-feast", name_en: "Family Biryani Feast", name_bn: "ফ্যামিলি বিরিয়ানি ফিস্ট",
    serves_en: "Serves ~10", serves_bn: "≈১০ জনের",
    contents_en: "1 large biryani + 2 curries (~6) + 20 samosas + salad + rice kheer (~6)",
    contents_bn: "১টি বড় বিরিয়ানি + ২টি তরকারি (≈৬) + ২০ সমুচা + সালাদ + চালের পায়েস (≈৬)",
    price: 12500, allergens: ["gluten", "milk", "tree nuts"] },
  { key: "big-dawat", name_en: "Big Dawat", name_bn: "বড় দাওয়াত",
    serves_en: "Serves ~16", serves_bn: "≈১৬ জনের",
    contents_en: "1 large biryani + Party Noodles + 2 curries (~10) + 40 samosas + salad + 2 desserts (~6)",
    contents_bn: "১টি বড় বিরিয়ানি + পার্টি নুডলস + ২টি তরকারি (≈১০) + ৪০ সমুচা + সালাদ + ২টি ডেজার্ট (≈৬)",
    price: 20500, allergens: ["gluten", "soy", "egg", "milk", "tree nuts"] },
];

export function findItem(key: string): Item | undefined {
  return MENU.find((m) => m.key === key);
}
export function findBundle(key: string): Bundle | undefined {
  return BUNDLES.find((b) => b.key === key);
}
export function unitPrice(key: string, size: string): number | null {
  const b = findBundle(key);
  if (b) return b.price;
  const it = findItem(key);
  const v = it?.variants.find((x) => x.size === size);
  return v ? v.price : null;
}
export function money(pence: number): string {
  return "£" + (pence / 100).toFixed(2);
}

export const ALLERGEN_NAMES: Record<string, { en: string; bn: string }> = {
  gluten: { en: "gluten", bn: "গ্লুটেন" },
  soy: { en: "soy", bn: "সয়া" },
  egg: { en: "egg", bn: "ডিম" },
  milk: { en: "milk", bn: "দুধ" },
  fish: { en: "fish", bn: "মাছ" },
  crustaceans: { en: "crustaceans", bn: "চিংড়ি জাতীয়" },
  "tree nuts": { en: "tree nuts", bn: "বাদাম" },
};
