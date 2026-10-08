import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  LogIn,
} from "lucide-react";
import { useLanguage } from "../LanguageContext";
import API_URL from "../api";

function Wishlist() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const token = localStorage.getItem("authToken");

  const loadWishlist = async () => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/wishlist`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (language === "Hindi"
              ? "Wishlist लोड नहीं हो सकी।"
              : "Could not load wishlist.")
        );
      }

      setItems(data?.wishlist?.products || []);
    } catch (err) {
      console.error("Wishlist loading error:", err);
      setItems([]);
      setError(
        err.message ||
          (language === "Hindi"
            ? "Wishlist लोड नहीं हो सकी।"
            : "Could not load wishlist.")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();

    const updateWishlist = () => {
      loadWishlist();
    };

    window.addEventListener(
      "wishlistUpdated",
      updateWishlist
    );

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        updateWishlist
      );
    };
  }, [language]);

  const removeItem = async (productId) => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      navigate("/login");
      return;
    }

    try {
      setActionId(productId);
      setError("");

      const response = await fetch(
        `${API_URL}/api/wishlist/remove/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (language === "Hindi"
              ? "Product wishlist से हटाया नहीं जा सका।"
              : "Could not remove product.")
        );
      }

      setItems(data?.wishlist?.products || []);
      window.dispatchEvent(
        new Event("wishlistUpdated")
      );
    } catch (err) {
      console.error("Wishlist remove error:", err);
      setError(err.message);
    } finally {
      setActionId("");
    }
  };

  const addToCart = async (product) => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      navigate("/login");
      return;
    }

    const productId = product?._id || product?.id;

    if (!productId) {
      return;
    }

    const variants = Array.isArray(product.variants)
      ? product.variants
      : [];

    const availableVariant =
      variants.find(
        (variant) => Number(variant?.stock) > 0
      ) || variants[0];

    const size =
      availableVariant?.size ||
      product?.sizes?.[0] ||
      "Default";

    const color =
      availableVariant?.color ||
      product?.colors?.[0] ||
      "Default";

    if (
      availableVariant &&
      Number(availableVariant.stock) <= 0
    ) {
      alert(
        language === "Hindi"
          ? "यह product अभी stock में नहीं है।"
          : "This product is currently out of stock."
      );
      return;
    }

    try {
      setActionId(productId);
      setError("");

      const response = await fetch(
        `${API_URL}/api/cart/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            productId,
            size,
            color,
            quantity: 1,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (language === "Hindi"
              ? "Product cart में add नहीं हो सका।"
              : "Could not add product to cart.")
        );
      }

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      setToastMessage(
        language === "Hindi"
          ? "प्रोडक्ट कार्ट में जोड़ दिया गया ✨"
          : "Product added to cart ✨"
      );

      setTimeout(() => {
        setToastMessage("");
      }, 2500);
    } catch (err) {
      console.error("Wishlist cart error:", err);
      setError(err.message);
    } finally {
      setActionId("");
    }
  };

  if (!token) {
    return (
      <main className="wishlist-page">
        <section className="wishlist-login-card">
          <div className="wishlist-login-icon">
            <Heart size={30} strokeWidth={1.4} />
          </div>

          <p className="wishlist-eyebrow">
            SHOPSPHERE WISHLIST
          </p>

          <h1>
            {language === "Hindi"
              ? "अपनी पसंद सेव करें।"
              : "Save what you love."}
          </h1>

          <p>
            {language === "Hindi"
              ? "अपनी wishlist देखने और manage करने के लिए login करें।"
              : "Login to save your favourite products and access them anytime."}
          </p>

          <Link
            to="/login"
            className="wishlist-primary-btn"
          >
            <LogIn size={17} />
            {language === "Hindi"
              ? "लॉगिन करें"
              : "LOGIN TO WISHLIST"}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="wishlist-page">

      <section className="wishlist-hero">
        <div>
          <p className="wishlist-eyebrow">
            SHOPSPHERE / SAVED EDIT
          </p>

          <h1>
            {language === "Hindi"
              ? "आपकी विशलिस्ट"
              : "Your Wishlist"}
          </h1>

          <p className="wishlist-subtitle">
            {language === "Hindi"
              ? "वे pieces जिन्हें आपने अपने लिए save किया है।"
              : "The pieces you loved enough to save."}
          </p>
        </div>

        <div className="wishlist-hero-count">
          <Heart size={19} strokeWidth={1.5} />
          <strong>{items.length}</strong>
          <span>
            {language === "Hindi"
              ? "SAVED"
              : "SAVED"}
          </span>
        </div>
      </section>

      {error && (
        <div className="wishlist-error">
          {error}
        </div>
      )}

      {loading ? (
        <section className="wishlist-loading">
          <div className="wishlist-loader-dot"></div>
          <p>
            {language === "Hindi"
              ? "आपकी wishlist लोड हो रही है..."
              : "Loading your wishlist..."}
          </p>
        </section>
      ) : items.length === 0 ? (
        <section className="wishlist-empty">
          <div className="wishlist-empty-icon">
            <Heart size={42} strokeWidth={1.2} />
          </div>

          <p className="wishlist-eyebrow">
            NOTHING SAVED YET
          </p>

          <h2>
            {language === "Hindi"
              ? "अभी आपकी wishlist खाली है।"
              : "Your wishlist is waiting."}
          </h2>

          <p>
            {language === "Hindi"
              ? "जो पसंद आए उस product के heart पर click करें और उसे यहां save करें।"
              : "Tap the heart on any product you love and it will appear here."}
          </p>

          <Link
            to="/products"
            className="wishlist-primary-btn"
          >
            {language === "Hindi"
              ? "शॉपिंग शुरू करें"
              : "EXPLORE PRODUCTS"}
            <ArrowRight size={16} />
          </Link>
        </section>
      ) : (
        <section className="wishlist-content">

          <div className="wishlist-grid">
            {items.map((product, index) => {
              const id =
                product?._id ||
                product?.id;

              return (
                <article
                  className="wishlist-card"
                  key={id}
                >
                  <div className="wishlist-card-image-wrap">
                    <Link
                      to={`/product/${id}`}
                      className="wishlist-card-image"
                    >
                      {product?.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                        />
                      ) : (
                        <div className="wishlist-no-image">
                          <ShoppingBag
                            size={32}
                            strokeWidth={1.2}
                          />
                        </div>
                      )}
                    </Link>

                    <button
                      type="button"
                      className="wishlist-remove-icon"
                      onClick={() =>
                        removeItem(id)
                      }
                      disabled={
                        actionId === id
                      }
                      aria-label="Remove from wishlist"
                      title="Remove from wishlist"
                    >
                      <Heart
                        size={18}
                        fill="currentColor"
                        strokeWidth={1.6}
                      />
                    </button>

                    <span className="wishlist-card-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="wishlist-card-body">
                    <div>
                      <p className="wishlist-card-category">
                        {product?.category ||
                          "SHOPSPHERE"}
                      </p>

                      <Link
                        to={`/product/${id}`}
                        className="wishlist-card-title"
                      >
                        {product?.name ||
                          "Product"}
                      </Link>
                    </div>

                    <strong className="wishlist-card-price">
                      ₹
                      {Number(
                        product?.price || 0
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div className="wishlist-card-actions">
                    <button
                      type="button"
                      className="wishlist-cart-btn"
                      onClick={() =>
                        addToCart(product)
                      }
                      disabled={
                        actionId === id
                      }
                    >
                      <ShoppingBag
                        size={16}
                        strokeWidth={1.7}
                      />
                      {actionId === id
                        ? "ADDING..."
                        : language === "Hindi"
                        ? "कार्ट में डालें"
                        : "ADD TO CART"}
                    </button>

                    <button
                      type="button"
                      className="wishlist-delete-btn"
                      onClick={() =>
                        removeItem(id)
                      }
                      disabled={
                        actionId === id
                      }
                      aria-label="Remove"
                      title="Remove"
                    >
                      <Trash2
                        size={16}
                        strokeWidth={1.6}
                      />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="wishlist-bottom-bar">
            <Link to="/products">
              {language === "Hindi"
                ? "← और products देखें"
                : "← CONTINUE SHOPPING"}
            </Link>

            <span>
              {items.length}{" "}
              {items.length === 1
                ? "ITEM"
                : "ITEMS"}{" "}
              SAVED
            </span>
          </div>

        </section>
      )}
      {toastMessage && (
        <div className="cart-toast" role="status">
          <span className="cart-toast-icon">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

    </main>
  );
}

export default Wishlist;
