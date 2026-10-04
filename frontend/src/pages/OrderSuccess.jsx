import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function OrderSuccess() {
  const { language } = useLanguage();

  const order = JSON.parse(
    localStorage.getItem("lastOrder")
  );

  // =========================
  // ORDER ID
  // =========================

  const orderId =
    order?._id ||
    order?.orderId ||
    "—";

  // =========================
  // ORDER DATE
  // =========================

  const orderDate = order?.createdAt
    ? new Date(
        order.createdAt
      ).toLocaleDateString(
        language === "Hindi"
          ? "hi-IN"
          : "en-IN"
      )
    : order?.date || "—";

  // =========================
  // TOTAL
  // =========================

  const total =
    Number(
      order?.finalTotal ??
        order?.totalAmount ??
        order?.total ??
        0
    ) || 0;

  // =========================
  // ITEMS
  // =========================

  const items =
    order?.items || [];

  const itemCount = items.reduce(
    (sum, item) =>
      sum +
      Number(item.quantity || 0),
    0
  );

  // =========================
  // STATUS
  // =========================

  const status =
    order?.status ||
    "confirmed";

  // =========================
  // CUSTOMER
  // =========================

  const customerName =
    order?.shippingAddress
      ?.fullName ||
    order?.customer?.name ||
    "";

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
          ? "हम आपको आपकी डिलीवरी के बारे में अपडेट देते रहेंगे।"
          : "We'll keep you updated about your delivery."}
      </p>

      {/* =========================
          ORDER DETAILS
      ========================= */}

      {order && (
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
              {String(status).replace(
                /_/g,
                " "
              )}
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
              ₹{total}
            </strong>
          </div>

        </div>
      )}

      {/* =========================
          ORDER ITEMS
      ========================= */}

      {order &&
        items.length > 0 && (
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
                const product =
                  item.product ||
                  item;

                const name =
                  product?.name ||
                  item?.name ||
                  "Product";

                const image =
                  product?.image ||
                  product?.imageUrl ||
                  item?.image ||
                  "";

                const price =
                  Number(
                    item?.price ??
                      product?.price ??
                      0
                  ) || 0;

                const quantity =
                  Number(
                    item?.quantity ||
                      1
                  );

                return (
                  <div
                    key={
                      product?._id ||
                      product?.id ||
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

                    {image && (
                      <img
                        src={image}
                        alt={name}
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
                        {name}
                      </strong>

                      <span
                        style={{
                          color:
                            "#81776e",
                          fontSize:
                            "11px",
                        }}
                      >
                        {quantity} × ₹
                        {price}
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
                      {price *
                        quantity}
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

        <Link to="/track-order">
          {language === "Hindi"
            ? "ऑर्डर ट्रैक करें"
            : "TRACK ORDER"}
        </Link>

        <Link to="/products">
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