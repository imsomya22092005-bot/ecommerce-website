import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import heroImage from "../assets/hero.png";

function Home() {
  const { language } = useLanguage();

  const [products, setProducts] = useState([]);

  const [saleEnd] = useState(() => {
    const savedEnd = localStorage.getItem(
      "shopSphereFlashSaleEnd"
    );

    if (savedEnd) {
      const savedTime = Number(savedEnd);

      if (savedTime > Date.now()) {
        return savedTime;
      }
    }

    const newEnd =
      Date.now() + 2 * 60 * 60 * 1000;

    localStorage.setItem(
      "shopSphereFlashSaleEnd",
      newEnd
    );

    return newEnd;
  });

  const [saleTime, setSaleTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const t =
    language === "Hindi"
      ? {
          heroLabel: "नई कलेक्शन · 2026 एडिशन",
          heroTitle1: "स्टाइल जो",
          heroTitle2: "आपकी लगे।",
          heroDescription:
            "फैशन, एक्सेसरीज़ और रोज़मर्रा की ज़रूरतों के लिए सोच-समझकर चुने गए प्रोडक्ट्स खोजें।",
          shopNow: "शॉप नाउ →",
          viewCollection: "कलेक्शन देखें",

          delivery: "फास्ट डिलीवरी",
          deliveryText: "पूरे भारत में",

          secure: "सुरक्षित भुगतान",
          secureText: "100% सुरक्षित",

          quality: "क्वालिटी प्रोडक्ट्स",
          qualityText: "चुनिंदा कलेक्शन",

          support: "कस्टमर सपोर्ट",
          supportText: "हम आपकी मदद के लिए हैं",

          categoryLabel:
            "कैटेगरी के अनुसार खरीदें",

          categoryTitle: "अपनी पसंद खोजें।",

          viewAll: "सभी देखें →",

          fashion: "फैशन",
          fashionText:
            "हर दिन के लिए आधुनिक स्टाइल",

          accessories: "एक्सेसरीज़",
          accessoriesText:
            "अपने लुक को पूरा करें",

          footwear: "फुटवियर",
          footwearText:
            "स्टाइल और आराम का मेल",

          newLabel: "नई कलेक्शन",
          newTitle: "नए प्रोडक्ट्स",
          newView: "सभी नए प्रोडक्ट्स →",

          promoLabel:
            "SHOPSPHERE EXCLUSIVE",

          promoTitle: "आओ,चलो",

          promoTitle2:
            "तुम्हारी स्टाइल को अच्छा करें",

          promoDescription:
            "चुनिंदा फैशन, एक्सेसरीज़ और रोज़मर्रा के प्रोडक्ट्स के साथ अपना अगला पसंदीदा लुक खोजें।",

          explore:
            "कलेक्शन एक्सप्लोर करें →",
        }
      : {
          heroLabel:
            "NEW COLLECTION · 2026 EDITION",

          heroTitle1: "Come Let's",

          heroTitle2:
            "Elevate Your Style.",

          heroDescription:
            "Discover thoughtfully selected fashion, accessories and everyday essentials made for modern living.",

          shopNow: "SHOP NOW →",

          viewCollection:
            "VIEW COLLECTION",

          delivery: "FAST DELIVERY",
          deliveryText: "Across India",

          secure: "SECURE PAYMENTS",
          secureText: "100% Protected",

          quality: "QUALITY PRODUCTS",
          qualityText: "Curated Collection",

          support: "CUSTOMER SUPPORT",
          supportText: "We're here to help",

          categoryLabel:
            "SHOP BY CATEGORY",

          categoryTitle:
            "Find what feels like you.",

          viewAll: "VIEW ALL →",

          fashion: "FASHION",
          fashionText:
            "Modern style for every day",

          accessories: "ACCESSORIES",
          accessoriesText:
            "Complete your look",

          footwear: "FOOTWEAR",
          footwearText:
            "Style meets comfort",

          newLabel: "NEW COLLECTION",
          newTitle: "New Arrivals",
          newView: "VIEW ALL NEW →",

          promoLabel:
            "SHOPSPHERE EXCLUSIVE",

          promoTitle:
            "Give your style",

          promoTitle2:
            "a fresh direction.",

          promoDescription:
            "Discover your next favourite look with carefully selected fashion, accessories and everyday essentials.",

          explore:
            "EXPLORE COLLECTION →",
        };

  /* ========================================
     FETCH PRODUCTS
  ======================================== */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`)

        if (!response.ok) {
          throw new Error(
            "Failed to load products"
          );
        }

        const data =
          await response.json();

        setProducts(
          data.products ||
            (Array.isArray(data)
              ? data
              : [])
        );
      } catch (error) {
        console.error(
          "Failed to load products:",
          error
        );
      }
    };

    fetchProducts();
  }, []);

  /* ========================================
     FLASH SALE TIMER
  ======================================== */

  useEffect(() => {
    const updateSaleTime = () => {
      const remaining = Math.max(
        0,
        saleEnd - Date.now()
      );

      const totalSeconds = Math.floor(
        remaining / 1000
      );

      const hours = Math.floor(
        totalSeconds / 3600
      );

      const minutes = Math.floor(
        (totalSeconds % 3600) / 60
      );

      const seconds =
        totalSeconds % 60;

      setSaleTime({
        hours,
        minutes,
        seconds,
      });
    };

    updateSaleTime();

    const timer = setInterval(
      updateSaleTime,
      1000
    );

    return () =>
      clearInterval(timer);
  }, [saleEnd]);

  return (
    <main className="home">

      {/* ========================================
          HERO
      ======================================== */}

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


      {/* ========================================
          FEATURES
      ======================================== */}

      <section className="hero-features">

        <div className="feature">
          <span>✦</span>

          <div>
            <strong>
              {t.delivery}
            </strong>

            <p>
              {t.deliveryText}
            </p>
          </div>
        </div>


        <div className="feature">
          <span>◈</span>

          <div>
            <strong>
              {t.secure}
            </strong>

            <p>
              {t.secureText}
            </p>
          </div>
        </div>


        <div className="feature">
          <span>◇</span>

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
          <span>♡</span>

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


      {/* ========================================
          CATEGORIES
      ======================================== */}

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

          {/* FASHION */}

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


          {/* ACCESSORIES */}

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


          {/* FOOTWEAR */}

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

        </div>

      </section>


      {/* ========================================
          FLASH SALE
      ======================================== */}

      <section className="flash-sale-section">

        <div className="flash-sale-content">

          <div className="flash-sale-heading">

            <p className="section-label">
              {language === "Hindi"
                ? "सीमित समय का ऑफर"
                : "LIMITED TIME OFFER"}
            </p>


            <h2>

              {language === "Hindi"
                ? "फ्लैश"
                : "Flash"}

              <br />

              <em>

                {language === "Hindi"
                  ? "सेल"
                  : "Sale"}

              </em>

            </h2>


            <p>

              {language === "Hindi"
                ? "चुनिंदा प्रोडक्ट्स पर 30% तक की छूट पाएं। जल्दी करें — ये ऑफर हमेशा नहीं रहेगा।"
                : "Enjoy up to 30% off on selected products. Don't wait — this offer won't last forever."}

            </p>


            <Link
              to="/products"
              className="flash-sale-btn"
            >

              {language === "Hindi"
                ? "सेल देखें →"
                : "SHOP SALE →"}

            </Link>

          </div>


          <div className="flash-sale-timer">

            <span className="timer-label">

              {language === "Hindi"
                ? "समाप्त होने में"
                : "ENDS IN"}

            </span>


            <div className="timer-boxes">

              <div className="timer-box">

                <strong>
                  {String(
                    saleTime.hours
                  ).padStart(2, "0")}
                </strong>

                <span>
                  {language === "Hindi"
                    ? "घंटे"
                    : "HRS"}
                </span>

              </div>


              <div className="timer-colon">
                :
              </div>


              <div className="timer-box">

                <strong>
                  {String(
                    saleTime.minutes
                  ).padStart(2, "0")}
                </strong>

                <span>
                  {language === "Hindi"
                    ? "मिनट"
                    : "MIN"}
                </span>

              </div>


              <div className="timer-colon">
                :
              </div>


              <div className="timer-box">

                <strong>
                  {String(
                    saleTime.seconds
                  ).padStart(2, "0")}
                </strong>

                <span>
                  {language === "Hindi"
                    ? "सेकंड"
                    : "SEC"}
                </span>

              </div>

            </div>


            <div className="flash-sale-note">

              {language === "Hindi"
                ? "✦ सीमित स्टॉक · सीमित समय"
                : "✦ Limited stock · Limited time"}

            </div>

          </div>

        </div>

      </section>


      {/* ========================================
          NEW ARRIVALS
      ======================================== */}

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

          {products.length === 0 ? (

            <div className="no-products">

              <h2>

                {language === "Hindi"
                  ? "जल्द ही नए प्रोडक्ट्स आएंगे"
                  : "New products coming soon"}

              </h2>


              <p>

                {language === "Hindi"
                  ? "हमारे नवीनतम कलेक्शन के लिए वापस आएं।"
                  : "Come back soon for our latest collection."}

              </p>

            </div>

          ) : (

            products
              .slice(0, 3)
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

                      <img
                        src={product.image}
                        alt={product.name}
                      />

                      <span className="arrival-tag">

                        {language === "Hindi"
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
                        ₹{product.price}
                      </strong>

                    </div>

                  </Link>

                );
              })

          )}

        </div>

      </section>


      {/* ========================================
          PROMOTIONAL SECTION
      ======================================== */}

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


        <div className="promo-number">
          01
        </div>

      </section>

    </main>
  );
}

export default Home;