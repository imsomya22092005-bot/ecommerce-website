import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";
import heroImage from "../assets/hero.png";


function Home() {
  const { language } = useLanguage();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/products"
        );

        const data = await response.json();

        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      }
    };

    fetchProducts();
  }, []);

  const content = {
  English: {
    newCollection: "NEW COLLECTION",
    heroTitle1: "Elevate Your",
    heroTitle2: "Everyday Style.",
    heroDescription:
      "Discover thoughtfully selected products made for your style, comfort and everyday life.",
    shopNow: "SHOP NOW",
    viewCollection: "VIEW COLLECTION",
    exploreCollections: "EXPLORE COLLECTIONS",
    shopByCategory: "Shop by Category",
    viewAll: "VIEW ALL →",
    fashion: "FASHION",
    fashionText: "Elevated everyday essentials",
    accessories: "ACCESSORIES",
    accessoriesText: "Details that complete your look",
    footwear: "FOOTWEAR",
    footwearText: "Comfort meets modern style",
    justDropped: "JUST DROPPED",
    newArrivals: "New Arrivals",
    shopAll: "SHOP ALL →",
    shopSphereEdit: "SHOPSPHERE EDIT",
    timeless: "Timeless pieces.",
    everyday: "Everyday essentials.",
    exploreCollection: "EXPLORE THE COLLECTION →",
  },

  Hindi: {
    newCollection: "नई कलेक्शन",
    heroTitle1: "अपने रोज़ाना",
    heroTitle2: "स्टाइल को बेहतर बनाएं।",
    heroDescription:
      "अपनी स्टाइल, आराम और रोज़मर्रा की ज़िंदगी के लिए चुने गए बेहतरीन प्रोडक्ट्स खोजें।",
    shopNow: "अभी खरीदें",
    viewCollection: "कलेक्शन देखें",
    exploreCollections: "कलेक्शन एक्सप्लोर करें",
    shopByCategory: "कैटेगरी के अनुसार खरीदें",
    viewAll: "सभी देखें →",
    fashion: "फैशन",
    fashionText: "रोज़मर्रा के स्टाइलिश प्रोडक्ट्स",
    accessories: "एक्सेसरीज़",
    accessoriesText: "आपके लुक को पूरा करने वाले खास प्रोडक्ट्स",
    footwear: "फुटवियर",
    footwearText: "आराम और आधुनिक स्टाइल का मेल",
    justDropped: "अभी-अभी आया",
    newArrivals: "नए प्रोडक्ट्स",
    shopAll: "सभी खरीदें →",
    shopSphereEdit: "SHOPSPHERE कलेक्शन",
    timeless: "हमेशा पसंद आने वाले प्रोडक्ट्स।",
    everyday: "रोज़मर्रा की ज़रूरतें।",
    exploreCollection: "कलेक्शन एक्सप्लोर करें →",
  },
};

const t = content[language];

  return (
    <main className="home">

      {/* ================= HERO ================= */}

      <section className="hero">
        <div className="hero-content">
          <p className="hero-label">{t.newCollection}</p>

          <h1>
  {t.heroTitle1}
  <br />
  {t.heroTitle2}
</h1>

          <p className="hero-description">
  {t.heroDescription}
</p>

          <div className="hero-buttons">
  <Link to="/products" className="hero-btn primary-btn">
    {t.shopNow}
  </Link>

  <Link
    to="/products?category=Fashion"
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
        </div>
      </section>


      {/* ================= FEATURES ================= */}

      <section className="hero-features">

        <div className="feature">
          <span>✦</span>

          <div>
            <strong>
  {language === "Hindi" ? "फ्री शिपिंग" : "FREE SHIPPING"}
</strong>
<p>
  {language === "Hindi"
    ? "₹999 से अधिक के ऑर्डर पर"
    : "On orders over ₹999"}
</p>
          </div>
        </div>

        <div className="feature">
          <span>↻</span>

          <div>
            <strong>
  {language === "Hindi" ? "आसान रिटर्न" : "EASY RETURNS"}
</strong>
<p>
  {language === "Hindi"
    ? "30 दिन की रिटर्न पॉलिसी"
    : "30-day return policy"}
</p>
          </div>
        </div>

        <div className="feature">
          <span>◇</span>

          <div>
            <strong>
  {language === "Hindi" ? "सुरक्षित भुगतान" : "SECURE PAYMENT"}
</strong>
<p>
  {language === "Hindi"
    ? "100% सुरक्षित चेकआउट"
    : "100% secure checkout"}
</p>
          </div>
        </div>

        <div className="feature">
          <span>♡</span>

          <div>
            <strong>
  {language === "Hindi" ? "24/7 सहायता" : "24/7 SUPPORT"}
</strong>
<p>
  {language === "Hindi"
    ? "हम आपकी सहायता के लिए हैं"
    : "We're here to help"}
</p>
          </div>
        </div>

      </section>


      {/* ================= CATEGORIES ================= */}

      <section className="categories-section">

        <div className="section-heading">

          <div>
            <p className="section-label">{t.exploreCollections}</p>
                <h2>{t.shopByCategory}</h2>
          </div>

         <Link to="/products" className="text-link">
  {t.viewAll}
</Link>

        </div>


        <div className="categories-grid">

         <Link
  to="/products?category=Fashion"
  className="category-card"
>
            <div className="category-number">
              01
            </div>

            <div>
              <h3>{t.fashion}</h3>
<p>{t.fashionText}</p>
            </div>

            <span>↗</span>
          </Link>


          <Link
  to="/products?category=Accessories"
  className="category-card"
>
            <div className="category-number">
              02
            </div>

            <div>
              <h3>{t.accessories}</h3>
<p>{t.accessoriesText}</p>
            </div>

            <span>↗</span>
          </Link>


          <Link
  to="/products?category=Footwear"
  className="category-card"
>
            <div className="category-number">
              03
            </div>

            <div>
             <h3>{t.footwear}</h3>
<p>{t.footwearText}</p>
            </div>

            <span>↗</span>
          </Link>

        </div>

      </section>

{/* ================= NEW ARRIVALS ================= */}

<section className="new-arrivals-section" id="new-arrivals">

  <div className="section-heading">

    <div>
      <p className="section-label">{t.justDropped}</p>
<h2>{t.newArrivals}</h2>
    </div>

    <Link to="/products" className="text-link">
  {t.shopAll}
</Link>

  </div>

<div className="new-arrivals-grid">

  {products.slice(0, 3).map((product) => {

    const productId = product._id || product.id;

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
            NEW
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
  })}

</div>

</section>

{/* ================= PROMOTIONAL BANNER ================= */}

<section className="promo-section">
  <div className="promo-content">
   <p className="section-label">{t.shopSphereEdit}</p>

<h2>
  {t.timeless}
  <br />
  {t.everyday}
</h2>

<p className="promo-description">
  {language === "Hindi"
    ? "ऐसे प्रोडक्ट्स खोजें जो आपकी रोज़मर्रा की ज़िंदगी में आसानी से फिट हों।"
    : "Discover pieces designed to fit effortlessly into your everyday life."}
</p>

<Link to="/products" className="promo-btn">
  {t.exploreCollection}
</Link>
  </div>

  <div className="promo-number">
    2026
  </div>
</section>

    </main>
  );
}

export default Home;