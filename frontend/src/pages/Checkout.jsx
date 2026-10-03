import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Checkout() {
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
      id: Date.now(),
      customer: form,
      items: cart,
      total,
      date: new Date().toLocaleDateString(),
    };

    localStorage.setItem(
      "lastOrder",
      JSON.stringify(order)
    );

    localStorage.removeItem("cart");

    navigate("/order-success");
  };

  if (cart.length === 0) {
    return (
      <main className="empty-cart">
        <p className="section-label">CHECKOUT</p>

        <h1>Your Cart is Empty</h1>

        <p>Add some products before checking out.</p>

        <Link to="/products" className="continue-shopping">
          CONTINUE SHOPPING
        </Link>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-header">
        <p className="section-label">SHOPSPHERE CHECKOUT</p>

        <h1>Complete Your Order</h1>
      </div>

      <div className="checkout-layout">
        <form
          className="checkout-form"
          onSubmit={handleSubmit}
        >
          <h2>Shipping Information</h2>

          <div className="checkout-fields">
            <div className="form-group">
              <label>FULL NAME</label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label>EMAIL ADDRESS</label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>PHONE NUMBER</label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="form-group">
              <label>PINCODE</label>

              <input
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                placeholder="Enter pincode"
                required
              />
            </div>

            <div className="form-group full-width">
              <label>ADDRESS</label>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="House no., street, locality"
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label>CITY</label>

              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Enter city"
                required
              />
            </div>
          </div>

          <h2 className="payment-title">
            Payment Method
          </h2>

          <div className="payment-option">
            <input
              type="radio"
              checked
              readOnly
            />

            <div>
              <strong>Cash on Delivery</strong>
              <span>Pay when your order arrives</span>
            </div>
          </div>

          <button className="place-order-btn" type="submit">
            PLACE ORDER
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>Order Summary</h2>

          {cart.map((item) => (
            <div className="checkout-product" key={item.id}>
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
          ))}

          <div className="summary-line"></div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>
              {shipping === 0 ? "FREE" : `₹${shipping}`}
            </span>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <strong>₹{total}</strong>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default Checkout;