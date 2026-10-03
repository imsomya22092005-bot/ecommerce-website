import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "../LanguageContext";

function ProductDetails() {
  const { id } = useParams();
  const { language } = useLanguage();
  const [added, setAdded] = useState(false);

  const products = [
    {
      id: 1,
      name:
        language === "Hindi"
          ? "क्लासिक बेज जैकेट"
          : "Classic Beige Jacket",
      price: 2499,
      category: "Fashion",
      description:
        language === "Hindi"
          ? "रोज़मर्रा की आसान और खूबसूरत स्टाइल के लिए डिज़ाइन की गई एक शानदार बेज जैकेट। इसका साफ़ और आरामदायक डिज़ाइन आपके पसंदीदा आउटफिट्स के साथ आसानी से मैच हो जाता है।"
          : "A timeless beige jacket designed for effortless everyday style. Clean, comfortable and easy to pair with your favorite outfits.",
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80",
    },

    {
      id: 2,
      name:
        language === "Hindi"
          ? "मिनिमल लेदर बैग"
          : "Minimal Leather Bag",
      price: 1999,
      category: "Accessories",
      description:
        language === "Hindi"
          ? "साफ़ और खूबसूरत डिज़ाइन वाला मिनिमल लेदर बैग, जो रोज़मर्रा के इस्तेमाल और आधुनिक लुक के लिए बिल्कुल सही है।"
          : "A minimal leather bag with a clean silhouette, perfect for everyday use and modern looks.",
      image:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80",
    },

    {
      id: 3,
      name:
        language === "Hindi"
          ? "क्लासिक व्हाइट स्नीकर्स"
          : "Classic White Sneakers",
      price: 2999,
      category: "Footwear",
      description:
        language === "Hindi"
          ? "सिंपल और बहुमुखी व्हाइट स्नीकर्स, जिन्हें आपके रोज़मर्रा के वॉर्डरोब के साथ आसानी से पहना जा सकता है।"
          : "Simple and versatile white sneakers created to complement your everyday wardrobe.",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80",
    },

    {
      id: 4,
      name:
        language === "Hindi"
          ? "एवरीडे कलाई घड़ी"
          : "Everyday Wrist Watch",
      price: 3499,
      category: "Accessories",
      description:
        language === "Hindi"
          ? "क्लीन डिज़ाइन और खूबसूरत रोज़मर्रा के लुक के साथ बनाई गई एक क्लासिक कलाई घड़ी।"
          : "A classic wrist watch combining a clean design with an elegant everyday aesthetic.",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
    },
  ];

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return (
      <main className="product-not-found">
        <h1>
          {language === "Hindi"
            ? "प्रोडक्ट नहीं मिला"
            : "Product Not Found"}
        </h1>

        <Link to="/products">
          {language === "Hindi"
            ? "प्रोडक्ट्स पर वापस जाएं"
            : "Back to Products"}
        </Link>
      </main>
    );
  }

  return (
    <main className="product-details">
      <div className="details-image-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="details-image"
        />
      </div>

      <div className="details-content">
        <p className="details-category">
          {language === "Hindi"
            ? product.category === "Fashion"
              ? "फैशन"
              : product.category === "Accessories"
              ? "एक्सेसरीज़"
              : product.category === "Footwear"
              ? "फुटवियर"
              : product.category
            : product.category}
        </p>

        <h1>{product.name}</h1>

        <p className="details-price">
          ₹{product.price}
        </p>

        <div className="details-line"></div>

        <p className="details-description">
          {product.description}
        </p>

        <div className="details-actions">

          {/* ADD TO CART */}
          <button
            className="add-cart-btn"
            onClick={() => {
              const existingCart =
                JSON.parse(localStorage.getItem("cart")) || [];

              const existingProduct = existingCart.find(
                (item) => item.id === product.id
              );

              let updatedCart;

              if (existingProduct) {
                updatedCart = existingCart.map((item) =>
                  item.id === product.id
                    ? {
                        ...item,
                        quantity: item.quantity + 1,
                      }
                    : item
                );
              } else {
                updatedCart = [
                  ...existingCart,
                  {
                    ...product,
                    quantity: 1,
                  },
                ];
              }

              localStorage.setItem(
                "cart",
                JSON.stringify(updatedCart)
              );

              window.dispatchEvent(
                new Event("cartUpdated")
              );

              setAdded(true);
            }}
          >
            {added
              ? language === "Hindi"
                ? "कार्ट में जोड़ा गया ✓"
                : "ADDED TO CART ✓"
              : language === "Hindi"
              ? "कार्ट में जोड़ें"
              : "ADD TO CART"}
          </button>

          {/* WISHLIST */}
          <button
            className="wishlist-btn"
            onClick={() => {
              const wishlist =
                JSON.parse(
                  localStorage.getItem("wishlist")
                ) || [];

              const alreadySaved = wishlist.some(
                (item) => item.id === product.id
              );

              if (alreadySaved) {
                const updatedWishlist = wishlist.filter(
                  (item) => item.id !== product.id
                );

                localStorage.setItem(
                  "wishlist",
                  JSON.stringify(updatedWishlist)
                );
              } else {
                const updatedWishlist = [
                  ...wishlist,
                  product,
                ];

                localStorage.setItem(
                  "wishlist",
                  JSON.stringify(updatedWishlist)
                );
              }

              window.dispatchEvent(
                new Event("wishlistUpdated")
              );
            }}
          >
            ♡
          </button>
        </div>

        {/* PRODUCT INFO */}
        <div className="product-info-box">
          <div>
            <strong>
              {language === "Hindi"
                ? "फ्री शिपिंग"
                : "FREE SHIPPING"}
            </strong>

            <span>
              {language === "Hindi"
                ? "₹999 से अधिक के ऑर्डर पर"
                : "On orders over ₹999"}
            </span>
          </div>

          <div>
            <strong>
              {language === "Hindi"
                ? "आसान रिटर्न"
                : "EASY RETURNS"}
            </strong>

            <span>
              {language === "Hindi"
                ? "30 दिन की रिटर्न पॉलिसी"
                : "30-day return policy"}
            </span>
          </div>

          <div>
            <strong>
              {language === "Hindi"
                ? "सुरक्षित भुगतान"
                : "SECURE PAYMENT"}
            </strong>

            <span>
              {language === "Hindi"
                ? "100% सुरक्षित चेकआउट"
                : "100% secure checkout"}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;