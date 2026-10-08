import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "../LanguageContext";
import API_URL from "../api";

function ProductCard({ product }) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState("");

  const productId = product._id || product.id;

  const handleAddToCart = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert(
        language === "Hindi"
          ? "कार्ट में जोड़ने के लिए पहले लॉगिन करें।"
          : "Please login first to add products to cart."
      );

      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          size: product.variants?.[0]?.size || product.sizes?.[0],
          color: product.variants?.[0]?.color || product.colors?.[0],
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not add product to cart."
        );
      }

      window.dispatchEvent(new Event("cartUpdated"));

      setToastMessage(
        language === "Hindi"
          ? "प्रोडक्ट कार्ट में जोड़ दिया गया ✨"
          : "Product added to cart ✨"
      );

      setTimeout(() => {
        setToastMessage("");
      }, 2500);
    } catch (error) {
      console.error("Add to cart error:", error);

      setToastMessage(
        language === "Hindi"
          ? error.message || "प्रोडक्ट कार्ट में नहीं जोड़ा जा सका।"
          : error.message || "Could not add product to cart."
      );

      setTimeout(() => {
        setToastMessage("");
      }, 3000);
    }
  };

  return (
    <article className="product-card">
      <Link
        to={`/product/${productId}`}
        className="product-image-wrapper"
      >
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />
      </Link>

      <div className="product-info">
        <p className="product-category">
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

        <Link
          to={`/product/${productId}`}
          className="product-name"
        >
          {product.name}
        </Link>

        <p className="product-price">
          ₹{product.price}
        </p>

        <p
          style={{
            margin: "6px 0 12px",
            fontSize: "11px",
            color: "#8a6245",
            letterSpacing: "0.5px",
          }}
        >
          ★ {Number(product.rating || 0).toFixed(1)}
          {" "}
          <span style={{ color: "#777" }}>
            ({Number(product.reviewCount || 0)} reviews)
          </span>
        </p>

        <button
          type="button"
          className="product-add-btn"
          onClick={handleAddToCart}
        >
          {language === "Hindi"
            ? "कार्ट में जोड़ें"
            : "ADD TO CART"}
        </button>
      </div>

      {toastMessage && (
        <div className="cart-toast" role="status">
          <span className="cart-toast-icon">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </article>
  );
}

export default ProductCard;