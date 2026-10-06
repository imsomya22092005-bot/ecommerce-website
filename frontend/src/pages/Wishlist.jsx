import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function Wishlist() {
  const { language } = useLanguage();
  const [items, setItems] = useState([]);

  const loadWishlist = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setItems(Array.isArray(saved) ? saved : []);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    loadWishlist();
    window.addEventListener("wishlistUpdated", loadWishlist);
    return () =>
      window.removeEventListener("wishlistUpdated", loadWishlist);
  }, []);

  const removeItem = (id) => {
    const updated = items.filter((item) => (item._id || item.id) !== id);
    setItems(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  return (
    <main className="new-arrivals-page">
      <section className="new-arrivals-page-header">
        <div className="new-arrivals-header-line"></div>
        <p className="new-arrivals-label">SHOPSPHERE</p>
        <h1>{language === "Hindi" ? "मेरी विशलिस्ट" : "Wishlist"}</h1>
        <p className="new-arrivals-subtitle">
          {language === "Hindi"
            ? "अपने पसंदीदा प्रोडक्ट्स यहां सेव करें।"
            : "Your saved favourite products."}
        </p>
        <div className="new-arrivals-header-meta">
          <span>{language === "Hindi" ? "सेव किए गए प्रोडक्ट्स" : "SAVED PRODUCTS"}</span>
          <span>{items.length} {language === "Hindi" ? "प्रोडक्ट्स" : "PRODUCTS"}</span>
        </div>
      </section>

      <section className="new-arrivals-page-content">
        {items.length === 0 ? (
          <div className="new-arrivals-empty">
            <div className="empty-arrivals-shape"><span>♡</span></div>
            <p className="empty-arrivals-label">WISHLIST</p>
            <h2>{language === "Hindi" ? "आपकी विशलिस्ट खाली है" : "Your wishlist is empty"}</h2>
            <p>
              {language === "Hindi"
                ? "प्रोडक्ट्स ब्राउज़ करें और अपने पसंदीदा आइटम सेव करें।"
                : "Browse products and save your favourites here."}
            </p>
            <Link to="/products" className="new-arrivals-empty-btn">
              {language === "Hindi" ? "शॉपिंग शुरू करें →" : "START SHOPPING →"}
            </Link>
          </div>
        ) : (
          <div className="new-arrivals-page-grid">
            {items.map((product, index) => {
              const id = product._id || product.id;
              return (
                <article className="new-arrival-product-card" key={id}>
                  <Link to={`/product/${id}`} className="new-arrival-product-image">
                    {product.image ? (
                      <img src={product.image} alt={product.name} loading="lazy" />
                    ) : (
                      <div className="new-arrival-no-image">Image unavailable</div>
                    )}
                    <span className="new-arrival-product-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </Link>

                  <div className="new-arrival-product-info">
                    <div className="new-arrival-product-copy">
                      <p>{product.category || "SHOPSPHERE"}</p>
                      <h3>{product.name}</h3>
                    </div>
                    <strong>₹{Number(product.price || 0).toLocaleString("en-IN")}</strong>
                  </div>

                  <div className="new-arrival-product-footer">
                    <button type="button" onClick={() => removeItem(id)}>
                      {language === "Hindi" ? "हटाएं" : "REMOVE"}
                    </button>
                    <Link to={`/product/${id}`}>↗</Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default Wishlist;
