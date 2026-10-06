import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

import heroImage from "../assets/hero.png";
import heroModel from "../assets/hero-model.png";

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
                  "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=85",
              },
              Women: {
                text: language === "Hindi"
                  ? "हर दिन के लिए खूबसूरत स्टाइल"
                  : "Beautiful styles for every day",
                image:
                  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85",
              },
              Footwear: {
                text: language === "Hindi"
                  ? "स्टाइल और आराम"
                  : "Style meets comfort",
                image:
                  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
              },
              Accessories: {
                text: language === "Hindi"
                  ? "अपने लुक को पूरा करें"
                  : "Complete your look",
                image:
                  "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?auto=format&fit=crop&w=900&q=85",
              },
            };

            const info = categoryInfo[category] || {
              text:
                language === "Hindi"
                  ? `${category} के सभी प्रोडक्ट्स देखें`
                  : `Explore all ${category} products`,
              image:
                "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=85",
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
          BRAND STORY / OUR PHILOSOPHY
      ===================================================== */}

      <section className="brand-story-section">

        <div className="brand-story-inner">

          {/* LABEL */}

          <div className="brand-story-label">

            <span className="brand-story-line"></span>

            <p className="section-label">
              {language === "Hindi"
                ? "हमारा नज़रिया"
                : "OUR PHILOSOPHY"}
            </p>

          </div>

          {/* MAIN CONTENT */}

          <div className="brand-story-content">

            <div className="brand-story-heading">

              <h2>
                {language === "Hindi"
                  ? "शॉपिंग सिर्फ खरीदना नहीं है।"
                  : "Shopping should feel"}

                <em>
                  {language === "Hindi"
                    ? " महसूस करना है।"
                    : " effortless."}
                </em>
              </h2>

            </div>

            <div className="brand-story-copy">

              <p>
                {language === "Hindi"
                  ? "ShopSphere को इस सोच के साथ बनाया गया है कि हर खरीदारी आसान, सुंदर और आपके लिए हो।"
                  : "ShopSphere was created with a simple idea — shopping should be easy, inspiring and made to feel like you."}
              </p>

              <p>
                {language === "Hindi"
                  ? "फैशन से लेकर रोज़मर्रा की essentials तक, हम ऐसी चीज़ें चुनते हैं जो आपकी lifestyle के साथ naturally fit हों।"
                  : "From fashion to everyday essentials, we bring together products that fit naturally into modern everyday life."}
              </p>

              <Link
                to="/about"
                className="brand-story-link"
              >
                {language === "Hindi"
                  ? "SHOPSPHERE के बारे में →"
                  : "DISCOVER SHOPSPHERE →"}
              </Link>

            </div>

          </div>

          {/* SIGNATURE */}

          <div className="brand-story-signature">

            <span>
              01
            </span>

            <div className="brand-story-signature-line"></div>

            <span>
              SHOPSPHERE
            </span>

          </div>

        </div>

      </section>


{/* =====================================================
    NEWSLETTER / STAY IN THE LOOP
===================================================== */}

<section className="newsletter-section">

  <div className="newsletter-inner">

    <div className="newsletter-content">

      <p className="newsletter-label">
        {language === "Hindi"
          ? "अपडेट्स पाएं"
          : "STAY IN THE LOOP"}
      </p>

      <h2>
        {language === "Hindi"
          ? "कुछ अच्छा आने वाला है।"
          : "Something good is"}
        <em>
          {language === "Hindi"
            ? " आने वाला है।"
            : " always coming."}
        </em>
      </h2>

      <p className="newsletter-description">
        {language === "Hindi"
          ? "नए कलेक्शन्स, चुनिंदा प्रोडक्ट्स और ShopSphere के खास अपडेट्स सबसे पहले पाएं।"
          : "Be the first to know about new collections, selected products and exclusive ShopSphere updates."}
      </p>

      <form
        className="newsletter-form"
        onSubmit={async (e) => {
          e.preventDefault();

          const email = e.currentTarget.email.value.trim();

          if (!email || newsletterSubmitting) {
            return;
          }

          try {
            setNewsletterSubmitting(true);
            setNewsletterMessage("");

            const response = await fetch(
              `${API_URL}/api/newsletter/subscribe`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
              }
            );

            const data = await response.json();

            if (!response.ok) {
              throw new Error(
                data.message || "Unable to subscribe"
              );
            }

            setNewsletterMessage(
              data.message ||
                (language === "Hindi"
                  ? "आप अब ShopSphere updates के लिए subscribed हैं।"
                  : "You're now subscribed to ShopSphere updates.")
            );

            e.currentTarget.reset();
          } catch (error) {
            console.error(
              "Newsletter subscription error:",
              error
            );

            setNewsletterMessage(
              error.message ||
                (language === "Hindi"
                  ? "अभी subscribe नहीं हो पाया।"
                  : "Unable to subscribe right now.")
            );
          } finally {
            setNewsletterSubmitting(false);
          }
        }}
      >

        <input
          name="email"
          type="email"
          placeholder={
            language === "Hindi"
              ? "अपना ईमेल दर्ज करें"
              : "Enter your email address"
          }
          required
        />

        <button
          type="submit"
          disabled={newsletterSubmitting}
        >
          {newsletterSubmitting
            ? language === "Hindi"
              ? "SUBSCRIBING..."
              : "SUBSCRIBING..."
            : language === "Hindi"
              ? "सब्सक्राइब करें"
              : "SUBSCRIBE"}
        </button>

      </form>

      {newsletterMessage && (
        <p className="newsletter-message">
          {newsletterMessage}
        </p>
      )}

      <p className="newsletter-note">
        {language === "Hindi"
          ? "कोई स्पैम नहीं। केवल ShopSphere updates."
          : "No spam. Just ShopSphere updates."}
      </p>

    </div>

    <div className="newsletter-visual" aria-hidden="true">
      <div className="newsletter-orbit newsletter-orbit-one"></div>
      <div className="newsletter-orbit newsletter-orbit-two"></div>
      <div className="newsletter-orbit newsletter-orbit-three"></div>

      <div className="newsletter-visual-core">
        <span>✦</span>
        <strong>SS</strong>
        <small>NEW / 2026</small>
      </div>

      <span className="newsletter-float newsletter-float-one">
        NEW
      </span>

      <span className="newsletter-float newsletter-float-two">
        ✦
      </span>
    </div>

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
          src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1200&q=85"
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
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85"
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
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85"
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
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=85"
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
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85"
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
          src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=1200&q=85"
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
    WHY SHOPSPHERE
===================================================== */}

<section className="why-shopsphere-section">

  <div className="why-shopsphere-inner">

    <div className="why-shopsphere-heading">

      <p className="section-label">
        {language === "Hindi"
          ? "SHOPSPHERE क्यों?"
          : "WHY SHOPSPHERE"}
      </p>

      <h2>
        {language === "Hindi"
          ? "सिर्फ एक"
          : "More than a"}

        <em>
          {language === "Hindi"
            ? " मार्केटप्लेस नहीं।"
            : " marketplace."}
        </em>
      </h2>

      <p className="why-shopsphere-intro">
        {language === "Hindi"
          ? "हम सोच-समझकर चुने गए प्रोडक्ट्स, आसान शॉपिंग और ऐसा स्टाइल साथ लाते हैं जो आपके लिए सही महसूस हो।"
          : "We bring together thoughtfully selected products, simple shopping and a style that feels truly yours."}
      </p>

    </div>


    <div className="why-shopsphere-grid">

      {/* 01 */}

      <div className="why-shop-card">

        <span className="why-shop-number">
          01
        </span>

        <div className="why-shop-icon">
          ✦
        </div>

        <h3>
          {language === "Hindi"
            ? "सोच-समझकर चुना गया"
            : "Thoughtfully Selected"}
        </h3>

        <p>
          {language === "Hindi"
            ? "हर प्रोडक्ट को आपकी रोज़मर्रा की ज़िंदगी को आसान और बेहतर बनाने के लिए चुना गया है।"
            : "Products chosen to make everyday shopping more useful, beautiful and effortless."}
        </p>

      </div>


      {/* 02 */}

      <div className="why-shop-card">

        <span className="why-shop-number">
          02
        </span>

        <div className="why-shop-icon">
          ◇
        </div>

        <h3>
          {language === "Hindi"
            ? "आपकी स्टाइल के लिए"
            : "Made for Your Style"}
        </h3>

        <p>
          {language === "Hindi"
            ? "फैशन से लेकर रोज़मर्रा की essentials तक, अपनी lifestyle के हिसाब से चीज़ें खोजें।"
            : "From fashion to everyday essentials, find pieces that naturally fit your lifestyle."}
        </p>

      </div>


      {/* 03 */}

      <div className="why-shop-card">

        <span className="why-shop-number">
          03
        </span>

        <div className="why-shop-icon">
          ◈
        </div>

        <h3>
          {language === "Hindi"
            ? "आसान शॉपिंग"
            : "Simple Experience"}
        </h3>

        <p>
          {language === "Hindi"
            ? "आसान browsing, साफ choices और आपके लिए बनाई गई एक simple shopping experience।"
            : "Easy browsing, clear choices and a shopping experience designed around you."}
        </p>

      </div>


      {/* 04 */}

      <div className="why-shop-card">

        <span className="why-shop-number">
          04
        </span>

        <div className="why-shop-icon">
          ○
        </div>

        <h3>
          {language === "Hindi"
            ? "हमेशा कुछ नया"
            : "Always Evolving"}
        </h3>

        <p>
          {language === "Hindi"
            ? "नए collections और fresh discoveries के साथ हमेशा कुछ नया explore करने के लिए।"
            : "New collections and fresh discoveries, so there is always something new to explore."}
        </p>

      </div>

    </div>

  </div>

</section>

    </main>
  );
}

export default Home;