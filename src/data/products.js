export const products = [
  // Laptops
  {
    id: 1,
    type: "laptops",
    name: "MacBook Air M2",
    shortDesc: "Ultra-thin and powerful for creative professionals",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=400&fit=crop",
    price: 99900,
    specs: {
      processor: "Apple M2 Chip",
      graphics: "8-core GPU",
      display: "13.6\" Liquid Retina",
    },
    launched: "July 2022",
    investment: "Excellent choice for students and professionals. The M2 chip offers incredible performance with great battery life. Perfect for coding, design, and everyday tasks.",
    buyLinks: [
      { site: "Amazon", url: "https://amazon.in" },
      { site: "Flipkart", url: "https://flipkart.com" },
      { site: "Reliance Digital", url: "https://reliancedigital.in" },
      { site: "Croma", url: "https://croma.com" },
    ],
    youtubeReviews: [
      "https://youtube.com/watch?v=macbook-air-m2-review",
      "https://youtube.com/watch?v=macbook-air-m2-unboxing"
    ],
    useCase: ["office", "casual", "creative"],
  },
  {
    id: 2,
    type: "laptops",
    name: "Dell XPS 13",
    shortDesc: "Premium ultrabook with stunning display",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=400&fit=crop",
    price: 129900,
    specs: {
      processor: "Intel i7-1260P",
      graphics: "Intel Iris Xe",
      display: "13.4\" 4K Touch",
    },
    launched: "March 2022",
    investment: "Great for business professionals and content creators. Premium build quality with excellent display. Slightly expensive but worth it for the build quality.",
    buyLinks: [
      { site: "Amazon", url: "https://amazon.in" },
      { site: "Flipkart", url: "https://flipkart.com" },
      { site: "Dell Official", url: "https://dell.com" },
    ],
    youtubeReviews: [
      "https://youtube.com/watch?v=dell-xps-13-review"
    ],
    useCase: ["office", "creative"],
  },
  {
    id: 3,
    type: "laptops",
    name: "ASUS ROG Strix G15",
    shortDesc: "Gaming powerhouse with RTX graphics",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=400&fit=crop",
    price: 89900,
    specs: {
      processor: "AMD Ryzen 7 6800H",
      graphics: "RTX 3060",
      display: "15.6\" FHD 144Hz",
    },
    launched: "January 2022",
    investment: "Perfect for gamers and content creators. Great value for money with powerful specs. The 144Hz display makes gaming smooth and enjoyable.",
    buyLinks: [
      { site: "Amazon", url: "https://amazon.in" },
      { site: "Flipkart", url: "https://flipkart.com" },
      { site: "ASUS Store", url: "https://asus.com" },
    ],
    youtubeReviews: [
      "https://youtube.com/watch?v=asus-rog-strix-g15-review"
    ],
    useCase: ["gaming", "creative"],
  },

  // Phones
  {
    id: 4,
    type: "phones",
    name: "iPhone 14 Pro",
    shortDesc: "Latest iPhone with Dynamic Island and A16 Bionic",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=400&fit=crop",
    price: 129900,
    specs: {
      processor: "A16 Bionic",
      graphics: "6-core GPU",
      display: "6.1\" Super Retina XDR",
    },
    launched: "September 2022",
    investment: "Top-tier smartphone with excellent camera system and performance. The Dynamic Island is innovative and useful. Great for photography enthusiasts and power users.",
    buyLinks: [
      { site: "Amazon", url: "https://amazon.in" },
      { site: "Flipkart", url: "https://flipkart.com" },
      { site: "Apple Store", url: "https://apple.com" },
      { site: "Reliance Digital", url: "https://reliancedigital.in" },
    ],
    youtubeReviews: [
      "https://youtube.com/watch?v=iphone-14-pro-review",
      "https://youtube.com/watch?v=iphone-14-pro-camera-test"
    ],
    useCase: ["casual", "creative", "office"],
  },
  {
    id: 5,
    type: "phones",
    name: "Samsung Galaxy S23 Ultra",
    shortDesc: "Android flagship with S Pen and 200MP camera",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=400&fit=crop",
    price: 124999,
    specs: {
      processor: "Snapdragon 8 Gen 2",
      graphics: "Adreno 740",
      display: "6.8\" Dynamic AMOLED 2X",
    },
    launched: "February 2023",
    investment: "Excellent Android flagship with S Pen functionality. Great for note-taking and productivity. The camera system is outstanding for photography and videography.",
    buyLinks: [
      { site: "Amazon", url: "https://amazon.in" },
      { site: "Flipkart", url: "https://flipkart.com" },
      { site: "Samsung Store", url: "https://samsung.com" },
      { site: "Croma", url: "https://croma.com" },
    ],
    youtubeReviews: [
      "https://youtube.com/watch?v=galaxy-s23-ultra-review"
    ],
    useCase: ["creative", "office", "gaming"],
  },
  {
    id: 6,
    type: "phones",
    name: "OnePlus 11",
    shortDesc: "Flagship killer with Snapdragon 8 Gen 2",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=400&fit=crop",
    price: 56999,
    specs: {
      processor: "Snapdragon 8 Gen 2",
      graphics: "Adreno 740",
      display: "6.7\" Fluid AMOLED",
    },
    launched: "February 2023",
    investment: "Great value for money with flagship performance. OxygenOS is clean and fast. Perfect for users who want premium features without the premium price tag.",
    buyLinks: [
      { site: "Amazon", url: "https://amazon.in" },
      { site: "Flipkart", url: "https://flipkart.com" },
      { site: "OnePlus Store", url: "https://oneplus.com" },
    ],
    youtubeReviews: [
      "https://youtube.com/watch?v=oneplus-11-review"
    ],
    useCase: ["casual", "office", "gaming"],
  },

  // Tablets
  {
    id: 7,
    type: "tablets",
    name: "iPad Pro 12.9\"",
    shortDesc: "Professional tablet for creators and professionals",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=400&fit=crop",
    price: 89900,
    specs: {
      processor: "M2 Chip",
      graphics: "10-core GPU",
      display: "12.9\" Liquid Retina XDR",
    },
    launched: "October 2022",
    investment: "Perfect for digital artists, designers, and professionals. The M2 chip provides desktop-class performance. Great for content creation and productivity.",
    buyLinks: [
      { site: "Amazon", url: "https://amazon.in" },
      { site: "Flipkart", url: "https://flipkart.com" },
      { site: "Apple Store", url: "https://apple.com" },
    ],
    youtubeReviews: [
      "https://youtube.com/watch?v=ipad-pro-12-9-review"
    ],
    useCase: ["creative", "office"],
  },
  {
    id: 8,
    type: "tablets",
    name: "Samsung Galaxy Tab S8 Ultra",
    shortDesc: "Android tablet with S Pen and large display",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=400&fit=crop",
    price: 109999,
    specs: {
      processor: "Snapdragon 8 Gen 1",
      graphics: "Adreno 730",
      display: "14.6\" Super AMOLED",
    },
    launched: "February 2022",
    investment: "Excellent Android tablet with S Pen included. Great for note-taking and productivity. The large display is perfect for multitasking and media consumption.",
    buyLinks: [
      { site: "Amazon", url: "https://amazon.in" },
      { site: "Flipkart", url: "https://flipkart.com" },
      { site: "Samsung Store", url: "https://samsung.com" },
    ],
    youtubeReviews: [
      "https://youtube.com/watch?v=galaxy-tab-s8-ultra-review"
    ],
    useCase: ["creative", "office", "casual"],
  },

  // Earphones
  {
    id: 9,
    type: "earphones",
    name: "AirPods Pro 2",
    shortDesc: "Premium wireless earbuds with active noise cancellation",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=400&fit=crop",
    price: 24900,
    specs: {
      processor: "H2 Chip",
      graphics: "N/A",
      display: "N/A",
    },
    launched: "September 2022",
    investment: "Best-in-class noise cancellation and sound quality. Perfect for iPhone users with seamless integration. Great for calls, music, and productivity.",
    buyLinks: [
      { site: "Amazon", url: "https://amazon.in" },
      { site: "Flipkart", url: "https://flipkart.com" },
      { site: "Apple Store", url: "https://apple.com" },
      { site: "Reliance Digital", url: "https://reliancedigital.in" },
    ],
    youtubeReviews: [
      "https://youtube.com/watch?v=airpods-pro-2-review"
    ],
    useCase: ["casual", "office"],
  },
  {
    id: 10,
    type: "earphones",
    name: "Sony WH-1000XM5",
    shortDesc: "Industry-leading noise-canceling headphones",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=400&fit=crop",
    price: 32990,
    specs: {
      processor: "V1 Processor",
      graphics: "N/A",
      display: "N/A",
    },
    launched: "May 2022",
    investment: "Exceptional noise cancellation and audio quality. Comfortable for long listening sessions. Great for travelers and audiophiles.",
    buyLinks: [
      { site: "Amazon", url: "https://amazon.in" },
      { site: "Flipkart", url: "https://flipkart.com" },
      { site: "Sony Store", url: "https://sony.com" },
      { site: "Croma", url: "https://croma.com" },
    ],
    youtubeReviews: [
      "https://youtube.com/watch?v=sony-wh-1000xm5-review"
    ],
    useCase: ["casual", "office", "travel"],
  },
  {
    id: 11,
    type: "earphones",
    name: "Samsung Galaxy Buds2 Pro",
    shortDesc: "Premium wireless earbuds with 24-bit Hi-Fi audio",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=400&fit=crop",
    price: 18990,
    specs: {
      processor: "Samsung Audio Codec",
      graphics: "N/A",
      display: "N/A",
    },
    launched: "August 2022",
    investment: "Great alternative to AirPods for Android users. Excellent sound quality and comfort. Good value for money with premium features.",
    buyLinks: [
      { site: "Amazon", url: "https://amazon.in" },
      { site: "Flipkart", url: "https://flipkart.com" },
      { site: "Samsung Store", url: "https://samsung.com" },
    ],
    youtubeReviews: [
      "https://youtube.com/watch?v=galaxy-buds2-pro-review"
    ],
    useCase: ["casual", "office", "fitness"],
  },
];