import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";

import API_URL from "../api";

function Cart() {
  const { language } = useLanguage();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartError, setCartError] = useState("");

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
  // GET TOKEN
  // =========================

  const getToken = () =>
    localStorage.getItem("authToken");

  // =========================
  // PRODUCT ID
  // =========================

  const getProductId = (item) =>
    item?._id || item?.id || item?.product?._id || item?.product?.id;

  // =========================
  // SAVE CART LOCALLY
  // =========================

  const saveLocalCart = (updatedCart) => {
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
  // NORMALIZE BACKEND CART
  // =========================

  const normalizeBackendCart = (backendCart) => {
    const items = backendCart?.items || [];

    return items
      .filter((item) => item?.product)
      .map((item) => {
        const product = item.product;

        return {
          _id: product._id,
          id: product._id,
          name: product.name || "",
          price: Number(product.price) || 0,
          image:
            product.image ||
            product.imageUrl ||
            "",
          category: product.category || "",
          quantity: Number(item.quantity) || 1,
        };
      });
  };

  // =========================
  // LOAD BACKEND CART
  // =========================

  const loadBackendCart = async () => {
    const token = getToken();

    if (!token) {
      const savedCart =
        JSON.parse(
          localStorage.getItem("cart")
        ) || [];

      setCart(savedCart);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setCartError("");

      const response = await fetch(
        `${API_URL}/api/cart`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load cart"
        );
      }

      const backendCart =
        await response.json();

      const backendItems =
        normalizeBackendCart(
          backendCart
        );

      /*
        If the user already had a local cart
        before backend integration and backend
        cart is empty, move those items to backend.
      */

      const savedCart =
        JSON.parse(
          localStorage.getItem("cart")
        ) || [];

      if (
        backendItems.length === 0 &&
        savedCart.length > 0
      ) {
        await syncLocalCartToBackend(
          savedCart,
          token
        );
        return;
      }

      setCart(backendItems);

      localStorage.setItem(
        "cart",
        JSON.stringify(backendItems)
      );

      window.dispatchEvent(
        new Event("cartUpdated")
      );
    } catch (error) {
      console.error(
        "Cart loading error:",
        error
      );

      /*
        Fallback to local cart if backend
        is unavailable.
      */

      const savedCart =
        JSON.parse(
          localStorage.getItem("cart")
        ) || [];

      setCart(savedCart);

      setCartError(
        language === "Hindi"
          ? "कार्ट सर्वर से लोड नहीं हो पाया।"
          : "Could not load cart from server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SYNC LOCAL CART TO BACKEND
  // =========================

  const syncLocalCartToBackend = async (
    localCart,
    token
  ) => {
    try {
      for (const item of localCart) {
        const productId =
          getProductId(item);

        if (!productId) continue;

        const quantity =
          Number(item.quantity) || 1;

        const response = await fetch(
          `${API_URL}/api/cart/add`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              productId,
              quantity,
            }),
          }
        );

        if (!response.ok) {
          console.error(
            `Could not sync product ${productId}`
          );
        }
      }

      // Reload final backend cart
      await loadBackendCartAfterSync(token);
    } catch (error) {
      console.error(
        "Cart sync error:",
        error
      );

      setCart(localCart);
      setLoading(false);
    }
  };

  // =========================
  // RELOAD AFTER SYNC
  // =========================

  const loadBackendCartAfterSync = async (
    token
  ) => {
    const response = await fetch(
      `${API_URL}/api/cart`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to reload cart"
      );
    }

    const backendCart =
      await response.json();

    const backendItems =
      normalizeBackendCart(
        backendCart
      );

    setCart(backendItems);

    localStorage.setItem(
      "cart",
      JSON.stringify(backendItems)
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    setLoading(false);
  };

  // =========================
  // LOAD CART ON PAGE OPEN
  // =========================

  useEffect(() => {
    loadBackendCart();
  }, []);

  // =========================
  // UPDATE BACKEND CART
  // =========================

  const updateBackendCart = async (
    productId,
    quantity
  ) => {
    const token = getToken();

    if (!token) return false;

    try {
      const response = await fetch(
        `${API_URL}/api/cart/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId,
            quantity,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Could not update cart"
        );
      }

      const updatedCart =
        normalizeBackendCart(
          data.cart
        );

      saveLocalCart(updatedCart);

      return true;
    } catch (error) {
      console.error(
        "Update cart error:",
        error
      );

      setCartError(
        error.message ||
          (language === "Hindi"
            ? "कार्ट अपडेट नहीं हो पाया।"
            : "Could not update cart.")
      );

      return false;
    }
  };

  // =========================
  // UPDATE QUANTITY
  // =========================

  const updateQuantity = async (
    id,
    change
  ) => {
    const currentItem =
      cart.find(
        (item) =>
          getProductId(item) === id
      );

    if (!currentItem) return;

    const newQuantity =
      Number(currentItem.quantity) +
      change;

    setCartError("");

    // Remove when quantity becomes 0
    if (newQuantity <= 0) {
      await removeItem(id);
      return;
    }

    // Logged-in user → backend
    if (getToken()) {
      const success =
        await updateBackendCart(
          id,
          newQuantity
        );

      if (success) {
        return;
      }

      return;
    }

    // Guest user → localStorage
    const updatedCart = cart.map(
      (item) =>
        getProductId(item) === id
          ? {
              ...item,
              quantity: newQuantity,
            }
          : item
    );

    saveLocalCart(updatedCart);
  };

  // =========================
  // REMOVE FROM BACKEND
  // =========================

  const removeBackendItem = async (
    productId
  ) => {
    const token = getToken();

    if (!token) return false;

    try {
      const response = await fetch(
        `${API_URL}/api/cart/remove/${productId}`,
        {
          method: "DELETE",
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
            "Could not remove item"
        );
      }

      const updatedCart =
        normalizeBackendCart(
          data.cart
        );

      saveLocalCart(updatedCart);

      return true;
    } catch (error) {
      console.error(
        "Remove cart item error:",
        error
      );

      setCartError(
        error.message ||
          (language === "Hindi"
            ? "आइटम हटाया नहीं जा सका।"
            : "Could not remove item.")
      );

      return false;
    }
  };

  // =========================
  // REMOVE ITEM
  // =========================

  const removeItem = async (id) => {
    setCartError("");

    // Logged-in user → backend
    if (getToken()) {
      await removeBackendItem(id);
      return;
    }

    // Guest user → localStorage
    const updatedCart = cart.filter(
      (item) =>
        getProductId(item) !== id
    );

    saveLocalCart(updatedCart);
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
          (total *
            appliedCoupon.value) /
            100
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
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="empty-cart">
        <p className="section-label">
          {language === "Hindi"
            ? "SHOPSPHERE कार्ट"
            : "SHOPSPHERE CART"}
        </p>

        <h1>
          {language === "Hindi"
            ? "कार्ट लोड हो रहा है..."
            : "Loading Cart..."}
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

      {/* CART HEADER */}

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

        {cartError && (
          <p className="coupon-error">
            {cartError}
          </p>
        )}
      </div>

      {/* CART LAYOUT */}

      <div className="cart-layout">

        {/* CART ITEMS */}

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
                      type="button"
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
                      type="button"
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
                    type="button"
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

        {/* ORDER SUMMARY */}

        <aside className="cart-summary">

          <h2>
            {language === "Hindi"
              ? "ऑर्डर का सारांश"
              : "Order Summary"}
          </h2>

          {/* COUPON */}

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

          {/* SUBTOTAL */}

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

          {/* DISCOUNT */}

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

          <div className="summary-line"></div>

          {/* FINAL TOTAL */}

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

          {/* CHECKOUT */}

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