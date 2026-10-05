import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";
import API_URL from "../api";

function Orders() {
  const { language } = useLanguage();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] =
    useState(null);

  // =========================
  // TOKEN
  // =========================

  const token =
    localStorage.getItem("authToken");

  // =========================
  // LOAD ORDERS
  // =========================

  useEffect(() => {
    const loadOrders = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/orders`,
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
                ? "ऑर्डर्स लोड नहीं हो पाए।"
                : "Could not load orders.")
          );
        }

        setOrders(
          Array.isArray(data.orders)
            ? data.orders
            : []
        );
      } catch (err) {
        console.error(
          "Orders loading error:",
          err
        );

        setError(
          err.message ||
            (language === "Hindi"
              ? "ऑर्डर्स लोड नहीं हो पाए।"
              : "Could not load orders.")
        );

        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [token, language]);

  // =========================
  // CANCEL ORDER
  // =========================

  const handleCancelOrder = async (
    orderId
  ) => {
    if (!token) {
      return;
    }

    const confirmed = window.confirm(
      language === "Hindi"
        ? "क्या आप इस ऑर्डर को कैंसल करना चाहते हैं?"
        : "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(orderId);
      setError("");

      const response = await fetch(
        `${API_URL}/api/orders/${orderId}/cancel`,
        {
          method: "PUT",
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
              ? "ऑर्डर कैंसल नहीं हो पाया।"
              : "Could not cancel order.")
        );
      }

      if (data.order) {
        setOrders((currentOrders) =>
          currentOrders.map((order) =>
            order._id === orderId
              ? data.order
              : order
          )
        );
      }
    } catch (err) {
      console.error(
        "Cancel order error:",
        err
      );

      setError(
        err.message ||
          (language === "Hindi"
            ? "ऑर्डर कैंसल नहीं हो पाया।"
            : "Could not cancel order.")
      );
    } finally {
      setCancellingId(null);
    }
  };

  // =========================
  // STATUS TEXT
  // =========================

  const getStatusText = (status) => {
    const normalizedStatus =
      String(status || "")
        .toLowerCase();

    if (language !== "Hindi") {
      return (
        normalizedStatus || "confirmed"
      );
    }

    const statusMap = {
      pending: "पेंडिंग",
      confirmed: "पुष्टि की गई",
      shipped: "भेज दिया गया",
      delivered: "डिलीवर हो गया",
      cancelled: "कैंसल किया गया",
    };

    return (
      statusMap[normalizedStatus] ||
      "पुष्टि की गई"
    );
  };

  // =========================
  // DATE
  // =========================

  const formatDate = (order) => {
    if (!order.createdAt) {
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

  const getItemCount = (order) =>
    (order.items || []).reduce(
      (total, item) =>
        total +
        (Number(item.quantity) || 0),
      0
    );

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="orders-page">
        <section className="orders-header">
          <p>
            {language === "Hindi"
              ? "मेरा अकाउंट"
              : "MY ACCOUNT"}
          </p>

          <h1>
            {language === "Hindi"
              ? "मेरे ऑर्डर्स"
              : "My Orders"}
          </h1>
        </section>

        <section className="orders-content">
          <div className="orders-empty">
            <div className="orders-empty-icon">
              📦
            </div>

            <h2>
              {language === "Hindi"
                ? "ऑर्डर्स लोड हो रहे हैं..."
                : "Loading orders..."}
            </h2>
          </div>
        </section>
      </main>
    );
  }

  // =========================
  // NOT LOGGED IN
  // =========================

  if (!token) {
    return (
      <main className="orders-page">
        <section className="orders-header">
          <p>
            {language === "Hindi"
              ? "मेरा अकाउंट"
              : "MY ACCOUNT"}
          </p>

          <h1>
            {language === "Hindi"
              ? "मेरे ऑर्डर्स"
              : "My Orders"}
          </h1>

          <span>
            {language === "Hindi"
              ? "अपने ऑर्डर्स देखने के लिए लॉगिन करें।"
              : "Please log in to view your orders."}
          </span>
        </section>

        <section className="orders-content">
          <div className="orders-empty">
            <div className="orders-empty-icon">
              🔐
            </div>

            <h2>
              {language === "Hindi"
                ? "कृपया लॉगिन करें"
                : "Login required"}
            </h2>

            <p>
              {language === "Hindi"
                ? "अपने ऑर्डर्स देखने के लिए अपने अकाउंट में लॉगिन करें।"
                : "Log in to your account to view your orders."}
            </p>

            <Link
              to="/login"
              className="orders-shop-btn"
            >
              {language === "Hindi"
                ? "लॉगिन करें →"
                : "Login →"}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="orders-page">

      {/* =========================
          HEADER
      ========================= */}

      <section className="orders-header">

        <p>
          {language === "Hindi"
            ? "मेरा अकाउंट"
            : "MY ACCOUNT"}
        </p>

        <h1>
          {language === "Hindi"
            ? "मेरे ऑर्डर्स"
            : "My Orders"}
        </h1>

        <span>
          {language === "Hindi"
            ? "अपने सभी हाल के ऑर्डर्स देखें।"
            : "View your recent orders and their details."}
        </span>

        {error && (
          <p className="coupon-error">
            {error}
          </p>
        )}

      </section>

      {/* =========================
          CONTENT
      ========================= */}

      <section className="orders-content">

        {orders.length === 0 ? (
          <div className="orders-empty">

            <div className="orders-empty-icon">
              📦
            </div>

            <h2>
              {language === "Hindi"
                ? "अभी कोई ऑर्डर नहीं है"
                : "No orders yet"}
            </h2>

            <p>
              {language === "Hindi"
                ? "आपने अभी तक कोई ऑर्डर नहीं किया है।"
                : "You haven't placed any orders yet."}
            </p>

            <Link
              to="/products"
              className="orders-shop-btn"
            >
              {language === "Hindi"
                ? "शॉपिंग शुरू करें →"
                : "Start Shopping →"}
            </Link>

          </div>
        ) : (
          <div className="orders-list">

            {orders.map(
              (order, index) => {
                const orderId =
                  order._id || index;

                const itemCount =
                  getItemCount(order);

                const totalAmount =
                  Number(
                    order.totalAmount
                  ) || 0;

                const status =
                  String(
                    order.status || ""
                  ).toLowerCase();

                const isCancelled =
                  status === "cancelled";

                const canCancel =
                  [
                    "pending",
                    "confirmed",
                  ].includes(status);

                return (
                  <div
                    className="order-card"
                    key={orderId}
                  >

                    {/* =========================
                        TOP
                    ========================= */}

                    <div className="order-card-top">

                      <div>
                        <p className="order-label">
                          {language === "Hindi"
                            ? "ऑर्डर आईडी"
                            : "ORDER ID"}
                        </p>

                        <h3>
                          #{orderId}
                        </h3>
                      </div>

                      <span className="order-status">
                        {getStatusText(
                          order.status
                        )}
                      </span>

                    </div>

                    {/* =========================
                        DETAILS
                    ========================= */}

                    <div className="order-details">

                      <p>
                        <strong>
                          {language === "Hindi"
                            ? "नाम:"
                            : "Name:"}
                        </strong>{" "}
                        {order.shippingAddress
                          ?.fullName ||
                          "Customer"}
                      </p>

                      <p>
                        <strong>
                          {language === "Hindi"
                            ? "तारीख:"
                            : "Date:"}
                        </strong>{" "}
                        {formatDate(order)}
                      </p>

                      <p>
                        <strong>
                          {language === "Hindi"
                            ? "आइटम:"
                            : "Items:"}
                        </strong>{" "}
                        {itemCount}
                      </p>

                    </div>

                    {/* =========================
                        PRODUCTS
                    ========================= */}

                    <div className="order-products">

                      {(order.items || []).map(
                        (item, itemIndex) => {
                          const product =
                            item.product ||
                            {};

                          const productId =
                            product._id ||
                            item.product?._id ||
                            itemIndex;

                          const image =
                            product.image ||
                            item.image ||
                            "";

                          const name =
                            product.name ||
                            item.name ||
                            "Product";

                          const price =
                            Number(
                              item.price ??
                                product.price
                            ) || 0;

                          return (
                            <div
                              className="order-product"
                              key={productId}
                            >

                              {image ? (
                                <img
                                  src={image}
                                  alt={name}
                                />
                              ) : (
                                <div
                                  style={{
                                    width:
                                      "70px",
                                    height:
                                      "70px",
                                    display:
                                      "flex",
                                    alignItems:
                                      "center",
                                    justifyContent:
                                      "center",
                                    background:
                                      "#eee",
                                    borderRadius:
                                      "8px",
                                  }}
                                >
                                  🛍️
                                </div>
                              )}

                              <div>

                                <strong>
                                  {name}
                                </strong>

                                <span>
                                  {item.quantity}{" "}
                                  × ₹
                                  {price.toLocaleString(
                                    "en-IN"
                                  )}
                                </span>

                              </div>

                            </div>
                          );
                        }
                      )}

                    </div>

                    {/* =========================
                        BOTTOM
                    ========================= */}

                    <div className="order-card-bottom">

                      <strong>
                        ₹
                        {totalAmount.toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          alignItems:
                            "center",
                          flexWrap: "wrap",
                        }}
                      >

                        {!isCancelled &&
                          canCancel && (
                            <button
                              type="button"
                              className="track-order-btn"
                              onClick={() =>
                                handleCancelOrder(
                                  orderId
                                )
                              }
                              disabled={
                                cancellingId ===
                                orderId
                              }
                              style={{
                                border:
                                  "none",
                                cursor:
                                  cancellingId ===
                                  orderId
                                    ? "wait"
                                    : "pointer",
                              }}
                            >
                              {cancellingId ===
                              orderId
                                ? language ===
                                  "Hindi"
                                  ? "कैंसल हो रहा है..."
                                  : "CANCELLING..."
                                : language ===
                                  "Hindi"
                                ? "ऑर्डर कैंसल करें"
                                : "CANCEL ORDER"}
                            </button>
                          )}

                        {!isCancelled && (
                          <Link
                            to={`/track-order?orderId=${orderId}`}
                            className="track-order-btn"
                          >
                            {language ===
                            "Hindi"
                              ? "ऑर्डर ट्रैक करें →"
                              : "Track Order →"}
                          </Link>
                        )}

                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </section>

    </main>
  );
}

export default Orders;