export interface MenuItem {
  id: number;
  name: string;
  desc: string;
  price: string;
  tag?: string;
  category?: string;
  imageUrl?: string;
}

export interface DoctorInfo {
  name: string;
  role: string;
  avatarEmoji?: string;
  avatarUrl?: string;
  sampleChat?: {
    user: string;
    doctor: string;
    recommendationTitle: string;
    recommendationDesc: string;
  };
}

export interface ReviewInfo {
  authorName: string;
  rating: number;
  text: string;
  time?: string;
}

export interface BusinessDemo {
  name: string;
  category: string;
  city: string;
  rating: number;
  reviewCount: number;
  phone: string;
  address: string;
  googleMapsUrl: string;
  hours: string;
  waNumber: string; // format internasional tanpa tanda +, contoh: 628123456789
  tagline: string;
  iconEmoji: string;
  doctor: DoctorInfo;
  categories: string[];
  menu: MenuItem[];
  reviews?: ReviewInfo[];
}
