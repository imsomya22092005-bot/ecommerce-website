import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";

function Cart() {
  const { language } = useLanguage();
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
      <p className="section-label">
        {language === "Hindi"
          ? "SHOPSPHERE कार्ट"
          : "SHOPSPHERE CART"}
      </p>

      <h1>
        {language === "Hindi"
          ? "आपका कार्ट खाली है"
          : "Your Cart is Empty"}
      </h1>

      <p>
        {language === "Hindi"
          ? "ऐसा लगता है कि आपने अभी तक अपने कार्ट में कुछ नहीं जोड़ा है।"
          : "Looks like you haven't added anything to your cart yet."}
      </p>

      <Link to="/products" className="continue-shopping">
        {language === "Hindi"
          ? "शॉपिंग जारी रखें"
          : "CONTINUE SHOPPING"}
      </Link>
    </main>
  );
}

  return (
    <main className="cart-page">
      <div className="cart-header">
  <p className="section-label">
    {language === "Hindi"
      ? "SHOPSPHERE कार्ट"
      : "SHOPSPHERE CART"}
  </p>

  <h1>
    {language === "Hindi"
      ? "आपका शॉपिंग बैग"
      : "Your Shopping Bag"}
  </h1>
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
  {language === "Hindi" ? "हटाएं" : "REMOVE"}
</button>
              </div>
            </article>
          ))}
        </section>

        

         <aside className="cart-summary">
  <h2>
    {language === "Hindi"
      ? "ऑर्डर का सारांश"
      : "Order Summary"}
  </h2>

  <div className="summary-row">
    <span>
      {language === "Hindi"
        ? "सबटोटल"
        : "Subtotal"}
    </span>

    <span>₹{total}</span>
  </div>

  <div className="summary-row">
    <span>
      {language === "Hindi"
        ? "शिपिंग"
        : "Shipping"}
    </span>

    <span>
      {total >= 999
        ? language === "Hindi"
          ? "फ्री"
          : "FREE"
        : "₹99"}
    </span>
  </div>

  <div className="summary-line"></div>

  <div className="summary-total">
    <span>
      {language === "Hindi"
        ? "कुल"
        : "Total"}
    </span>

    <strong>
      ₹{total >= 999 ? total : total + 99}
    </strong>
  </div>

  <Link to="/checkout" className="checkout-btn">
    {language === "Hindi"
      ? "चेकआउट के लिए आगे बढ़ें"
      : "PROCEED TO CHECKOUT"}
  </Link>
</aside>
      </div>
    </main>
  );
}

export default Cart;