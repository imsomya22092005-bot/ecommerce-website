import { Link } from "react-router-dom";

function OrderSuccess() {
  const order =
    JSON.parse(localStorage.getItem("lastOrder"));

  return (
    <main className="order-success">
      <div className="success-icon">✓</div>

      <p className="section-label">
        ORDER CONFIRMED
      </p>

      <h1>Thank You For Your Order</h1>

      <p>
        Your order has been successfully placed.
        We'll keep you updated about your delivery.
      </p>

      {order && (
        <div className="order-details">
          <div>
            <span>ORDER ID</span>
            <strong>#{order.id}</strong>
          </div>

          <div>
            <span>ORDER DATE</span>
            <strong>{order.date}</strong>
          </div>

          <div>
            <span>TOTAL</span>
            <strong>₹{order.total}</strong>
          </div>
        </div>
      )}

      <div className="success-actions">
        <Link to="/products">
          CONTINUE SHOPPING
        </Link>

        <Link to="/">
          BACK TO HOME
        </Link>
      </div>
    </main>
  );
}

export default OrderSuccess;