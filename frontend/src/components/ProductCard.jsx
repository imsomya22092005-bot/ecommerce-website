import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import API_URL from "../api";

function ProductCard({ product }) {
  const { language } = useLanguage();
  const navigate = useNavigate();

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

      alert(
        language === "Hindi"
          ? "प्रोडक्ट कार्ट में जोड़ दिया गया।"
          : "Product added to cart."
      );
    } catch (error) {
      console.error("Add to cart error:", error);

      alert(
        language === "Hindi"
          ? error.message || "प्रोडक्ट कार्ट में नहीं जोड़ा जा सका।"
          : error.message || "Could not add product to cart."
      );
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
    </article>
  );
}

export default ProductCard;