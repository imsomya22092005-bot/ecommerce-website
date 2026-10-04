import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";

function Cart() {
  const { language } = useLanguage();

  const [cart, setCart] = useState([]);

  // =========================
  // COUPON STATES
  // =========================

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  // =========================
  // AVAILABLE COUPONS
  // =========================

  const coupons = {
    SHOP10: {
      type: "percent",
      value: 10,
    },

    WELCOME15: {
      type: "percent",
      value: 15,
    },

    FLAT200: {
      type: "fixed",
      value: 200,
    },

    SAVE20: {
      type: "percent",
      value: 20,
    },
  };

  // =========================
  // LOAD CART
  // =========================

  useEffect(() => {
    const savedCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    setCart(savedCart);
  }, []);

  // =========================
  // PRODUCT ID
  // =========================

  const getProductId = (item) =>
    item._id || item.id;

  // =========================
  // UPDATE QUANTITY
  // =========================

  const updateQuantity = (id, change) => {
    const updatedCart = cart
      .map((item) =>
        getProductId(item) === id
          ? {
              ...item,
              quantity:
                Number(item.quantity) + change,
            }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };

  // =========================
  // REMOVE ITEM
  // =========================

  const removeItem = (id) => {
    const updatedCart = cart.filter(
      (item) => getProductId(item) !== id
    );

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };

  // =========================
  // SUBTOTAL
  // =========================

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price) *
        Number(item.quantity),
    0
  );

  // =========================
  // APPLY COUPON
  // =========================

  const handleApplyCoupon = () => {
    const code = couponCode
      .trim()
      .toUpperCase();

    setCouponError("");

    if (!code) {
      setCouponError(
        language === "Hindi"
          ? "कृपया कूपन कोड दर्ज करें।"
          : "Please enter a coupon code."
      );
      return;
    }

    const coupon = coupons[code];

    if (!coupon) {
      setAppliedCoupon(null);

      setCouponError(
        language === "Hindi"
          ? "अमान्य कूपन कोड।"
          : "Invalid coupon code."
      );

      return;
    }

    setAppliedCoupon({
      code,
      ...coupon,
    });

    setCouponCode("");
    setCouponError("");
  };

  // =========================
  // REMOVE COUPON
  // =========================

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  // =========================
  // DISCOUNT
  // =========================

  const discount = appliedCoupon
    ? appliedCoupon.type === "percent"
      ? Math.round(
          (total * appliedCoupon.value) / 100
        )
      : Math.min(
          appliedCoupon.value,
          total
        )
    : 0;

  // =========================
  // SHIPPING
  // =========================

  const shipping =
    total >= 999 ? 0 : 99;

  // =========================
  // FINAL TOTAL
  // =========================

  const finalTotal = Math.max(
    0,
    total - discount + shipping
  );

  // =========================
  // EMPTY CART
  // =========================

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
  // MAIN CART
  // =========================

  return (
    <main className="cart-page">

      {/* =========================
          CART HEADER
      ========================= */}

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

      {/* =========================
          CART LAYOUT
      ========================= */}

      <div className="cart-layout">

        {/* =========================
            CART ITEMS
        ========================= */}

        <section className="cart-items">

          {cart.map((item) => {

            const productId =
              getProductId(item);

            return (
              <article
                className="cart-item"
                key={productId}
              >

                <img
                  src={item.image}
                  alt={item.name}
                />

                <div className="cart-item-info">

                  <p className="product-category">
                    {item.category}
                  </p>

                  <h2>
                    {item.name}
                  </h2>

                  <p className="cart-price">
                    ₹{item.price}
                  </p>

                  {/* QUANTITY */}

                  <div className="quantity-controls">

                    <button
                      onClick={() =>
                        updateQuantity(
                          productId,
                          -1
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          productId,
                          1
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                  {/* REMOVE */}

                  <button
                    className="remove-item"
                    onClick={() =>
                      removeItem(productId)
                    }
                  >
                    {language === "Hindi"
                      ? "हटाएं"
                      : "REMOVE"}
                  </button>

                </div>

              </article>
            );
          })}

        </section>

        {/* =========================
            ORDER SUMMARY
        ========================= */}

        <aside className="cart-summary">

          <h2>
            {language === "Hindi"
              ? "ऑर्डर का सारांश"
              : "Order Summary"}
          </h2>

          {/* =========================
              COUPON
          ========================= */}

          <div className="coupon-box">

            <p className="coupon-label">
              {language === "Hindi"
                ? "कूपन कोड"
                : "COUPON CODE"}
            </p>

            <div className="coupon-input-row">

              <input
                type="text"
                value={couponCode}
                onChange={(e) =>
                  setCouponCode(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleApplyCoupon();
                  }
                }}
                placeholder={
                  language === "Hindi"
                    ? "कूपन कोड दर्ज करें"
                    : "Enter coupon code"
                }
              />

              <button
                type="button"
                onClick={
                  handleApplyCoupon
                }
              >
                {language === "Hindi"
                  ? "लागू करें"
                  : "APPLY"}
              </button>

            </div>

            {/* COUPON ERROR */}

            {couponError && (
              <p className="coupon-error">
                {couponError}
              </p>
            )}

            {/* APPLIED COUPON */}

            {appliedCoupon && (
              <div className="applied-coupon">

                <div>
                  <span>
                    {language === "Hindi"
                      ? "लागू:"
                      : "Applied:"}
                  </span>

                  <strong>
                    {appliedCoupon.code}
                  </strong>
                </div>

                <button
                  type="button"
                  onClick={
                    removeCoupon
                  }
                >
                  ×
                </button>

              </div>
            )}

            {/* AVAILABLE COUPONS */}

            {!appliedCoupon && (
              <p className="coupon-hint">
                {language === "Hindi"
                  ? "ट्राई करें: SHOP10 · WELCOME15 · FLAT200 · SAVE20"
                  : "Try: SHOP10 · WELCOME15 · FLAT200 · SAVE20"}
              </p>
            )}

          </div>

          {/* =========================
              SUBTOTAL
          ========================= */}

          <div className="summary-row">

            <span>
              {language === "Hindi"
                ? "सबटोटल"
                : "Subtotal"}
            </span>

            <span>
              ₹{total}
            </span>

          </div>

          {/* =========================
              DISCOUNT
          ========================= */}

          {discount > 0 && (
            <div className="summary-row coupon-discount">

              <span>
                {language === "Hindi"
                  ? `कूपन छूट (${appliedCoupon.code})`
                  : `Coupon Discount (${appliedCoupon.code})`}
              </span>

              <span>
                -₹{discount}
              </span>

            </div>
          )}

          {/* =========================
              SHIPPING
          ========================= */}

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

          <div className="summary-line"></div>

          {/* =========================
              FINAL TOTAL
          ========================= */}

          <div className="summary-total">

            <span>
              {language === "Hindi"
                ? "कुल"
                : "Total"}
            </span>

            <strong>
              ₹{finalTotal}
            </strong>

          </div>

          {/* =========================
              CHECKOUT
          ========================= */}

          <Link
            to="/checkout"
            className="checkout-btn"
          >
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