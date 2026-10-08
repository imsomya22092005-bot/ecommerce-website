import { useEffect, useState } from "react";
import API_URL from "../api";

function ReviewSection({ productId, language }) {
  const [reviews, setReviews] = useState([]);
  const [ratingDistribution, setRatingDistribution] = useState({
    5: 0, 4: 0, 3: 0, 2: 0, 1: 0,
  });
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [myReview, setMyReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("authToken");

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/api/reviews/product/${productId}?page=1&limit=10`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load reviews.");
      }

      setReviews(data.reviews || []);
      setRatingDistribution(data.ratingDistribution || {
        5: 0, 4: 0, 3: 0, 2: 0, 1: 0,
      });
      setAverageRating(Number(data.product?.rating || 0));
      setReviewCount(Number(data.product?.reviewCount || 0));
    } catch (error) {
      console.error("Review load error:", error);
      setMessage(
        language === "Hindi"
          ? "Reviews लोड नहीं हो सके।"
          : "Reviews could not be loaded."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadMyReview = async () => {
    if (!token) {
      setMyReview(null);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/reviews/product/${productId}/my-review`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (response.ok) {
        setMyReview(data.review || null);
        if (data.review) {
          setRating(data.review.rating);
          setComment(data.review.comment || "");
        }
      }
    } catch (error) {
      console.error("My review load error:", error);
    }
  };

  useEffect(() => {
    if (!productId) return;
    loadReviews();
    loadMyReview();
  }, [productId]);

  const resetForm = () => {
    setRating(5);
    setComment("");
    setEditing(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      setMessage(
        language === "Hindi"
          ? "Review देने के लिए पहले login करें।"
          : "Please login to write a review."
      );
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const url = editing
        ? `${API_URL}/api/reviews/${myReview?._id}`
        : `${API_URL}/api/reviews`;

      const response = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...(editing ? {} : { productId }),
          rating: Number(rating),
          comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save review.");
      }

      setMyReview(data.review || null);
      setMessage(
        language === "Hindi"
          ? editing ? "Review update हो गया ✓" : "Review add हो गया ✓"
          : editing ? "Review updated ✓" : "Review added ✓"
      );
      resetForm();
      await loadReviews();
    } catch (error) {
      console.error("Review save error:", error);
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !myReview?._id) return;

    const confirmed = window.confirm(
      language === "Hindi"
        ? "क्या आप अपना review delete करना चाहते हैं?"
        : "Delete your review?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/api/reviews/${myReview._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete review.");
      }

      setMyReview(null);
      resetForm();
      setMessage(
        language === "Hindi"
          ? "Review delete हो गया ✓"
          : "Review deleted ✓"
      );
      await loadReviews();
    } catch (error) {
      console.error("Review delete error:", error);
      setMessage(error.message);
    }
  };

  const startEditing = () => {
    if (!myReview) return;
    setRating(myReview.rating);
    setComment(myReview.comment || "");
    setEditing(true);
    setMessage("");
  };

  const totalForBar = Math.max(reviewCount, 1);

  return (
    <section
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "30px 30px 90px",
      }}
    >
      <div
        style={{
          borderTop: "1px solid #e2d7ca",
          paddingTop: "55px",
        }}
      >
        <p style={{
          margin: 0,
          color: "#8a6245",
          fontSize: "10px",
          letterSpacing: "2px",
          fontWeight: 700,
        }}>
          {language === "Hindi" ? "CUSTOMER REVIEWS" : "CUSTOMER REVIEWS"}
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(180px, .7fr) minmax(260px, 1fr) minmax(300px, 1.4fr)",
          gap: "35px",
          marginTop: "22px",
        }}>
          <div style={{
            padding: "24px",
            background: "#fffdf9",
            border: "1px solid #e2d7ca",
          }}>
            <div style={{ fontSize: "38px", fontWeight: 700 }}>
              {averageRating.toFixed(1)}
            </div>
            <div style={{ color: "#9a6b42", letterSpacing: "3px", margin: "7px 0" }}>
              {"★".repeat(Math.round(averageRating))}{"☆".repeat(5 - Math.round(averageRating))}
            </div>
            <div style={{ color: "#777", fontSize: "12px" }}>
              {reviewCount} {language === "Hindi" ? "reviews" : "reviews"}
            </div>
          </div>

          <div>
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} style={{
                display: "grid",
                gridTemplateColumns: "32px 1fr 35px",
                alignItems: "center",
                gap: "8px",
                marginBottom: "9px",
                fontSize: "12px",
              }}>
                <span>{star}★</span>
                <div style={{
                  height: "7px",
                  background: "#eee6dc",
                  overflow: "hidden",
                }}>
                  <div style={{
                    width: `${(Number(ratingDistribution[star] || 0) / totalForBar) * 100}%`,
                    height: "100%",
                    background: "#9a6b42",
                  }} />
                </div>
                <span style={{ textAlign: "right", color: "#777" }}>
                  {ratingDistribution[star] || 0}
                </span>
              </div>
            ))}
          </div>

          <div>
            <h2 style={{
              margin: "0 0 12px",
              fontSize: "24px",
              fontWeight: 600,
            }}>
              {myReview
                ? language === "Hindi" ? "Your Review" : "Your Review"
                : language === "Hindi" ? "Share your experience" : "Share your experience"}
            </h2>

            {token ? (
              <form onSubmit={handleSubmit}>
                <div style={{ display: "flex", gap: "5px", marginBottom: "12px" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      aria-label={`${star} stars`}
                      style={{
                        border: 0,
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: "25px",
                        padding: 0,
                        color: star <= rating ? "#9a6b42" : "#d6cec4",
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  minLength={3}
                  maxLength={1000}
                  placeholder={language === "Hindi"
                    ? "Apna experience likhein..."
                    : "Write your experience..."}
                  rows={4}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    resize: "vertical",
                    padding: "13px",
                    border: "1px solid #ddd3c8",
                    background: "#fff",
                    fontFamily: "inherit",
                  }}
                  required
                />

                <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      padding: "12px 18px",
                      border: 0,
                      background: "#171513",
                      color: "#fff",
                      cursor: saving ? "wait" : "pointer",
                    }}
                  >
                    {saving
                      ? "SAVING..."
                      : editing
                      ? "UPDATE REVIEW"
                      : "WRITE REVIEW"}
                  </button>

                  {editing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      style={{
                        padding: "12px 18px",
                        background: "transparent",
                        border: "1px solid #cfc4b8",
                        cursor: "pointer",
                      }}
                    >
                      CANCEL
                    </button>
                  )}

                  {myReview && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      style={{
                        padding: "12px 18px",
                        background: "transparent",
                        border: "1px solid #c9a69b",
                        color: "#9b5142",
                        cursor: "pointer",
                      }}
                    >
                      DELETE
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <p style={{ color: "#777", fontSize: "13px", lineHeight: 1.6 }}>
                {language === "Hindi"
                  ? "Review लिखने के लिए पहले login करें।"
                  : "Login to write a review. Reviews are available to customers who purchased and received this product."}
              </p>
            )}

            {message && (
              <p style={{
                marginTop: "12px",
                color: message.toLowerCase().includes("could") || message.includes("required") || message.includes("only after")
                  ? "#a64b3c"
                  : "#5f7858",
                fontSize: "12px",
                lineHeight: 1.5,
              }}>
                {message}
              </p>
            )}
          </div>
        </div>

        <div style={{ marginTop: "45px" }}>
          <h3 style={{ fontSize: "18px", marginBottom: "20px" }}>
            {language === "Hindi" ? "Latest reviews" : "Latest reviews"}
          </h3>

          {loading ? (
            <p style={{ color: "#777" }}>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p style={{ color: "#777" }}>
              {language === "Hindi"
                ? "Abhi koi review nahi hai."
                : "No reviews yet."}
            </p>
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {reviews.map((review) => (
                <article
                  key={review._id}
                  style={{
                    padding: "20px",
                    border: "1px solid #e5ddd4",
                    background: "#fff",
                  }}
                >
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "15px",
                    flexWrap: "wrap",
                  }}>
                    <strong>{review.user?.username || "Customer"}</strong>
                    <span style={{ color: "#9a6b42", letterSpacing: "2px" }}>
                      {"★".repeat(Number(review.rating || 0))}
                    </span>
                  </div>
                  <p style={{
                    margin: "10px 0 0",
                    color: "#555",
                    lineHeight: 1.7,
                    fontSize: "13px",
                  }}>
                    {review.comment}
                  </p>
                  {review.verifiedPurchase && (
                    <small style={{
                      display: "block",
                      marginTop: "10px",
                      color: "#5f7858",
                      fontSize: "10px",
                      letterSpacing: "1px",
                    }}>
                      VERIFIED PURCHASE
                    </small>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ReviewSection;
