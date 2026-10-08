import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";
import API_URL from "../api";

function Checkout() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // =========================
  // TOKEN
  // =========================

  const token =
    localStorage.getItem("authToken");

  // =========================
  // NORMALIZE CART
  // =========================

  const normalizeBackendCart = (
    backendCart
  ) => {
    const items =
      backendCart?.items || [];

    return items
      .filter(
        (item) => item?.product
      )
      .map((item) => ({
        _id:
          item.product._id,
        id:
          item.product._id,
        name:
          item.product.name || "",
        price:
          Number(
            item.product.price
          ) || 0,
        image:
          item.product.image || "",
        category:
          item.product.category || "",
        quantity:
          Number(item.quantity) || 1,
        stock:
          Number(
            item.product.stock
          ) || 0,
      }));
  };

  // =========================
  // LOAD USER PROFILE
  // =========================

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        return;
      }

      try {
        const response =
          await fetch(
            `${API_URL}/api/auth/profile`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (response.ok) {
          const profile =
            data?.user || data;

          setForm((current) => ({
            ...current,
            name:
              profile?.username ||
              "",
          }));
        }
      } catch (err) {
        console.error(
          "Profile loading error:",
          err
        );
      }
    };

    loadProfile();
  }, [token]);

  // =========================
  // LOAD CART
  // =========================

  useEffect(() => {
    const loadCart =
      async () => {
        if (!token) {
          setLoading(false);
          return;
        }

        try {
          setLoading(true);
          setError("");

          const response =
            await fetch(
              `${API_URL}/api/cart`,
              {
                method: "GET",
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                (language ===
                "Hindi"
                  ? "कार्ट लोड नहीं हो पाया।"
                  : "Could not load cart.")
            );
          }

          setCart(
            normalizeBackendCart(
              data.cart
            )
          );
        } catch (err) {
          console.error(
            "Checkout cart error:",
            err
          );

          setCart([]);

          setError(
            err.message ||
              (language ===
              "Hindi"
                ? "कार्ट लोड नहीं हो पाया।"
                : "Could not load cart.")
          );
        } finally {
          setLoading(false);
        }
      };

    loadCart();
  }, [token, language]);

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  // =========================
  // SUBTOTAL
  // =========================

  const subtotal =
    cart.reduce(
      (total, item) =>
        total +
        Number(item.price) *
          Number(item.quantity),
      0
    );

  // Backend currently calculates
  // the order total as:
  // product price × quantity

  const total = subtotal;

  // =========================
  // PLACE ORDER
  // =========================

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      setError("");

      // =========================
      // LOGIN
      // =========================

      if (!token) {
        alert(
          language === "Hindi"
            ? "ऑर्डर करने से पहले लॉगिन करें।"
            : "Please log in before placing an order."
        );

        navigate("/login");
        return;
      }

      // =========================
      // EMPTY CART
      // =========================

      if (cart.length === 0) {
        setError(
          language === "Hindi"
            ? "आपका कार्ट खाली है।"
            : "Your cart is empty."
        );

        return;
      }

      // =========================
      // PLACE ORDER
      // =========================

      try {
        setPlacingOrder(true);

        const response =
          await fetch(
            `${API_URL}/api/orders`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
                Authorization:
                  `Bearer ${token}`,
              },
              body: JSON.stringify({
                fullName:
                  form.name.trim(),
                address:
                  form.address.trim(),
                city:
                  form.city.trim(),
                state:
                  form.state.trim(),
                pincode:
                  form.pincode.trim(),
                phone:
                  form.phone.trim(),
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              (language ===
              "Hindi"
                ? "ऑर्डर प्लेस नहीं हो पाया।"
                : "Could not place order.")
          );
        }

        const backendOrder =
          data?.order;

        if (!backendOrder) {
          throw new Error(
            language === "Hindi"
              ? "ऑर्डर की जानकारी प्राप्त नहीं हुई।"
              : "Order information was not returned."
          );
        }

        // =========================
        // SAVE ONLY LATEST BACKEND ORDER
        // FOR ORDER SUCCESS PAGE
        // =========================

        localStorage.setItem(
          "lastOrder",
          JSON.stringify(
            backendOrder
          )
        );

        /* Save the latest delivery address for the navbar/profile UI. */
        localStorage.setItem(
          "shopSphereDeliveryAddress",
          JSON.stringify({
            fullName: form.name.trim(),
            address: form.address.trim(),
            city: form.city.trim(),
            state: form.state.trim(),
            pincode: form.pincode.trim(),
            phone: form.phone.trim(),
          })
        );

        window.dispatchEvent(
          new Event("deliveryUpdated")
        );

        // Backend automatically:
        // 1. creates order
        // 2. calculates total
        // 3. decreases stock
        // 4. clears backend cart

        setCart([]);

        window.dispatchEvent(
          new Event("cartUpdated")
        );

        navigate(
          "/order-success"
        );
      } catch (err) {
        console.error(
          "Place order error:",
          err
        );

        setError(
          err.message ||
            (language ===
            "Hindi"
              ? "ऑर्डर प्लेस नहीं हो पाया।"
              : "Could not place order.")
        );
      } finally {
        setPlacingOrder(false);
      }
    };

  // =========================
  // LOGIN REQUIRED
  // =========================

  if (!token) {
    return (
      <main className="empty-cart">

        <p className="section-label">
          {language === "Hindi"
            ? "चेकआउट"
            : "CHECKOUT"}
        </p>

        <h1>
          {language === "Hindi"
            ? "लॉगिन आवश्यक है"
            : "Login Required"}
        </h1>

        <p>
          {language === "Hindi"
            ? "चेकआउट करने के लिए पहले अपने अकाउंट में लॉगिन करें।"
            : "Please log in to your account before checkout."}
        </p>

        <Link
          to="/login"
          className="continue-shopping"
        >
          {language === "Hindi"
            ? "लॉगिन करें"
            : "LOGIN"}
        </Link>

      </main>
    );
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="empty-cart">

        <p className="section-label">
          {language === "Hindi"
            ? "चेकआउट"
            : "CHECKOUT"}
        </p>

        <h1>
          {language === "Hindi"
            ? "चेकआउट लोड हो रहा है..."
            : "Loading Checkout..."}
        </h1>

      </main>
    );
  }

  // =========================
  // EMPTY CART
  // =========================

  if (
    cart.length === 0 &&
    !error
  ) {
    return (
      <main className="empty-cart">

        <p className="section-label">
          {language === "Hindi"
            ? "चेकआउट"
            : "CHECKOUT"}
        </p>

        <h1>
          {language === "Hindi"
            ? "आपका कार्ट खाली है"
            : "Your Cart is Empty"}
        </h1>

        <p>
          {language === "Hindi"
            ? "चेकआउट करने से पहले कुछ प्रोडक्ट्स जोड़ें।"
            : "Add some products before checking out."}
        </p>

        <Link
          to="/products"
          className="continue-shopping"
        >
          {language === "Hindi"
            ? "शॉपिंग जारी रखें"
            : "CONTINUE SHOPPING"}
        </Link>

      </main>
    );
  }

  return (
    <main className="checkout-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="checkout-header">

        <p className="section-label">
          {language === "Hindi"
            ? "SHOPSPHERE चेकआउट"
            : "SHOPSPHERE CHECKOUT"}
        </p>

        <h1>
          {language === "Hindi"
            ? "अपना ऑर्डर पूरा करें"
            : "Complete Your Order"}
        </h1>

        {error && (
          <p className="coupon-error">
            {error}
          </p>
        )}

      </div>

      <div className="checkout-layout">

        {/* =========================
            SHIPPING FORM
        ========================= */}

        <form
          className="checkout-form"
          onSubmit={handleSubmit}
        >

          <h2>
            {language === "Hindi"
              ? "डिलीवरी की जानकारी"
              : "Delivery Information"}
          </h2>

          <div className="checkout-fields">

            {/* NAME */}

            <div className="form-group">

              <label>
                {language === "Hindi"
                  ? "पूरा नाम"
                  : "FULL NAME"}
              </label>

              <input
                name="name"
                value={form.name}
                onChange={
                  handleChange
                }
                placeholder={
                  language ===
                  "Hindi"
                    ? "अपना पूरा नाम दर्ज करें"
                    : "Enter your full name"
                }
                required
              />

            </div>

            {/* PHONE */}

            <div className="form-group">

              <label>
                {language === "Hindi"
                  ? "फोन नंबर"
                  : "PHONE NUMBER"}
              </label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={
                  handleChange
                }
                placeholder={
                  language ===
                  "Hindi"
                    ? "10 अंकों का फोन नंबर"
                    : "10-digit phone number"
                }
                pattern="[0-9]{10}"
                maxLength="10"
                required
              />

            </div>

            {/* PINCODE */}

            <div className="form-group">

              <label>
                {language === "Hindi"
                  ? "पिनकोड"
                  : "PINCODE"}
              </label>

              <input
                name="pincode"
                value={
                  form.pincode
                }
                onChange={
                  handleChange
                }
                placeholder={
                  language ===
                  "Hindi"
                    ? "6 अंकों का पिनकोड"
                    : "6-digit pincode"
                }
                pattern="[0-9]{6}"
                maxLength="6"
                required
              />

            </div>

            {/* ADDRESS */}

            <div className="form-group full-width">

              <label>
                {language === "Hindi"
                  ? "पूरा पता"
                  : "ADDRESS"}
              </label>

              <textarea
                name="address"
                value={
                  form.address
                }
                onChange={
                  handleChange
                }
                placeholder={
                  language ===
                  "Hindi"
                    ? "मकान नंबर, गली, क्षेत्र"
                    : "House no., street, locality"
                }
                rows="4"
                required
              />

            </div>

            {/* CITY */}

            <div className="form-group">

              <label>
                {language === "Hindi"
                  ? "शहर"
                  : "CITY"}
              </label>

              <input
                name="city"
                value={form.city}
                onChange={
                  handleChange
                }
                placeholder={
                  language ===
                  "Hindi"
                    ? "शहर दर्ज करें"
                    : "Enter city"
                }
                required
              />

            </div>

            {/* STATE */}

            <div className="form-group">

              <label>
                {language === "Hindi"
                  ? "राज्य"
                  : "STATE"}
              </label>

              <input
                name="state"
                value={form.state}
                onChange={
                  handleChange
                }
                placeholder={
                  language ===
                  "Hindi"
                    ? "राज्य दर्ज करें"
                    : "Enter state"
                }
                required
              />

            </div>

          </div>

          {/* =========================
              ORDER INFORMATION
          ========================= */}

          <h2 className="payment-title">
            {language === "Hindi"
              ? "ऑर्डर जानकारी"
              : "Order Information"}
          </h2>

          <div className="payment-option">

            <div>

              <strong>
                {language === "Hindi"
                  ? "ऑर्डर प्लेस करने के लिए तैयार"
                  : "Ready to place your order"}
              </strong>

              <span>
                {language === "Hindi"
                  ? "आपकी डिलीवरी जानकारी सुरक्षित रूप से ऑर्डर के साथ भेजी जाएगी।"
                  : "Your delivery information will be submitted securely with the order."}
              </span>

            </div>

          </div>

          {/* =========================
              PLACE ORDER
          ========================= */}

          <button
            className="place-order-btn"
            type="submit"
            disabled={
              placingOrder
            }
          >
            {placingOrder
              ? language ===
                "Hindi"
                ? "ऑर्डर प्लेस हो रहा है..."
                : "PLACING ORDER..."
              : language ===
                "Hindi"
              ? "ऑर्डर करें"
              : "PLACE ORDER"}
          </button>

        </form>

        {/* =========================
            ORDER SUMMARY
        ========================= */}

        <aside className="checkout-summary">

          <h2>
            {language === "Hindi"
              ? "ऑर्डर का सारांश"
              : "Order Summary"}
          </h2>

          {cart.map((item) => (
            <div
              className="checkout-product"
              key={item._id}
            >

              <Link
                to={`/product/${item._id || item.id}`}
                className="checkout-product-link"
                aria-label={`View ${item.name}`}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                  />
                ) : (
                  <div
                    style={{
                      width: "60px",
                      height: "70px",
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      background:
                        "#eee5da",
                      color:
                        "#8a6245",
                    }}
                  >
                    🛍️
                  </div>
                )}
              </Link>

              <div>

                <Link
                  to={`/product/${item._id || item.id}`}
                  className="checkout-product-name"
                >
                  <strong>
                    {item.name}
                  </strong>
                </Link>

                <span>
                  {item.quantity} × ₹
                  {Number(
                    item.price
                  ).toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

            </div>
          ))}

          <div className="summary-line"></div>

          {/* SUBTOTAL */}

          <div className="summary-row">

            <span>
              {language === "Hindi"
                ? "सबटोटल"
                : "Subtotal"}
            </span>

            <span>
              ₹
              {subtotal.toLocaleString(
                "en-IN"
              )}
            </span>

          </div>

          {/* TOTAL */}

          <div className="summary-total">

            <span>
              {language === "Hindi"
                ? "कुल"
                : "Total"}
            </span>

            <strong>
              ₹
              {total.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

        </aside>

      </div>

    </main>
  );
}

export default Checkout;