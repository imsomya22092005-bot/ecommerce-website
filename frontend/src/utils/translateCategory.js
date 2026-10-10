const HINDI_CATEGORIES = {
  Home: "होम",
  Men: "पुरुष",
  Women: "महिलाएँ",
  Clothing: "कपड़े",
  Fashion: "फैशन",
  Accessories: "एक्सेसरीज़",
  Footwear: "जूते",
  "New Arrivals": "नए प्रोडक्ट्स",
  "Best Sellers": "सबसे पसंदीदा",
  Collections: "कलेक्शन्स",
  "About Us": "हमारे बारे में",
  Beauty: "ब्यूटी",
  beauty: "ब्यूटी",
  "skin-care": "स्किनकेयर",
  "Skin Care": "स्किनकेयर",
  fragrances: "खुशबू और परफ्यूम",
  Fragrances: "खुशबू और परफ्यूम",
  Electronics: "इलेक्ट्रॉनिक्स",
  smartphones: "स्मार्टफोन",
  Smartphones: "स्मार्टफोन",
  laptops: "लैपटॉप",
  Laptops: "लैपटॉप",
  tablets: "टैबलेट",
  "mobile-accessories": "मोबाइल एक्सेसरीज़",
  "sports-accessories": "स्पोर्ट्स एक्सेसरीज़",
  Sports: "खेल",
  furniture: "फर्नीचर",
  Furniture: "फर्नीचर",
  "home-decoration": "होम डेकोर",
  "kitchen-accessories": "किचन एक्सेसरीज़",
  "mens-shirts": "पुरुषों की शर्ट",
  "womens-dresses": "महिलाओं की ड्रेस",
  tops: "टॉप्स",
  "mens-shoes": "पुरुषों के जूते",
  "womens-shoes": "महिलाओं के जूते",
  "mens-watches": "पुरुषों की घड़ियाँ",
  "womens-watches": "महिलाओं की घड़ियाँ",
  sunglasses: "सनग्लासेस",
  "womens-bags": "महिलाओं के बैग",
  "womens-jewellery": "महिलाओं की ज्वेलरी",
  Gadgets: "गैजेट्स",
  "Home Accessories": "होम एक्सेसरीज़",
  "SHOPSPHERE COLLECTION": "SHOPSPHERE कलेक्शन",
};

export function translateCategory(value, language = "English") {
  if (language !== "Hindi" || !value) return value;
  const key = String(value).trim();
  return HINDI_CATEGORIES[key] || key.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export default translateCategory;
