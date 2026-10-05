import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function AdminDashboard() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] =
    useState("overview");

  const userRole =
    localStorage.getItem("userRole");

  const userName =
    localStorage.getItem("userName") ||
    "Admin";

  // =========================
  // PROTECT ADMIN PAGE
  // =========================

  if (userRole !== "admin") {
    return (
      <main className="admin-access-denied">
        <div className="admin-denied-card">

          <div className="admin-denied-icon">
            🔒
          </div>

          <p className="section-label">
            SHOPSPHERE
          </p>

          <h1>
            {language === "Hindi"
              ? "एक्सेस उपलब्ध नहीं है"
              : "Access Restricted"}
          </h1>

          <p>
            {language === "Hindi"
              ? "यह पेज केवल एडमिन के लिए उपलब्ध है।"
              : "This dashboard is available only for administrators."}
          </p>

          <Link
            to="/"
            className="admin-back-btn"
          >
            {language === "Hindi"
              ? "होम पर जाएं →"
              : "BACK TO HOME →"}
          </Link>

        </div>
      </main>
    );
  }

  // =========================
  // LOCAL DATA
  // =========================

  const orders = useMemo(() => {
    return (
      JSON.parse(
        localStorage.getItem("orders")
      ) || []
    );
  }, []);

  const wishlist = useMemo(() => {
    return (
      JSON.parse(
        localStorage.getItem("wishlist")
      ) || []
    );
  }, []);

  const cart = useMemo(() => {
    return (
      JSON.parse(
        localStorage.getItem("cart")
      ) || []
    );
  }, []);

  // =========================
  // BASIC FRONTEND STATS
  // =========================

  const totalOrders =
    orders.length;

  const totalWishlistItems =
    wishlist.length;

  const totalCartItems =
    cart.reduce(
      (sum, item) =>
        sum +
        Number(item.quantity || 0),
      0
    );

  const totalRevenue =
    orders.reduce(
      (sum, order) =>
        sum +
        Number(
          order.totalAmount ||
          order.total ||
          0
        ),
      0
    );

  // =========================
  // NAVIGATION
  // =========================

  const goToStore = () => {
    navigate("/");
  };

  return (
    <main className="admin-dashboard">

      {/* =========================
          PAGE STYLES
      ========================= */}

      <style>{`

        .admin-dashboard {
          min-height: 100vh;
          background: #f6f1e9;
          padding: 38px 5% 80px;
          color: #211e1b;
        }

        .admin-shell {
          max-width: 1450px;
          margin: 0 auto;
        }

        /* =========================
           HEADER
        ========================= */

        .admin-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 35px;
        }

        .admin-header-left {
          flex: 1;
        }

        .admin-eyebrow {
          margin: 0 0 9px;
          color: #8a6245;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .admin-header h1 {
          margin: 0;
          font-family:
            "Playfair Display",
            serif;
          font-size: clamp(
            34px,
            5vw,
            58px
          );
          line-height: 1;
          font-weight: 600;
        }

        .admin-header-description {
          max-width: 600px;
          margin: 14px 0 0;
          color: #71675f;
          font-size: 13px;
          line-height: 1.7;
        }

        .admin-header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .admin-user-badge {
          padding: 12px 16px;
          border: 1px solid #ddcfbf;
          background: #fffdf9;
          font-size: 11px;
        }

        .admin-user-badge span {
          color: #8a6245;
          margin-right: 6px;
        }

        .admin-store-btn {
          border: none;
          padding: 12px 17px;
          background: #211e1b;
          color: #fffdf9;
          text-decoration: none;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          cursor: pointer;
        }

        .admin-store-btn:hover {
          background: #8a6245;
        }

        /* =========================
           NAVIGATION
        ========================= */

        .admin-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 3px;
          padding: 5px;
          margin-bottom: 32px;
          background: #e8ded0;
          width: fit-content;
        }

        .admin-tab {
          border: none;
          background: transparent;
          padding: 11px 18px;
          color: #776d64;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          cursor: pointer;
        }

        .admin-tab.active {
          background: #211e1b;
          color: #fffdf9;
        }

        /* =========================
           KPI CARDS
        ========================= */

        .admin-kpi-grid {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }

        .admin-kpi {
          padding: 22px;
          border: 1px solid #e2d6c7;
          background: #fffdf9;
        }

        .admin-kpi-label {
          margin: 0 0 14px;
          color: #8f8378;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1.5px;
        }

        .admin-kpi-value {
          margin: 0;
          color: #211e1b;
          font-family:
            "Playfair Display",
            serif;
          font-size: 32px;
          font-weight: 600;
        }

        .admin-kpi-note {
          margin-top: 7px;
          color: #988d82;
          font-size: 10px;
          line-height: 1.5;
        }

        /* =========================
           MAIN GRID
        ========================= */

        .admin-main-grid {
          display: grid;
          grid-template-columns:
            minmax(0, 1.7fr)
            minmax(280px, 0.8fr);
          gap: 18px;
        }

        .admin-panel {
          border: 1px solid #e2d6c7;
          background: #fffdf9;
        }

        .admin-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 20px 22px;
          border-bottom: 1px solid #e8ded0;
        }

        .admin-panel-header h2 {
          margin: 0;
          font-family:
            "Playfair Display",
            serif;
          font-size: 22px;
          font-weight: 600;
        }

        .admin-panel-header span {
          color: #9b8f84;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        /* =========================
           ORDER TABLE
        ========================= */

        .admin-table-wrap {
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          min-width: 600px;
          border-collapse: collapse;
        }

        .admin-table th {
          padding: 13px 20px;
          text-align: left;
          color: #95897e;
          background: #faf7f2;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .admin-table td {
          padding: 16px 20px;
          border-top: 1px solid #eee7de;
          color: #4e4741;
          font-size: 11px;
        }

        .admin-order-id {
          color: #211e1b;
          font-weight: 700;
        }

        .admin-status {
          display: inline-block;
          padding: 6px 9px;
          border-radius: 20px;
          background: #eef2eb;
          color: #617458;
          font-size: 9px;
          font-weight: 700;
          text-transform: capitalize;
        }

        .admin-empty-row {
          padding: 35px 20px !important;
          text-align: center;
          color: #a0968b !important;
        }

        /* =========================
           QUICK ACTIONS
        ========================= */

        .admin-actions {
          display: grid;
          gap: 10px;
          padding: 20px;
        }

        .admin-action {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px;
          border: 1px solid #e3d8ca;
          background: #f9f5ef;
        }

        .admin-action-icon {
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e8ded0;
          font-size: 15px;
        }

        .admin-action-copy {
          flex: 1;
        }

        .admin-action-copy strong {
          display: block;
          color: #211e1b;
          font-size: 11px;
        }

        .admin-action-copy span {
          display: block;
          margin-top: 3px;
          color: #91867c;
          font-size: 9px;
        }

        /* =========================
           FULL PANELS
        ========================= */

        .admin-full-panel {
          margin-top: 18px;
        }

        .admin-placeholder-grid {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 15px;
          padding: 20px;
        }

        .admin-placeholder-card {
          min-height: 120px;
          padding: 18px;
          border: 1px solid #e5dacd;
          background: #faf7f2;
        }

        .admin-placeholder-card span {
          display: block;
          margin-bottom: 10px;
          color: #8d8176;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .admin-placeholder-card h3 {
          margin: 0;
          font-family:
            "Playfair Display",
            serif;
          font-size: 20px;
          font-weight: 600;
        }

        .admin-placeholder-card p {
          margin: 8px 0 0;
          color: #93887d;
          font-size: 10px;
          line-height: 1.5;
        }

        /* =========================
           ACCESS DENIED
        ========================= */

        .admin-access-denied {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
          background: #f6f1e9;
        }

        .admin-denied-card {
          max-width: 500px;
          padding: 45px;
          text-align: center;
          border: 1px solid #e2d6c7;
          background: #fffdf9;
        }

        .admin-denied-icon {
          margin-bottom: 15px;
          font-size: 34px;
        }

        .admin-denied-card h1 {
          margin: 10px 0;
          font-family:
            "Playfair Display",
            serif;
          font-size: 38px;
        }

        .admin-denied-card p {
          color: #786e65;
          font-size: 12px;
          line-height: 1.7;
        }

        .admin-back-btn {
          display: inline-block;
          margin-top: 18px;
          padding: 12px 18px;
          background: #211e1b;
          color: #fffdf9;
          text-decoration: none;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 1050px) {
          .admin-kpi-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .admin-main-grid {
            grid-template-columns: 1fr;
          }

          .admin-placeholder-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .admin-dashboard {
            padding: 25px 16px 60px;
          }

          .admin-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .admin-header-right {
            width: 100%;
            flex-wrap: wrap;
          }

          .admin-tabs {
            width: 100%;
            overflow-x: auto;
            flex-wrap: nowrap;
          }

          .admin-tab {
            white-space: nowrap;
          }

          .admin-kpi-grid {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }

          .admin-kpi {
            padding: 16px;
          }

          .admin-kpi-value {
            font-size: 26px;
          }

          .admin-panel-header {
            padding: 17px;
          }
        }

        @media (max-width: 450px) {
          .admin-kpi-grid {
            grid-template-columns: 1fr;
          }

          .admin-header h1 {
            font-size: 38px;
          }
        }

      `}</style>

      <div className="admin-shell">

        {/* =========================
            HEADER
        ========================= */}

        <header className="admin-header">

          <div className="admin-header-left">

            <p className="admin-eyebrow">
              SHOPSPHERE · ADMIN
            </p>

            <h1>
              {language === "Hindi"
                ? "डैशबोर्ड"
                : "Dashboard"}
            </h1>

            <p className="admin-header-description">
              {language === "Hindi"
                ? `स्वागत है, ${userName}। अपने स्टोर की गतिविधियों और ऑर्डर्स को यहां मैनेज करें।`
                : `Welcome, ${userName}. Manage your store activity, orders and customers from one place.`}
            </p>

          </div>

          <div className="admin-header-right">

            <div className="admin-user-badge">
              <span>ADMIN</span>
              {userName}
            </div>

            <button
              type="button"
              className="admin-store-btn"
              onClick={goToStore}
            >
              {language === "Hindi"
                ? "स्टोर देखें"
                : "VIEW STORE"}
            </button>

          </div>

        </header>

        {/* =========================
            TABS
        ========================= */}

        <nav className="admin-tabs">

          <button
            type="button"
            className={`admin-tab ${
              activeTab === "overview"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab("overview")
            }
          >
            {language === "Hindi"
              ? "ओवरव्यू"
              : "OVERVIEW"}
          </button>

          <button
            type="button"
            className={`admin-tab ${
              activeTab === "orders"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab("orders")
            }
          >
            {language === "Hindi"
              ? "ऑर्डर्स"
              : "ORDERS"}
          </button>

          <button
            type="button"
            className={`admin-tab ${
              activeTab === "products"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab("products")
            }
          >
            {language === "Hindi"
              ? "प्रोडक्ट्स"
              : "PRODUCTS"}
          </button>

          <button
            type="button"
            className={`admin-tab ${
              activeTab === "users"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab("users")
            }
          >
            {language === "Hindi"
              ? "यूज़र्स"
              : "USERS"}
          </button>

        </nav>

        {/* =========================
            KPI CARDS
        ========================= */}

        <section className="admin-kpi-grid">

          <div className="admin-kpi">
            <p className="admin-kpi-label">
              TOTAL ORDERS
            </p>

            <p className="admin-kpi-value">
              {totalOrders}
            </p>

            <p className="admin-kpi-note">
              {language === "Hindi"
                ? "लोकल ऑर्डर रिकॉर्ड"
                : "Orders currently available in frontend records"}
            </p>
          </div>

          <div className="admin-kpi">
            <p className="admin-kpi-label">
              REVENUE
            </p>

            <p className="admin-kpi-value">
              ₹{totalRevenue}
            </p>

            <p className="admin-kpi-note">
              {language === "Hindi"
                ? "फ्रंटएंड रिकॉर्ड से"
                : "Calculated from available order records"}
            </p>
          </div>

          <div className="admin-kpi">
            <p className="admin-kpi-label">
              CART ITEMS
            </p>

            <p className="admin-kpi-value">
              {totalCartItems}
            </p>

            <p className="admin-kpi-note">
              {language === "Hindi"
                ? "वर्तमान कार्ट आइटम"
                : "Items currently in the cart"}
            </p>
          </div>

          <div className="admin-kpi">
            <p className="admin-kpi-label">
              WISHLIST
            </p>

            <p className="admin-kpi-value">
              {totalWishlistItems}
            </p>

            <p className="admin-kpi-note">
              {language === "Hindi"
                ? "सेव किए गए प्रोडक्ट्स"
                : "Saved products in wishlist"}
            </p>
          </div>

        </section>

        {/* =========================
            OVERVIEW
        ========================= */}

        {activeTab === "overview" && (
          <>
            <div className="admin-main-grid">

              {/* RECENT ORDERS */}

              <section className="admin-panel">

                <div className="admin-panel-header">

                  <h2>
                    {language === "Hindi"
                      ? "हाल के ऑर्डर्स"
                      : "Recent Orders"}
                  </h2>

                  <span>
                    {orders.length} RECORDS
                  </span>

                </div>

                <div className="admin-table-wrap">

                  <table className="admin-table">

                    <thead>
                      <tr>

                        <th>
                          {language === "Hindi"
                            ? "ऑर्डर"
                            : "ORDER"}
                        </th>

                        <th>
                          {language === "Hindi"
                            ? "ग्राहक"
                            : "CUSTOMER"}
                        </th>

                        <th>
                          {language === "Hindi"
                            ? "कुल"
                            : "TOTAL"}
                        </th>

                        <th>
                          {language === "Hindi"
                            ? "स्थिति"
                            : "STATUS"}
                        </th>

                      </tr>
                    </thead>

                    <tbody>

                      {orders.length === 0 ? (

                        <tr>
                          <td
                            colSpan="4"
                            className="admin-empty-row"
                          >
                            {language === "Hindi"
                              ? "अभी कोई ऑर्डर रिकॉर्ड उपलब्ध नहीं है।"
                              : "No order records are available yet."}
                          </td>
                        </tr>

                      ) : (

                        orders
                          .slice(0, 6)
                          .map(
                            (
                              order,
                              index
                            ) => (
                              <tr
                                key={
                                  order._id ||
                                  order.orderId ||
                                  index
                                }
                              >

                                <td className="admin-order-id">
                                  #
                                  {order._id ||
                                    order.orderId}
                                </td>

                                <td>
                                  {order.shippingAddress
                                    ?.fullName ||
                                    order.customer
                                      ?.name ||
                                    "Customer"}
                                </td>

                                <td>
                                  ₹
                                  {Number(
                                    order.totalAmount ||
                                      order.total ||
                                      0
                                  )}
                                </td>

                                <td>

                                  <span className="admin-status">
                                    {String(
                                      order.status ||
                                        "confirmed"
                                    ).replace(
                                      /_/g,
                                      " "
                                    )}
                                  </span>

                                </td>

                              </tr>
                            )
                          )

                      )}

                    </tbody>

                  </table>

                </div>

              </section>

              {/* QUICK ACTIONS */}

              <section className="admin-panel">

                <div className="admin-panel-header">

                  <h2>
                    {language === "Hindi"
                      ? "क्विक एक्शन्स"
                      : "Quick Actions"}
                  </h2>

                </div>

                <div className="admin-actions">

                  <div className="admin-action">
                    <div className="admin-action-icon">
                      📦
                    </div>

                    <div className="admin-action-copy">
                      <strong>
                        {language === "Hindi"
                          ? "ऑर्डर मैनेज करें"
                          : "Manage Orders"}
                      </strong>

                      <span>
                        {language === "Hindi"
                          ? "स्टेटस और ऑर्डर देखें"
                          : "View and update order status"}
                      </span>
                    </div>
                  </div>

                  <div className="admin-action">
                    <div className="admin-action-icon">
                      🛍️
                    </div>

                    <div className="admin-action-copy">
                      <strong>
                        {language === "Hindi"
                          ? "प्रोडक्ट्स मैनेज करें"
                          : "Manage Products"}
                      </strong>

                      <span>
                        {language === "Hindi"
                          ? "कैटलॉग और स्टॉक"
                          : "Catalog and inventory management"}
                      </span>
                    </div>
                  </div>

                  <div className="admin-action">
                    <div className="admin-action-icon">
                      👥
                    </div>

                    <div className="admin-action-copy">
                      <strong>
                        {language === "Hindi"
                          ? "यूज़र्स देखें"
                          : "Manage Users"}
                      </strong>

                      <span>
                        {language === "Hindi"
                          ? "कस्टमर अकाउंट्स"
                          : "Customer account management"}
                      </span>
                    </div>
                  </div>

                </div>

              </section>

            </div>

            {/* STORE SNAPSHOT */}

            <section className="admin-panel admin-full-panel">

              <div className="admin-panel-header">

                <h2>
                  {language === "Hindi"
                    ? "स्टोर स्नैपशॉट"
                    : "Store Snapshot"}
                </h2>

                <span>
                  FRONTEND PREVIEW
                </span>

              </div>

              <div className="admin-placeholder-grid">

                <div className="admin-placeholder-card">

                  <span>
                    PRODUCTS
                  </span>

                  <h3>
                    API CONNECTED SOON
                  </h3>

                  <p>
                    {language === "Hindi"
                      ? "प्रोडक्ट मैनेजमेंट को backend admin API से जोड़ा जाएगा।"
                      : "Product management will connect to the backend admin API."}
                  </p>

                </div>

                <div className="admin-placeholder-card">

                  <span>
                    USERS
                  </span>

                  <h3>
                    API CONNECTED SOON
                  </h3>

                  <p>
                    {language === "Hindi"
                      ? "यूज़र मैनेजमेंट backend admin endpoint मिलने के बाद जोड़ा जाएगा।"
                      : "User management will connect after the exact admin endpoint is wired."}
                  </p>

                </div>

                <div className="admin-placeholder-card">

                  <span>
                    ANALYTICS
                  </span>

                  <h3>
                    READY
                  </h3>

                  <p>
                    {language === "Hindi"
                      ? "डैशबोर्ड का विजुअल analytics structure तैयार है।"
                      : "The visual analytics structure is ready for real data."}
                  </p>

                </div>

              </div>

            </section>
          </>
        )}

        {/* =========================
            ORDERS TAB
        ========================= */}

        {activeTab === "orders" && (
          <section className="admin-panel">

            <div className="admin-panel-header">

              <h2>
                {language === "Hindi"
                  ? "ऑर्डर मैनेजमेंट"
                  : "Order Management"}
              </h2>

              <span>
                BACKEND INTEGRATION PENDING
              </span>

            </div>

            <div className="admin-placeholder-grid">

              <div className="admin-placeholder-card">
                <span>
                  VIEW ORDERS
                </span>

                <h3>
                  READY
                </h3>

                <p>
                  {language === "Hindi"
                    ? "रीयल ऑर्डर्स API से कनेक्ट किया जाएगा।"
                    : "Ready to connect with the admin orders API."}
                </p>
              </div>

              <div className="admin-placeholder-card">
                <span>
                  UPDATE STATUS
                </span>

                <h3>
                  READY
                </h3>

                <p>
                  {language === "Hindi"
                    ? "Confirmed से Delivered तक status controls जोड़े जाएंगे।"
                    : "Status controls will be connected to the backend."}
                </p>
              </div>

              <div className="admin-placeholder-card">
                <span>
                  CANCEL / ACTIONS
                </span>

                <h3>
                  READY
                </h3>

                <p>
                  {language === "Hindi"
                    ? "Admin actions के लिए frontend structure तैयार है।"
                    : "Frontend structure is ready for admin actions."}
                </p>
              </div>

            </div>

          </section>
        )}

        {/* =========================
            PRODUCTS TAB
        ========================= */}

        {activeTab === "products" && (
          <section className="admin-panel">

            <div className="admin-panel-header">

              <h2>
                {language === "Hindi"
                  ? "प्रोडक्ट मैनेजमेंट"
                  : "Product Management"}
              </h2>

              <span>
                PRODUCT API
              </span>

            </div>

            <div className="admin-placeholder-grid">

              <div className="admin-placeholder-card">
                <span>
                  CATALOG
                </span>

                <h3>
                  PRODUCTS
                </h3>

                <p>
                  {language === "Hindi"
                    ? "प्रोडक्ट लिस्ट को admin controls के साथ जोड़ा जा सकता है।"
                    : "Product listing can be connected with admin controls."}
                </p>
              </div>

              <div className="admin-placeholder-card">
                <span>
                  INVENTORY
                </span>

                <h3>
                  STOCK
                </h3>

                <p>
                  {language === "Hindi"
                    ? "स्टॉक management के लिए backend support जोड़ा जाएगा।"
                    : "Inventory controls can be connected to backend support."}
                </p>
              </div>

              <div className="admin-placeholder-card">
                <span>
                  FILTERS
                </span>

                <h3>
                  SEARCH + SORT
                </h3>

                <p>
                  {language === "Hindi"
                    ? "Admin product table में search और sorting जोड़ी जा सकती है।"
                    : "Search and sorting can be added to the admin product table."}
                </p>
              </div>

            </div>

          </section>
        )}

        {/* =========================
            USERS TAB
        ========================= */}

        {activeTab === "users" && (
          <section className="admin-panel">

            <div className="admin-panel-header">

              <h2>
                {language === "Hindi"
                  ? "यूज़र मैनेजमेंट"
                  : "User Management"}
              </h2>

              <span>
                ADMIN API
              </span>

            </div>

            <div className="admin-placeholder-grid">

              <div className="admin-placeholder-card">
                <span>
                  CUSTOMERS
                </span>

                <h3>
                  USER LIST
                </h3>

                <p>
                  {language === "Hindi"
                    ? "Backend के admin user endpoint से customer list लाएंगे।"
                    : "Customer list will be loaded from the admin user endpoint."}
                </p>
              </div>

              <div className="admin-placeholder-card">
                <span>
                  ROLES
                </span>

                <h3>
                  USER / ADMIN
                </h3>

                <p>
                  {language === "Hindi"
                    ? "Role-based access frontend में पहले से मौजूद है।"
                    : "Role-based access is already supported in the frontend."}
                </p>
              </div>

              <div className="admin-placeholder-card">
                <span>
                  ACCOUNT ACTIONS
                </span>

                <h3>
                  READY
                </h3>

                <p>
                  {language === "Hindi"
                    ? "Exact backend actions मिलने पर buttons connect होंगे।"
                    : "Action buttons will be connected after exact backend routes are confirmed."}
                </p>
              </div>

            </div>

          </section>
        )}

      </div>

    </main>
  );
}

export default AdminDashboard;