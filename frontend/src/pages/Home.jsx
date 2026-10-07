import API_URL from "../api";
import heroModel from "../assets/hero-model.png";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";


/* =========================================================
   ALLOWED SHOPSPHERE CATEGORIES
========================================================= */

const ALLOWED_CATEGORIES = new Set([
  // Current backend categories
  "Men",
  "Women",
  "Footwear",
  "Accessories",

  // Future detailed categories
  "mens-shirts",
  "womens-dresses",
  "tops",
  "beauty",
  "skin-care",
  "fragrances",
  "mens-shoes",
  "womens-shoes",
  "smartphones",
  "laptops",
  "tablets",
  "mobile-accessories",
  "sports-accessories",
  "furniture",
  "home-decoration",
  "kitchen-accessories",
  "mens-watches",
  "womens-watches",
  "sunglasses",
  "womens-bags",
  "womens-jewellery",
]);

/* =========================================================
   GROUP CATEGORY URL
========================================================= */

function createCategoryUrl(categories) {
  return `/products?categories=${encodeURIComponent(
    categories.join("||")
  )}`;
}

/* =========================================================
   HOME
========================================================= */

function Home() {
  const { language } = useLanguage();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState("");

  /* =======================================================
     TRANSLATIONS
  ======================================================= */

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

          trusted: "1,000+ ग्राहकों का भरोसा",
          trustedText: "हम पर भरोसा करने वाले ग्राहक",

          categoryLabel: "कैटेगरी के अनुसार खरीदें",
          categoryTitle: "अपनी पसंद खोजें।",
          viewAll: "सभी देखें →",

          fashion: "फैशन",
          fashionText:
            "हर दिन के लिए आधुनिक स्टाइल",

          beauty: "ब्यूटी",
          beautyText:
            "ब्यूटी, स्किनकेयर और फ्रेग्रेंस",

          footwear: "फुटवियर",
          footwearText:
            "स्टाइल और आराम का मेल",

          gadgets: "गैजेट्स",
          gadgetsText:
            "आधुनिक जीवन के लिए स्मार्ट टेक",

          sports: "स्पोर्ट्स",
          sportsText:
            "एक्टिव लाइफस्टाइल के लिए गियर",

          furniture: "फर्नीचर",
          furnitureText:
            "आपके स्पेस के लिए खूबसूरत पीसेज़",

          homeAccessories: "होम एक्सेसरीज़",
          homeAccessoriesText:
            "आपके घर को पूरा करने वाली डिटेल्स",

          accessories: "एक्सेसरीज़",
          accessoriesText:
            "अपने लुक को पूरा करें",

          newLabel: "नवीनतम कलेक्शन",
          newTitle: "नए प्रोडक्ट्स",
          newView: "सभी नए प्रोडक्ट्स →",

          loading:
            "प्रोडक्ट्स लोड हो रहे हैं...",

          noProducts:
            "अभी कोई प्रोडक्ट उपलब्ध नहीं है।",

          promoLabel: "SHOPSPHERE",
          promoTitle: "अपना स्टाइल",
          promoTitle2: "अपनी तरह बनाएं।",
          promoDescription:
            "फैशन, एक्सेसरीज़ और रोज़मर्रा के प्रोडक्ट्स में अपना अगला पसंदीदा लुक खोजें।",
          explore:
            "कलेक्शन एक्सप्लोर करें →",
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

          trusted: "TRUSTED BY 1,000+ CUSTOMERS",
          trustedText: "Loved and trusted by our customers",

          categoryLabel: "SHOP BY CATEGORY",
          categoryTitle:
            "Find what feels like you.",
          viewAll: "VIEW ALL →",

          fashion: "FASHION",
          fashionText:
            "Modern style for every day",

          beauty: "BEAUTY",
          beautyText:
            "Beauty, skincare and fragrances",

          footwear: "FOOTWEAR",
          footwearText:
            "Style meets comfort",

          gadgets: "GADGETS",
          gadgetsText:
            "Smart tech for modern living",

          sports: "SPORTS",
          sportsText:
            "Gear for an active lifestyle",

          furniture: "FURNITURE",
          furnitureText:
            "Pieces made for your space",

          homeAccessories:
            "HOME ACCESSORIES",
          homeAccessoriesText:
            "Details that complete your space",

          accessories: "ACCESSORIES",
          accessoriesText:
            "Complete your look",

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
          explore:
            "EXPLORE COLLECTION →",
        };

  /* =========================================================
     FETCH PRODUCTS
  ========================================================= */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/api/products?limit=1000`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load products"
          );
        }

        const data =
          await response.json();

        const productList =
          Array.isArray(data)
            ? data
            : data.products || [];

        /* USE THE CATEGORIES ACTUALLY PRESENT IN THE BACKEND */

        const backendProducts =
          productList.filter((product) =>
            String(product.category || "").trim()
          );

        /* SORT NEWEST FIRST */

        const sortedProducts =
          [...backendProducts].sort(
            (a, b) => {
              const dateA =
                new Date(
                  a.createdAt || 0
                ).getTime();

              const dateB =
                new Date(
                  b.createdAt || 0
                ).getTime();

              return dateB - dateA;
            }
          );

        setProducts(
          sortedProducts
        );

        const backendCategories = [
          ...new Set(
            sortedProducts
              .map((product) =>
                String(product.category || "").trim()
              )
              .filter(Boolean)
          ),
        ];

        setCategories(backendCategories);
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

  /* =========================================================
     UI
  ========================================================= */

  return (
    <main className="home">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hero">

        <div className="hero-content">

          <p className="hero-label">
            {t.heroLabel}
          </p>

          <h1>
            {t.heroTitle1}
            <br />
            <em>
              {t.heroTitle2}
            </em>
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
            src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1400&q=90"
            alt="ShopSphere fashion edit"
            className="hero-image"
          />

          <div className="hero-mini-images">

            <img
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300&q=80"
              alt="Fashion"
              className="mini-image mini-one"
            />

            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80"
              alt="Accessories"
              className="mini-image mini-two"
            />

            <img
            src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=300&q=80"
              alt="Footwear"
              className="mini-image mini-three"
            />

          </div>

        </div>

      </section>

      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section className="hero-features">

        <div className="feature">
          <span>✦</span>

          <div>
            <strong>
              {t.quality}
            </strong>

            <p>
              {t.qualityText}
            </p>
          </div>
        </div>

        <div className="feature">
          <span>◈</span>

          <div>
            <strong>
              {t.collection}
            </strong>

            <p>
              {t.collectionText}
            </p>
          </div>
        </div>

        <div className="feature">
          <span>◇</span>

          <div>
            <strong>
              {t.support}
            </strong>

            <p>
              {t.supportText}
            </p>
          </div>
        </div>

        <div className="feature">
          <span>♡</span>

          <div>
            <strong>
              {t.trusted}
            </strong>

            <p>
              {t.trustedText}
            </p>
          </div>
        </div>

      </section>

      {/* =====================================================
          SHOP BY CATEGORY
      ===================================================== */}

      <section className="categories-section">

        <div className="section-heading">

          <div>

            <p className="section-label">
              {t.categoryLabel}
            </p>

            <h2>
              {t.categoryTitle}
            </h2>

          </div>

          <Link
            to="/products"
            className="text-link"
          >
            {t.viewAll}
          </Link>

        </div>

        <div className="categories-grid">

          {categories.map((category, index) => {

            const categoryKey =
              category.toLowerCase().replace(/[^a-z0-9]+/g, "-");

            const categoryInfo = {
              Men: {
                text: language === "Hindi"
                  ? "आधुनिक पुरुषों का स्टाइल"
                  : "Modern styles for men",
                image:
                  "https://images.unsplash.com/photo-1506629905607-d9d3b4e9b1cf?auto=format&fit=crop&w=900&q=85",
              },
              Women: {
                text: language === "Hindi"
                  ? "हर दिन के लिए खूबसूरत स्टाइल"
                  : "Beautiful styles for every day",
                image:
                  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=85",
              },
              Footwear: {
                text: language === "Hindi"
                  ? "स्टाइल और आराम"
                  : "Style meets comfort",
                image:
                  "https://images.unsplash.com/photo-1528701800489-20be3c7f3a3f?auto=format&fit=crop&w=900&q=85",
              },
              Accessories: {
                text: language === "Hindi"
                  ? "अपने लुक को पूरा करें"
                  : "Complete your look",
                image:
                  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=85",
              },
            };

            const info = categoryInfo[category] || {
              text:
                language === "Hindi"
                  ? `${category} के सभी प्रोडक्ट्स देखें`
                  : `Explore all ${category} products`,
              image:
                  "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=85",
            };

            return (
              <Link
                key={category}
                to={createCategoryUrl([category])}
                className={`category-card category-${categoryKey}`}
              >
                <img
                  src={info.image}
                  alt={`${category} collection`}
                />

                <div className="category-overlay"></div>

                <div className="category-card-content">

                  <span className="category-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <h3>{category.toUpperCase()}</h3>
                    <p>{info.text}</p>
                  </div>

                  <span className="category-arrow">
                    ↗
                  </span>

                </div>
              </Link>
            );
          })}

        </div>

      </section>


      {/* =====================================================
          NEW ARRIVALS
      ===================================================== */}

      <section className="new-arrivals-section">

        <div className="section-heading">

          <div>

            <p className="section-label">
              {t.newLabel}
            </p>

            <h2>
              {t.newTitle}
            </h2>

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
              <h2>
                {t.loading}
              </h2>
            </div>
          )}

          {!loading &&
            products.length === 0 && (
              <div className="no-products">
                <h2>
                  {t.noProducts}
                </h2>
              </div>
            )}

          {!loading &&
            products.length > 0 &&
            products
              .slice(0, 6)
              .map((product) => {

                const productId =
                  product._id ||
                  product.id;

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
                            minHeight:
                              "260px",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            background:
                              "#eee5da",
                            color:
                              "#8a6245",
                          }}
                        >
                          🛍️
                        </div>
                      )}

                      <span className="arrival-tag">
                        {language ===
                        "Hindi"
                          ? "नया"
                          : "NEW"}
                      </span>

                    </div>

                    <div className="arrival-info">

                      <div>

                        <p>
                          {product.category}
                        </p>

                        <h3>
                          {product.name}
                        </h3>

                      </div>

                      <strong>
                        ₹
                        {Number(
                          product.price ||
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>

                  </Link>
                );
              })}

        </div>

      </section>


      {/* =====================================================
          PROMO
      ===================================================== */}

      <section className="promo-section">

        <div className="promo-content">

          <p className="section-label">
            {t.promoLabel}
          </p>

          <h2>
            {t.promoTitle}
            <br />
            <em>
              {t.promoTitle2}
            </em>
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

        {/* MODEL CUT-OUT */}

        <div className="promo-visual">

          <img
            src={heroModel}
            alt="ShopSphere fashion model"
          />

        </div>

        <div className="promo-number">
          01
        </div>

      </section>


      {/* =====================================================
    SHOP BY STYLE
===================================================== */}

<section className="style-edit-section">

  <div className="style-edit-inner">

    {/* HEADING */}

    <div className="style-edit-heading">

      <div>
        <p className="section-label">
          {language === "Hindi"
            ? "स्टाइल एडिट"
            : "STYLE EDIT"}
        </p>

        <h2>
          {language === "Hindi"
            ? "अपने मूड के हिसाब से खोजें।"
            : "Shop by"}
          <em>
            {language === "Hindi"
              ? ""
              : " style."}
          </em>
        </h2>
      </div>

      <p className="style-edit-intro">
        {language === "Hindi"
          ? "आज आप कैसा महसूस कर रहे हैं? उसी के हिसाब से अपना अगला favourite खोजें।"
          : "What are you feeling today? Discover your next favourite by mood, taste and lifestyle."}
      </p>

    </div>


    {/* STYLE CARDS */}

    <div className="style-edit-grid">

      {/* 01 MEN */}
      <Link
        to="/products?category=Men"
        className="style-edit-card style-edit-one"
      >
        <img
                src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85"
          alt="Men collection"
        />
        <div className="style-edit-overlay"></div>
        <div className="style-edit-card-content">
          <span>01</span>
          <div>
            <h3>{language === "Hindi" ? "पुरुषों का स्टाइल" : "Men"}</h3>
            <p>
              {language === "Hindi"
                ? "आधुनिक पुरुषों के लिए चुनिंदा स्टाइल।"
                : "Modern styles selected for men."}
            </p>
          </div>
          <strong>↗</strong>
        </div>
      </Link>

      {/* 02 WOMEN */}
      <Link
        to="/products?category=Women"
        className="style-edit-card style-edit-two"
      >
        <img
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85"
          alt="Women collection"
        />
        <div className="style-edit-overlay"></div>
        <div className="style-edit-card-content">
          <span>02</span>
          <div>
            <h3>{language === "Hindi" ? "महिलाओं का स्टाइल" : "Women"}</h3>
            <p>
              {language === "Hindi"
                ? "हर दिन के लिए खूबसूरत और modern styles।"
                : "Beautiful modern styles for every day."}
            </p>
          </div>
          <strong>↗</strong>
        </div>
      </Link>

      {/* 03 FOOTWEAR */}
      <Link
        to="/products?category=Footwear"
        className="style-edit-card style-edit-three"
      >
        <img
                src="https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=1200&q=85"
          alt="Footwear collection"
        />
        <div className="style-edit-overlay"></div>
        <div className="style-edit-card-content">
          <span>03</span>
          <div>
            <h3>{language === "Hindi" ? "फुटवियर" : "Footwear"}</h3>
            <p>
              {language === "Hindi"
                ? "स्टाइल और comfort का perfect mix।"
                : "The perfect mix of style and comfort."}
            </p>
          </div>
          <strong>↗</strong>
        </div>
      </Link>

      {/* 04 NEW ARRIVALS */}
      <Link
        to="/new-arrivals"
        className="style-edit-card style-edit-four"
      >
        <img
                src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=85"
          alt="New arrivals"
        />
        <div className="style-edit-overlay"></div>
        <div className="style-edit-card-content">
          <span>04</span>
          <div>
            <h3>{language === "Hindi" ? "नए प्रोडक्ट्स" : "New Arrivals"}</h3>
            <p>
              {language === "Hindi"
                ? "सबसे नए products और fresh picks।"
                : "Fresh styles and the latest picks."}
            </p>
          </div>
          <strong>↗</strong>
        </div>
      </Link>

      {/* 05 BEST SELLERS */}
      <Link
        to="/products?sort=price_desc"
        className="style-edit-card style-edit-five"
      >
        <img
                src="https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&w=1200&q=85"
          alt="Best sellers"
        />
        <div className="style-edit-overlay"></div>
        <div className="style-edit-card-content">
          <span>05</span>
          <div>
            <h3>{language === "Hindi" ? "बेस्ट सेलर्स" : "Best Sellers"}</h3>
            <p>
              {language === "Hindi"
                ? "सबसे पसंद किए जाने वाले picks।"
                : "Popular picks worth discovering."}
            </p>
          </div>
          <strong>↗</strong>
        </div>
      </Link>

      {/* 06 COLLECTIONS */}
      <Link
        to="/products"
        className="style-edit-card style-edit-six"
      >
        <img
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85"
          alt="ShopSphere collections"
        />
        <div className="style-edit-overlay"></div>
        <div className="style-edit-card-content">
          <span>06</span>
          <div>
            <h3>{language === "Hindi" ? "कलेक्शंस" : "Collections"}</h3>
            <p>
              {language === "Hindi"
                ? "ShopSphere की पूरी collection explore करें।"
                : "Explore the complete ShopSphere collection."}
            </p>
          </div>
          <strong>↗</strong>
        </div>
      </Link>

    </div>

  </div>

</section>


      {/* =====================================================
          SHOPSPHERE NOTES
      ===================================================== */}
      <section className="home-notes-section">
        <div className="home-notes-heading">
          <div>
            <p className="section-label">
              {language === "Hindi" ? "SHOPSPHERE NOTES" : "SHOPSPHERE NOTES"}
            </p>
            <h2>
              {language === "Hindi"
                ? "Shopping के बीच"
                : "A little more"}
              <em>
                {language === "Hindi" ? " थोड़ा और।" : " than shopping."}
              </em>
            </h2>
          </div>
          <p>
            {language === "Hindi"
              ? "Style inspiration, curated collections और ShopSphere की छोटी stories — सब एक जगह।"
              : "Style inspiration, curated collections and small ShopSphere stories, all in one place."}
          </p>
        </div>

        <div className="home-notes-grid">
          <Link to="/collections" className="home-note-card home-note-large">
            <img
              src="https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=1200&q=85"
              alt="ShopSphere collections"
            />
            <div className="home-note-overlay" />
            <div className="home-note-copy">
              <span>01 / COLLECTIONS</span>
              <h3>{language === "Hindi" ? "अपना अगला edit चुनें।" : "Choose your next edit."}</h3>
              <strong>EXPLORE →</strong>
            </div>
          </Link>

          <Link to="/journal" className="home-note-card">
            <img
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85"
              alt="ShopSphere journal"
            />
            <div className="home-note-overlay" />
            <div className="home-note-copy">
              <span>02 / JOURNAL</span>
              <h3>{language === "Hindi" ? "थोड़ा inspiration." : "A little inspiration."}</h3>
              <strong>READ →</strong>
            </div>
          </Link>

          <Link to="/about" className="home-note-card">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=85"
              alt="About ShopSphere"
            />
            <div className="home-note-overlay" />
            <div className="home-note-copy">
              <span>03 / ABOUT</span>
              <h3>{language === "Hindi" ? "हमारे पीछे की सोच।" : "The thinking behind it."}</h3>
              <strong>DISCOVER →</strong>
            </div>
          </Link>
        </div>
      </section>

    </main>
  );
}

export default Home;