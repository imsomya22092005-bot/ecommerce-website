import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";
import API_URL from "../api";
import { Heart } from "lucide-react";

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

  const [wishlisted, setWishlisted] =
    useState(false);

  const [wishlistLoading, setWishlistLoading] =
    useState(false);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

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

        const loadedProduct = data?.product || data;
        setProduct(loadedProduct);

        if (loadedProduct?.variants?.length) {
          setSelectedSize(loadedProduct.variants[0].size);
          setSelectedColor(loadedProduct.variants[0].color);
        } else {
          setSelectedSize(loadedProduct?.sizes?.[0] || "");
          setSelectedColor(loadedProduct?.colors?.[0] || "");
        }
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
  // WISHLIST
  // =========================

  useEffect(() => {
    const loadWishlistStatus = async () => {
      const token = localStorage.getItem("authToken");

      if (!token || !id) {
        setWishlisted(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/wishlist`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        const products =
          data?.wishlist?.products || [];

        setWishlisted(
          products.some(
            (item) =>
              String(item?._id || item?.id) === String(id)
          )
        );
      } catch (error) {
        console.error(
          "Wishlist status error:",
          error
        );
      }
    };

    loadWishlistStatus();
  }, [id]);

  const handleWishlistToggle = async () => {
    const token =
      localStorage.getItem("authToken");

    if (!token) {
      alert(
        language === "Hindi"
          ? "Wishlist में product जोड़ने के लिए पहले login करें।"
          : "Please login before using your wishlist."
      );
      return;
    }

    const productId =
      product?._id || product?.id;

    if (!productId) {
      return;
    }

    setWishlistLoading(true);
    setActionError("");

    try {
      const response = wishlisted
        ? await fetch(
            `${API_URL}/api/wishlist/remove/${productId}`,
            {
              method: "DELETE",
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          )
        : await fetch(
            `${API_URL}/api/wishlist/add`,
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
              }),
            }
          );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (language === "Hindi"
              ? "Wishlist update नहीं हो सकी।"
              : "Could not update wishlist.")
        );
      }

      setWishlisted(!wishlisted);
      window.dispatchEvent(
        new Event("wishlistUpdated")
      );
    } catch (error) {
      console.error(
        "Wishlist update error:",
        error
      );

      setActionError(
        error.message ||
          (language === "Hindi"
            ? "Wishlist update नहीं हो सकी।"
            : "Could not update wishlist.")
      );
    } finally {
      setWishlistLoading(false);
    }
  };

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

    if (
      Array.isArray(product.variants) &&
      product.variants.length > 0 &&
      (!selectedSize || !selectedColor)
    ) {
      setActionError(
        language === "Hindi"
          ? "कृपया size और color चुनें।"
          : "Please select a size and color."
      );
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
              size: selectedSize,
              color: selectedColor,
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

      // Backend cart is the source of truth for logged-in users.
      // Keep a lightweight local cache only for UI events; Cart.jsx
      // fetches the real cart from the API when the user is authenticated.

      setAdded(true);

      window.dispatchEvent(
        new Event("cartUpdated")
      );

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

  const selectedVariant = Array.isArray(product.variants)
    ? product.variants.find(
        (variant) =>
          String(variant?.size || "").trim() ===
            String(selectedSize || "").trim() &&
          String(variant?.color || "").trim() ===
            String(selectedColor || "").trim()
      )
    : null;

  const selectedVariantStock =
    selectedVariant
      ? Number(selectedVariant.stock) || 0
      : productStock;

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
    Array.isArray(product.variants) &&
    product.variants.length > 0
      ? !selectedVariant || selectedVariantStock <= 0
      : productStock <= 0;

  const displayStock =
    Array.isArray(product.variants) &&
    product.variants.length > 0
      ? selectedVariantStock
      : productStock;

  const stockMessage =
    isOutOfStock
      ? language === "Hindi"
        ? "स्टॉक में उपलब्ध नहीं"
        : "Out of Stock"
      : language === "Hindi"
      ? `${displayStock} उपलब्ध`
      : `${displayStock} in stock`;

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

          <div className="product-title-row">
            <h1>
              {productName}
            </h1>

            <button
              type="button"
              className={`product-wishlist-btn ${wishlisted ? "is-wishlisted" : ""}`}
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
              aria-label={
                wishlisted
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
              title={
                wishlisted
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
            >
              <Heart
                size={24}
                strokeWidth={1.7}
                fill={
                  wishlisted
                    ? "currentColor"
                    : "none"
                }
              />
            </button>
          </div>

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
              SIZE & COLOR
          ========================= */}

          {product.variants?.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                margin: "20px 0",
              }}
            >
              <select
                value={selectedSize}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedSize(value);
                  const match = product.variants.find(
                    (variant) =>
                      variant.size === value &&
                      variant.color === selectedColor
                  );
                  const firstForSize = product.variants.find(
                    (variant) => variant.size === value
                  );
                  setSelectedColor(
                    match?.color ||
                    firstForSize?.color ||
                    ""
                  );
                }}
                style={{ padding: "12px", border: "1px solid #ddd" }}
              >
                {[...new Set(product.variants.map((v) => v.size))].map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>

              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                style={{ padding: "12px", border: "1px solid #ddd" }}
              >
                {[...new Set(
                  product.variants
                    .filter((v) => !selectedSize || v.size === selectedSize)
                    .map((v) => v.color)
                )].map((color) => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>
          )}

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