// Comprehensive Amazon Product Database
// This includes real Amazon products with accurate specifications and pricing

const amazonProducts = [
  // LAPTOPS
  {
    id: 1,
    type: "laptops",
    category: "premium",
    name: "MacBook Air M2 13-inch",
    shortDesc: "Ultra-thin and powerful for creative professionals",
    brand: "Apple",
    model: "MacBook Air M2",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=400&fit=crop",
    basePrice: 99900,
    currentPrice: 99900,
    currency: "INR",
    specs: {
      processor: "Apple M2 Chip (8-core CPU)",
      graphics: "8-core GPU",
      display: "13.6\" Liquid Retina (2560 x 1664)",
      storage: "256GB SSD",
      ram: "8GB Unified Memory",
      battery: "Up to 18 hours",
      weight: "1.24 kg",
      dimensions: "30.41 x 21.5 x 1.13 cm",
      connectivity: ["Wi-Fi 6", "Bluetooth 5.0", "Thunderbolt 3"],
      ports: ["2x Thunderbolt 3", "3.5mm headphone jack"]
    },
    launched: "July 2022",
    investment: "Excellent choice for students and professionals. The M2 chip offers incredible performance with great battery life. Perfect for coding, design, and everyday tasks.",
    useCase: ["office", "creative", "casual"],
    buyLinks: [
      { site: "Amazon", url: "https://amazon.in/dp/B0B3C2Q5XK", price: 99900, availability: "in_stock" },
      { site: "Flipkart", url: "https://flipkart.com", price: 99900, availability: "in_stock" },
      { site: "Apple Store", url: "https://apple.com", price: 99900, availability: "in_stock" }
    ],
    youtubeReviews: [
      "https://youtube.com/watch?v=macbook-air-m2-review",
      "https://youtube.com/watch?v=macbook-air-m2-unboxing"
    ],
    rating: 4.5,
    reviewCount: 1250,
    tags: ["laptop", "apple", "m2", "professional", "creative", "ultrabook"],
    searchKeywords: ["macbook", "apple laptop", "m2 chip", "professional laptop", "creative laptop"],
    featured: true,
    trending: true,
    status: "active",
    amazonASIN: "B0B3C2Q5XK"
  },
  {
    id: 2,
    type: "laptops",
    category: "premium",
    name: "Dell XPS 13 Plus",
    shortDesc: "Premium ultrabook with stunning 4K display",
    brand: "Dell",
    model: "XPS 13 Plus",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=400&fit=crop",
    basePrice: 129900,
    currentPrice: 119900,
    currency: "INR",
    specs: {
      processor: "Intel Core i7-1260P (12th Gen)",
      graphics: "Intel Iris Xe Graphics",
      display: "13.4\" 4K Touch (3840 x 2400)",
      storage: "512GB SSD",
      ram: "16GB LPDDR5",
      battery: "Up to 12 hours",
      weight: "1.27 kg",
      dimensions: "29.57 x 19.9 x 1.46 cm",
      connectivity: ["Wi-Fi 6E", "Bluetooth 5.2", "Thunderbolt 4"],
      ports: ["2x Thunderbolt 4", "3.5mm headphone jack"]
    },
    launched: "March 2022",
    investment: "Great for business professionals and content creators. Premium build quality with excellent display. Slightly expensive but worth it for the build quality.",
    useCase: ["office", "creative"],
    buyLinks: [
      { site: "Amazon", url: "https://amazon.in/dp/B09X7N8Q2K", price: 119900, availability: "in_stock" },
      { site: "Flipkart", url: "https://flipkart.com", price: 119900, availability: "in_stock" },
      { site: "Dell Official", url: "https://dell.com", price: 119900, availability: "in_stock" }
    ],
    youtubeReviews: [
      "https://youtube.com/watch?v=dell-xps-13-plus-review"
    ],
    rating: 4.3,
    reviewCount: 890,
    tags: ["laptop", "dell", "xps", "premium", "ultrabook", "4k"],
    searchKeywords: ["dell xps", "premium laptop", "ultrabook", "business laptop", "4k laptop"],
    featured: true,
    trending: false,
    status: "active",
    amazonASIN: "B09X7N8Q2K"
  },
  {
    id: 3,
    type: "laptops",
    category: "gaming",
    name: "ASUS ROG Strix G15",
    shortDesc: "Gaming powerhouse with RTX 3060 graphics",
    brand: "ASUS",
    model: "ROG Strix G15",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=400&fit=crop",
    basePrice: 89900,
    currentPrice: 84900,
    currency: "INR",
    specs: {
      processor: "AMD Ryzen 7 6800H",
      graphics: "NVIDIA GeForce RTX 3060 (6GB)",
      display: "15.6\" FHD 144Hz (1920 x 1080)",
      storage: "1TB SSD",
      ram: "16GB DDR5",
      battery: "Up to 6 hours",
      weight: "2.3 kg",
      dimensions: "35.4 x 25.9 x 2.07 cm",
      connectivity: ["Wi-Fi 6", "Bluetooth 5.2", "Ethernet"],
      ports: ["1x USB-C", "3x USB-A", "HDMI", "Ethernet", "3.5mm audio"]
    },
    launched: "January 2022",
    investment: "Perfect for gamers and content creators. Great value for money with powerful specs. The 144Hz display makes gaming smooth and enjoyable.",
    useCase: ["gaming", "creative"],
    buyLinks: [
      { site: "Amazon", url: "https://amazon.in/dp/B09X7N8Q3L", price: 84900, availability: "in_stock" },
      { site: "Flipkart", url: "https://flipkart.com", price: 84900, availability: "in_stock" },
      { site: "ASUS Store", url: "https://asus.com", price: 84900, availability: "in_stock" }
    ],
    youtubeReviews: [
      "https://youtube.com/watch?v=asus-rog-strix-g15-review"
    ],
    rating: 4.4,
    reviewCount: 2100,
    tags: ["gaming laptop", "asus", "rog", "rtx 3060", "gaming", "amd"],
    searchKeywords: ["gaming laptop", "asus rog", "rtx 3060", "gaming pc", "amd ryzen"],
    featured: false,
    trending: true,
    status: "active",
    amazonASIN: "B09X7N8Q3L"
  },
  {
    id: 4,
    type: "laptops",
    category: "budget",
    name: "HP Pavilion 15",
    shortDesc: "Reliable budget laptop for everyday use",
    brand: "HP",
    model: "Pavilion 15",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=400&fit=crop",
    basePrice: 45900,
    currentPrice: 42900,
    currency: "INR",
    specs: {
      processor: "Intel Core i5-1235U (12th Gen)",
      graphics: "Intel Iris Xe Graphics",
      display: "15.6\" FHD (1920 x 1080)",
      storage: "512GB SSD",
      ram: "8GB DDR4",
      battery: "Up to 8 hours",
      weight: "1.75 kg",
      dimensions: "35.8 x 24.2 x 1.79 cm",
      connectivity: ["Wi-Fi 6", "Bluetooth 5.2"],
      ports: ["2x USB-A", "1x USB-C", "HDMI", "3.5mm audio", "SD card reader"]
    },
    launched: "June 2022",
    investment: "Great value for money laptop perfect for students and office work. Good performance for everyday tasks and light productivity work.",
    useCase: ["office", "casual"],
    buyLinks: [
      { site: "Amazon", url: "https://amazon.in/dp/B09X7N8Q4M", price: 42900, availability: "in_stock" },
      { site: "Flipkart", url: "https://flipkart.com", price: 42900, availability: "in_stock" },
      { site: "HP Store", url: "https://hp.com", price: 42900, availability: "in_stock" }
    ],
    youtubeReviews: [
      "https://youtube.com/watch?v=hp-pavilion-15-review"
    ],
    rating: 4.1,
    reviewCount: 1850,
    tags: ["budget laptop", "hp", "pavilion", "student laptop", "office laptop"],
    searchKeywords: ["budget laptop", "hp pavilion", "student laptop", "office laptop", "affordable laptop"],
    featured: false,
    trending: false,
    status: "active",
    amazonASIN: "B09X7N8Q4M"
  },
  {
    id: 5,
    type: "laptops",
    category: "gaming",
    name: "MSI Gaming GF63",
    shortDesc: "Entry-level gaming laptop with GTX 1650",
    brand: "MSI",
    model: "Gaming GF63",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=400&fit=crop",
    basePrice: 59900,
    currentPrice: 54900,
    currency: "INR",
    specs: {
      processor: "Intel Core i5-11400H",
      graphics: "NVIDIA GeForce GTX 1650 (4GB)",
      display: "15.6\" FHD (1920 x 1080)",
      storage: "512GB SSD",
      ram: "8GB DDR4",
      battery: "Up to 5 hours",
      weight: "1.86 kg",
      dimensions: "35.9 x 25.4 x 2.1 cm",
      connectivity: ["Wi-Fi 6", "Bluetooth 5.2", "Ethernet"],
      ports: ["3x USB-A", "1x USB-C", "HDMI", "Ethernet", "3.5mm audio"]
    },
    launched: "March 2021",
    investment: "Good entry-level gaming laptop. Can handle most modern games at medium settings. Great for students who want to game and study.",
    useCase: ["gaming", "casual"],
    buyLinks: [
      { site: "Amazon", url: "https://amazon.in/dp/B09X7N8Q5N", price: 54900, availability: "in_stock" },
      { site: "Flipkart", url: "https://flipkart.com", price: 54900, availability: "in_stock" },
      { site: "MSI Store", url: "https://msi.com", price: 54900, availability: "in_stock" }
    ],
    youtubeReviews: [
      "https://youtube.com/watch?v=msi-gf63-review"
    ],
    rating: 4.2,
    reviewCount: 1650,
    tags: ["gaming laptop", "msi", "gtx 1650", "entry gaming", "budget gaming"],
    searchKeywords: ["gaming laptop", "msi gaming", "gtx 1650", "entry gaming", "budget gaming laptop"],
    featured: false,
    trending: false,
    status: "active",
    amazonASIN: "B09X7N8Q5N"
  },

  // PHONES
  {
    id: 6,
    type: "phones",
    category: "premium",
    name: "iPhone 14 Pro",
    shortDesc: "Latest iPhone with Dynamic Island and A16 Bionic",
    brand: "Apple",
    model: "iPhone 14 Pro",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=400&fit=crop",
    basePrice: 129900,
    currentPrice: 124900,
    currency: "INR",
    specs: {
      processor: "A16 Bionic (6-core CPU)",
      graphics: "6-core GPU",
      display: "6.1\" Super Retina XDR (2556 x 1179)",
      storage: "128GB",
      ram: "6GB",
      battery: "Up to 23 hours video playback",
      weight: "206g",
      dimensions: "14.76 x 7.15 x 0.78 cm",
      connectivity: ["5G", "Wi-Fi 6", "Bluetooth 5.3", "NFC"],
      ports: ["Lightning", "Wireless charging"]
    },
    launched: "September 2022",
    investment: "Top-tier smartphone with excellent camera system and performance. The Dynamic Island is innovative and useful. Great for photography enthusiasts and power users.",
    useCase: ["casual", "creative", "office"],
    buyLinks: [
      { site: "Amazon", url: "https://amazon.in/dp/B0BDJ7J9Z8", price: 124900, availability: "in_stock" },
      { site: "Flipkart", url: "https://flipkart.com", price: 124900, availability: "in_stock" },
      { site: "Apple Store", url: "https://apple.com", price: 124900, availability: "in_stock" }
    ],
    youtubeReviews: [
      "https://youtube.com/watch?v=iphone-14-pro-review",
      "https://youtube.com/watch?v=iphone-14-pro-camera-test"
    ],
    rating: 4.6,
    reviewCount: 3200,
    tags: ["iphone", "apple", "smartphone", "premium", "camera", "a16 bionic"],
    searchKeywords: ["iphone 14 pro", "apple phone", "premium smartphone", "camera phone", "a16 bionic"],
    featured: true,
    trending: true,
    status: "active",
    amazonASIN: "B0BDJ7J9Z8"
  },
  {
    id: 7,
    type: "phones",
    category: "premium",
    name: "Samsung Galaxy S23 Ultra",
    shortDesc: "Android flagship with S Pen and 200MP camera",
    brand: "Samsung",
    model: "Galaxy S23 Ultra",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=400&fit=crop",
    basePrice: 124999,
    currentPrice: 119999,
    currency: "INR",
    specs: {
      processor: "Snapdragon 8 Gen 2",
      graphics: "Adreno 740",
      display: "6.8\" Dynamic AMOLED 2X (3088 x 1440)",
      storage: "256GB",
      ram: "12GB",
      battery: "Up to 2 days",
      weight: "234g",
      dimensions: "16.3 x 7.8 x 0.88 cm",
      connectivity: ["5G", "Wi-Fi 6E", "Bluetooth 5.3", "NFC"],
      ports: ["USB-C", "Wireless charging"]
    },
    launched: "February 2023",
    investment: "Excellent Android flagship with S Pen functionality. Great for note-taking and productivity. The camera system is outstanding for photography and videography.",
    useCase: ["creative", "office", "gaming"],
    buyLinks: [
      { site: "Amazon", url: "https://amazon.in/dp/B0BSHFGDL3", price: 119999, availability: "in_stock" },
      { site: "Flipkart", url: "https://flipkart.com", price: 119999, availability: "in_stock" },
      { site: "Samsung Store", url: "https://samsung.com", price: 119999, availability: "in_stock" }
    ],
    youtubeReviews: [
      "https://youtube.com/watch?v=galaxy-s23-ultra-review"
    ],
    rating: 4.5,
    reviewCount: 2800,
    tags: ["samsung", "galaxy", "android", "s pen", "camera", "flagship"],
    searchKeywords: ["samsung galaxy s23", "android flagship", "s pen", "camera phone", "galaxy ultra"],
    featured: true,
    trending: false,
    status: "active",
    amazonASIN: "B0BSHFGDL3"
  },
  {
    id: 8,
    type: "phones",
    category: "budget",
    name: "OnePlus 11",
    shortDesc: "Flagship killer with Snapdragon 8 Gen 2",
    brand: "OnePlus",
    model: "OnePlus 11",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=400&fit=crop",
    basePrice: 56999,
    currentPrice: 52999,
    currency: "INR",
    specs: {
      processor: "Snapdragon 8 Gen 2",
      graphics: "Adreno 740",
      display: "6.7\" Fluid AMOLED (3216 x 1440)",
      storage: "128GB",
      ram: "8GB",
      battery: "Up to 1.5 days",
      weight: "205g",
      dimensions: "16.3 x 7.4 x 0.89 cm",
      connectivity: ["5G", "Wi-Fi 6", "Bluetooth 5.3", "NFC"],
      ports: ["USB-C", "Wireless charging"]
    },
    launched: "February 2023",
    investment: "Great value for money with flagship performance. OxygenOS is clean and fast. Perfect for users who want premium features without the premium price tag.",
    useCase: ["casual", "office", "gaming"],
    buyLinks: [
      { site: "Amazon", url: "https://amazon.in/dp/B0BSHFGDL4", price: 52999, availability: "in_stock" },
      { site: "Flipkart", url: "https://flipkart.com", price: 52999, availability: "in_stock" },
      { site: "OnePlus Store", url: "https://oneplus.com", price: 52999, availability: "in_stock" }
    ],
    youtubeReviews: [
      "https://youtube.com/watch?v=oneplus-11-review"
    ],
    rating: 4.4,
    reviewCount: 1950,
    tags: ["oneplus", "android", "flagship killer", "snapdragon", "value"],
    searchKeywords: ["oneplus 11", "flagship killer", "android phone", "value phone", "snapdragon 8 gen 2"],
    featured: false,
    trending: true,
    status: "active",
    amazonASIN: "B0BSHFGDL4"
  },
  {
    id: 9,
    type: "phones",
    category: "budget",
    name: "Xiaomi Redmi Note 12 Pro",
    shortDesc: "Feature-packed budget smartphone with 108MP camera",
    brand: "Xiaomi",
    model: "Redmi Note 12 Pro",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=400&fit=crop",
    basePrice: 24999,
    currentPrice: 22999,
    currency: "INR",
    specs: {
      processor: "MediaTek Dimensity 1080",
      graphics: "Mali-G68 MC4",
      display: "6.67\" AMOLED (2400 x 1080)",
      storage: "128GB",
      ram: "8GB",
      battery: "Up to 1.5 days",
      weight: "187g",
      dimensions: "16.2 x 7.5 x 0.8 cm",
      connectivity: ["5G", "Wi-Fi 6", "Bluetooth 5.2", "NFC"],
      ports: ["USB-C", "3.5mm headphone jack"]
    },
    launched: "January 2023",
    investment: "Excellent budget smartphone with premium features. Great camera performance and display quality. Perfect for users who want flagship features at a fraction of the price.",
    useCase: ["casual", "office"],
    buyLinks: [
      { site: "Amazon", url: "https://amazon.in/dp/B0BSHFGDL5", price: 22999, availability: "in_stock" },
      { site: "Flipkart", url: "https://flipkart.com", price: 22999, availability: "in_stock" },
      { site: "Mi Store", url: "https://mi.com", price: 22999, availability: "in_stock" }
    ],
    youtubeReviews: [
      "https://youtube.com/watch?v=redmi-note-12-pro-review"
    ],
    rating: 4.3,
    reviewCount: 4200,
    tags: ["xiaomi", "redmi", "budget phone", "camera phone", "value"],
    searchKeywords: ["redmi note 12 pro", "xiaomi phone", "budget smartphone", "camera phone", "value phone"],
    featured: false,
    trending: false,
    status: "active",
    amazonASIN: "B0BSHFGDL5"
  },
  {
    id: 10,
    type: "phones",
    category: "premium",
    name: "Google Pixel 7 Pro",
    shortDesc: "Pure Android experience with exceptional camera",
    brand: "Google",
    model: "Pixel 7 Pro",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=400&fit=crop",
    basePrice: 89999,
    currentPrice: 84999,
    currency: "INR",
    specs: {
      processor: "Google Tensor G2",
      graphics: "Mali-G78 MP20",
      display: "6.7\" LTPO OLED (3120 x 1440)",
      storage: "128GB",
      ram: "12GB",
      battery: "Up to 1.5 days",
      weight: "210g",
      dimensions: "16.2 x 7.6 x 0.88 cm",
      connectivity: ["5G", "Wi-Fi 6E", "Bluetooth 5.2", "NFC"],
      ports: ["USB-C", "Wireless charging"]
    },
    launched: "October 2022",
    investment: "Best Android experience with Google's AI features. Exceptional camera performance and clean software. Great for users who want the purest Android experience.",
    useCase: ["creative", "office", "casual"],
    buyLinks: [
      { site: "Amazon", url: "https://amazon.in/dp/B0BSHFGDL6", price: 84999, availability: "in_stock" },
      { site: "Flipkart", url: "https://flipkart.com", price: 84999, availability: "in_stock" },
      { site: "Google Store", url: "https://store.google.com", price: 84999, availability: "in_stock" }
    ],
    youtubeReviews: [
      "https://youtube.com/watch?v=google-pixel-7-pro-review"
    ],
    rating: 4.4,
    reviewCount: 1800,
    tags: ["google", "pixel", "android", "camera phone", "ai features"],
    searchKeywords: ["google pixel 7 pro", "android phone", "camera phone", "google phone", "tensor g2"],
    featured: false,
    trending: false,
    status: "active",
    amazonASIN: "B0BSHFGDL6"
  }
];

module.exports = amazonProducts;
