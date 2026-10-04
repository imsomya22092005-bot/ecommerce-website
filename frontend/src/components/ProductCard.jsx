import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

import API_URL from "../api";

function ProductCard({ product }) {
  const { language } = useLanguage();

  const productId = product._id || product.id;

  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart = async () => {
    const token = localStorage.getItem("authToken");

    // =================================
    // LOGGED-IN USER → BACKEND CART
    // =================================

    if (token) {
      try {
        const response = await fetch(
          `${API_URL}/api/cart/add`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              productId,
              quantity: 1,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Could not add product to cart"
          );
        }

        // =========================
        // SAVE BACKEND CART LOCALLY
        // =========================

        if (data.cart) {
          const backendCart =
            data.cart.items || [];

          const normalizedCart =
            backendCart
              .filter((item) => item.product)
              .map((item) => ({
                _id: item.product._id,
                id: item.product._id,
                name: item.product.name,
                price: Number(item.product.price) || 0,
                image:
                  item.product.image ||
                  item.product.imageUrl ||
                  "",
                category:
                  item.product.category || "",
                quantity:
                  Number(item.quantity) || 1,
              }));

          localStorage.setItem(
            "cart",
            JSON.stringify(normalizedCart)
          );
        }

        window.dispatchEvent(
          new Event("cartUpdated")
        );

        return;
      } catch (error) {
        console.error(
          "Add to cart error:",
          error
        );

        alert(
          language === "Hindi"
            ? error.message ||
                "प्रोडक्ट कार्ट में नहीं जोड़ा जा सका।"
            : error.message ||
                "Could not add product to cart."
        );

        return;
      }
    }

    // =================================
    // GUEST USER → LOCAL CART
    // =================================

    const existingCart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    const existingItem =
      existingCart.find(
        (item) =>
          (item._id || item.id) ===
          productId
      );

    let updatedCart;

    if (existingItem) {
      updatedCart = existingCart.map(
        (item) =>
          (item._id || item.id) ===
          productId
            ? {
                ...item,
                quantity:
                  Number(item.quantity) + 1,
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