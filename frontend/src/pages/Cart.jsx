import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";
import API_URL from "../api";

function Cart() {
  const { language } = useLanguage();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartError, setCartError] = useState("");
  const [actionLoading, setActionLoading] =
    useState(false);

  // =========================
  // GET TOKEN
  // =========================

  const getToken = () =>
    localStorage.getItem("authToken");

  // =========================
  // PRODUCT ID
  // =========================

  const getProductId = (item) =>
    item?._id ||
    item?.id ||
    item?.product?._id ||
    item?.product?.id;

  // =========================
  // NORMALIZE BACKEND CART
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
      .map((item) => {
        const product =
          item.product;

        const productId =
          product._id ||
          product.id;

        return {
          _id: productId,
          id: productId,

          name:
            product.name || "Product",

          price:
            Number(product.price) || 0,

          image:
            product.image ||
            product.imageUrl ||
            "",

          category:
            product.category || "",

          stock:
            Number(product.stock) || 0,

          quantity:
            Number(item.quantity) || 1,
        };
      });
  };

  // =========================
  // SAVE CART CACHE
  // =========================

  const saveCart = (updatedCart) => {
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
  // LOAD CART
  // =========================

  const loadCart = async () => {
    const token = getToken();

    // Backend cart requires login
    if (!token) {
      setCart([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setCartError("");

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
            (language === "Hindi"
              ? "कार्ट लोड नहीं हो पाया।"
              : "Could not load cart.")
        );
      }

      const backendItems =
        normalizeBackendCart(data);

      saveCart(backendItems);
    } catch (error) {
      console.error(
        "Cart loading error:",
        error
      );

      setCart([]);

      setCartError(
        error.message ||
          (language === "Hindi"
            ? "कार्ट लोड नहीं हो पाया।"
            : "Could not load cart.")
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD ON OPEN
  // =========================

  useEffect(() => {
    loadCart();
  }, [language]);

  // =========================
  // UPDATE QUANTITY
  // =========================

  const updateQuantity = async (
    productId,
    newQuantity
  ) => {
    const token = getToken();

    if (!token) {
      return;
    }

    // Remove item when quantity becomes 0
    if (newQuantity <= 0) {
      await removeItem(productId);
      return;
    }

    try {
      setActionLoading(true);
      setCartError("");

      const response =
        await fetch(
          `${API_URL}/api/cart/update`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              productId,
              quantity:
                newQuantity,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (language === "Hindi"
              ? "कार्ट अपडेट नहीं हो पाया।"
              : "Could not update cart.")
        );
      }

      const updatedCart =
        normalizeBackendCart(
          data.cart
        );

      saveCart(updatedCart);
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
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // REMOVE ITEM
  // =========================

  const removeItem = async (
    productId
  ) => {
    const token = getToken();

    if (!token) {
      return;
    }

    try {
      setActionLoading(true);
      setCartError("");

      const response =
        await fetch(
          `${API_URL}/api/cart/remove/${productId}`,
          {
            method: "DELETE",

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
            (language === "Hindi"
              ? "Product हटाया नहीं जा सका।"
              : "Could not remove product.")
        );
      }

      const updatedCart =
        normalizeBackendCart(
          data.cart
        );

      saveCart(updatedCart);
    } catch (error) {
      console.error(
        "Remove cart item error:",
        error
      );

      setCartError(
        error.message ||
          (language === "Hindi"
            ? "Product हटाया नहीं जा सका।"
            : "Could not remove product.")
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // CLEAR CART
  // =========================

  const clearCart = async () => {
    const token = getToken();

    if (!token || cart.length === 0) {
      return;
    }

    try {
      setActionLoading(true);
      setCartError("");

      const response =
        await fetch(
          `${API_URL}/api/cart/clear`,
          {
            method: "DELETE",

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
            (language === "Hindi"
              ? "कार्ट clear नहीं हो पाया।"
              : "Could not clear cart.")
        );
      }

      saveCart([]);
    } catch (error) {
      console.error(
        "Clear cart error:",
        error
      );

      setCartError(
        error.message ||
          (language === "Hindi"
            ? "कार्ट clear नहीं हो पाया।"
            : "Could not clear cart.")
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // TOTAL
  // =========================

  const total = cart.reduce(
    (sum, item) =>
      sum +
      (Number(item.price) || 0) *
        (Number(item.quantity) || 0),
    0
  );

  // =========================
  // NOT LOGGED IN
  // =========================

  if (!getToken()) {
    return (
      <main className="empty-cart">

        <p className="section-label">
          {language === "Hindi"
            ? "SHOPSPHERE कार्ट"
            : "SHOPSPHERE CART"}
        </p>

        <h1>
          {language === "Hindi"
            ? "कृपया लॉगिन करें"
            : "Please Login"}
        </h1>

        <p>
          {language === "Hindi"
            ? "अपने cart को देखने और manage करने के लिए पहले login करें।"
            : "Please login to view and manage your cart."}
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
            ? "अभी आपके cart में कोई product नहीं है।"
            : "There are no products in your cart right now."}
        </p>

        {cartError && (
          <p className="coupon-error">
            {cartError}
          </p>
        )}

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
  // CART PAGE
  // =========================

  return (
    <main className="cart-page">

      {/* =========================
          HEADER
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

        {cartError && (
          <p className="coupon-error">
            {cartError}
          </p>
        )}

      </div>

      {/* =========================
          LAYOUT
      ========================= */}

      <div className="cart-layout">

        {/* =========================
            ITEMS
        ========================= */}

        <section className="cart-items">

          {cart.map((item) => {
            const productId =
              getProductId(item);

            const quantity =
              Number(item.quantity) || 1;

            const stock =
              Number(item.stock) || 0;

            return (
              <article
                className="cart-item"
                key={productId}
              >

                {/* IMAGE */}

                <img
                  src={item.image}
                  alt={item.name}
                />

                {/* INFO */}

                <div className="cart-item-info">

                  <p className="product-category">
                    {item.category}
                  </p>

                  <h2>
                    {item.name}
                  </h2>

                  <p className="cart-price">
                    ₹
                    {(
                      Number(
                        item.price
                      ) || 0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </p>

                  {/* QUANTITY */}

                  <div className="quantity-controls">

                    <button
                      type="button"
                      disabled={
                        actionLoading
                      }
                      onClick={() =>
                        updateQuantity(
                          productId,
                          quantity - 1
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {quantity}
                    </span>

                    <button
                      type="button"
                      disabled={
                        actionLoading ||
                        (stock > 0 &&
                          quantity >=
                            stock)
                      }
                      onClick={() =>
                        updateQuantity(
                          productId,
                          quantity + 1
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                  {/* STOCK */}

                  {stock > 0 && (
                    <small
                      style={{
                        display:
                          "block",
                        marginTop:
                          "8px",
                        color:
                          "#8a6245",
                        fontSize:
                          "11px",
                      }}
                    >
                      {language ===
                      "Hindi"
                        ? `${stock} उपलब्ध`
                        : `${stock} in stock`}
                    </small>
                  )}

                  {/* REMOVE */}

                  <button
                    type="button"
                    className="remove-item"
                    disabled={
                      actionLoading
                    }
                    onClick={() =>
                      removeItem(
                        productId
                      )
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
            SUMMARY
        ========================= */}

        <aside className="cart-summary">

          <h2>
            {language === "Hindi"
              ? "ऑर्डर का सारांश"
              : "Order Summary"}
          </h2>

          {/* ITEM COUNT */}

          <div className="summary-row">

            <span>
              {language === "Hindi"
                ? "आइटम्स"
                : "Items"}
            </span>

            <span>
              {cart.reduce(
                (sum, item) =>
                  sum +
                  (Number(
                    item.quantity
                  ) || 0),
                0
              )}
            </span>

          </div>

          {/* TOTAL */}

          <div className="summary-line"></div>

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

          {/* CLEAR CART */}

          <button
            type="button"
            className="remove-item"
            style={{
              marginBottom:
                "14px",
            }}
            disabled={
              actionLoading
            }
            onClick={clearCart}
          >
            {language === "Hindi"
              ? "पूरा कार्ट खाली करें"
              : "CLEAR CART"}
          </button>

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