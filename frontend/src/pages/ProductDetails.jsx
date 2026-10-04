import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";

function ProductDetails() {
  const { id } = useParams();
  const { language } = useLanguage();

  const [product, setProduct] = useState(null);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     REVIEW STATES
  ========================= */

  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const [reviewerName, setReviewerName] = useState(
    localStorage.getItem("userName") || ""
  );

  /* =========================
     FETCH PRODUCT
  ========================= */

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:3000/api/products/${id}`
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        setProduct(data);
      } catch (error) {
        console.error(
          "Error fetching product:",
          error
        );

        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* =========================
     LOAD PRODUCT REVIEWS
  ========================= */

  useEffect(() => {
    if (!id) return;

    const storageKey =
      `shopSphereReviews_${id}`;

    const savedReviews =
      JSON.parse(
        localStorage.getItem(storageKey)
      ) || [];

    setReviews(savedReviews);

    setReviewRating(0);
    setHoverRating(0);
    setReviewText("");

    setReviewerName(
      localStorage.getItem("userName") || ""
    );
  }, [id]);

  /* =========================
     ADD REVIEW
  ========================= */

  const handleReviewSubmit = (e) => {
    e.preventDefault();

    const name =
      reviewerName.trim();

    const text =
      reviewText.trim();

    if (!name) {
      return;
    }

    if (reviewRating === 0) {
      return;
    }

    if (!text) {
      return;
    }

    const newReview = {
      id: Date.now(),
      name,
      rating: reviewRating,
      review: text,
      date: new Date().toLocaleDateString(
        language === "Hindi"
          ? "hi-IN"
          : "en-IN"
      ),
    };

    const updatedReviews = [
      newReview,
      ...reviews,
    ];

    setReviews(updatedReviews);

    localStorage.setItem(
      `shopSphereReviews_${id}`,
      JSON.stringify(updatedReviews)
    );

    setReviewText("");
    setReviewRating(0);
    setHoverRating(0);

    localStorage.setItem(
      "userName",
      name
    );
  };

  /* =========================
     RATING CALCULATION
  ========================= */

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (total, item) =>
              total + item.rating,
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  /* =========================
     LOADING
  ========================= */

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

  /* =========================
     ERROR
  ========================= */

  if (error || !product) {
    return (
      <main className="product-not-found">

        <h1>
          {language === "Hindi"
            ? "प्रोडक्ट नहीं मिला"
            : "Product Not Found"}
        </h1>

        <Link to="/products">
          {language === "Hindi"
            ? "प्रोडक्ट्स पर वापस जाएं"
            : "Back to Products"}
        </Link>

      </main>
    );
  }

  /* =========================
     ADD TO CART
  ========================= */

  const handleAddToCart = () => {
    const existingCart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    const productId =
      product._id || product.id;

    const existingProduct =
      existingCart.find(
        (item) =>
          (item._id || item.id) ===
          productId
      );

    let updatedCart;

    if (existingProduct) {
      updatedCart = existingCart.map(
        (item) =>
          (item._id || item.id) ===
          productId
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
      );
    } else {
      updatedCart = [
        ...existingCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    setAdded(true);
  };

  /* =========================
     WISHLIST
  ========================= */

  const handleWishlist = () => {
    const wishlist =
      JSON.parse(
        localStorage.getItem("wishlist")
      ) || [];

    const productId =
      product._id || product.id;

    const alreadySaved =
      wishlist.some(
        (item) =>
          (item._id || item.id) ===
          productId
      );

    if (alreadySaved) {
      const updatedWishlist =
        wishlist.filter(
          (item) =>
            (item._id || item.id) !==
            productId
        );

      localStorage.setItem(
        "wishlist",
        JSON.stringify(updatedWishlist)
      );
    } else {
      const updatedWishlist = [
        ...wishlist,
        product,
      ];

      localStorage.setItem(
        "wishlist",
        JSON.stringify(updatedWishlist)
      );
    }

    window.dispatchEvent(
      new Event("wishlistUpdated")
    );
  };

  return (
    <main className="product-details-page">

      {/* =========================
          PRODUCT DETAILS
      ========================= */}

      <section className="product-details">

        <div className="details-image-wrapper">

          <img
            src={product.image}
            alt={product.name}
            className="details-image"
          />

        </div>


        <div className="details-content">

          {/* CATEGORY */}

          <p className="details-category">

            {language === "Hindi"
              ? product.category ===
                "Fashion"
                ? "फैशन"
                : product.category ===
                  "Accessories"
                ? "एक्सेसरीज़"
                : product.category ===
                  "Footwear"
                ? "फुटवियर"
                : product.category
              : product.category}

          </p>


          {/* PRODUCT NAME */}

          <h1>
            {product.name}
          </h1>


          {/* PRODUCT RATING SUMMARY */}

          <div className="product-rating-summary">

            <div className="product-rating-stars">

              {reviews.length > 0
                ? "★★★★★"
                : "☆☆☆☆☆"}

            </div>

            <strong>
              {reviews.length > 0
                ? averageRating
                : "No rating"}
            </strong>

            <span>
              {reviews.length === 1
                ? "1 Review"
                : `${reviews.length} Reviews`}
            </span>

          </div>


          {/* PRICE */}

          <p className="details-price">
            ₹{product.price}
          </p>

          <div className="details-line"></div>


          {/* DESCRIPTION */}

          <p className="details-description">
            {product.description}
          </p>


          {/* ACTIONS */}

          <div className="details-actions">

            <button
              className="add-cart-btn"
              onClick={handleAddToCart}
            >
              {added
                ? language === "Hindi"
                  ? "कार्ट में जोड़ा गया ✓"
                  : "ADDED TO CART ✓"
                : language === "Hindi"
                ? "कार्ट में जोड़ें"
                : "ADD TO CART"}
            </button>


            <button
              className="wishlist-btn"
              onClick={handleWishlist}
              aria-label="Add to wishlist"
            >
              ♡
            </button>

          </div>


          {/* PRODUCT INFO */}

          <div className="product-info-box">

            <div>

              <strong>
                {language === "Hindi"
                  ? "फ्री शिपिंग"
                  : "FREE SHIPPING"}
              </strong>

              <span>
                {language === "Hindi"
                  ? "₹999 से अधिक के ऑर्डर पर"
                  : "On orders over ₹999"}
              </span>

            </div>


            <div>

              <strong>
                {language === "Hindi"
                  ? "आसान रिटर्न"
                  : "EASY RETURNS"}
              </strong>

              <span>
                {language === "Hindi"
                  ? "30 दिन की रिटर्न पॉलिसी"
                  : "30-day return policy"}
              </span>

            </div>


            <div>

              <strong>
                {language === "Hindi"
                  ? "सुरक्षित भुगतान"
                  : "SECURE PAYMENT"}
              </strong>

              <span>
                {language === "Hindi"
                  ? "100% सुरक्षित चेकआउट"
                  : "100% secure checkout"}
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          REVIEWS SECTION
      ========================= */}

      <section className="product-reviews-section">

        <div className="product-reviews-header">

          <div>

            <p className="section-label">
              {language === "Hindi"
                ? "ग्राहक अनुभव"
                : "CUSTOMER EXPERIENCE"}
            </p>

            <h2>
              {language === "Hindi"
                ? "Reviews & Ratings"
                : "Reviews & Ratings"}
            </h2>

          </div>


          <div className="product-review-overall">

            <strong>
              {reviews.length > 0
                ? averageRating
                : "0.0"}
            </strong>

            <div>
              <span className="overall-stars">
                {reviews.length > 0
                  ? "★★★★★"
                  : "☆☆☆☆☆"}
              </span>

              <small>
                {reviews.length === 1
                  ? "1 customer review"
                  : `${reviews.length} customer reviews`}
              </small>
            </div>

          </div>

        </div>


        {/* =========================
            WRITE REVIEW
        ========================= */}

        <div className="product-review-write">

          <div className="review-write-title">

            <p>
              WRITE A REVIEW
            </p>

            <h3>
              {language === "Hindi"
                ? "इस प्रोडक्ट के बारे में बताएं"
                : "Tell us about this product"}
            </h3>

          </div>


          <form
            onSubmit={handleReviewSubmit}
            className="product-review-form"
          >

            {/* NAME */}

            <div className="product-review-field">

              <label>
                {language === "Hindi"
                  ? "आपका नाम"
                  : "YOUR NAME"}
              </label>

              <input
                type="text"
                value={reviewerName}
                onChange={(e) =>
                  setReviewerName(
                    e.target.value
                  )
                }
                placeholder={
                  language === "Hindi"
                    ? "अपना नाम दर्ज करें"
                    : "Enter your name"
                }
                required
              />

            </div>


            {/* RATING */}

            <div className="product-review-field">

              <label>
                {language === "Hindi"
                  ? "आपकी रेटिंग"
                  : "YOUR RATING"}
              </label>

              <div className="product-rating-picker">

                {[1, 2, 3, 4, 5].map(
                  (star) => (

                    <button
                      key={star}
                      type="button"
                      className={
                        star <=
                        (hoverRating ||
                          reviewRating)
                          ? "rating-star active"
                          : "rating-star"
                      }
                      onMouseEnter={() =>
                        setHoverRating(
                          star
                        )
                      }
                      onMouseLeave={() =>
                        setHoverRating(0)
                      }
                      onClick={() =>
                        setReviewRating(
                          star
                        )
                      }
                      aria-label={`Rate ${star} stars`}
                    >
                      ★
                    </button>

                  )
                )}

              </div>

            </div>


            {/* REVIEW */}

            <div className="product-review-field">

              <label>
                {language === "Hindi"
                  ? "आपका रिव्यू"
                  : "YOUR REVIEW"}
              </label>

              <textarea
                value={reviewText}
                onChange={(e) =>
                  setReviewText(
                    e.target.value
                  )
                }
                placeholder={
                  language === "Hindi"
                    ? "इस प्रोडक्ट के बारे में अपना अनुभव लिखें..."
                    : "Write your experience with this product..."
                }
                rows="5"
                required
              />

            </div>


            <button
              type="submit"
              className="product-review-submit"
            >
              {language === "Hindi"
                ? "रिव्यू पोस्ट करें →"
                : "POST REVIEW →"}
            </button>

          </form>

        </div>


        {/* =========================
            REVIEWS LIST
        ========================= */}

        <div className="product-review-list">

          <div className="product-review-list-title">

            <h3>
              {language === "Hindi"
                ? "Customers Say"
                : "What customers say"}
            </h3>

            <span>
              {reviews.length} REVIEWS
            </span>

          </div>


          {reviews.length === 0 ? (

            <div className="no-product-reviews">

              <span>
                ✦
              </span>

              <h3>
                {language === "Hindi"
                  ? "अभी कोई रिव्यू नहीं है"
                  : "No reviews yet"}
              </h3>

              <p>
                {language === "Hindi"
                  ? "इस प्रोडक्ट पर पहला रिव्यू देने वाले बनें।"
                  : "Be the first shopper to review this product."}
              </p>

            </div>

          ) : (

            <div className="product-review-grid">

              {reviews.map((item) => (

                <article
                  className="product-review-card"
                  key={item.id}
                >

                  <div className="product-review-card-top">

                    <div className="product-review-avatar">
                      {item.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>

                      <h4>
                        {item.name}
                      </h4>

                      <div className="review-card-rating">

                        {"★".repeat(
                          item.rating
                        )}

                        {"☆".repeat(
                          5 - item.rating
                        )}

                      </div>

                    </div>

                  </div>


                  <p className="product-review-text">
                    “{item.review}”
                  </p>


                  <div className="product-review-card-footer">

                    <span>
                      {item.date}
                    </span>

                    <span>
                      ✓ Verified
                    </span>

                  </div>

                </article>

              ))}

            </div>

          )}

        </div>

      </section>

    </main>
  );
}

export default ProductDetails;