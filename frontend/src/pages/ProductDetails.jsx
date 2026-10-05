import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";
import API_URL from "../api";

function ProductDetails() {
  const { id } = useParams();
  const { language } = useLanguage();

  const [product, setProduct] =
    useState(null);

  const [added, setAdded] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [actionError, setActionError] =
    useState("");

  // =========================
  // FETCH PRODUCT
  // =========================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `${API_URL}/api/products/${id}`
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              (language === "Hindi"
                ? "प्रोडक्ट नहीं मिला।"
                : "Product not found.")
          );
        }

        setProduct(data);
      } catch (err) {
        console.error(
          "Error fetching product:",
          err
        );

        setError(
          err.message ||
            (language === "Hindi"
              ? "प्रोडक्ट नहीं मिला।"
              : "Product not found.")
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, language]);

  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart = async () => {
    const token =
      localStorage.getItem("authToken");

    setActionError("");

    // Backend cart requires authentication
    if (!token) {
      alert(
        language === "Hindi"
          ? "कार्ट में product जोड़ने के लिए पहले login करें।"
          : "Please login before adding a product to cart."
      );

      return;
    }

    const productId =
      product?._id || product?.id;

    if (!productId) {
      return;
    }

    try {
      const response =
        await fetch(
          `${API_URL}/api/cart/add`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              productId,
              quantity: 1,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (language === "Hindi"
              ? "Product cart में add नहीं हो सका।"
              : "Could not add product to cart.")
        );
      }

      // =========================
      // SAVE BACKEND CART LOCALLY
      // =========================

      const backendItems =
        data?.cart?.items || [];

      const normalizedCart =
        backendItems
          .filter(
            (item) =>
              item?.product
          )
          .map((item) => {
            const backendProduct =
              item.product;

            const backendProductId =
              backendProduct._id ||
              backendProduct.id;

            return {
              _id:
                backendProductId,

              id:
                backendProductId,

              name:
                backendProduct.name ||
                "",

              description:
                backendProduct.description ||
                "",

              price:
                Number(
                  backendProduct.price
                ) || 0,

              category:
                backendProduct.category ||
                "",

              image:
                backendProduct.image ||
                "",

              stock:
                Number(
                  backendProduct.stock
                ) || 0,

              quantity:
                Number(
                  item.quantity
                ) || 1,
            };
          });

      localStorage.setItem(
        "cart",
        JSON.stringify(
          normalizedCart
        )
      );

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      setAdded(true);

      setTimeout(() => {
        setAdded(false);
      }, 2500);

    } catch (err) {
      console.error(
        "Add to cart error:",
        err
      );

      setActionError(
        err.message ||
          (language === "Hindi"
            ? "Product cart में add नहीं हो सका।"
            : "Could not add product to cart.")
      );
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="product-not-found">
        <h1>
          {language === "Hindi"
            ? "प्रोडक्ट लोड हो रहा है..."
            : "Loading product..."}
        </h1>
      </main>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error || !product) {
    return (
      <main className="product-not-found">

        <h1>
          {language === "Hindi"
            ? "प्रोडक्ट नहीं मिला"
            : "Product Not Found"}
        </h1>

        <p>
          {error}
        </p>

        <Link to="/products">
          {language === "Hindi"
            ? "प्रोडक्ट्स पर वापस जाएं"
            : "Back to Products"}
        </Link>

      </main>
    );
  }

  // =========================
  // PRODUCT DATA
  // =========================

  const productId =
    product._id || product.id;

  const productName =
    product.name || "Product";

  const productDescription =
    product.description || "";

  const productPrice =
    Number(product.price) || 0;

  const productStock =
    Number(product.stock) || 0;

  const productImage =
    product.image || "";

  const productCategory =
    product.category || "";

  // =========================
  // CATEGORY
  // =========================

  const getCategoryName = () => {
    if (language !== "Hindi") {
      return productCategory;
    }

    const categories = {
      Fashion: "फैशन",
      Accessories: "एक्सेसरीज़",
      Footwear: "फुटवियर",
      Electronics: "इलेक्ट्रॉनिक्स",
      Smartphones: "स्मार्टफोन",
      Laptops: "लैपटॉप",
      Audio: "ऑडियो",
      Beauty: "ब्यूटी",
      Home: "होम",
    };

    return (
      categories[productCategory] ||
      productCategory
    );
  };

  // =========================
  // STOCK STATUS
  // =========================

  const isOutOfStock =
    productStock <= 0;

  const stockMessage =
    isOutOfStock
      ? language === "Hindi"
        ? "स्टॉक में उपलब्ध नहीं"
        : "Out of Stock"
      : language === "Hindi"
      ? `${productStock} उपलब्ध`
      : `${productStock} in stock`;

  return (
    <main className="product-details-page">

      {/* =========================
          PRODUCT DETAILS
      ========================= */}

      <section className="product-details">

        {/* =========================
            IMAGE
        ========================= */}

        <div className="details-image-wrapper">

          {productImage ? (
            <img
              src={productImage}
              alt={productName}
              className="details-image"
            />
          ) : (
            <div
              className="details-image"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "400px",
                background:
                  "#e8ded0",
                color: "#8a6245",
                fontSize: "13px",
              }}
            >
              {language === "Hindi"
                ? "Image उपलब्ध नहीं"
                : "Image unavailable"}
            </div>
          )}

        </div>

        {/* =========================
            CONTENT
        ========================= */}

        <div className="details-content">

          {/* CATEGORY */}

          <p className="details-category">
            {getCategoryName()}
          </p>

          {/* NAME */}

          <h1>
            {productName}
          </h1>

          {/* PRICE */}

          <p className="details-price">
            ₹
            {productPrice.toLocaleString(
              "en-IN"
            )}
          </p>

          <div className="details-line"></div>

          {/* DESCRIPTION */}

          <div className="details-description">
            <p>
              {productDescription}
            </p>
          </div>

          {/* =========================
              STOCK
          ========================= */}

          <div
            style={{
              margin:
                "22px 0",
              padding:
                "14px 16px",
              border:
                "1px solid #e2d7ca",
              background:
                "#fffdf9",
            }}
          >
            <span
              style={{
                display:
                  "block",
                marginBottom:
                  "5px",
                fontSize:
                  "9px",
                letterSpacing:
                  "1px",
                fontWeight:
                  "700",
                color:
                  "#8a6245",
              }}
            >
              {language === "Hindi"
                ? "स्टॉक"
                : "STOCK"}
            </span>

            <strong
              style={{
                color:
                  isOutOfStock
                    ? "#b45845"
                    : "#5f7858",
                fontSize:
                  "14px",
              }}
            >
              {stockMessage}
            </strong>
          </div>

          {/* =========================
              ERROR
          ========================= */}

          {actionError && (
            <p
              style={{
                margin:
                  "0 0 15px",
                color:
                  "#a64b3c",
                fontSize:
                  "12px",
                lineHeight:
                  "1.5",
              }}
            >
              {actionError}
            </p>
          )}

          {/* =========================
              ACTIONS
          ========================= */}

          <div className="details-actions">

            <button
              type="button"
              className="add-cart-btn"
              onClick={
                handleAddToCart
              }
              disabled={
                isOutOfStock
              }
              style={{
                opacity:
                  isOutOfStock
                    ? 0.55
                    : 1,
                cursor:
                  isOutOfStock
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {isOutOfStock
                ? language === "Hindi"
                  ? "स्टॉक खत्म है"
                  : "OUT OF STOCK"
                : added
                ? language === "Hindi"
                  ? "कार्ट में जोड़ा गया ✓"
                  : "ADDED TO CART ✓"
                : language === "Hindi"
                ? "कार्ट में जोड़ें"
                : "ADD TO CART"}
            </button>

          </div>

          {/* =========================
              BASIC PRODUCT INFO
          ========================= */}

          <div className="product-info-box">

            <div>
              <strong>
                {language === "Hindi"
                  ? "कैटेगरी"
                  : "CATEGORY"}
              </strong>

              <span>
                {getCategoryName()}
              </span>
            </div>

            <div>
              <strong>
                {language === "Hindi"
                  ? "कीमत"
                  : "PRICE"}
              </strong>

              <span>
                ₹
                {productPrice.toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>

            <div>
              <strong>
                {language === "Hindi"
                  ? "उपलब्धता"
                  : "AVAILABILITY"}
              </strong>

              <span>
                {stockMessage}
              </span>
            </div>

          </div>

        </div>

      </section>

      {/* =========================
          BOTTOM NAVIGATION
      ========================= */}

      <section
        style={{
          maxWidth:
            "1200px",
          margin:
            "0 auto",
          padding:
            "0 30px 70px",
        }}
      >
        <Link
          to="/products"
          className="continue-shopping"
        >
          {language === "Hindi"
            ? "← सभी प्रोडक्ट्स देखें"
            : "← VIEW ALL PRODUCTS"}
        </Link>
      </section>

    </main>
  );
}

export default ProductDetails;