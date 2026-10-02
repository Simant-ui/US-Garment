export const SITE_CONFIG = {
  name: "US Dresses and Garment Udyog",
  shortName: "US Dresses",
  nepaliName: "युएस ड्रेस एण्ड गार्मेन्ट उद्योग",
  tagline: "गुणस्तरीय पोशाक, विश्वास हाम्रो शान",
  location: "Hetauda, Makwanpur, Bagmati Province, Nepal",
  address: "Hetauda-04, Main Road, Makwanpur, Nepal",
  phone: "+977 9855012345",
  secondaryPhone: "+977 057 523456",
  whatsapp: "+9779855012345",
  email: "info@usdresses.com.np",
  established: "2015",
  mapUrl: "https://maps.google.com/?q=Hetauda+Garment+Nepal",
  social: {
    facebook: "https://facebook.com/usdresseshetauda",
    instagram: "https://instagram.com/usdresses.nepal",
    tiktok: "https://tiktok.com/@usdresses_official",
    youtube: "https://youtube.com/@usdressesgarment",
  }
};

export const NEPAL_PROVINCES = [
  { id: 1, name: "Koshi Province" },
  { id: 2, name: "Madhesh Province" },
  { id: 3, name: "Bagmati Province" },
  { id: 4, name: "Gandaki Province" },
  { id: 5, name: "Lumbini Province" },
  { id: 6, name: "Karnali Province" },
  { id: 7, name: "Sudurpashchim Province" }
];

export const NEPAL_DISTRICTS: Record<string, string[]> = {
  "Bagmati Province": ["Makwanpur", "Kathmandu", "Lalitpur", "Bhaktapur", "Chitwan", "Kavrepalanchok", "Nuwakot", "Dhading", "Ramechhap", "Sindhuli", "Sindhupalchok", "Rasuwa", "Dolkha"],
  "Madhesh Province": ["Parsa", "Bara", "Rautahat", "Sarlahi", "Dhanusha", "Mahottari", "Siraha", "Saptari"],
  "Gandaki Province": ["Kaski", "Gorkha", "Tanahun", "Syangja", "Nawalpur", "Lamjung", "Parbat", "Baglung", "Myagdi", "Mustang", "Manang"],
  "Lumbini Province": ["Rupandehi", "Palpa", "Nawalparasi West", "Kapilvastu", "Arghakhanchi", "Gulmi", "Dang", "Banke", "Bardiya", "Pyuthan", "Rolpa", "Rukum East"],
  "Koshi Province": ["Morang", "Sunsari", "Jhapa", "Ilam", "Udayapur", "Dhankuta", "Bhojpur", "Sankhuwasabha", "Solukhumbu", "Okhaldhunga", "Khotang", "Panchthar", "Taplejung", "Tehrathum"],
  "Karnali Province": ["Surkhet", "Dailekh", "Jajarkot", "Salyan", "Rukum West", "Jumla", "Kalikot", "Humla", "Mugu", "Dolpa"],
  "Sudurpashchim Province": ["Kailali", "Kanchanpur", "Dadeldhura", "Doti", "Achham", "Baitadi", "Bajhang", "Bajura", "Darchula"]
};

export const CATEGORIES_LIST = [
  { name: "Ladies Kurtha", slug: "ladies-kurtha", icon: "Shirt" },
  { name: "Ladies Gown", slug: "ladies-gown", icon: "Sparkles" },
  { name: "T-Shirts", slug: "t-shirts", icon: "Shirt" },
  { name: "Dresses", slug: "dresses", icon: "ShoppingBag" },
  { name: "School Uniform", slug: "school-uniform", icon: "GraduationCap" },
  { name: "House Dress", slug: "house-dress", icon: "Home" },
  { name: "Sweatshirts", slug: "sweatshirts", icon: "Flame" },
  { name: "Jackets", slug: "jackets", icon: "Shield" },
  { name: "Track Suits", slug: "track-suits", icon: "Activity" },
  { name: "Sportswear", slug: "sportswear", icon: "Trophy" },
  { name: "Custom Stitching", slug: "custom-stitching", icon: "Scissors" },
  { name: "Wholesale & Bulk", slug: "wholesale", icon: "Truck" }
];

export const STANDARD_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "Free Size", "Custom"];

export const COLOR_OPTIONS = [
  { name: "Royal Green", hex: "#0F4C3A" },
  { name: "Navy Blue", hex: "#1A2B4C" },
  { name: "Maroon / Red", hex: "#8B0000" },
  { name: "Classic Black", hex: "#111111" },
  { name: "Pure White", hex: "#FFFFFF" },
  { name: "Golden Yellow", hex: "#D4AF37" },
  { name: "Rose Pink", hex: "#E75480" },
  { name: "Sky Blue", hex: "#87CEEB" },
  { name: "Heather Grey", hex: "#808080" },
  { name: "Olive Green", hex: "#556B2F" }
];
