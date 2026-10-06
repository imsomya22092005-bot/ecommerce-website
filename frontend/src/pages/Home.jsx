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
  const [loading, setLoading] = useState(true);

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

        /* ONLY ALLOWED CATEGORIES */

        const allowedProducts =
          productList.filter((product) =>
            ALLOWED_CATEGORIES.has(
              String(
                product.category || ""
              ).trim()
            )
          );

        /* SORT NEWEST FIRST */

        const sortedProducts =
          [...allowedProducts].sort(
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

          {/* 01 FASHION */}

          <Link
            to={createCategoryUrl([
              "mens-shirts",
              "womens-dresses",
              "tops",
            ])}
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
                <h3>
                  {t.fashion}
                </h3>

                <p>
                  {t.fashionText}
                </p>
              </div>

              <span className="category-arrow">
                ↗
              </span>

            </div>

          </Link>


          {/* 02 BEAUTY */}

          <Link
            to={createCategoryUrl([
              "beauty",
              "skin-care",
              "fragrances",
            ])}
            className="category-card category-beauty"
          >

            <img
              src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85"
              alt="Beauty collection"
            />

            <div className="category-overlay"></div>

            <div className="category-card-content">

              <span className="category-number">
                02
              </span>

              <div>
                <h3>
                  {t.beauty}
                </h3>

                <p>
                  {t.beautyText}
                </p>
              </div>

              <span className="category-arrow">
                ↗
              </span>

            </div>

          </Link>


          {/* 03 FOOTWEAR */}

          <Link
            to={createCategoryUrl([
              "mens-shoes",
              "womens-shoes",
            ])}
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
                <h3>
                  {t.footwear}
                </h3>

                <p>
                  {t.footwearText}
                </p>
              </div>

              <span className="category-arrow">
                ↗
              </span>

            </div>

          </Link>


          {/* 04 GADGETS */}

          <Link
            to={createCategoryUrl([
              "smartphones",
              "laptops",
              "tablets",
              "mobile-accessories",
            ])}
            className="category-card category-gadgets"
          >

            <img
              src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85"
              alt="Gadgets collection"
            />

            <div className="category-overlay"></div>

            <div className="category-card-content">

              <span className="category-number">
                04
              </span>

              <div>
                <h3>
                  {t.gadgets}
                </h3>

                <p>
                  {t.gadgetsText}
                </p>
              </div>

              <span className="category-arrow">
                ↗
              </span>

            </div>

          </Link>


          {/* 05 SPORTS */}

          <Link
            to={createCategoryUrl([
              "sports-accessories",
            ])}
            className="category-card category-sports"
          >

            <img
              src="https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=85"
              alt="Sports collection"
            />

            <div className="category-overlay"></div>

            <div className="category-card-content">

              <span className="category-number">
                05
              </span>

              <div>
                <h3>
                  {t.sports}
                </h3>

                <p>
                  {t.sportsText}
                </p>
              </div>

              <span className="category-arrow">
                ↗
              </span>

            </div>

          </Link>


          {/* 06 FURNITURE */}

          <Link
            to={createCategoryUrl([
              "furniture",
            ])}
            className="category-card category-furniture"
          >

            <img
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85"
              alt="Furniture collection"
            />

            <div className="category-overlay"></div>

            <div className="category-card-content">

              <span className="category-number">
                06
              </span>

              <div>
                <h3>
                  {t.furniture}
                </h3>

                <p>
                  {t.furnitureText}
                </p>
              </div>

              <span className="category-arrow">
                ↗
              </span>

            </div>

          </Link>


          {/* 07 HOME ACCESSORIES */}

          <Link
            to={createCategoryUrl([
              "home-decoration",
              "kitchen-accessories",
            ])}
            className="category-card category-home"
          >

            <img
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85"
              alt="Home accessories collection"
            />

            <div className="category-overlay"></div>

            <div className="category-card-content">

              <span className="category-number">
                07
              </span>

              <div>
                <h3>
                  {t.homeAccessories}
                </h3>

                <p>
                  {t.homeAccessoriesText}
                </p>
              </div>

              <span className="category-arrow">
                ↗
              </span>

            </div>

          </Link>


          {/* 08 ACCESSORIES */}

          <Link
            to={createCategoryUrl([
              "mens-watches",
              "womens-watches",
              "sunglasses",
              "womens-bags",
              "womens-jewellery",
            ])}
            className="category-card category-accessories"
          >

            <img
              src="https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?auto=format&fit=crop&w=900&q=85"
              alt="Accessories collection"
            />

            <div className="category-overlay"></div>

            <div className="category-card-content">

              <span className="category-number">
                08
              </span>

              <div>
                <h3>
                  {t.accessories}
                </h3>

                <p>
                  {t.accessoriesText}
                </p>
              </div>

              <span className="category-arrow">
                ↗
              </span>

            </div>

          </Link>


          {/* 09 NEW ARRIVALS */}

          <Link
            to="/new-arrivals"
            className="category-card category-new"
          >

            <img
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=85"
              alt="New arrivals collection"
            />

            <div className="category-overlay"></div>

            <div className="category-card-content">

              <span className="category-number">
                09
              </span>

              <div>
                <h3>
                  NEW ARRIVALS
                </h3>

                <p>
                  Fresh styles and latest picks
                </p>
              </div>

              <span className="category-arrow">
                ↗
              </span>

            </div>

          </Link>

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
        onSubmit={(e) => {
          e.preventDefault();
          e.target.reset();
        }}
      >

        <input
          type="email"
          placeholder={
            language === "Hindi"
              ? "अपना ईमेल दर्ज करें"
              : "Enter your email address"
          }
          required
        />

        <button type="submit">
          {language === "Hindi"
            ? "सब्सक्राइब करें"
            : "SUBSCRIBE"}
        </button>

      </form>

      <p className="newsletter-note">
        {language === "Hindi"
          ? "कोई स्पैम नहीं। केवल ShopSphere updates."
          : "No spam. Just ShopSphere updates."}
      </p>

    </div>

    <div className="newsletter-mark">
      ✦
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

      {/* 01 */}

      <Link
        to={createCategoryUrl([
          "mens-shirts",
          "womens-dresses",
          "tops",
          "mens-shoes",
          "womens-shoes"
        ])}
        className="style-edit-card style-edit-one"
      >

        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85"
          alt="Everyday style"
        />

        <div className="style-edit-overlay"></div>

        <div className="style-edit-card-content">

          <span>01</span>

          <div>
            <h3>
              {language === "Hindi"
                ? "हर दिन का स्टाइल"
                : "Everyday Ease"}
            </h3>

            <p>
              {language === "Hindi"
                ? "Simple, comfortable और effortlessly stylish."
                : "Simple, comfortable and effortlessly stylish."}
            </p>
          </div>

          <strong>↗</strong>

        </div>

      </Link>


      {/* 02 */}

      <Link
        to={createCategoryUrl([
          "womens-jewellery",
          "womens-bags",
          "fragrances",
          "beauty"
        ])}
        className="style-edit-card style-edit-two"
      >

        <img
          src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=85"
          alt="Modern style"
        />

        <div className="style-edit-overlay"></div>

        <div className="style-edit-card-content">

          <span>02</span>

          <div>
            <h3>
              {language === "Hindi"
                ? "मॉडर्न म्यूज़"
                : "Modern Muse"}
            </h3>

            <p>
              {language === "Hindi"
                ? "Bold details और refined choices."
                : "Bold details and refined choices."}
            </p>
          </div>

          <strong>↗</strong>

        </div>

      </Link>


      {/* 03 */}

      <Link
        to={createCategoryUrl([
          "sports-accessories",
          "smartphones",
          "mobile-accessories"
        ])}
        className="style-edit-card style-edit-three"
      >

        <img
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=85"
          alt="Active lifestyle"
        />

        <div className="style-edit-overlay"></div>

        <div className="style-edit-card-content">

          <span>03</span>

          <div>
            <h3>
              {language === "Hindi"
                ? "ऑफ-ड्यूटी"
                : "Off-Duty Energy"}
            </h3>

            <p>
              {language === "Hindi"
                ? "Active days के लिए fresh essentials."
                : "Fresh essentials for active days."}
            </p>
          </div>

          <strong>↗</strong>

        </div>

      </Link>


      {/* 04 */}

      <Link
        to={createCategoryUrl([
          "furniture",
          "home-decoration",
          "kitchen-accessories"
        ])}
        className="style-edit-card style-edit-four"
      >

        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85"
          alt="Home style"
        />

        <div className="style-edit-overlay"></div>

        <div className="style-edit-card-content">

          <span>04</span>

          <div>
            <h3>
              {language === "Hindi"
                ? "क्वाइट कम्फर्ट"
                : "Quiet Comfort"}
            </h3>

            <p>
              {language === "Hindi"
                ? "अपने space के लिए calm और beautiful pieces."
                : "Calm and beautiful pieces for your space."}
            </p>
          </div>

          <strong>↗</strong>

        </div>

      </Link>

      {/* 05 */}

<Link
  to={createCategoryUrl([
    "smartphones",
    "laptops",
    "tablets",
    "mobile-accessories"
  ])}
  className="style-edit-card style-edit-five"
>

  <img
    src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=85"
    alt="Modern tech lifestyle"
  />

  <div className="style-edit-overlay"></div>

  <div className="style-edit-card-content">

    <span>05</span>

    <div>
      <h3>
        {language === "Hindi"
          ? "टेक स्टेट ऑफ माइंड"
          : "Tech State of Mind"}
      </h3>

      <p>
        {language === "Hindi"
          ? "Smart gadgets जो आपकी everyday life को बेहतर बनाएं।"
          : "Smart gadgets that elevate your everyday life."}
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