import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  UserRound,
  ShoppingCart,
  Heart,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { useLanguage } from "../LanguageContext";
import { useTheme } from "../ThemeContext";
import API_URL from "../api";
import CategoryBar from "./CategoryBar";

/* =========================================================
   TRANSLATIONS
========================================================= */

const translations = {
  English: {
    home: "Home",
    shop: "Shop",
    newArrivals: "New Arrivals",
    bestSellers: "Best Sellers",
    collections: "Collections",
    about: "About Us",
    journal: "Journal",

    search:
      "Search for Products, Brands and More",

    searchButton: "Search",

    login: "Login",
    logout: "Logout",
    hello: "Hello",

    more: "More",

    contact: "Contact Us",
    help: "Help & Support",
    orders: "My Orders",
    trackOrder: "Track Order",
    profile: "My Profile",
    wishlist: "Wishlist",

    adminDashboard:
      "Admin Dashboard",

    cart: "Cart",

    premium:
      "✨ Premium Shopping",

    menu: "Toggle menu",
    close: "Close",
  },

  Hindi: {
    home: "होम",
    shop: "शॉप",

    newArrivals:
      "नए प्रोडक्ट्स",

    bestSellers:
      "बेस्ट सेलर्स",

    collections:
      "कलेक्शन्स",

    about: "हमारे बारे में",
    journal: "जर्नल",

    search:
      "प्रोडक्ट, ब्रांड और बहुत कुछ खोजें",

    searchButton: "खोजें",

    login: "लॉगिन",
    logout: "लॉगआउट",
    hello: "नमस्ते",

    more: "और",

    contact: "संपर्क करें",

    help: "मदद और सहायता",

    orders: "मेरे ऑर्डर्स",

    trackOrder:
      "ऑर्डर ट्रैक करें",

    profile: "मेरी प्रोफाइल",
    wishlist: "मेरी विशलिस्ट",

    adminDashboard:
      "एडमिन डैशबोर्ड",

    cart: "कार्ट",

    premium:
      "✨ प्रीमियम शॉपिंग",

    menu: "मेन्यू खोलें",
    close: "बंद करें",
  },
};

/* =========================================================
   NAVBAR
========================================================= */

function Navbar() {
  const {
    language,
    setLanguage,
  } = useLanguage();

  const t =
    translations[language];

  const { theme, toggleTheme } = useTheme();

  const navigate =
    useNavigate();

  /* =======================================================
     STATES
  ======================================================= */

  const [cartCount, setCartCount] =
    useState(0);

  const [userName, setUserName] =
    useState(
      localStorage.getItem(
        "userName"
      )
    );

  const [userRole, setUserRole] =
    useState(
      localStorage.getItem(
        "userRole"
      )
    );

  const [search, setSearch] =
    useState("");

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [moreOpen, setMoreOpen] =
    useState(false);

  const [deliveryAddress, setDeliveryAddress] =
    useState(() => {
      try {
        return JSON.parse(
          localStorage.getItem("shopSphereDeliveryAddress") || "null"
        );
      } catch {
        return null;
      }
    });

  /* =======================================================
     LOAD CART COUNT
  ======================================================= */

  const loadCartCount =
    async () => {
      const token =
        localStorage.getItem(
          "authToken"
        );

      if (!token) {
        setCartCount(0);
        return;
      }

      try {
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

        if (!response.ok) {
          setCartCount(0);
          return;
        }

        const data =
          await response.json();

        const items =
          Array.isArray(
            data?.cart?.items
          )
            ? data.cart.items
            : [];

/*
 * Count only cart lines that have a populated product.
 * This keeps the navbar badge from showing a ghost count
 * when the backend cart contains an unusable/stale item.
 */
        const validItems =
          items.filter(
            (item) =>
              item?.product?._id ||
              item?.product?.id
          );

        const count =
          validItems.reduce(
            (total, item) =>
              total +
              Number(
                item.quantity || 0
              ),
            0
          );

        setCartCount(count);
      } catch (error) {
        console.error(
          "Cart count error:",
          error
        );

        setCartCount(0);
      }
    };

  /* =======================================================
     CART UPDATE LISTENER
  ======================================================= */

  useEffect(() => {
    loadCartCount();

    const updateCart = () => {
      loadCartCount();
    };

    window.addEventListener(
      "cartUpdated",
      updateCart
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        updateCart
      );
    };
  }, [userName]);

  /* =======================================================
     USER UPDATE LISTENER
  ======================================================= */

  useEffect(() => {
    const updateUser = () => {
      setUserName(
        localStorage.getItem(
          "userName"
        )
      );

      setUserRole(
        localStorage.getItem(
          "userRole"
        )
      );
    };

    updateUser();

    window.addEventListener(
      "userUpdated",
      updateUser
    );

    return () => {
      window.removeEventListener(
        "userUpdated",
        updateUser
      );
    };
  }, []);

  /* =======================================================
     DELIVERY LOCATION
  ======================================================= */

  const loadDeliveryAddress = async () => {
    if (!userName) {
      setDeliveryAddress(null);
      return;
    }

    try {
      const saved = localStorage.getItem(
        "shopSphereDeliveryAddress"
      );

      if (saved) {
        setDeliveryAddress(JSON.parse(saved));
      }
    } catch {
      setDeliveryAddress(null);
    }

    const token = localStorage.getItem("authToken");

    if (!token) return;

    try {
      const response = await fetch(
        API_URL + "/api/orders",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (!response.ok) return;

      const data = await response.json();
      const orders = Array.isArray(data?.orders)
        ? data.orders
        : [];

      if (!orders.length) return;

      const latestOrder = [...orders].sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )[0];

      const address = latestOrder?.shippingAddress;

      if (address) {
        setDeliveryAddress(address);
        localStorage.setItem(
          "shopSphereDeliveryAddress",
          JSON.stringify(address)
        );
      }
    } catch (error) {
      console.error(
        "Delivery address loading error:",
        error
      );
    }
  };

  useEffect(() => {
    loadDeliveryAddress();

    const updateDelivery = () => {
      loadDeliveryAddress();
    };

    window.addEventListener(
      "deliveryUpdated",
      updateDelivery
    );

    return () => {
      window.removeEventListener(
        "deliveryUpdated",
        updateDelivery
      );
    };
  }, [userName]);

  /* =======================================================
     SEARCH
  ======================================================= */

  const handleSearch = (e) => {
    e.preventDefault();

    const value =
      search.trim();

    if (!value) {
      return;
    }

    navigate(
      `/products?search=${encodeURIComponent(
        value
      )}`
    );

    setSearch("");
    setMenuOpen(false);
    setMoreOpen(false);
  };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {
    localStorage.removeItem(
      "userName"
    );

    localStorage.removeItem(
      "userEmail"
    );

    localStorage.removeItem(
      "authToken"
    );

    localStorage.removeItem(
      "userRole"
    );

    localStorage.removeItem(
      "shopSphereDeliveryAddress"
    );

    setUserName(null);
    setUserRole(null);
    setCartCount(0);

    window.dispatchEvent(
      new Event("userUpdated")
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    setMenuOpen(false);
    setMoreOpen(false);

    navigate("/");
  };

  /* =======================================================
     CLOSE MENU
  ======================================================= */

  const closeMenu = () => {
    setMenuOpen(false);
  };

  /* =======================================================
     MORE
  ======================================================= */

  const handleMoreToggle =
    () => {
      setMoreOpen(
        (prev) => !prev
      );
    };

  const closeMore = () => {
    setMoreOpen(false);
  };

  /* =======================================================
     ADMIN
  ======================================================= */

  const isAdmin =
    userRole === "admin";

  /* =======================================================
     UI
  ======================================================= */

  return (
    <header className="shop-navbar">

      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <div className="shop-topbar">

        <div className="shop-topbar-left">

          <Link
            to="/"
            className="top-active"
          >
            ShopSphere
          </Link>

          <Link to="/products">
            {t.shop}
          </Link>

          <Link to="/new-arrivals">
            {t.newArrivals}
          </Link>

          <Link to="/about">
            {t.about}
          </Link>

          <Link to="/journal">
            {t.journal}
          </Link>

        </div>

        <div className="shop-topbar-right">

          <span>
            {t.premium}
          </span>

          <select
            className="language-select"
            aria-label={language === "Hindi" ? "भाषा चुनें" : "Choose language"}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="English">English</option>
            <option value="Hindi">हिंदी</option>
          </select>

          <button
            type="button"
            className={"theme-switch " + (theme === "dark" ? "is-dark" : "")}
            onClick={toggleTheme}
            role="switch"
            aria-checked={theme === "dark"}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            <span className="theme-switch-thumb">
              {theme === "dark"
                ? <Moon size={14} strokeWidth={2} />
                : <Sun size={14} strokeWidth={2} />}
            </span>
          </button>

        </div>

      </div>

      {/* =====================================================
          MAIN BAR
      ===================================================== */}

      <div className="shop-mainbar">

        {/* LOGO */}

        <Link
          to="/"
          className="shop-logo"
          onClick={closeMenu}
        >
          SHOPSPHERE
        </Link>

        {userName && deliveryAddress && (
          <div
            className="shop-delivery-location"
            title={
              deliveryAddress.address
                ? deliveryAddress.address
                : "Delivery address"
            }
            style={{
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minWidth: "135px",
              maxWidth: "190px",
              lineHeight: 1.15,
              marginLeft: "-12px",
              marginRight: "-10px",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                color: "#77716c",
                whiteSpace: "nowrap",
              }}
            >
              {language === "Hindi"
                ? "डिलीवर करें: " + userName
                : "Deliver to " + userName}
            </span>

            <strong
              style={{
                marginTop: "3px",
                fontSize: "11px",
                color: "#211e1b",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {deliveryAddress.city || "—"}
              {deliveryAddress.pincode
                ? " " + deliveryAddress.pincode
                : ""}
            </strong>
          </div>
        )}

        {/* SEARCH */}

        <form
          className="shop-search"
          onSubmit={
            handleSearch
          }
        >
          <span className="search-symbol">
            ⌕
          </span>

          <input
            type="text"
            placeholder={t.search}
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

          <button type="submit">
            {t.searchButton}
          </button>
        </form>

        {/* ACTIONS */}

        <div className="shop-actions">

          {/* =================================================
              ACCOUNT
          ================================================= */}

          {userName ? (
            <Link
              to="/profile"
              className="shop-account"
              aria-label={t.profile}
              title={t.profile}
            >
              <span className="account-icon">
                <UserRound
                  size={20}
                  strokeWidth={1.6}
                />
              </span>

              <span className="account-text">
                {t.hello},{" "}
                {userName}
              </span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="shop-account"
            >
              <span className="account-icon">
                <UserRound
                  size={20}
                  strokeWidth={1.6}
                />
              </span>

              <span className="account-text">
                {t.login}
              </span>
            </Link>
          )}

          {/* =================================================
              MORE
          ================================================= */}

          <div className="more-wrapper">

            <button
              className="more-button"
              onClick={
                handleMoreToggle
              }
              type="button"
            >
              {t.more} ▾
            </button>

            {moreOpen && (
              <div className="more-dropdown">

                <button
                  className="dropdown-close"
                  onClick={
                    closeMore
                  }
                  aria-label={
                    t.close
                  }
                  title={t.close}
                  type="button"
                >
                  ×
                </button>

                <Link
                  to="/contact"
                  onClick={
                    closeMore
                  }
                >
                  📞 {t.contact}
                </Link>

                <Link
                  to="/help"
                  onClick={
                    closeMore
                  }
                >
                  ❓ {t.help}
                </Link>

                <Link
                  to="/orders"
                  onClick={
                    closeMore
                  }
                >
                  📋 {t.orders}
                </Link>

                <Link
                  to="/track-order"
                  onClick={
                    closeMore
                  }
                >
                  🚚 {t.trackOrder}
                </Link>

                <Link
                  to="/profile"
                  onClick={
                    closeMore
                  }
                >
                  👤 {t.profile}
                </Link>

                <Link
                  to="/wishlist"
                  onClick={closeMore}
                  className="wishlist-nav-link"
                >
                  <Heart
                    size={15}
                    strokeWidth={1.8}
                  />
                  {t.wishlist}
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={
                      closeMore
                    }
                    className="admin-nav-link"
                  >
                    <LayoutDashboard
                      size={15}
                      strokeWidth={1.8}
                    />

                    {t.adminDashboard}
                  </Link>
                )}

              </div>
            )}

          </div>

          {/* =================================================
              CART
          ================================================= */}

          <Link
            to="/cart"
            className="shop-cart"
            aria-label={t.cart}
            title={t.cart}
          >

            <ShoppingCart
              size={21}
              strokeWidth={1.7}
            />

            {cartCount > 0 && (
              <span className="shop-cart-count">
                {cartCount}
              </span>
            )}

            <span className="cart-text">
              {t.cart}
            </span>

          </Link>

          {/* =================================================
              HAMBURGER
          ================================================= */}

          <button
            className={`shop-hamburger ${
              menuOpen
                ? "active"
                : ""
            }`}
            onClick={() =>
              setMenuOpen(
                (prev) =>
                  !prev
              )
            }
            aria-label={t.menu}
            title={t.menu}
            type="button"
          >

            {menuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}

          </button>

        </div>

      </div>

      {/* =====================================================
          CATEGORY BAR
      ===================================================== */}

      <CategoryBar />

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      {menuOpen && (
        <div className="shop-mobile-menu">

          <Link
            to="/home"
            onClick={closeMenu}
          >
            {t.home}
          </Link>

          <Link
            to="/products"
            onClick={closeMenu}
          >
            {t.shop}
          </Link>

          <Link
            to="/new-arrivals"
            onClick={closeMenu}
          >
            {t.newArrivals}
          </Link>

          <Link
            to="/products?sort=price_desc"
            onClick={closeMenu}
          >
            {t.bestSellers}
          </Link>

          <Link
            to="/products"
            onClick={closeMenu}
          >
            {t.collections}
          </Link>

          <Link
            to="/cart"
            onClick={closeMenu}
          >
            🛒 {t.cart}
          </Link>

          <Link
            to="/about"
            onClick={closeMenu}
          >
            {t.about}
          </Link>

          <Link
            to="/contact"
            onClick={closeMenu}
          >
            📞 {t.contact}
          </Link>

          <Link
            to="/help"
            onClick={closeMenu}
          >
            ❓ {t.help}
          </Link>

          <Link
            to="/orders"
            onClick={closeMenu}
          >
            📋 {t.orders}
          </Link>

          <Link
            to="/track-order"
            onClick={closeMenu}
          >
            🚚 {t.trackOrder}
          </Link>

          <Link
            to="/profile"
            onClick={closeMenu}
          >
            👤 {t.profile}
          </Link>

          <Link
            to="/wishlist"
            onClick={closeMenu}
          >
            ♡ {t.wishlist}
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              onClick={closeMenu}
              className="admin-mobile-link"
            >
              <LayoutDashboard
                size={16}
                strokeWidth={1.8}
              />

              {t.adminDashboard}
            </Link>
          )}

          {!userName && (
            <Link
              to="/login"
              onClick={closeMenu}
            >
              👤 {t.login}
            </Link>
          )}

          {userName && (
            <button
              className="mobile-logout-shop"
              onClick={
                handleLogout
              }
              type="button"
            >
              {t.logout}
            </button>
          )}

        </div>
      )}

    </header>
  );
}

export default Navbar;