import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import API_URL from "../api";

function TrackOrder() {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();

  const orderFromUrl =
    searchParams.get("orderId") || "";

  const [orderId, setOrderId] =
    useState(orderFromUrl);

  const [foundOrder, setFoundOrder] =
    useState(null);

  const [searched, setSearched] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const token =
    localStorage.getItem("authToken");

  // =========================
  // URL ORDER ID
  // =========================

  useEffect(() => {
    if (orderFromUrl) {
      setOrderId(orderFromUrl);
    }
  }, [orderFromUrl]);

  // =========================
  // TRACK ORDER
  // =========================

  const handleTrack = async (e) => {
    e.preventDefault();

    const value =
      orderId.trim();

    if (!value) {
      return;
    }

    setError("");
    setFoundOrder(null);
    setSearched(false);

    // =========================
    // LOGIN REQUIRED
    // =========================

    if (!token) {
      setError(
        language === "Hindi"
          ? "ऑर्डर ट्रैक करने के लिए पहले लॉगिन करें।"
          : "Please log in to track your order."
      );

      setSearched(true);
      return;
    }

    try {
      setLoading(true);

      const response =
        await fetch(
          `${API_URL}/api/orders/${encodeURIComponent(
            value
          )}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (language === "Hindi"
              ? "ऑर्डर नहीं मिला।"
              : "Order not found.")
        );
      }

      // Backend returns the order directly
      setFoundOrder(data);
      setSearched(true);
    } catch (err) {
      console.error(
        "Track order error:",
        err
      );

      setError(
        err.message ||
          (language === "Hindi"
            ? "ऑर्डर नहीं मिला।"
            : "Could not find order.")
      );

      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // STATUS
  // =========================

  const getStatusText = (status) => {
    const value =
      String(status || "")
        .toLowerCase()
        .trim();

    if (language === "Hindi") {
      const statusMap = {
        pending: "पेंडिंग",
        confirmed: "पुष्टि की गई",
        shipped: "भेज दिया गया",
        delivered: "डिलीवर हो गया",
        cancelled: "कैंसल किया गया",
      };

      return (
        statusMap[value] ||
        "पुष्टि की गई"
      );
    }

    const statusMap = {
      pending: "Pending",
      confirmed: "Confirmed",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };

    return (
      statusMap[value] ||
      "Confirmed"
    );
  };

  // =========================
  // STATUS STEP
  // =========================

  const getStatusStep = (status) => {
    const value =
      String(status || "")
        .toLowerCase()
        .trim();

    const steps = {
      pending: 0,
      confirmed: 1,
      shipped: 2,
      delivered: 3,
    };

    return steps[value] ?? 0;
  };

  // =========================
  // DATE
  // =========================

  const formatDate = (order) => {
    if (!order?.createdAt) {
      return "—";
    }

    return new Date(
      order.createdAt
    ).toLocaleDateString(
      language === "Hindi"
        ? "hi-IN"
        : "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================
  // ITEM COUNT
  // =========================

  const getItemCount = (order) => {
    return (order?.items || []).reduce(
      (total, item) =>
        total +
        (Number(item.quantity) || 0),
      0
    );
  };

  const displayOrderId =
    foundOrder?._id || orderId;

  const currentStep =
    foundOrder &&
    foundOrder.status !==
      "cancelled"
      ? getStatusStep(
          foundOrder.status
        )
      : -1;

  // =========================
  // TRACKING STEPS
  // =========================

  const trackingSteps = [
    {
      key: "pending",
      title:
        language === "Hindi"
          ? "ऑर्डर पेंडिंग"
          : "Order Pending",
      location:
        "ShopSphere Order Center",
      message:
        language === "Hindi"
          ? "आपका ऑर्डर प्राप्त हो गया है।"
          : "Your order has been received.",
    },
    {
      key: "confirmed",
      title:
        language === "Hindi"
          ? "ऑर्डर कन्फर्म"
          : "Order Confirmed",
      location:
        "ShopSphere Order Center",
      message:
        language === "Hindi"
          ? "आपका ऑर्डर कन्फर्म हो गया है।"
          : "Your order has been confirmed.",
    },
    {
      key: "shipped",
      title:
        language === "Hindi"
          ? "शिप्ड"
          : "Shipped",
      location:
        "Dispatch Hub",
      message:
        language === "Hindi"
          ? "आपका ऑर्डर डिस्पैच कर दिया गया है।"
          : "Your order has been dispatched.",
    },
    {
      key: "delivered",
      title:
        language === "Hindi"
          ? "डिलीवर्ड"
          : "Delivered",
      location:
        "Delivery Address",
      message:
        language === "Hindi"
          ? "आपका ऑर्डर सफलतापूर्वक डिलीवर हो गया है।"
          : "Your order has been delivered successfully.",
    },
  ];

  return (
    <main className="track-page">

      {/* =========================
          PAGE STYLE
      ========================= */}

      <style>{`
        .track-page {
          min-height: 100vh;
          background: #f6f1e9;
        }

        .track-content {
          padding-bottom: 80px;
        }

        .tracking-result {
          margin-top: 35px;
        }

        .shipment-history {
          margin-top: 35px;
          padding: 25px 10px 5px;
          border-top: 1px solid #e5d9ca;
        }

        .shipment-history-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 30px;
        }

        .shipment-history-header h4 {
          margin: 0;
          color: #211e1b;
          font-family: "Playfair Display", serif;
          font-size: 22px;
        }

        .shipment-history-header span {
          padding: 7px 10px;
          border: 1px solid #e1d4c5;
          border-radius: 20px;
          color: #8a6245;
          background: #fffdf9;
          font-size: 10px;
          word-break: break-all;
        }

        .shipment-item {
          position: relative;
          display: flex;
          gap: 18px;
          min-height: 120px;
        }

        .shipment-marker-area {
          position: relative;
          width: 36px;
          min-width: 36px;
          display: flex;
          justify-content: center;
        }

        .shipment-marker {
          position: relative;
          z-index: 2;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #d7cab9;
          border-radius: 50%;
          background: #fffdf9;
          color: #aaa095;
          font-size: 11px;
          font-weight: 700;
        }

        .shipment-line {
          position: absolute;
          z-index: 1;
          top: 32px;
          bottom: 0;
          left: 50%;
          width: 2px;
          transform: translateX(-50%);
          background: #ded2c4;
        }

        .shipment-info {
          flex: 1;
          padding-bottom: 32px;
        }

        .shipment-top {
          display: flex;
          justify-content: space-between;
          gap: 15px;
        }

        .shipment-info h5 {
          margin: 2px 0 5px;
          color: #a69a8d;
          font-size: 15px;
        }

        .shipment-location {
          display: block;
          color: #b1a59a;
          font-size: 11px;
        }

        .shipment-info p {
          max-width: 520px;
          margin: 8px 0 0;
          color: #afa49a;
          font-size: 11px;
          line-height: 1.7;
        }

        .shipment-item.completed .shipment-marker {
          border-color: #7d9473;
          background: #7d9473;
          color: white;
          box-shadow: 0 0 0 4px rgba(125, 148, 115, 0.10);
        }

        .shipment-item.completed .shipment-line {
          background: #7d9473;
        }

        .shipment-item.completed .shipment-info h5 {
          color: #211e1b;
        }

        .shipment-item.current .shipment-marker {
          border-color: #c96f5b;
          background: #c96f5b;
          color: white;
          box-shadow: 0 0 0 5px rgba(201, 111, 91, 0.12);
        }

        .shipment-item.current .shipment-info h5 {
          color: #c96f5b;
        }

        .shipment-current-label {
          display: inline-block;
          margin-top: 11px;
          padding: 6px 10px;
          border-radius: 20px;
          background: #f3ddd7;
          color: #a75645;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .track-order-meta {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 25px;
        }

        .track-order-meta-card {
          padding: 15px;
          border: 1px solid #e5d9ca;
          background: #fffdf9;
        }

        .track-order-meta-card span {
          display: block;
          margin-bottom: 5px;
          color: #95897e;
          font-size: 9px;
          letter-spacing: 1px;
          font-weight: 700;
        }

        .track-order-meta-card strong {
          color: #211e1b;
          font-size: 13px;
        }

        .track-cancelled {
          margin-top: 25px;
          padding: 14px 16px;
          border: 1px solid #e7c6bf;
          background: #f8e9e5;
          color: #a75645;
          font-size: 12px;
        }

        @media (max-width: 600px) {
          .shipment-history {
            padding-left: 0;
            padding-right: 0;
          }

          .shipment-history-header h4 {
            font-size: 18px;
          }

          .shipment-item {
            gap: 12px;
          }

          .shipment-marker-area {
            width: 30px;
            min-width: 30px;
          }

          .shipment-marker {
            width: 28px;
            height: 28px;
          }

          .shipment-line {
            top: 28px;
          }

          .shipment-info h5 {
            font-size: 13px;
          }

          .shipment-location {
            font-size: 10px;
          }

          .shipment-info p {
            font-size: 10px;
          }

          .track-order-meta {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* =========================
          HERO
      ========================= */}

      <section className="track-hero">

        <p>ORDER TRACKING</p>

        <h1>
          {language === "Hindi"
            ? "अपना ऑर्डर ट्रैक करें"
            : "Track Your Order"}
        </h1>

        <span>
          {language === "Hindi"
            ? "अपना ऑर्डर ID डालकर स्टेटस देखें।"
            : "Enter your order ID to check its status."}
        </span>

      </section>

      {/* =========================
          CONTENT
      ========================= */}

      <section className="track-content">

        <div className="track-form-card">

          <div className="track-icon">
            🚚
          </div>

          <h2>
            {language === "Hindi"
              ? "मेरा ऑर्डर कहाँ है?"
              : "Where is my order?"}
          </h2>

          <p>
            {language === "Hindi"
              ? "ऑर्डर करने के बाद मिले Order ID को यहाँ डालें।"
              : "Enter the Order ID you received after placing your order."}
          </p>

          <form onSubmit={handleTrack}>

            <label>
              Order ID
            </label>

            <input
              type="text"
              placeholder="Example: 68f123abc..."
              value={orderId}
              onChange={(e) => {
                setOrderId(
                  e.target.value
                );
                setFoundOrder(null);
                setSearched(false);
                setError("");
              }}
              required
            />

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? language === "Hindi"
                  ? "चेक हो रहा है..."
                  : "Checking..."
                : language === "Hindi"
                ? "ऑर्डर ट्रैक करें →"
                : "Track Order →"}
            </button>

          </form>

          {/* =========================
              ERROR
          ========================= */}

          {searched && error && (
            <div className="tracking-result">

              <div className="tracking-result-icon">
                !
              </div>

              <h3>
                {language === "Hindi"
                  ? "ऑर्डर नहीं मिला"
                  : "Order Not Found"}
              </h3>

              <p>
                {error}
              </p>

              {!token && (
                <Link
                  to="/login"
                  className="orders-shop-btn"
                  style={{
                    display:
                      "inline-block",
                    marginTop: "15px",
                  }}
                >
                  {language === "Hindi"
                    ? "लॉगिन करें →"
                    : "Login →"}
                </Link>
              )}

            </div>
          )}

          {/* =========================
              ORDER FOUND
          ========================= */}

          {searched &&
            foundOrder &&
            !error && (
              <div className="tracking-result">

                <div className="tracking-result-icon">
                  ✓
                </div>

                <h3>
                  {language === "Hindi"
                    ? "ऑर्डर मिल गया"
                    : "Order Found"}
                </h3>

                <p>
                  {language === "Hindi"
                    ? "आपके ऑर्डर की वर्तमान स्थिति:"
                    : "Your order is currently:"}{" "}
                  <strong>
                    {getStatusText(
                      foundOrder.status
                    )}
                  </strong>
                </p>

                {/* =========================
                    META
                ========================= */}

                <div className="track-order-meta">

                  <div className="track-order-meta-card">

                    <span>
                      ORDER DATE
                    </span>

                    <strong>
                      {formatDate(
                        foundOrder
                      )}
                    </strong>

                  </div>

                  <div className="track-order-meta-card">

                    <span>
                      ITEMS
                    </span>

                    <strong>
                      {getItemCount(
                        foundOrder
                      )}
                    </strong>

                  </div>

                  <div className="track-order-meta-card">

                    <span>
                      TOTAL
                    </span>

                    <strong>
                      ₹
                      {Number(
                        foundOrder.totalAmount ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>

                </div>

                {/* =========================
                    CANCELLED
                ========================= */}

                {String(
                  foundOrder.status
                ).toLowerCase() ===
                  "cancelled" && (
                  <div className="track-cancelled">
                    {language === "Hindi"
                      ? "यह ऑर्डर कैंसल कर दिया गया है।"
                      : "This order has been cancelled."}
                  </div>
                )}

                {/* =========================
                    TIMELINE
                ========================= */}

                <div className="shipment-history">

                  <div className="shipment-history-header">

                    <h4>
                      {language === "Hindi"
                        ? "ऑर्डर हिस्ट्री"
                        : "Order History"}
                    </h4>

                    <span>
                      #{displayOrderId}
                    </span>

                  </div>

                  <div>
                    {trackingSteps.map(
                      (step, index) => {
                        const completed =
                          currentStep >=
                          0 &&
                          index <
                            currentStep;

                        const current =
                          currentStep >=
                          0 &&
                          index ===
                            currentStep;

                        return (
                          <div
                            key={step.key}
                            className={`shipment-item ${
                              completed
                                ? "completed"
                                : ""
                            } ${
                              current
                                ? "current"
                                : ""
                            }`}
                          >

                            <div className="shipment-marker-area">

                              <span className="shipment-marker">
                                {completed
                                  ? "✓"
                                  : current
                                  ? "●"
                                  : index + 1}
                              </span>

                              {index <
                                trackingSteps.length -
                                  1 && (
                                <span className="shipment-line"></span>
                              )}

                            </div>

                            <div className="shipment-info">

                              <div className="shipment-top">

                                <div>

                                  <h5>
                                    {
                                      step.title
                                    }
                                  </h5>

                                  <span className="shipment-location">
                                    📍{" "}
                                    {
                                      step.location
                                    }
                                  </span>

                                </div>

                              </div>

                              <p>
                                {
                                  step.message
                                }
                              </p>

                              {current && (
                                <span className="shipment-current-label">
                                  {language ===
                                  "Hindi"
                                    ? "वर्तमान स्थिति"
                                    : "CURRENT STATUS"}
                                </span>
                              )}

                            </div>

                          </div>
                        );
                      }
                    )}
                  </div>

                </div>

                {/* =========================
                    BACK
                ========================= */}

                <Link
                  to="/orders"
                  className="orders-shop-btn"
                  style={{
                    display:
                      "inline-block",
                    marginTop:
                      "25px",
                  }}
                >
                  {language === "Hindi"
                    ? "← मेरे ऑर्डर्स"
                    : "← Back to Orders"}
                </Link>

              </div>
            )}

        </div>

      </section>

    </main>
  );
}

export default TrackOrder;