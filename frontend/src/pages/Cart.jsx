import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const updateQuantity = (id, change) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + change }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <main className="empty-cart">
        <p className="section-label">SHOPSPHERE CART</p>

        <h1>Your Cart is Empty</h1>

        <p>
          Looks like you haven't added anything to your cart yet.
        </p>

        <Link to="/products" className="continue-shopping">
          CONTINUE SHOPPING
        </Link>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-header">
        <p className="section-label">SHOPSPHERE CART</p>
        <h1>Your Shopping Bag</h1>
      </div>

      <div className="cart-layout">
        <section className="cart-items">
          {cart.map((item) => (
            <article className="cart-item" key={item.id}>
              <img
                src={item.image}
                alt={item.name}
              />

              <div className="cart-item-info">
                <p className="product-category">
                  {item.category}
                </p>

                <h2>{item.name}</h2>

                <p className="cart-price">
                  ₹{item.price}
                </p>

                <div className="quantity-controls">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  className="remove-item"
                  onClick={() => removeItem(item.id)}
                >
                  REMOVE
                </button>
              </div>
            </article>
          ))}
        </section>

        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{total}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>{total >= 999 ? "FREE" : "₹99"}</span>
          </div>

          <div className="summary-line"></div>

          <div className="summary-total">
            <span>Total</span>
            <strong>
              ₹{total >= 999 ? total : total + 99}
            </strong>
          </div>

         <Link to="/checkout" className="checkout-btn">
  PROCEED TO CHECKOUT
</Link>
        </aside>
      </div>
    </main>
  );
}

export default Cart;