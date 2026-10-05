import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function NewArrivals() {
  const { language } = useLanguage();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/products"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setProducts(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Failed to fetch products:",
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
    <main className="new-arrivals-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <section className="new-arrivals-page-header">

        <div className="new-arrivals-header-line"></div>

        <p className="new-arrivals-label">
          {language === "Hindi"
            ? "अभी-अभी आया"
            : "JUST DROPPED"}
        </p>

        <h1>
          {language === "Hindi"
            ? "नए प्रोडक्ट्स"
            : "New Arrivals"}
        </h1>

        <p className="new-arrivals-subtitle">
          {language === "Hindi"
            ? "हमारी नवीनतम कलेक्शन को एक्सप्लोर करें।"
            : "Explore the latest pieces added to the ShopSphere collection."}
        </p>

        <div className="new-arrivals-header-meta">
          <span>
            {language === "Hindi"
              ? "नई कलेक्शन · 2026"
              : "NEW COLLECTION · 2026"}
          </span>

          <span>
            {products.length > 0
              ? `${products.length} ${
                  language === "Hindi"
                    ? "प्रोडक्ट्स"
                    : "PRODUCTS"
                }`
              : language === "Hindi"
              ? "COMING SOON"
              : "COMING SOON"}
          </span>
        </div>

      </section>


      {/* =========================
          PRODUCTS CONTENT
      ========================= */}

      <section className="new-arrivals-page-content">

        {/* LOADING */}

        {loading && (
          <div className="new-arrivals-loading">

            <div className="new-arrivals-loader"></div>

            <p>
              {language === "Hindi"
                ? "नई कलेक्शन लोड हो रही है..."
                : "Loading the latest collection..."}
            </p>

          </div>
        )}


        {/* EMPTY STATE */}

        {!loading && products.length === 0 && (
          <div className="new-arrivals-empty">

            <div className="empty-arrivals-shape">

              <span>✦</span>
              <span>✦</span>
              <span>✦</span>

            </div>

            <p className="empty-arrivals-label">
              {language === "Hindi"
                ? "COMING SOON"
                : "COMING SOON"}
            </p>

            <h2>
              {language === "Hindi"
                ? "नए प्रोडक्ट्स जल्द आ रहे हैं"
                : "New arrivals are coming soon"}
            </h2>

            <p>
              {language === "Hindi"
                ? "हमारी नई कलेक्शन तैयार हो रही है। कृपया जल्द दोबारा देखें।"
                : "We're preparing something new for you. Please check back soon for the latest products."}
            </p>

            <Link
              to="/products"
              className="new-arrivals-empty-btn"
            >
              {language === "Hindi"
                ? "कलेक्शन एक्सप्लोर करें →"
                : "EXPLORE COLLECTION →"}
            </Link>

          </div>
        )}


        {/* PRODUCTS */}

        {!loading && products.length > 0 && (
          <div className="new-arrivals-page-grid">

            {products.map((product, index) => {

              const productId =
                product._id || product.id;

              return (
                <Link
                  key={productId}
                  to={`/product/${productId}`}
                  className="new-arrival-product-card"
                >

                  {/* IMAGE */}

                  <div className="new-arrival-product-image">

                    <img
                      src={product.image}
                      alt={product.name}
                    />

                    <span className="new-arrival-product-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="new-arrival-product-tag">
                      {language === "Hindi"
                        ? "नया"
                        : "NEW"}
                    </span>

                  </div>


                  {/* INFO */}

                  <div className="new-arrival-product-info">

                    <div className="new-arrival-product-copy">

                      <p>
                        {product.category ||
                          "SHOPSPHERE"}
                      </p>

                      <h3>
                        {product.name}
                      </h3>

                    </div>

                    <strong>
                      ₹{product.price}
                    </strong>

                  </div>


                  <div className="new-arrival-product-footer">
                    <span>
                      {language === "Hindi"
                        ? "प्रोडक्ट देखें"
                        : "VIEW PRODUCT"}
                    </span>

                    <span>↗</span>
                  </div>

                </Link>
              );
            })}

          </div>
        )}

      </section>

    </main>
  );
}

export default NewArrivals;