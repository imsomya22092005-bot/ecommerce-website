import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useLanguage } from "../LanguageContext";
import API_URL from "../api";

function AdminDashboard() {
  const { language } =
    useLanguage();

  const navigate =
    useNavigate();

  const token =
    localStorage.getItem(
      "authToken"
    );

  const userRole =
    localStorage.getItem(
      "userRole"
    );

  const userName =
    localStorage.getItem(
      "userName"
    ) || "Admin";

  // =========================
  // TAB
  // =========================

  const [activeTab, setActiveTab] =
    useState("overview");

  // =========================
  // DATA
  // =========================

  const [products, setProducts] =
    useState([]);

  const [orders, setOrders] =
    useState([]);

  const [users, setUsers] =
    useState([]);

  // =========================
  // LOADING
  // =========================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  // =========================
  // ERROR / SUCCESS
  // =========================

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // =========================
  // PRODUCT FORM
  // =========================

  const emptyProduct = {
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
  };

  const [productForm, setProductForm] =
    useState(emptyProduct);

  const [editingProductId, setEditingProductId] =
    useState(null);

  // =========================
  // STATUS
  // =========================

  const orderStatuses = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];

  // =========================
  // ADMIN ACCESS
  // =========================

  if (
    !token ||
    userRole !== "admin"
  ) {
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
              ? "यह dashboard केवल admin के लिए उपलब्ध है।"
              : "This dashboard is available only for administrators."}
          </p>

          {!token ? (
            <Link
              to="/login"
              className="admin-back-btn"
            >
              {language === "Hindi"
                ? "लॉगिन करें →"
                : "LOGIN →"}
            </Link>
          ) : (
            <Link
              to="/"
              className="admin-back-btn"
            >
              {language === "Hindi"
                ? "होम पर जाएं →"
                : "BACK TO HOME →"}
            </Link>
          )}

        </div>

      </main>
    );
  }

  // =========================
  // API HELPER
  // =========================

  const apiRequest = async (
    endpoint,
    options = {}
  ) => {
    const response =
      await fetch(
        `${API_URL}${endpoint}`,
        {
          ...options,
          headers: {
            ...(options.body
              ? {
                  "Content-Type":
                    "application/json",
                }
              : {}),
            Authorization:
              `Bearer ${token}`,
            ...(options.headers || {}),
          },
        }
      );

    const data =
      await response
        .json()
        .catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message ||
          (language === "Hindi"
            ? "Request पूरा नहीं हो पाया।"
            : "Request failed.")
      );
    }

    return data;
  };

  // =========================
  // LOAD PRODUCTS
  // =========================

  const loadProducts =
    async () => {
      const data =
        await apiRequest(
          "/api/products?limit=1000"
        );

      const list =
        Array.isArray(data)
          ? data
          : data.products || [];

      setProducts(list);
    };

  // =========================
  // LOAD ORDERS
  // =========================

  const loadOrders =
    async () => {
      const data =
        await apiRequest(
          "/api/orders/all"
        );

      setOrders(
        Array.isArray(
          data.orders
        )
          ? data.orders
          : []
      );
    };

  // =========================
  // LOAD USERS
  // =========================

  const loadUsers =
    async () => {
      const data =
        await apiRequest(
          "/api/users/"
        );

      setUsers(
        Array.isArray(
          data.users
        )
          ? data.users
          : []
      );
    };

  // =========================
  // LOAD DASHBOARD
  // =========================

  useEffect(() => {
    const loadDashboard =
      async () => {
        try {
          setLoading(true);
          setError("");

          await Promise.all([
            loadProducts(),
            loadOrders(),
            loadUsers(),
          ]);
        } catch (err) {
          console.error(
            "Admin dashboard error:",
            err
          );

          setError(
            err.message ||
              (language === "Hindi"
                ? "Dashboard data लोड नहीं हो पाया।"
                : "Could not load dashboard data.")
          );
        } finally {
          setLoading(false);
        }
      };

    loadDashboard();
  }, []);

  // =========================
  // PRODUCT FORM CHANGE
  // =========================

  const handleProductChange = (
    e
  ) => {
    const {
      name,
      value,
    } = e.target;

    setProductForm(
      (current) => ({
        ...current,
        [name]: value,
      })
    );

    setError("");
    setSuccess("");
  };

  // =========================
  // RESET PRODUCT FORM
  // =========================

  const resetProductForm = () => {
    setProductForm(
      emptyProduct
    );

    setEditingProductId(null);
  };

  // =========================
  // EDIT PRODUCT
  // =========================

  const handleEditProduct = (
    product
  ) => {
    setEditingProductId(
      product._id
    );

    setProductForm({
      name:
        product.name || "",
      description:
        product.description ||
        "",
      price:
        product.price ?? "",
      category:
        product.category || "",
      image:
        product.image || "",
      stock:
        product.stock ?? "",
    });

    setActiveTab(
      "products"
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // SAVE PRODUCT
  // =========================

  const handleProductSubmit =
    async (e) => {
      e.preventDefault();

      setError("");
      setSuccess("");

      if (
        !productForm.name.trim()
      ) {
        setError(
          language === "Hindi"
            ? "Product name भरें।"
            : "Enter the product name."
        );
        return;
      }

      if (
        productForm.price === ""
      ) {
        setError(
          language === "Hindi"
            ? "Price भरें।"
            : "Enter the product price."
        );
        return;
      }

      if (
        productForm.stock === ""
      ) {
        setError(
          language === "Hindi"
            ? "Stock भरें।"
            : "Enter the product stock."
        );
        return;
      }

      try {
        setSaving(true);

        const payload = {
          name: productForm.name.trim(),
          description: productForm.description.trim() || "ShopSphere product",
          price: Number(productForm.price),
          category: productForm.category.trim() || "General",
          image: productForm.image.trim(),
          stock: Number(productForm.stock),
        };

        if (!editingProductId) {
          payload.brand = "ShopSphere";
          payload.subcategory = payload.category;
          payload.gender = "Unisex";
          payload.sizes = ["Free Size"];
          payload.colors = ["Default"];
          payload.variants = [
            {
              size: "Free Size",
              color: "Default",
              stock: Number(productForm.stock),
            },
          ];
        }

        if (
          editingProductId
        ) {
          await apiRequest(
            `/api/products/${editingProductId}`,
            {
              method: "PUT",
              body:
                JSON.stringify(
                  payload
                ),
            }
          );

          setSuccess(
            language === "Hindi"
              ? "Product successfully update हो गया।"
              : "Product updated successfully."
          );
        } else {
          await apiRequest(
            "/api/products",
            {
              method: "POST",
              body:
                JSON.stringify(
                  payload
                ),
            }
          );

          setSuccess(
            language === "Hindi"
              ? "Product successfully add हो गया।"
              : "Product added successfully."
          );
        }

        await loadProducts();

        resetProductForm();
      } catch (err) {
        console.error(
          "Product save error:",
          err
        );

        setError(
          err.message ||
            (language === "Hindi"
              ? "Product save नहीं हो पाया।"
              : "Could not save product.")
        );
      } finally {
        setSaving(false);
      }
    };

  // =========================
  // DELETE PRODUCT
  // =========================

  const handleDeleteProduct =
    async (
      productId
    ) => {
      const confirmed =
        window.confirm(
          language === "Hindi"
            ? "क्या आप इस product को delete करना चाहते हैं?"
            : "Are you sure you want to delete this product?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setError("");
        setSuccess("");
        setSaving(true);

        await apiRequest(
          `/api/products/${productId}`,
          {
            method: "DELETE",
          }
        );

        await loadProducts();

        if (
          editingProductId ===
          productId
        ) {
          resetProductForm();
        }

        setSuccess(
          language === "Hindi"
            ? "Product delete हो गया।"
            : "Product deleted successfully."
        );
      } catch (err) {
        console.error(
          "Product delete error:",
          err
        );

        setError(
          err.message ||
            (language === "Hindi"
              ? "Product delete नहीं हो पाया।"
              : "Could not delete product.")
        );
      } finally {
        setSaving(false);
      }
    };

  // =========================
  // UPDATE ORDER STATUS
  // =========================

  const handleOrderStatus =
    async (
      orderId,
      status
    ) => {
      try {
        setError("");
        setSuccess("");

        await apiRequest(
          `/api/orders/${orderId}/status`,
          {
            method: "PUT",
            body: JSON.stringify({
              status,
            }),
          }
        );

        setOrders(
          (currentOrders) =>
            currentOrders.map(
              (order) =>
                order._id ===
                orderId
                  ? {
                      ...order,
                      status,
                    }
                  : order
            )
        );

        setSuccess(
          language === "Hindi"
            ? "Order status update हो गया।"
            : "Order status updated successfully."
        );
      } catch (err) {
        console.error(
          "Order status error:",
          err
        );

        setError(
          err.message ||
            (language === "Hindi"
              ? "Order status update नहीं हो पाया।"
              : "Could not update order status.")
        );
      }
    };

  // =========================
  // REFRESH
  // =========================

  const refreshDashboard =
    async () => {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        await Promise.all([
          loadProducts(),
          loadOrders(),
          loadUsers(),
        ]);

        setSuccess(
          language === "Hindi"
            ? "Dashboard refresh हो गया।"
            : "Dashboard refreshed."
        );
      } catch (err) {
        setError(
          err.message ||
            "Refresh failed."
        );
      } finally {
        setLoading(false);
      }
    };

  // =========================
  // STATS
  // =========================

  const totalOrders =
    orders.length;

  const totalProducts =
    products.length;

  const totalUsers =
    users.length;

  const totalRevenue =
    orders
      .filter(
        (order) =>
          String(
            order.status
          ).toLowerCase() !==
          "cancelled"
      )
      .reduce(
        (sum, order) =>
          sum +
          Number(
            order.totalAmount ||
              0
          ),
        0
      );

  const lowStockProducts =
    products.filter(
      (product) =>
        Number(
          product.stock
        ) <= 5
    ).length;

  // =========================
  // STORE NAVIGATION
  // =========================

  const goToStore = () => {
    navigate("/");
  };

  // =========================
  // STATUS TEXT
  // =========================

  const getStatusText = (
    status
  ) => {
    if (
      language !==
      "Hindi"
    ) {
      return (
        String(status)
          .replace(/_/g, " ")
          .replace(
            /^\w/,
            (letter) =>
              letter.toUpperCase()
          )
      );
    }

    const map = {
      pending: "पेंडिंग",
      confirmed:
        "पुष्टि की गई",
      shipped:
        "भेज दिया गया",
      delivered:
        "डिलीवर हो गया",
      cancelled:
        "कैंसल किया गया",
    };

    return (
      map[
        String(status)
          .toLowerCase()
      ] || status
    );
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="admin-dashboard">

        <div className="admin-shell">

          <section className="admin-loading-card">

            <div className="admin-loading-icon">
              ⚙️
            </div>

            <p>
              {language === "Hindi"
                ? "Admin dashboard लोड हो रहा है..."
                : "Loading admin dashboard..."}
            </p>

          </section>

        </div>

      </main>
    );
  }

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

        .admin-loading-card,
        .admin-panel {
          border: 1px solid #e2d6c7;
          background: #fffdf9;
        }

        .admin-loading-card {
          max-width: 500px;
          margin: 100px auto;
          padding: 50px;
          text-align: center;
        }

        .admin-loading-icon {
          font-size: 35px;
          margin-bottom: 15px;
        }

        .admin-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 35px;
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

        .admin-description {
          max-width: 650px;
          margin: 14px 0 0;
          color: #71675f;
          font-size: 13px;
          line-height: 1.7;
        }

        .admin-header-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
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

        .admin-store-btn,
        .admin-refresh-btn {
          border: none;
          padding: 12px 17px;
          background: #211e1b;
          color: #fffdf9;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          cursor: pointer;
        }

        .admin-refresh-btn {
          background: #8a6245;
        }

        .admin-store-btn:hover,
        .admin-refresh-btn:hover {
          opacity: 0.85;
        }

        .admin-message {
          margin-bottom: 20px;
          padding: 12px 15px;
          border: 1px solid #ded2c4;
          background: #fffdf9;
          color: #6f665e;
          font-size: 11px;
        }

        .admin-message.error {
          border-color: #e7c6bf;
          background: #f8e9e5;
          color: #a75645;
        }

        .admin-message.success {
          border-color: #d5dfd0;
          background: #eef2eb;
          color: #617458;
        }

        .admin-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 3px;
          padding: 5px;
          margin-bottom: 25px;
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
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
          margin-bottom: 25px;
        }

        .admin-kpi {
          padding: 20px;
          border: 1px solid #e2d6c7;
          background: #fffdf9;
        }

        .admin-kpi-label {
          margin: 0 0 12px;
          color: #8f8378;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1.5px;
        }

        .admin-kpi-value {
          margin: 0;
          font-family: "Playfair Display", serif;
          font-size: 29px;
          font-weight: 600;
        }

        .admin-kpi-note {
          margin-top: 7px;
          color: #988d82;
          font-size: 9px;
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
          min-width: 720px;
          border-collapse: collapse;
        }

        .admin-table th {
          padding: 13px 18px;
          text-align: left;
          color: #95897e;
          background: #faf7f2;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .admin-table td {
          padding: 15px 18px;
          border-top: 1px solid #eee7de;
          color: #4e4741;
          font-size: 11px;
          vertical-align: middle;
        }

        .admin-id {
          color: #211e1b;
          font-weight: 700;
        }

        .admin-status-select,
        .admin-form input,
        .admin-form textarea,
        .admin-form select {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #ddd1c2;
          background: #fffdf9;
          color: #211e1b;
          padding: 10px 11px;
          font: inherit;
          outline: none;
        }

        .admin-status-select {
          width: auto;
          min-width: 125px;
          padding: 7px 9px;
          font-size: 10px;
        }

        .admin-form {
          padding: 22px;
          border-bottom: 1px solid #e8ded0;
          background: #faf7f2;
        }

        .admin-form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 13px;
        }

        .admin-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .admin-field.full {
          grid-column: 1 / -1;
        }

        .admin-field label {
          color: #756a61;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .admin-form textarea {
          resize: vertical;
        }

        .admin-form-actions {
          display: flex;
          gap: 10px;
          margin-top: 16px;
          flex-wrap: wrap;
        }

        .admin-primary-btn,
        .admin-secondary-btn,
        .admin-delete-btn {
          border: none;
          padding: 11px 16px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          cursor: pointer;
        }

        .admin-primary-btn {
          background: #211e1b;
          color: #fffdf9;
        }

        .admin-secondary-btn {
          background: #e8ded0;
          color: #4e4741;
        }

        .admin-delete-btn {
          background: #a75645;
          color: white;
        }

        .admin-primary-btn:disabled,
        .admin-delete-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .admin-product-image {
          width: 50px;
          height: 60px;
          object-fit: cover;
          background: #eee5da;
        }

        .admin-no-image {
          width: 50px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eee5da;
          font-size: 18px;
        }

        .admin-row-actions {
          display: flex;
          gap: 7px;
          flex-wrap: wrap;
        }

        .admin-small-btn {
          border: 1px solid #ddd1c2;
          background: #fffdf9;
          padding: 7px 9px;
          color: #4e4741;
          font-size: 9px;
          font-weight: 700;
          cursor: pointer;
        }

        .admin-small-btn.delete {
          border-color: #dfbdb5;
          color: #a75645;
        }

        .admin-empty {
          padding: 35px 20px;
          text-align: center;
          color: #9a9086;
          font-size: 12px;
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

        .admin-denied-icon {
          margin-bottom: 15px;
          font-size: 34px;
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

        @media (max-width: 1200px) {
          .admin-kpi-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 800px) {
          .admin-dashboard {
            padding: 25px 16px 60px;
          }

          .admin-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .admin-kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .admin-form-grid {
            grid-template-columns: 1fr;
          }

          .admin-field.full {
            grid-column: auto;
          }

          .admin-tabs {
            width: 100%;
            overflow-x: auto;
            flex-wrap: nowrap;
          }

          .admin-tab {
            white-space: nowrap;
          }
        }

        @media (max-width: 480px) {
          .admin-kpi-grid {
            grid-template-columns: 1fr;
          }

          .admin-header h1 {
            font-size: 40px;
          }
        }

      `}</style>

      <div className="admin-shell">

        {/* =========================
            HEADER
        ========================= */}

        <header className="admin-header">

          <div>

            <p className="admin-eyebrow">
              SHOPSPHERE · ADMIN
            </p>

            <h1>
              {language === "Hindi"
                ? "Dashboard"
                : "Dashboard"}
            </h1>

            <p className="admin-description">
              {language === "Hindi"
                ? `Welcome ${userName}. अपने store के products, orders और users manage करें।`
                : `Welcome ${userName}. Manage your products, orders and customers from one place.`}
            </p>

          </div>

          <div className="admin-header-right">

            <div className="admin-user-badge">
              <span>ADMIN</span>
              {userName}
            </div>

            <button
              type="button"
              className="admin-refresh-btn"
              onClick={
                refreshDashboard
              }
            >
              {language === "Hindi"
                ? "REFRESH"
                : "REFRESH"}
            </button>

            <button
              type="button"
              className="admin-store-btn"
              onClick={
                goToStore
              }
            >
              {language === "Hindi"
                ? "STORE देखें"
                : "VIEW STORE"}
            </button>

          </div>

        </header>

        {/* =========================
            MESSAGES
        ========================= */}

        {error && (
          <div className="admin-message error">
            {error}
          </div>
        )}

        {success && (
          <div className="admin-message success">
            {success}
          </div>
        )}

        {/* =========================
            TABS
        ========================= */}

        <nav className="admin-tabs">

          <button
            type="button"
            className={`admin-tab ${
              activeTab ===
              "overview"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab(
                "overview"
              )
            }
          >
            OVERVIEW
          </button>

          <button
            type="button"
            className={`admin-tab ${
              activeTab ===
              "products"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab(
                "products"
              )
            }
          >
            PRODUCTS
          </button>

          <button
            type="button"
            className={`admin-tab ${
              activeTab ===
              "orders"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab(
                "orders"
              )
            }
          >
            ORDERS
          </button>

          <button
            type="button"
            className={`admin-tab ${
              activeTab ===
              "users"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab(
                "users"
              )
            }
          >
            USERS
          </button>

        </nav>

        {/* =========================
            KPI
        ========================= */}

        <section className="admin-kpi-grid">

          <div className="admin-kpi">
            <p className="admin-kpi-label">
              PRODUCTS
            </p>

            <p className="admin-kpi-value">
              {totalProducts}
            </p>

            <p className="admin-kpi-note">
              LIVE PRODUCT CATALOG
            </p>
          </div>

          <div className="admin-kpi">
            <p className="admin-kpi-label">
              ORDERS
            </p>

            <p className="admin-kpi-value">
              {totalOrders}
            </p>

            <p className="admin-kpi-note">
              LIVE ORDERS
            </p>
          </div>

          <div className="admin-kpi">
            <p className="admin-kpi-label">
              USERS
            </p>

            <p className="admin-kpi-value">
              {totalUsers}
            </p>

            <p className="admin-kpi-note">
              REGISTERED USERS
            </p>
          </div>

          <div className="admin-kpi">
            <p className="admin-kpi-label">
              REVENUE
            </p>

            <p className="admin-kpi-value">
              ₹
              {totalRevenue.toLocaleString(
                "en-IN"
              )}
            </p>

            <p className="admin-kpi-note">
              NON-CANCELLED ORDERS
            </p>
          </div>

          <div className="admin-kpi">
            <p className="admin-kpi-label">
              LOW STOCK
            </p>

            <p className="admin-kpi-value">
              {lowStockProducts}
            </p>

            <p className="admin-kpi-note">
              STOCK ≤ 5
            </p>
          </div>

        </section>

        {/* =========================
            OVERVIEW
        ========================= */}

        {activeTab ===
          "overview" && (
          <section className="admin-panel">

            <div className="admin-panel-header">

              <h2>
                {language === "Hindi"
                  ? "Recent Orders"
                  : "Recent Orders"}
              </h2>

              <span>
                {orders.length} ORDERS
              </span>

            </div>

            {orders.length ===
            0 ? (
              <div className="admin-empty">
                {language === "Hindi"
                  ? "अभी कोई order नहीं है।"
                  : "No orders available yet."}
              </div>
            ) : (
              <div className="admin-table-wrap">

                <table className="admin-table">

                  <thead>
                    <tr>
                      <th>
                        ORDER
                      </th>

                      <th>
                        CUSTOMER
                      </th>

                      <th>
                        TOTAL
                      </th>

                      <th>
                        STATUS
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders
                      .slice(
                        0,
                        8
                      )
                      .map(
                        (
                          order
                        ) => (
                          <tr
                            key={
                              order._id
                            }
                          >

                            <td className="admin-id">
                              #
                              {
                                order._id
                              }
                            </td>

                            <td>
                              {
                                order
                                  .shippingAddress
                                  ?.fullName ||
                                "Customer"
                              }
                            </td>

                            <td>
                              ₹
                              {Number(
                                order.totalAmount ||
                                  0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </td>

                            <td>
                              {getStatusText(
                                order.status
                              )}
                            </td>

                          </tr>
                        )
                      )}
                  </tbody>

                </table>

              </div>
            )}

          </section>
        )}

        {/* =========================
            PRODUCTS
        ========================= */}

        {activeTab ===
          "products" && (
          <section className="admin-panel">

            <div className="admin-panel-header">

              <h2>
                {editingProductId
                  ? "Edit Product"
                  : "Add Product"}
              </h2>

              <span>
                {products.length} PRODUCTS
              </span>

            </div>

            {/* PRODUCT FORM */}

            <form
              className="admin-form"
              onSubmit={
                handleProductSubmit
              }
            >

              <div className="admin-form-grid">

                <div className="admin-field">
                  <label>
                    NAME
                  </label>

                  <input
                    name="name"
                    value={
                      productForm.name
                    }
                    onChange={
                      handleProductChange
                    }
                    placeholder="Product name"
                  />
                </div>

                <div className="admin-field">
                  <label>
                    CATEGORY
                  </label>

                  <input
                    name="category"
                    value={
                      productForm.category
                    }
                    onChange={
                      handleProductChange
                    }
                    placeholder="Fashion / Footwear / Accessories"
                  />
                </div>

                <div className="admin-field">
                  <label>
                    PRICE
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="price"
                    value={
                      productForm.price
                    }
                    onChange={
                      handleProductChange
                    }
                    placeholder="Price"
                  />
                </div>

                <div className="admin-field">
                  <label>
                    STOCK
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="stock"
                    value={
                      productForm.stock
                    }
                    onChange={
                      handleProductChange
                    }
                    placeholder="Stock quantity"
                  />
                </div>

                <div className="admin-field full">
                  <label>
                    IMAGE URL
                  </label>

                  <input
                    name="image"
                    value={
                      productForm.image
                    }
                    onChange={
                      handleProductChange
                    }
                    placeholder="https://..."
                  />
                </div>

                <div className="admin-field full">
                  <label>
                    DESCRIPTION
                  </label>

                  <textarea
                    name="description"
                    value={
                      productForm.description
                    }
                    onChange={
                      handleProductChange
                    }
                    rows="4"
                    placeholder="Product description"
                  />
                </div>

              </div>

              <div className="admin-form-actions">

                <button
                  type="submit"
                  className="admin-primary-btn"
                  disabled={
                    saving
                  }
                >
                  {saving
                    ? "SAVING..."
                    : editingProductId
                    ? "UPDATE PRODUCT"
                    : "ADD PRODUCT"}
                </button>

                {editingProductId && (
                  <button
                    type="button"
                    className="admin-secondary-btn"
                    onClick={
                      resetProductForm
                    }
                  >
                    CANCEL EDIT
                  </button>
                )}

              </div>

            </form>

            {/* PRODUCT TABLE */}

            <div className="admin-table-wrap">

              <table className="admin-table">

                <thead>
                  <tr>

                    <th>
                      PRODUCT
                    </th>

                    <th>
                      CATEGORY
                    </th>

                    <th>
                      PRICE
                    </th>

                    <th>
                      STOCK
                    </th>

                    <th>
                      ACTIONS
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {products.length ===
                  0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="admin-empty"
                      >
                        No products
                        available.
                      </td>
                    </tr>
                  ) : (
                    products.map(
                      (
                        product
                      ) => (
                        <tr
                          key={
                            product._id
                          }
                        >

                          <td>

                            <div
                              style={{
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                gap:
                                  "10px",
                              }}
                            >

                              {product.image ? (
                                <img
                                  className="admin-product-image"
                                  src={
                                    product.image
                                  }
                                  alt={
                                    product.name
                                  }
                                />
                              ) : (
                                <div className="admin-no-image">
                                  🛍️
                                </div>
                              )}

                              <strong>
                                {
                                  product.name
                                }
                              </strong>

                            </div>

                          </td>

                          <td>
                            {product.category ||
                              "—"}
                          </td>

                          <td>
                            ₹
                            {Number(
                              product.price ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </td>

                          <td>
                            {
                              product.stock
                            }
                          </td>

                          <td>

                            <div className="admin-row-actions">

                              <button
                                type="button"
                                className="admin-small-btn"
                                onClick={() =>
                                  handleEditProduct(
                                    product
                                  )
                                }
                              >
                                EDIT
                              </button>

                              <button
                                type="button"
                                className="admin-small-btn delete"
                                onClick={() =>
                                  handleDeleteProduct(
                                    product._id
                                  )
                                }
                                disabled={
                                  saving
                                }
                              >
                                DELETE
                              </button>

                            </div>

                          </td>

                        </tr>
                      )
                    )
                  )}

                </tbody>

              </table>

            </div>

          </section>
        )}

        {/* =========================
            ORDERS
        ========================= */}

        {activeTab ===
          "orders" && (
          <section className="admin-panel">

            <div className="admin-panel-header">

              <h2>
                Order Management
              </h2>

              <span>
                {orders.length} ORDERS
              </span>

            </div>

            <div className="admin-table-wrap">

              <table className="admin-table">

                <thead>
                  <tr>

                    <th>
                      ORDER ID
                    </th>

                    <th>
                      CUSTOMER
                    </th>

                    <th>
                      TOTAL
                    </th>

                    <th>
                      STATUS
                    </th>

                    <th>
                      DATE
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {orders.length ===
                  0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="admin-empty"
                      >
                        No orders available.
                      </td>
                    </tr>
                  ) : (
                    orders.map(
                      (
                        order
                      ) => (
                        <tr
                          key={
                            order._id
                          }
                        >

                          <td className="admin-id">
                            #
                            {
                              order._id
                            }
                          </td>

                          <td>
                            {
                              order
                                .shippingAddress
                                ?.fullName ||
                              "Customer"
                            }
                          </td>

                          <td>
                            ₹
                            {Number(
                              order.totalAmount ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </td>

                          <td>

                            <select
                              className="admin-status-select"
                              value={
                                order.status ||
                                "confirmed"
                              }
                              onChange={(
                                e
                              ) =>
                                handleOrderStatus(
                                  order._id,
                                  e.target
                                    .value
                                )
                              }
                            >

                              {orderStatuses.map(
                                (
                                  status
                                ) => (
                                  <option
                                    key={
                                      status
                                    }
                                    value={
                                      status
                                    }
                                  >
                                    {getStatusText(
                                      status
                                    )}
                                  </option>
                                )
                              )}

                            </select>

                          </td>

                          <td>
                            {order.createdAt
                              ? new Date(
                                  order.createdAt
                                ).toLocaleDateString(
                                  "en-IN"
                                )
                              : "—"}
                          </td>

                        </tr>
                      )
                    )
                  )}

                </tbody>

              </table>

            </div>

          </section>
        )}

        {/* =========================
            USERS
        ========================= */}

        {activeTab ===
          "users" && (
          <section className="admin-panel">

            <div className="admin-panel-header">

              <h2>
                User Management
              </h2>

              <span>
                {users.length} USERS
              </span>

            </div>

            <div className="admin-table-wrap">

              <table className="admin-table">

                <thead>
                  <tr>

                    <th>
                      USERNAME
                    </th>

                    <th>
                      EMAIL
                    </th>

                    <th>
                      ROLE
                    </th>

                    <th>
                      ID
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {users.length ===
                  0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="admin-empty"
                      >
                        No users available.
                      </td>
                    </tr>
                  ) : (
                    users.map(
                      (
                        user
                      ) => (
                        <tr
                          key={
                            user._id
                          }
                        >

                          <td>
                            {
                              user.username ||
                              "—"
                            }
                          </td>

                          <td>
                            {
                              user.email ||
                              "—"
                            }
                          </td>

                          <td>
                            <strong
                              style={{
                                textTransform:
                                  "capitalize",
                              }}
                            >
                              {
                                user.role ||
                                "user"
                              }
                            </strong>
                          </td>

                          <td className="admin-id">
                            {
                              user._id
                            }
                          </td>

                        </tr>
                      )
                    )
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