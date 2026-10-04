import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const { language } = useLanguage();

  // =========================
  // LOAD WISHLIST
  // =========================

  const loadWishlist = () => {
    const savedWishlist =
      JSON.parse(
        localStorage.getItem("wishlist")
      ) || [];

    setWishlist(savedWishlist);
  };

  useEffect(() => {
    loadWishlist();

    window.addEventListener(
      "wishlistUpdated",
      loadWishlist
    );

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        loadWishlist
      );
    };
  }, []);

  // =========================
  // PRODUCT ID
  // =========================

  const getProductId = (item) =>
    item._id || item.id;

  // =========================
  // REMOVE FROM WISHLIST
  // =========================

  const removeFromWishlist = (id) => {
    const updatedWishlist =
      wishlist.filter(
        (item) =>
          getProductId(item) !== id
      );

    localStorage.setItem(
      "wishlist",
      JSON.stringify(
        updatedWishlist
      )
    );

    setWishlist(updatedWishlist);

    window.dispatchEvent(
      new Event("wishlistUpdated")
    );
  };

  // =========================
  // ADD TO CART
  // =========================

  const addToCart = (product) => {
    const productId =
      getProductId(product);

    const existingCart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    const existingItem =
      existingCart.find(
        (item) =>
          getProductId(item) ===
          productId
      );

    let updatedCart;

    if (existingItem) {
      updatedCart =
        existingCart.map((item) =>
          getProductId(item) ===
          productId
            ? {
                ...item,
                quantity:
                  Number(
                    item.quantity
                  ) + 1,
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

    alert(
      language === "Hindi"
        ? "प्रोडक्ट कार्ट में जोड़ दिया गया।"
        : "Product added to cart."
    );
  };

  // =========================
  // EMPTY WISHLIST
  // =========================

  return (
    <main className="wishlist-page">

      {/* ========================================
          WISHLIST HEADER
      ======================================== */}

      <div className="wishlist-header">

        <p className="section-label">
          SHOPSPHERE
        </p>

        <h1>
          {language === "Hindi"
            ? "आपकी विशलिस्ट"
            : "Your Wishlist"}
        </h1>

        <p>
          {language === "Hindi"
            ? "अपने पसंदीदा प्रोडक्ट्स को सेव करें और जब चाहें वापस देखें।"
            : "Save the pieces you love and come back to them whenever you want."}
        </p>

      </div>

      {/* ========================================
          EMPTY WISHLIST
      ======================================== */}

      {wishlist.length === 0 ? (

        <div className="empty-wishlist">

          <div className="wishlist-empty-label">
            {language === "Hindi"
              ? "आपकी पसंद · YOUR EDIT"
              : "YOUR EDIT · CURATED BY YOU"}
          </div>

          {/* WISH SHELF */}

          <div className="wish-shelf-area">

            <div className="wish-shelf-slots">

              <div className="wish-slot wish-slot-coral">
                <span>♡</span>

                <small>
                  {language === "Hindi"
                    ? "फैशन"
                    : "FASHION"}
                </small>
              </div>

              <div className="wish-slot wish-slot-gold">
                <span>✦</span>

                <small>
                  {language === "Hindi"
                    ? "स्टाइल"
                    : "STYLE"}
                </small>
              </div>

              <div className="wish-slot wish-slot-sage">
                <span>◇</span>

                <small>
                  {language === "Hindi"
                    ? "एक्सेसरीज़"
                    : "ACCESSORIES"}
                </small>
              </div>

              <div className="wish-slot wish-slot-blue">
                <span>♡</span>

                <small>
                  {language === "Hindi"
                    ? "कलेक्शन"
                    : "COLLECTION"}
                </small>
              </div>

            </div>

            <div className="wish-shelf-line"></div>

            <div className="wish-shelf-bottom"></div>

          </div>

          {/* CENTER CONTENT */}

          <div className="wishlist-empty-content">

            <div className="empty-heart">
              ♡
            </div>

            <h2>
              {language === "Hindi"
                ? "आपकी विशलिस्ट खाली है"
                : "Your wishlist is empty"}
            </h2>

            <p>
              {language === "Hindi"
                ? "एक्सप्लोर करना शुरू करें और अपने पसंदीदा प्रोडक्ट्स सेव करें।"
                : "Start exploring and save your favorite products."}
            </p>

            <Link
              to="/products"
              className="continue-shopping"
            >
              {language === "Hindi"
                ? "प्रोडक्ट्स एक्सप्लोर करें"
                : "EXPLORE PRODUCTS"}
            </Link>

          </div>

          {/* BOTTOM LABEL */}

          <div className="wishlist-shelf-footer">

            <span>FASHION</span>
            <i>•</i>
            <span>ACCESSORIES</span>
            <i>•</i>
            <span>FOOTWEAR</span>

          </div>

        </div>

      ) : (

        /* ========================================
           WISHLIST PRODUCTS
        ======================================== */

        <section className="wishlist-grid">

          {wishlist.map((product) => {

            const productId =
              getProductId(product);

            return (
              <article
                className="wishlist-card"
                key={productId}
              >

                {/* PRODUCT IMAGE */}

                <Link
                  to={`/product/${productId}`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                  />
                </Link>

                {/* PRODUCT INFO */}

                <div className="wishlist-info">

                  <p className="product-category">

                    {language === "Hindi"
                      ? product.category ===
                        "Fashion"
                        ? "फैशन"
                        : product.category ===
                          "Accessories"
                        ? "एक्सेसरीज़"
                        : product.category ===
                          "Footwear"
                        ? "फुटवियर"
                        : product.category
                      : product.category}

                  </p>

                  <h2>
                    {product.name}
                  </h2>

                  <p>
                    ₹{product.price}
                  </p>

                  {/* ACTIONS */}

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                      marginTop: "12px",
                    }}
                  >

                    <button
                      type="button"
                      className="product-add-btn"
                      onClick={() =>
                        addToCart(product)
                      }
                    >
                      {language === "Hindi"
                        ? "कार्ट में जोड़ें"
                        : "ADD TO CART"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        removeFromWishlist(
                          productId
                        )
                      }
                      style={{
                        border: "none",
                        background:
                          "transparent",
                        cursor: "pointer",
                      }}
                    >
                      {language === "Hindi"
                        ? "हटाएं"
                        : "REMOVE"}
                    </button>

                  </div>

                </div>

              </article>
            );
          })}

        </section>

      )}

    </main>
  );
}

export default Wishlist;