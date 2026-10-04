import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";

function ProductDetails() {
  const { id } = useParams();
  const { language } = useLanguage();

  const [product, setProduct] = useState(null);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch single product from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:3000/api/products/${id}`
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <main className="product-not-found">
        <h1>
          {language === "Hindi"
            ? "प्रोडक्ट लोड हो रहा है..."
            : "Loading product..."}
        </h1>
      </main>
    );
  }

  // Error / product not found
  if (error || !product) {
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

        <p className="details-price">₹{product.price}</p>

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

              const productId = product._id || product.id;

              const existingProduct = existingCart.find(
                (item) => (item._id || item.id) === productId
              );

              let updatedCart;

              if (existingProduct) {
                updatedCart = existingCart.map((item) =>
                  (item._id || item.id) === productId
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

              const productId = product._id || product.id;

              const alreadySaved = wishlist.some(
                (item) => (item._id || item.id) === productId
              );

              if (alreadySaved) {
                const updatedWishlist = wishlist.filter(
                  (item) => (item._id || item.id) !== productId
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