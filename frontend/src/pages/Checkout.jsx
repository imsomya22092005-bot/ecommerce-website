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
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // =========================
  // GET PRODUCT ID
  // =========================

  const getProductId = (item) =>
    item._id ||
    item.id ||
    item.product?._id ||
    item.product?.id;

  // =========================
  // GET TOKEN
  // =========================

  const getToken = () =>
    localStorage.getItem("authToken");

  // =========================
  // NORMALIZE BACKEND CART
  // =========================

  const normalizeBackendCart = (backendCart) => {
    const items = backendCart?.items || [];

    return items
      .filter((item) => item?.product)
      .map((item) => ({
        _id: item.product._id,
        id: item.product._id,
        name: item.product.name || "",
        price: Number(item.product.price) || 0,
        image:
          item.product.image ||
          item.product.imageUrl ||
          "",
        category: item.product.category || "",
        quantity: Number(item.quantity) || 1,
      }));
  };

  // =========================
  // LOAD CART
  // =========================

  useEffect(() => {
    const loadCart = async () => {
      const token = getToken();

      // =========================
      // USER NOT LOGGED IN
      // =========================

      if (!token) {
        const savedCart =
          JSON.parse(
            localStorage.getItem("cart")
          ) || [];

        setCart(savedCart);
        setLoading(false);
        return;
      }

      // =========================
      // LOGGED-IN USER
      // =========================

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/cart`,
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
              "Could not load cart"
          );
        }

        const backendCart =
          normalizeBackendCart(data);

        setCart(backendCart);

        localStorage.setItem(
          "cart",
          JSON.stringify(backendCart)
        );
      } catch (err) {
        console.error(
          "Checkout cart error:",
          err
        );

        // Fallback to local cart
        const savedCart =
          JSON.parse(
            localStorage.getItem("cart")
          ) || [];

        setCart(savedCart);

        setError(
          language === "Hindi"
            ? "कार्ट लोड नहीं हो पाया।"
            : "Could not load cart."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  // =========================
  // SUBTOTAL
  // =========================

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price) *
        Number(item.quantity),
    0
  );

  // =========================
  // SHIPPING
  // =========================

  const shipping =
    subtotal >= 999 ? 0 : 99;

  // =========================
  // TOTAL
  // =========================

  const total =
    subtotal + shipping;

  // =========================
  // PLACE ORDER
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();

    setError("");

    // =========================
    // LOGIN REQUIRED
    // =========================

    if (!token) {
      alert(
        language === "Hindi"
          ? "ऑर्डर करने से पहले लॉगिन करें।"
          : "Please login before placing an order."
      );

      navigate("/login");
      return;
    }

    // =========================
    // CHECK CART
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
    // BACKEND REQUEST
    // =========================

    try {
      setPlacingOrder(true);

      const response = await fetch(
        `${API_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName: form.name,
            address: form.address,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
            phone: form.phone,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Could not place order"
        );
      }

      // =========================
      // SAVE ORDER FOR SUCCESS PAGE
      // =========================

      const backendOrder =
        data.order;

      const orderForFrontend = {
        orderId:
          backendOrder?._id ||
          `SS${Date.now()}`,

        customer: form,

        items:
          backendOrder?.items || cart,

        total:
          Number(
            backendOrder?.totalAmount
          ) || subtotal,

        shipping,

        finalTotal:
          (Number(
            backendOrder?.totalAmount
          ) || subtotal) +
          shipping,

        date:
          backendOrder?.createdAt
            ? new Date(
                backendOrder.createdAt
              ).toLocaleDateString()
            : new Date().toLocaleDateString(),

        status:
          backendOrder?.status ||
          "confirmed",
      };

      // =========================
      // SAVE LATEST ORDER
      // =========================

      localStorage.setItem(
        "lastOrder",
        JSON.stringify(
          orderForFrontend
        )
      );

      // =========================
      // SAVE ORDER HISTORY LOCALLY
      // =========================

      const existingOrders =
        JSON.parse(
          localStorage.getItem("orders")
        ) || [];

      existingOrders.unshift(
        orderForFrontend
      );

      localStorage.setItem(
        "orders",
        JSON.stringify(
          existingOrders
        )
      );

      // =========================
      // CLEAR LOCAL CART
      // =========================

      localStorage.removeItem("cart");

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      // =========================
      // GO TO SUCCESS
      // =========================

      navigate("/order-success");
    } catch (err) {
      console.error(
        "Place order error:",
        err
      );

      setError(
        err.message ||
          (language === "Hindi"
            ? "ऑर्डर प्लेस नहीं हो पाया।"
            : "Could not place order.")
      );
    } finally {
      setPlacingOrder(false);
    }
  };

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

  if (cart.length === 0) {
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

  // =========================
  // MAIN CHECKOUT
  // =========================

  return (
    <main className="checkout-page">

      {/* =========================
          CHECKOUT HEADER
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
              ? "शिपिंग की जानकारी"
              : "Shipping Information"}
          </h2>

          <div className="checkout-fields">

            {/* FULL NAME */}

            <div className="form-group">
              <label>
                {language === "Hindi"
                  ? "पूरा नाम"
                  : "FULL NAME"}
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={
                  language === "Hindi"
                    ? "अपना पूरा नाम दर्ज करें"
                    : "Enter your full name"
                }
                required
              />
            </div>

            {/* EMAIL */}

            <div className="form-group">
              <label>
                {language === "Hindi"
                  ? "ईमेल पता"
                  : "EMAIL ADDRESS"}
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder={
                  language === "Hindi"
                    ? "अपना ईमेल दर्ज करें"
                    : "Enter your email"
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
                onChange={handleChange}
                placeholder={
                  language === "Hindi"
                    ? "अपना फोन नंबर दर्ज करें"
                    : "Enter your phone number"
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
                value={form.pincode}
                onChange={handleChange}
                placeholder={
                  language === "Hindi"
                    ? "पिनकोड दर्ज करें"
                    : "Enter pincode"
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
                  ? "पता"
                  : "ADDRESS"}
              </label>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder={
                  language === "Hindi"
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
                onChange={handleChange}
                placeholder={
                  language === "Hindi"
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
                onChange={handleChange}
                placeholder={
                  language === "Hindi"
                    ? "राज्य दर्ज करें"
                    : "Enter state"
                }
                required
              />
            </div>

          </div>

          {/* =========================
              PAYMENT
          ========================= */}

          <h2 className="payment-title">
            {language === "Hindi"
              ? "भुगतान का तरीका"
              : "Payment Method"}
          </h2>

          <div className="payment-option">

            <input
              type="radio"
              checked
              readOnly
            />

            <div>
              <strong>
                {language === "Hindi"
                  ? "कैश ऑन डिलीवरी"
                  : "Cash on Delivery"}
              </strong>

              <span>
                {language === "Hindi"
                  ? "ऑर्डर आने पर भुगतान करें"
                  : "Pay when your order arrives"}
              </span>
            </div>

          </div>

          {/* =========================
              PLACE ORDER
          ========================= */}

          <button
            className="place-order-btn"
            type="submit"
            disabled={placingOrder}
          >
            {placingOrder
              ? language === "Hindi"
                ? "ऑर्डर प्लेस हो रहा है..."
                : "PLACING ORDER..."
              : language === "Hindi"
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

          {cart.map((item) => {
            const productId =
              getProductId(item);

            return (
              <div
                className="checkout-product"
                key={productId}
              >

                <img
                  src={item.image}
                  alt={item.name}
                />

                <div>
                  <strong>
                    {item.name}
                  </strong>

                  <span>
                    {item.quantity} × ₹
                    {item.price}
                  </span>
                </div>

              </div>
            );
          })}

          <div className="summary-line"></div>

          {/* SUBTOTAL */}

          <div className="summary-row">
            <span>
              {language === "Hindi"
                ? "सबटोटल"
                : "Subtotal"}
            </span>

            <span>
              ₹{subtotal}
            </span>
          </div>

          {/* SHIPPING */}

          <div className="summary-row">
            <span>
              {language === "Hindi"
                ? "शिपिंग"
                : "Shipping"}
            </span>

            <span>
              {shipping === 0
                ? language === "Hindi"
                  ? "फ्री"
                  : "FREE"
                : `₹${shipping}`}
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
              ₹{total}
            </strong>
          </div>

        </aside>

      </div>
    </main>
  );
}

export default Checkout;