import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import API_URL from "../api";

function AdminDashboard() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");

  const userRole = localStorage.getItem("userRole");
  const userName = localStorage.getItem("userName") || "Admin";

  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [actionSuccess, setActionSuccess] = useState("");

  const token = localStorage.getItem("authToken");

  // =========================
  // PROTECT ADMIN PAGE
  // =========================
  if (userRole !== "admin") {
    return (
      <main className="admin-access-denied">
        <div className="admin-denied-card">
          <div className="admin-denied-icon">🔒</div>

          <p className="section-label">SHOPSPHERE</p>

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

          <Link to="/" className="admin-back-btn">
            {language === "Hindi" ? "होम पर जाएं →" : "BACK TO HOME →"}
          </Link>
        </div>
      </main>
    );
  }

  // =========================
  // FETCH ADMIN DATA
  // =========================
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setError("");

        // 1. Fetch Orders
        let ordersData = [];
        try {
          let ordersRes = await fetch(`${API_URL}/api/orders/admin/all`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!ordersRes.ok) {
            ordersRes = await fetch(`${API_URL}/api/orders/all`, {
              headers: { Authorization: `Bearer ${token}` },
            });
          }

          if (ordersRes.ok) {
            const data = await ordersRes.json();
            ordersData = data.orders || [];
          } else {
            ordersData =
              JSON.parse(localStorage.getItem("orders")) || [];
          }
        } catch (err) {
          console.error("Admin orders fetch error:", err);
          ordersData =
            JSON.parse(localStorage.getItem("orders")) || [];
        }
        setOrders(ordersData);

        // Pre-fill selected statuses
        const statusMap = {};
        ordersData.forEach((order) => {
          statusMap[order._id || order.orderId] = order.status || "confirmed";
        });
        setSelectedStatuses(statusMap);

        // 2. Fetch Users
        try {
          const usersRes = await fetch(`${API_URL}/api/users`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (usersRes.ok) {
            const data = await usersRes.json();
            setUsers(data.users || []);
          }
        } catch (err) {
          console.error("Admin users fetch error:", err);
        }

        // 3. Fetch Products
        try {
          const productsRes = await fetch(`${API_URL}/api/products?limit=0`);
          if (productsRes.ok) {
            const data = await productsRes.json();
            setProducts(data.products || (Array.isArray(data) ? data : []));
          }
        } catch (err) {
          console.error("Admin products fetch error:", err);
        }
      } catch (err) {
        console.error("Admin data loading error:", err);
        setError(
          language === "Hindi"
            ? "डेटा लोड करने में समस्या आई।"
            : "Error loading admin data."
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAdminData();
    }
  }, [token, language]);

  // =========================
  // UPDATE ORDER STATUS
  // =========================
  const handleUpdateStatus = async (orderId) => {
    const newStatus = selectedStatuses[orderId];
    if (!newStatus) return;

    try {
      setStatusUpdatingId(orderId);
      setActionSuccess("");
      setError("");

      let res = await fetch(`${API_URL}/api/orders/admin/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update order status");
      }

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: newStatus } : o
        )
      );

      setActionSuccess(
        language === "Hindi"
          ? `ऑर्डर #${orderId.slice(-6)} का स्टेटस ${newStatus} में अपडेट हो गया!`
          : `Order #${orderId.slice(-6)} status updated to ${newStatus}!`
      );

      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err) {
      console.error("Status update error:", err);
      setError(err.message || "Failed to update status");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================
  const handleDeleteProduct = async (productId, productName) => {
    const confirmDelete = window.confirm(
      language === "Hindi"
        ? `क्या आप "${productName}" को हटाना चाहते हैं?`
        : `Are you sure you want to delete "${productName}"?`
    );

    if (!confirmDelete) return;

    try {
      setActionSuccess("");
      setError("");

      const res = await fetch(`${API_URL}/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete product");
      }

      setProducts((prev) => prev.filter((p) => p._id !== productId));

      setActionSuccess(
        language === "Hindi"
          ? "प्रोडक्ट सफलतापूर्वक हटा दिया गया!"
          : "Product deleted successfully!"
      );
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err) {
      console.error("Delete product error:", err);
      setError(err.message || "Failed to delete product");
    }
  };

  // =========================
  // STATS
  // =========================
  const totalOrders = orders.length;
  const totalUsers = users.length;
  const totalProducts = products.length;

  const totalRevenue = orders.reduce(
    (sum, order) =>
      sum +
      Number(
        order.totalAmount ||
          order.total ||
          0
      ),
    0
  );

  const goToStore = () => {
    navigate("/");
  };

  return (
    <main className="admin-dashboard">
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
          font-family: "Playfair Display", serif;
          font-size: clamp(34px, 5vw, 58px);
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
          font-weight: 700;
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

        .admin-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
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
          font-family: "Playfair Display", serif;
          font-size: 32px;
          font-weight: 600;
        }

        .admin-kpi-note {
          margin-top: 7px;
          color: #988d82;
          font-size: 10px;
          line-height: 1.5;
        }

        .admin-main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.7fr) minmax(280px, 0.8fr);
          gap: 18px;
        }

        .admin-panel {
          border: 1px solid #e2d6c7;
          background: #fffdf9;
          margin-bottom: 20px;
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
          font-family: "Playfair Display", serif;
          font-size: 22px;
          font-weight: 600;
        }

        .admin-panel-header span {
          color: #9b8f84;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .admin-table-wrap {
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          min-width: 650px;
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
          vertical-align: middle;
        }

        .admin-order-id {
          color: #211e1b;
          font-weight: 700;
        }

        .admin-status {
          display: inline-block;
          padding: 5px 9px;
          border-radius: 20px;
          background: #eef2eb;
          color: #617458;
          font-size: 9px;
          font-weight: 700;
          text-transform: capitalize;
        }

        .admin-status.pending { background: #fff5e6; color: #a16207; }
        .admin-status.confirmed { background: #eef2eb; color: #617458; }
        .admin-status.shipped { background: #eff6ff; color: #1d4ed8; }
        .admin-status.delivered { background: #ecfdf5; color: #047857; }
        .admin-status.cancelled { background: #fef2f2; color: #b91c1c; }

        .admin-empty-row {
          padding: 35px 20px !important;
          text-align: center;
          color: #a0968b !important;
        }

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
          cursor: pointer;
        }

        .admin-action:hover {
          border-color: #8a6245;
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
          font-family: "Playfair Display", serif;
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

        @media (max-width: 1050px) {
          .admin-kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .admin-main-grid {
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
        }
      `}</style>

      <div className="admin-shell">
        {/* =========================
            HEADER
        ========================= */}
        <header className="admin-header">
          <div className="admin-header-left">
            <p className="admin-eyebrow">SHOPSPHERE · ADMIN</p>
            <h1>{language === "Hindi" ? "डैशबोर्ड" : "Dashboard"}</h1>
            <p className="admin-header-description">
              {language === "Hindi"
                ? `स्वागत है, ${userName}। अपने स्टोर की गतिविधियों, ऑर्डर्स, प्रोडक्ट्स और कस्टमर्स को यहां मैनेज करें।`
                : `Welcome, ${userName}. Manage your store activity, orders, products, and customers from one place.`}
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
              {language === "Hindi" ? "स्टोर देखें" : "VIEW STORE"}
            </button>
          </div>
        </header>

        {/* NOTIFICATIONS */}
        {actionSuccess && (
          <div
            style={{
              padding: "12px 18px",
              background: "#edf4ea",
              color: "#3f6834",
              border: "1px solid #c9e0c1",
              fontSize: "12px",
              fontWeight: 600,
              marginBottom: "20px",
            }}
          >
            ✓ {actionSuccess}
          </div>
        )}

        {error && (
          <div
            style={{
              padding: "12px 18px",
              background: "#fcedeb",
              color: "#a64b3c",
              border: "1px solid #f4c7c3",
              fontSize: "12px",
              fontWeight: 600,
              marginBottom: "20px",
            }}
          >
            ! {error}
          </div>
        )}

        {/* =========================
            TABS
        ========================= */}
        <nav className="admin-tabs">
          <button
            type="button"
            className={`admin-tab ${
              activeTab === "overview" ? "active" : ""
            }`}
            onClick={() => setActiveTab("overview")}
          >
            {language === "Hindi" ? "ओवरव्यू" : "OVERVIEW"}
          </button>

          <button
            type="button"
            className={`admin-tab ${
              activeTab === "orders" ? "active" : ""
            }`}
            onClick={() => setActiveTab("orders")}
          >
            {language === "Hindi" ? "ऑर्डर्स" : "ORDERS"} ({orders.length})
          </button>

          <button
            type="button"
            className={`admin-tab ${
              activeTab === "products" ? "active" : ""
            }`}
            onClick={() => setActiveTab("products")}
          >
            {language === "Hindi" ? "प्रोडक्ट्स" : "PRODUCTS"} (
            {products.length})
          </button>

          <button
            type="button"
            className={`admin-tab ${
              activeTab === "users" ? "active" : ""
            }`}
            onClick={() => setActiveTab("users")}
          >
            {language === "Hindi" ? "यूज़र्स" : "USERS"} ({users.length})
          </button>
        </nav>

        {/* =========================
            KPI CARDS
        ========================= */}
        <section className="admin-kpi-grid">
          <div className="admin-kpi">
            <p className="admin-kpi-label">TOTAL ORDERS</p>
            <p className="admin-kpi-value">{totalOrders}</p>
            <p className="admin-kpi-note">
              {language === "Hindi"
                ? "कुल डेटाबेस ऑर्डर्स"
                : "Total orders in database"}
            </p>
          </div>

          <div className="admin-kpi">
            <p className="admin-kpi-label">TOTAL REVENUE</p>
            <p className="admin-kpi-value">₹{totalRevenue}</p>
            <p className="admin-kpi-note">
              {language === "Hindi"
                ? "ऑर्डर अमाउंट से परिकलित"
                : "Calculated from database orders"}
            </p>
          </div>

          <div className="admin-kpi">
            <p className="admin-kpi-label">PRODUCTS IN STORE</p>
            <p className="admin-kpi-value">{totalProducts}</p>
            <p className="admin-kpi-note">
              {language === "Hindi"
                ? "लाइव कैटलॉग प्रोडक्ट्स"
                : "Active catalog items"}
            </p>
          </div>

          <div className="admin-kpi">
            <p className="admin-kpi-label">REGISTERED USERS</p>
            <p className="admin-kpi-value">{totalUsers}</p>
            <p className="admin-kpi-note">
              {language === "Hindi"
                ? "पंजीकृत ग्राहक और एडमिन"
                : "Registered users & admins"}
            </p>
          </div>
        </section>

        {/* =========================
            TAB 1: OVERVIEW
        ========================= */}
        {activeTab === "overview" && (
          <div className="admin-main-grid">
            {/* RECENT ORDERS */}
            <section className="admin-panel">
              <div className="admin-panel-header">
                <h2>
                  {language === "Hindi"
                    ? "हाल के ऑर्डर्स"
                    : "Recent Orders"}
                </h2>
                <span>{orders.length} RECORDS</span>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{language === "Hindi" ? "ऑर्डर" : "ORDER"}</th>
                      <th>{language === "Hindi" ? "ग्राहक" : "CUSTOMER"}</th>
                      <th>{language === "Hindi" ? "कुल" : "TOTAL"}</th>
                      <th>{language === "Hindi" ? "स्थिति" : "STATUS"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="admin-empty-row">
                          {language === "Hindi"
                            ? "अभी कोई ऑर्डर रिकॉर्ड उपलब्ध नहीं है।"
                            : "No order records are available yet."}
                        </td>
                      </tr>
                    ) : (
                      orders.slice(0, 5).map((order) => {
                        const orderId = order._id || order.orderId;
                        const customerName =
                          order.user?.username ||
                          order.shippingAddress?.fullName ||
                          "Customer";
                        const amount =
                          order.totalAmount ?? order.total ?? 0;
                        const status = order.status || "confirmed";

                        return (
                          <tr key={orderId}>
                            <td className="admin-order-id">
                              #{orderId ? String(orderId).slice(-8) : "—"}
                            </td>
                            <td>{customerName}</td>
                            <td>₹{amount}</td>
                            <td>
                              <span
                                className={`admin-status ${status.toLowerCase()}`}
                              >
                                {status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
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
                <div
                  className="admin-action"
                  onClick={() => setActiveTab("orders")}
                >
                  <div className="admin-action-icon">📦</div>
                  <div className="admin-action-copy">
                    <strong>
                      {language === "Hindi"
                        ? "ऑर्डर मैनेज करें"
                        : "Manage Orders"}
                    </strong>
                    <span>
                      {language === "Hindi"
                        ? `${orders.length} ऑर्डर्स देखें और स्टेटस बदलें`
                        : `View all ${orders.length} orders & update status`}
                    </span>
                  </div>
                </div>

                <div
                  className="admin-action"
                  onClick={() => setActiveTab("products")}
                >
                  <div className="admin-action-icon">🛍️</div>
                  <div className="admin-action-copy">
                    <strong>
                      {language === "Hindi"
                        ? "प्रोडक्ट्स देखें"
                        : "Manage Products"}
                    </strong>
                    <span>
                      {language === "Hindi"
                        ? `${products.length} प्रोडक्ट्स और स्टॉक कैटलॉग`
                        : `Browse catalog of ${products.length} products`}
                    </span>
                  </div>
                </div>

                <div
                  className="admin-action"
                  onClick={() => setActiveTab("users")}
                >
                  <div className="admin-action-icon">👥</div>
                  <div className="admin-action-copy">
                    <strong>
                      {language === "Hindi"
                        ? "यूज़र्स देखें"
                        : "Manage Users"}
                    </strong>
                    <span>
                      {language === "Hindi"
                        ? `${users.length} रजिस्टर्ड अकाउंट्स`
                        : `View ${users.length} registered accounts`}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* =========================
            TAB 2: ORDERS MANAGEMENT
        ========================= */}
        {activeTab === "orders" && (
          <section className="admin-panel">
            <div className="admin-panel-header">
              <h2>
                {language === "Hindi"
                  ? "ऑर्डर मैनेजमेंट"
                  : "Order Management"}
              </h2>
              <span>{orders.length} TOTAL ORDERS</span>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ORDER ID</th>
                    <th>CUSTOMER</th>
                    <th>SHIPPING ADDRESS</th>
                    <th>ITEMS</th>
                    <th>TOTAL</th>
                    <th>CURRENT STATUS</th>
                    <th>UPDATE STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="admin-empty-row">
                        {loading
                          ? "Loading orders..."
                          : "No orders found."}
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => {
                      const orderId = order._id || order.orderId;
                      const customerName =
                        order.user?.username ||
                        order.shippingAddress?.fullName ||
                        "Customer";
                      const customerEmail =
                        order.user?.email || "";
                      const addressStr = order.shippingAddress
                        ? `${order.shippingAddress.address}, ${order.shippingAddress.city}`
                        : "—";
                      const currentStatus =
                        order.status || "confirmed";
                      const currentSelectValue =
                        selectedStatuses[orderId] || currentStatus;
                      const isUpdating =
                        statusUpdatingId === orderId;

                      return (
                        <tr key={orderId}>
                          <td className="admin-order-id">
                            #{orderId ? String(orderId).slice(-8) : "—"}
                          </td>
                          <td>
                            <strong>{customerName}</strong>
                            {customerEmail && (
                              <span
                                style={{
                                  display: "block",
                                  color: "#8a7f74",
                                  fontSize: "10px",
                                }}
                              >
                                {customerEmail}
                              </span>
                            )}
                          </td>
                          <td style={{ maxWidth: "200px" }}>
                            {addressStr}
                          </td>
                          <td>{(order.items || []).length} items</td>
                          <td>
                            <strong>
                              ₹{order.totalAmount ?? order.total ?? 0}
                            </strong>
                          </td>
                          <td>
                            <span
                              className={`admin-status ${currentStatus.toLowerCase()}`}
                            >
                              {currentStatus}
                            </span>
                          </td>
                          <td>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <select
                                value={currentSelectValue}
                                onChange={(e) =>
                                  setSelectedStatuses({
                                    ...selectedStatuses,
                                    [orderId]: e.target.value,
                                  })
                                }
                                disabled={
                                  isUpdating ||
                                  currentStatus === "cancelled"
                                }
                                style={{
                                  padding: "6px 8px",
                                  border: "1px solid #d8cbbb",
                                  background: "#fff",
                                  fontSize: "11px",
                                  color: "#211e1b",
                                }}
                              >
                                <option value="pending">pending</option>
                                <option value="confirmed">confirmed</option>
                                <option value="shipped">shipped</option>
                                <option value="delivered">delivered</option>
                                <option value="cancelled">cancelled</option>
                              </select>

                              <button
                                type="button"
                                disabled={
                                  isUpdating ||
                                  currentSelectValue === currentStatus ||
                                  currentStatus === "cancelled"
                                }
                                onClick={() => handleUpdateStatus(orderId)}
                                style={{
                                  border: "none",
                                  background:
                                    currentSelectValue === currentStatus
                                      ? "#d8cbbb"
                                      : "#211e1b",
                                  color: "#fff",
                                  padding: "6px 10px",
                                  fontSize: "10px",
                                  fontWeight: 700,
                                  cursor:
                                    currentSelectValue === currentStatus
                                      ? "default"
                                      : "pointer",
                                }}
                              >
                                {isUpdating ? "..." : "SAVE"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* =========================
            TAB 3: PRODUCTS CATALOG
        ========================= */}
        {activeTab === "products" && (
          <section className="admin-panel">
            <div className="admin-panel-header">
              <h2>
                {language === "Hindi"
                  ? "प्रोडक्ट मैनेजमेंट"
                  : "Product Management"}
              </h2>
              <span>{products.length} PRODUCTS</span>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>IMAGE</th>
                    <th>PRODUCT NAME</th>
                    <th>CATEGORY</th>
                    <th>PRICE</th>
                    <th>STOCK</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="admin-empty-row">
                        {loading
                          ? "Loading products..."
                          : "No products in database."}
                      </td>
                    </tr>
                  ) : (
                    products.slice(0, 25).map((product) => (
                      <tr key={product._id || product.id}>
                        <td>
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "cover",
                                border: "1px solid #e8ded0",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                background: "#eee",
                              }}
                            />
                          )}
                        </td>
                        <td>
                          <strong>{product.name}</strong>
                        </td>
                        <td>
                          <span
                            style={{
                              textTransform: "capitalize",
                              color: "#8a6245",
                            }}
                          >
                            {product.category}
                          </span>
                        </td>
                        <td>₹{product.price}</td>
                        <td>
                          <span
                            style={{
                              color:
                                product.stock > 10 ? "#211e1b" : "#b91c1c",
                              fontWeight: product.stock <= 10 ? 700 : 400,
                            }}
                          >
                            {product.stock} left
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteProduct(
                                product._id,
                                product.name
                              )
                            }
                            style={{
                              border: "1px solid #e3a89e",
                              background: "#fff",
                              color: "#b91c1c",
                              padding: "5px 10px",
                              fontSize: "10px",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            DELETE
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {products.length > 25 && (
              <div
                style={{
                  padding: "12px 20px",
                  fontSize: "11px",
                  color: "#8a7f74",
                  textAlign: "center",
                  borderTop: "1px solid #eee7de",
                }}
              >
                Showing first 25 of {products.length} products.
              </div>
            )}
          </section>
        )}

        {/* =========================
            TAB 4: USERS MANAGEMENT
        ========================= */}
        {activeTab === "users" && (
          <section className="admin-panel">
            <div className="admin-panel-header">
              <h2>
                {language === "Hindi"
                  ? "यूज़र मैनेजमेंट"
                  : "User Management"}
              </h2>
              <span>{users.length} REGISTERED USERS</span>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>USER ID</th>
                    <th>USERNAME</th>
                    <th>EMAIL</th>
                    <th>ROLE</th>
                    <th>REGISTERED DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="admin-empty-row">
                        {loading ? "Loading users..." : "No users found."}
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u._id}>
                        <td className="admin-order-id">
                          #{String(u._id).slice(-8)}
                        </td>
                        <td>
                          <strong>{u.username}</strong>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "4px 8px",
                              fontSize: "9px",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              background:
                                u.role === "admin" ? "#211e1b" : "#e8ded0",
                              color:
                                u.role === "admin" ? "#fffdf9" : "#4e4741",
                            }}
                          >
                            {u.role || "user"}
                          </span>
                        </td>
                        <td>
                          {u.createdAt
                            ? new Date(u.createdAt).toLocaleDateString()
                            : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default AdminDashboard;