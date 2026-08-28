export interface MenuItem {
  id: number;
  name: string;
  desc: string;
  price: string;
  tag?: string;
}

export interface BusinessDemo {
  name: string;
  category: string;
  city: string;
  rating: number;
  reviewCount: number;
  address: string;
  hours: string;
  waNumber: string; // format internasional tanpa tanda +, contoh: 628211407047
  tagline: string;
  menu: MenuItem[];
}

export const demosData: Record<string, BusinessDemo> = {
  "erbee": {
    name: "Erbee Coffee",
    category: "Coffee Shop & Pastry",
    city: "Bandung",
    rating: 5.0,
    reviewCount: 218,
    address: "Jl. Tata Surya No.73, Manjahlega, Rancasari",
    hours: "Open · Closes 11.00 PM",
    waNumber: "628211407047",
    tagline: "Specialty coffee & fresh pastries harian dengan suasana nyaman untuk santai dan kerja di Bandung Timur.",
    menu: [
      {
        id: 1,
        name: "Erbee Signature Aren Latte",
        desc: "Espresso robusta-arabica blend racikan khas, gula aren murni, dan fresh milk creamy.",
        price: "28.000",
        tag: "Best Seller",
      },
      {
        id: 2,
        name: "Caramel Macchiato Chill",
        desc: "Steamed fresh milk dipadu espresso shot pekat, sirup vanilla, dan saus karamel legit.",
        price: "32.000",
        tag: "Favorite",
      },
      {
        id: 3,
        name: "Manual Brew (V60 / Japanese)",
        desc: "Single origin beans lokal pilihan dengan floral & fruity tasting notes.",
        price: "30.000",
        tag: "Barista Pick",
      },
      {
        id: 4,
        name: "Butter Almond Croissant",
        desc: "Pastry renyah berlapis dengan taburan kacang almond panggang gurih wangi.",
        price: "25.000",
        tag: "Snack",
      },
    ],
  },
  // Nanti prospek berikutnya cukup tambah di sini:
  // "barber-slempang": { ... },
};