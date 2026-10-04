import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";

function Checkout() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    const savedCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    setCart(savedCart);
  }, []);

  const getProductId = (item) => item._id || item.id;

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const order = {
    orderId: `SS${Date.now()}`,
    customer: form,
    items: cart,
    total: total,
    date: new Date().toLocaleDateString(),
    status: "Confirmed",
  };

  // Save latest order
  localStorage.setItem(
    "lastOrder",
    JSON.stringify(order)
  );

  // Save all orders
  const existingOrders =
    JSON.parse(localStorage.getItem("orders")) || [];

  existingOrders.unshift(order);

  localStorage.setItem(
    "orders",
    JSON.stringify(existingOrders)
  );

  // Empty cart
  localStorage.removeItem("cart");

  // Update navbar cart count
  window.dispatchEvent(new Event("cartUpdated"));

  // Go to success page
  navigate("/order-success");
};

  if (cart.length === 0) {
    return (
      <main className="empty-cart">
        <p className="section-label">
          {language === "Hindi" ? "चेकआउट" : "CHECKOUT"}
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
      </div>

      <div className="checkout-layout">
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
                required
              />
            </div>

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
                required
              />
            </div>

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
          </div>

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

          <button
            className="place-order-btn"
            type="submit"
          >
            {language === "Hindi"
              ? "ऑर्डर करें"
              : "PLACE ORDER"}
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>
            {language === "Hindi"
              ? "ऑर्डर का सारांश"
              : "Order Summary"}
          </h2>

          {cart.map((item) => {
            const productId = getProductId(item);

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
                  <strong>{item.name}</strong>

                  <span>
                    {item.quantity} × ₹{item.price}
                  </span>
                </div>
              </div>
            );
          })}

          <div className="summary-line"></div>

          <div className="summary-row">
            <span>
              {language === "Hindi"
                ? "सबटोटल"
                : "Subtotal"}
            </span>

            <span>₹{subtotal}</span>
          </div>

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

          <div className="summary-total">
            <span>
              {language === "Hindi"
                ? "कुल"
                : "Total"}
            </span>

            <strong>₹{total}</strong>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default Checkout;