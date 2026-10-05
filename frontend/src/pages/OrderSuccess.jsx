import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function OrderSuccess() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const savedOrder =
    localStorage.getItem("lastOrder");

  const order = savedOrder
    ? JSON.parse(savedOrder)
    : null;

  // =========================
  // NO ORDER
  // =========================

  if (!order) {
    return (
      <main className="order-success">

        <div className="success-icon">
          !
        </div>

        <p className="section-label">
          {language === "Hindi"
            ? "ऑर्डर नहीं मिला"
            : "ORDER NOT FOUND"}
        </p>

        <h1>
          {language === "Hindi"
            ? "ऑर्डर की जानकारी उपलब्ध नहीं है"
            : "Order information is unavailable"}
        </h1>

        <p>
          {language === "Hindi"
            ? "अपना ऑर्डर देखने के लिए My Orders पर जाएं।"
            : "Please go to My Orders to view your orders."}
        </p>

        <div className="success-actions">

          <Link to="/orders">
            {language === "Hindi"
              ? "मेरे ऑर्डर्स देखें"
              : "VIEW MY ORDERS"}
          </Link>

          <Link to="/products">
            {language === "Hindi"
              ? "शॉपिंग जारी रखें"
              : "CONTINUE SHOPPING"}
          </Link>

        </div>

      </main>
    );
  }

  // =========================
  // ORDER ID
  // =========================

  const orderId =
    order._id || "—";

  // =========================
  // DATE
  // =========================

  const orderDate =
    order.createdAt
      ? new Date(
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
        )
      : "—";

  // =========================
  // TOTAL
  // =========================

  const total =
    Number(
      order.totalAmount
    ) || 0;

  // =========================
  // ITEMS
  // =========================

  const items =
    Array.isArray(order.items)
      ? order.items
      : [];

  const itemCount =
    items.reduce(
      (sum, item) =>
        sum +
        (Number(
          item.quantity
        ) || 0),
      0
    );

  // =========================
  // STATUS
  // =========================

  const status =
    String(
      order.status ||
        "confirmed"
    ).toLowerCase();

  const getStatusText = () => {
    if (language === "Hindi") {
      const statusMap = {
        pending: "पेंडिंग",
        confirmed: "पुष्टि की गई",
        shipped: "भेज दिया गया",
        delivered: "डिलीवर हो गया",
        cancelled: "कैंसल किया गया",
      };

      return (
        statusMap[status] ||
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
      statusMap[status] ||
      "Confirmed"
    );
  };

  // =========================
  // CUSTOMER
  // =========================

  const customerName =
    order.shippingAddress
      ?.fullName || "";

  // =========================
  // ITEM PRODUCT DETAILS
  // =========================

  const getItemDetails = (
    item
  ) => {
    const product =
      item.product || {};

    return {
      id:
        product._id ||
        item.productId ||
        item._id,

      name:
        product.name ||
        item.name ||
        "Product",

      image:
        product.image ||
        item.image ||
        "",

      price:
        Number(
          item.price ??
            product.price ??
            0
        ) || 0,

      quantity:
        Number(
          item.quantity
        ) || 1,
    };
  };

  // =========================
  // CONTINUE SHOPPING
  // =========================

  const handleContinueShopping =
    () => {
      localStorage.removeItem(
        "lastOrder"
      );

      navigate("/products");
    };

  return (
    <main className="order-success">

      {/* =========================
          SUCCESS ICON
      ========================= */}

      <div className="success-icon">
        ✓
      </div>

      {/* =========================
          LABEL
      ========================= */}

      <p className="section-label">
        {language === "Hindi"
          ? "ऑर्डर कन्फर्म हो गया"
          : "ORDER CONFIRMED"}
      </p>

      {/* =========================
          TITLE
      ========================= */}

      <h1>
        {language === "Hindi"
          ? "आपके ऑर्डर के लिए धन्यवाद"
          : "Thank You For Your Order"}
      </h1>

      {/* =========================
          MESSAGE
      ========================= */}

      <p>
        {language === "Hindi"
          ? `धन्यवाद${customerName ? ` ${customerName}` : ""}! आपका ऑर्डर सफलतापूर्वक प्लेस हो गया है।`
          : `Thank you${customerName ? `, ${customerName}` : ""}! Your order has been successfully placed.`}
      </p>

      <p>
        {language === "Hindi"
          ? "आप अपने ऑर्डर की स्थिति My Orders या Track Order से देख सकते हैं।"
          : "You can check your order status from My Orders or Track Order."}
      </p>

      {/* =========================
          ORDER DETAILS
      ========================= */}

      <div className="order-details">

        {/* ORDER ID */}

        <div>
          <span>
            {language === "Hindi"
              ? "ऑर्डर आईडी"
              : "ORDER ID"}
          </span>

          <strong>
            #{orderId}
          </strong>
        </div>

        {/* DATE */}

        <div>
          <span>
            {language === "Hindi"
              ? "ऑर्डर की तारीख"
              : "ORDER DATE"}
          </span>

          <strong>
            {orderDate}
          </strong>
        </div>

        {/* ITEMS */}

        <div>
          <span>
            {language === "Hindi"
              ? "कुल आइटम"
              : "ITEMS"}
          </span>

          <strong>
            {itemCount}
          </strong>
        </div>

        {/* STATUS */}

        <div>
          <span>
            {language === "Hindi"
              ? "स्थिति"
              : "STATUS"}
          </span>

          <strong
            style={{
              textTransform:
                "capitalize",
            }}
          >
            {getStatusText()}
          </strong>
        </div>

        {/* TOTAL */}

        <div>
          <span>
            {language === "Hindi"
              ? "कुल"
              : "TOTAL"}
          </span>

          <strong>
            ₹
            {total.toLocaleString(
              "en-IN"
            )}
          </strong>
        </div>

      </div>

      {/* =========================
          DELIVERY ADDRESS
      ========================= */}

      {order.shippingAddress && (
        <div
          className="success-order-items"
          style={{
            width: "100%",
            maxWidth: "760px",
            margin:
              "30px auto 0",
            textAlign: "left",
          }}
        >

          <p
            className="section-label"
            style={{
              marginBottom:
                "6px",
            }}
          >
            {language === "Hindi"
              ? "डिलीवरी पता"
              : "DELIVERY ADDRESS"}
          </p>

          <div
            style={{
              padding: "18px",
              border:
                "1px solid #e8ded0",
              background:
                "#fffdf9",
              color:
                "#5f574f",
              fontSize:
                "12px",
              lineHeight:
                "1.8",
            }}
          >

            <strong>
              {
                order.shippingAddress
                  .fullName
              }
            </strong>

            <br />

            {
              order.shippingAddress
                .address
            }

            <br />

            {
              order.shippingAddress
                .city
            }
            ,{" "}
            {
              order.shippingAddress
                .state
            }{" "}
            -{" "}
            {
              order.shippingAddress
                .pincode
            }

            <br />

            {language === "Hindi"
              ? "फोन: "
              : "Phone: "}

            {
              order.shippingAddress
                .phone
            }

          </div>

        </div>
      )}

      {/* =========================
          ORDER ITEMS
      ========================= */}

      {items.length > 0 && (
        <div
          className="success-order-items"
          style={{
            width: "100%",
            maxWidth: "760px",
            margin:
              "30px auto 0",
            textAlign: "left",
          }}
        >

          <div
            style={{
              marginBottom:
                "15px",
            }}
          >

            <p
              className="section-label"
              style={{
                marginBottom:
                  "6px",
              }}
            >
              {language === "Hindi"
                ? "आपका ऑर्डर"
                : "YOUR ORDER"}
            </p>

            <h2
              style={{
                margin: 0,
              }}
            >
              {language === "Hindi"
                ? "ऑर्डर आइटम्स"
                : "Order Items"}
            </h2>

          </div>

          {items.map(
            (item, index) => {
              const details =
                getItemDetails(
                  item
                );

              const itemTotal =
                details.price *
                details.quantity;

              return (
                <div
                  key={
                    details.id ||
                    index
                  }
                  style={{
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap: "14px",
                    padding:
                      "14px 0",
                    borderBottom:
                      "1px solid #e8ded0",
                  }}
                >

                  {/* IMAGE */}

                  {details.image ? (
                    <img
                      src={
                        details.image
                      }
                      alt={
                        details.name
                      }
                      style={{
                        width:
                          "64px",
                        height:
                          "76px",
                        objectFit:
                          "cover",
                        background:
                          "#f6f1e9",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width:
                          "64px",
                        height:
                          "76px",
                        display:
                          "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        background:
                          "#eee5da",
                        color:
                          "#8a6245",
                        fontSize:
                          "20px",
                      }}
                    >
                      🛍️
                    </div>
                  )}

                  {/* INFO */}

                  <div
                    style={{
                      flex: 1,
                    }}
                  >

                    <strong
                      style={{
                        display:
                          "block",
                        color:
                          "#211e1b",
                        fontSize:
                          "13px",
                        marginBottom:
                          "5px",
                      }}
                    >
                      {details.name}
                    </strong>

                    <span
                      style={{
                        color:
                          "#81776e",
                        fontSize:
                          "11px",
                      }}
                    >
                      {details.quantity} × ₹
                      {details.price.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>

                  {/* ITEM TOTAL */}

                  <strong
                    style={{
                      color:
                        "#8a6245",
                      fontSize:
                        "12px",
                    }}
                  >
                    ₹
                    {itemTotal.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>
              );
            }
          )}

        </div>
      )}

      {/* =========================
          ACTIONS
      ========================= */}

      <div className="success-actions">

        <Link to="/orders">
          {language === "Hindi"
            ? "मेरे ऑर्डर्स देखें"
            : "VIEW MY ORDERS"}
        </Link>

        <Link
          to={`/track-order?orderId=${orderId}`}
        >
          {language === "Hindi"
            ? "ऑर्डर ट्रैक करें"
            : "TRACK ORDER"}
        </Link>

        <Link
          to="/products"
          onClick={
            handleContinueShopping
          }
        >
          {language === "Hindi"
            ? "शॉपिंग जारी रखें"
            : "CONTINUE SHOPPING"}
        </Link>

        <Link to="/">
          {language === "Hindi"
            ? "होम पर वापस जाएं"
            : "BACK TO HOME"}
        </Link>

      </div>

    </main>
  );
}

export default OrderSuccess;