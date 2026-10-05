import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import heroImage from "../assets/hero.png";

function Home() {
  const { language } = useLanguage();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const t =
    language === "Hindi"
      ? {
          heroLabel: "SHOPSPHERE COLLECTION",
          heroTitle1: "स्टाइल जो",
          heroTitle2: "आपकी लगे।",
          heroDescription:
            "फैशन, एक्सेसरीज़ और रोज़मर्रा की ज़रूरतों के लिए चुनिंदा प्रोडक्ट्स खोजें।",
          shopNow: "शॉप नाउ →",
          viewCollection: "कलेक्शन देखें",

          quality: "क्वालिटी प्रोडक्ट्स",
          qualityText: "चुनिंदा कलेक्शन",

          collection: "क्यूरेटेड कलेक्शन",
          collectionText: "आपके स्टाइल के लिए",

          support: "कस्टमर सपोर्ट",
          supportText: "हम आपकी मदद के लिए हैं",

          categoryLabel: "कैटेगरी के अनुसार खरीदें",
          categoryTitle: "अपनी पसंद खोजें।",
          viewAll: "सभी देखें →",

          fashion: "फैशन",
          fashionText: "हर दिन के लिए आधुनिक स्टाइल",

          accessories: "एक्सेसरीज़",
          accessoriesText: "अपने लुक को पूरा करें",

          footwear: "फुटवियर",
          footwearText: "स्टाइल और आराम का मेल",

          newLabel: "नवीनतम कलेक्शन",
          newTitle: "नए प्रोडक्ट्स",
          newView: "सभी नए प्रोडक्ट्स →",

          loading: "प्रोडक्ट्स लोड हो रहे हैं...",
          noProducts:
            "अभी कोई प्रोडक्ट उपलब्ध नहीं है।",

          promoLabel: "SHOPSPHERE",
          promoTitle: "अपना स्टाइल",
          promoTitle2: "अपनी तरह बनाएं।",
          promoDescription:
            "फैशन, एक्सेसरीज़ और रोज़मर्रा के प्रोडक्ट्स में अपना अगला पसंदीदा लुक खोजें।",
          explore: "कलेक्शन एक्सप्लोर करें →",
        }
      : {
          heroLabel: "SHOPSPHERE COLLECTION",
          heroTitle1: "Come Let's",
          heroTitle2: "Elevate Your Style.",
          heroDescription:
            "Discover thoughtfully selected fashion, accessories and everyday essentials made for modern living.",
          shopNow: "SHOP NOW →",
          viewCollection: "VIEW COLLECTION",

          quality: "QUALITY PRODUCTS",
          qualityText: "Curated collection",

          collection: "CURATED COLLECTION",
          collectionText: "Selected for your style",

          support: "CUSTOMER SUPPORT",
          supportText: "We're here to help",

          categoryLabel: "SHOP BY CATEGORY",
          categoryTitle: "Find what feels like you.",
          viewAll: "VIEW ALL →",

          fashion: "FASHION",
          fashionText: "Modern style for every day",

          accessories: "ACCESSORIES",
          accessoriesText: "Complete your look",

          footwear: "FOOTWEAR",
          footwearText: "Style meets comfort",

          newLabel: "LATEST COLLECTION",
          newTitle: "New Arrivals",
          newView: "VIEW ALL NEW →",

          loading: "Loading products...",
          noProducts:
            "No products are available right now.",

          promoLabel: "SHOPSPHERE",
          promoTitle: "Define your style",
          promoTitle2: "your way.",
          promoDescription:
            "Discover your next favourite look with carefully selected fashion, accessories and everyday essentials.",
          explore: "EXPLORE COLLECTION →",
        };

  // =========================
  // FETCH PRODUCTS
  // =========================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/api/products?limit=1000`
        );

        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        const data = await response.json();

        const productList = Array.isArray(data)
          ? data
          : data.products || [];

        const sortedProducts = [...productList].sort(
          (a, b) => {
            const dateA = new Date(
              a.createdAt || 0
            ).getTime();

            const dateB = new Date(
              b.createdAt || 0
            ).getTime();

            return dateB - dateA;
          }
        );

        setProducts(sortedProducts);
      } catch (error) {
        console.error(
          "Failed to load products:",
          error
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="home">

      {/* =========================
          HERO
      ========================= */}

      <section className="hero">

        <div className="hero-content">

          <p className="hero-label">
            {t.heroLabel}
          </p>

          <h1>
            {t.heroTitle1}
            <br />
            <em>{t.heroTitle2}</em>
          </h1>

          <p className="hero-description">
            {t.heroDescription}
          </p>

          <div className="hero-buttons">

            <Link
              to="/products"
              className="hero-btn primary-btn"
            >
              {t.shopNow}
            </Link>

            <Link
              to="/products"
              className="hero-btn secondary-btn"
            >
              {t.viewCollection}
            </Link>

          </div>

        </div>

        <div className="hero-image-wrapper">

          <img
            src={heroImage}
            alt="ShopSphere collection"
            className="hero-image"
          />

          <div className="hero-mini-images">

            <img
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=300&q=80"
              alt="Fashion"
              className="mini-image mini-one"
            />

            <img
              src="https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=300&q=80"
              alt="Accessories"
              className="mini-image mini-two"
            />

            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80"
              alt="Footwear"
              className="mini-image mini-three"
            />

          </div>

        </div>

      </section>

      {/* =========================
          FEATURES
      ========================= */}

      <section className="hero-features">

        <div className="feature">
          <span>✦</span>

          <div>
            <strong>{t.quality}</strong>
            <p>{t.qualityText}</p>
          </div>
        </div>

        <div className="feature">
          <span>◈</span>

          <div>
            <strong>{t.collection}</strong>
            <p>{t.collectionText}</p>
          </div>
        </div>

        <div className="feature">
          <span>◇</span>

          <div>
            <strong>{t.support}</strong>
            <p>{t.supportText}</p>
          </div>
        </div>

      </section>

      {/* =========================
          CATEGORIES
      ========================= */}

      <section className="categories-section">

        <div className="section-heading">

          <div>

            <p className="section-label">
              {t.categoryLabel}
            </p>

            <h2>{t.categoryTitle}</h2>

          </div>

          <Link
            to="/products"
            className="text-link"
          >
            {t.viewAll}
          </Link>

        </div>

        <div className="categories-grid">

          <Link
            to="/products?category=Fashion"
            className="category-card category-fashion"
          >

            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85"
              alt="Fashion collection"
            />

            <div className="category-overlay"></div>

            <div className="category-card-content">

              <span className="category-number">
                01
              </span>

              <div>
                <h3>{t.fashion}</h3>
                <p>{t.fashionText}</p>
              </div>

              <span className="category-arrow">
                ↗
              </span>

            </div>

          </Link>

          <Link
            to="/products?category=Accessories"
            className="category-card category-accessories"
          >

            <img
              src="https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?auto=format&fit=crop&w=900&q=85"
              alt="Accessories collection"
            />

            <div className="category-overlay"></div>

            <div className="category-card-content">

              <span className="category-number">
                02
              </span>

              <div>
                <h3>{t.accessories}</h3>
                <p>{t.accessoriesText}</p>
              </div>

              <span className="category-arrow">
                ↗
              </span>

            </div>

          </Link>

          <Link
            to="/products?category=Footwear"
            className="category-card category-footwear"
          >

            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85"
              alt="Footwear collection"
            />

            <div className="category-overlay"></div>

            <div className="category-card-content">

              <span className="category-number">
                03
              </span>

              <div>
                <h3>{t.footwear}</h3>
                <p>{t.footwearText}</p>
              </div>

              <span className="category-arrow">
                ↗
              </span>

            </div>

          </Link>

        </div>

      </section>

      {/* =========================
          NEW ARRIVALS
      ========================= */}

      <section className="new-arrivals-section">

        <div className="section-heading">

          <div>

            <p className="section-label">
              {t.newLabel}
            </p>

            <h2>{t.newTitle}</h2>

          </div>

          <Link
            to="/new-arrivals"
            className="text-link"
          >
            {t.newView}
          </Link>

        </div>

        <div className="new-arrivals-grid">

          {loading && (
            <div className="no-products">
              <h2>{t.loading}</h2>
            </div>
          )}

          {!loading &&
            products.length === 0 && (
              <div className="no-products">
                <h2>{t.noProducts}</h2>
              </div>
            )}

          {!loading &&
            products.length > 0 &&
            products.slice(0, 3).map((product) => {
              const productId =
                product._id || product.id;

              return (
                <Link
                  key={productId}
                  to={`/product/${productId}`}
                  className="arrival-card"
                >

                  <div className="arrival-image">

                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          minHeight: "260px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#eee5da",
                          color: "#8a6245",
                        }}
                      >
                        🛍️
                      </div>
                    )}

                    <span className="arrival-tag">
                      {language === "Hindi"
                        ? "नया"
                        : "NEW"}
                    </span>

                  </div>

                  <div className="arrival-info">

                    <div>

                      <p>
                        {product.category ||
                          "SHOPSPHERE"}
                      </p>

                      <h3>
                        {product.name}
                      </h3>

                    </div>

                    <strong>
                      ₹
                      {Number(
                        product.price || 0
                      ).toLocaleString("en-IN")}
                    </strong>

                  </div>

                </Link>
              );
            })}

        </div>

      </section>

      {/* =========================
          PROMO
      ========================= */}

      <section className="promo-section">

        <div className="promo-content">

          <p className="section-label">
            {t.promoLabel}
          </p>

          <h2>
            {t.promoTitle}
            <br />
            <em>{t.promoTitle2}</em>
          </h2>

          <p className="promo-description">
            {t.promoDescription}
          </p>

          <Link
            to="/products"
            className="promo-btn"
          >
            {t.explore}
          </Link>

        </div>

        <div className="promo-number">
          01
        </div>

      </section>

    </main>
  );
}

export default Home;