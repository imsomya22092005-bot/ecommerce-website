import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import API_URL from "../api";

function NewArrivals() {
  const { language } = useLanguage();

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================
  // FETCH PRODUCTS
  // =========================

  useEffect(() => {
    const fetchNewArrivals =
      async () => {
        try {
          setLoading(true);
          setError("");

          // Backend supports limit.
          // createdAt is available because
          // Product model uses timestamps.
          const response =
            await fetch(
              `${API_URL}/api/products?limit=1000`
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                (language === "Hindi"
                  ? "प्रोडक्ट्स लोड नहीं हो सके।"
                  : "Unable to load products.")
            );
          }

          const productList =
            Array.isArray(data)
              ? data
              : data.products || [];

          // =========================
          // SORT NEWEST FIRST
          // =========================

          const sortedProducts =
            [...productList].sort(
              (a, b) => {
                const dateA =
                  new Date(
                    a.createdAt || 0
                  ).getTime();

                const dateB =
                  new Date(
                    b.createdAt || 0
                  ).getTime();

                return (
                  dateB - dateA
                );
              }
            );

          setProducts(
            sortedProducts
          );
        } catch (err) {
          console.error(
            "Failed to fetch new arrivals:",
            err
          );

          setProducts([]);

          setError(
            err.message ||
              (language === "Hindi"
                ? "प्रोडक्ट्स लोड नहीं हो सके।"
                : "Unable to load products.")
          );
        } finally {
          setLoading(false);
        }
      };

    fetchNewArrivals();
  }, [language]);

  return (
    <main className="new-arrivals-page">

      {/* =========================
          HEADER
      ========================= */}

      <section className="new-arrivals-page-header">

        <div className="new-arrivals-header-line"></div>

        <p className="new-arrivals-label">
          {language === "Hindi"
            ? "नवीनतम प्रोडक्ट्स"
            : "LATEST PRODUCTS"}
        </p>

        <h1>
          {language === "Hindi"
            ? "New Arrivals"
            : "New Arrivals"}
        </h1>

        <p className="new-arrivals-subtitle">
          {language === "Hindi"
            ? "ShopSphere में हाल ही में जोड़े गए प्रोडक्ट्स देखें।"
            : "Explore the products most recently added to ShopSphere."}
        </p>

        <div className="new-arrivals-header-meta">

          <span>
            {language === "Hindi"
              ? "नवीनतम कलेक्शन"
              : "LATEST COLLECTION"}
          </span>

          <span>
            {products.length}{" "}
            {language === "Hindi"
              ? "प्रोडक्ट्स"
              : "PRODUCTS"}
          </span>

        </div>

      </section>

      {/* =========================
          CONTENT
      ========================= */}

      <section className="new-arrivals-page-content">

        {/* =========================
            LOADING
        ========================= */}

        {loading && (
          <div className="new-arrivals-loading">

            <div className="new-arrivals-loader"></div>

            <p>
              {language === "Hindi"
                ? "नवीनतम प्रोडक्ट्स लोड हो रहे हैं..."
                : "Loading the latest products..."}
            </p>

          </div>
        )}

        {/* =========================
            ERROR
        ========================= */}

        {!loading && error && (
          <div className="new-arrivals-empty">

            <div className="empty-arrivals-shape">
              <span>!</span>
            </div>

            <p className="empty-arrivals-label">
              {language === "Hindi"
                ? "ERROR"
                : "ERROR"}
            </p>

            <h2>
              {language === "Hindi"
                ? "प्रोडक्ट्स लोड नहीं हो सके"
                : "Could not load products"}
            </h2>

            <p>
              {error}
            </p>

            <Link
              to="/products"
              className="new-arrivals-empty-btn"
            >
              {language === "Hindi"
                ? "सभी प्रोडक्ट्स देखें →"
                : "VIEW ALL PRODUCTS →"}
            </Link>

          </div>
        )}

        {/* =========================
            EMPTY
        ========================= */}

        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="new-arrivals-empty">

              <div className="empty-arrivals-shape">

                <span>✦</span>
                <span>✦</span>
                <span>✦</span>

              </div>

              <p className="empty-arrivals-label">
                {language === "Hindi"
                  ? "NO PRODUCTS"
                  : "NO PRODUCTS"}
              </p>

              <h2>
                {language === "Hindi"
                  ? "अभी कोई प्रोडक्ट उपलब्ध नहीं है"
                  : "No products available"}
              </h2>

              <p>
                {language === "Hindi"
                  ? "फिलहाल दिखाने के लिए कोई प्रोडक्ट नहीं है।"
                  : "There are currently no products to display."}
              </p>

              <Link
                to="/products"
                className="new-arrivals-empty-btn"
              >
                {language === "Hindi"
                  ? "कलेक्शन देखें →"
                  : "EXPLORE COLLECTION →"}
              </Link>

            </div>
          )}

        {/* =========================
            PRODUCTS
        ========================= */}

        {!loading &&
          !error &&
          products.length > 0 && (
            <div className="new-arrivals-page-grid">

              {products.map(
                (product, index) => {
                  const productId =
                    product._id ||
                    product.id;

                  return (
                    <Link
                      key={
                        productId
                      }
                      to={`/product/${productId}`}
                      className="new-arrival-product-card"
                    >

                      {/* IMAGE */}

                      <div className="new-arrival-product-image">

                        {product.image ? (
                          <img
                            src={
                              product.image
                            }
                            alt={
                              product.name
                            }
                            loading="lazy"
                          />
                        ) : (
                          <div
                            style={{
                              width:
                                "100%",
                              height:
                                "100%",
                              minHeight:
                                "260px",
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              background:
                                "#e8ded0",
                              color:
                                "#8a6245",
                              fontSize:
                                "12px",
                            }}
                          >
                            {language ===
                            "Hindi"
                              ? "Image उपलब्ध नहीं"
                              : "Image unavailable"}
                          </div>
                        )}

                        <span className="new-arrival-product-number">
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <span className="new-arrival-product-tag">
                          {language ===
                          "Hindi"
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
                          ₹
                          {Number(
                            product.price
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>

                      {/* FOOTER */}

                      <div className="new-arrival-product-footer">

                        <span>
                          {language ===
                          "Hindi"
                            ? "प्रोडक्ट देखें"
                            : "VIEW PRODUCT"}
                        </span>

                        <span>
                          ↗
                        </span>

                      </div>

                    </Link>
                  );
                }
              )}

            </div>
          )}

      </section>

    </main>
  );
}

export default NewArrivals;