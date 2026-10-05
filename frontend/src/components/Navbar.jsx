import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  House,
  Shirt,
  Watch,
  Footprints,
  Sparkles,
  Star,
  Heart,
  Info,
  LayoutDashboard,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { useLanguage } from "../LanguageContext";
import API_URL from "../api";

/* =========================================================
   TRANSLATIONS
========================================================= */

const translations = {
  English: {
    home: "Home",
    shop: "Shop",
    fashion: "Fashion",
    accessories: "Accessories",
    footwear: "Footwear",
    newArrivals: "New Arrivals",
    bestSellers: "Best Sellers",
    collections: "Collections",
    about: "About Us",

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
    fashion: "फैशन",
    accessories: "एक्सेसरीज़",
    footwear: "फुटवियर",
    newArrivals:
      "नए प्रोडक्ट्स",
    bestSellers:
      "बेस्ट सेलर्स",
    collections: "कलेक्शंस",
    about: "हमारे बारे में",

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

  const navigate =
    useNavigate();

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

  // =========================
  // LOAD CART COUNT
  // =========================

  const loadCartCount =
    async () => {
      const token =
        localStorage.getItem(
          "authToken"
        );

      // Guest has no backend cart
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
            data?.items
          )
            ? data.items
            : [];

        const count =
          items.reduce(
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

  // =========================
  // CART UPDATE LISTENER
  // =========================

  useEffect(() => {
    loadCartCount();

    const updateCart =
      () => {
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

  // =========================
  // USER UPDATE
  // =========================

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

  // =========================
  // SEARCH
  // =========================

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

  // =========================
  // LOGOUT
  // =========================

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

  // =========================
  // CLOSE MOBILE MENU
  // =========================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // =========================
  // MORE
  // =========================

  const handleMoreToggle =
    () => {
      setMoreOpen(
        (prev) => !prev
      );
    };

  const closeMore = () => {
    setMoreOpen(false);
  };

  // =========================
  // ADMIN
  // =========================

  const isAdmin =
    userRole === "admin";

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

        </div>

        <div className="shop-topbar-right">

          <span>
            {t.premium}
          </span>

          <select
            value={language}
            onChange={(e) =>
              setLanguage(
                e.target.value
              )
            }
          >
            <option value="English">
              English
            </option>

            <option value="Hindi">
              हिंदी
            </option>
          </select>

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
          onClick={
            closeMenu
          }
        >
          SHOPSPHERE
        </Link>

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

          {/* LOGIN / ACCOUNT */}

          {userName ? (
            <div className="shop-account">

              <span className="account-icon">
                ♙
              </span>

              <span className="account-text">
                {t.hello},{" "}
                {userName}
              </span>

              <button
                className="logout-small"
                onClick={
                  handleLogout
                }
                type="button"
              >
                {t.logout}
              </button>

            </div>
          ) : (
            <Link
              to="/login"
              className="shop-account"
            >

              <span className="account-icon">
                ♙
              </span>

              <span className="account-text">
                {t.login}
              </span>

            </Link>
          )}

          {/* MORE */}

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
                  🚚{" "}
                  {t.trackOrder}
                </Link>

                <Link
                  to="/profile"
                  onClick={
                    closeMore
                  }
                >
                  👤 {t.profile}
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

                    {
                      t.adminDashboard
                    }
                  </Link>
                )}

              </div>
            )}

          </div>

          {/* CART */}

          <Link
            to="/cart"
            className="shop-cart"
            aria-label={t.cart}
            title={t.cart}
          >

            🛒

            {cartCount > 0 && (
              <span className="shop-cart-count">
                {cartCount}
              </span>
            )}

            <span className="cart-text">
              {t.cart}
            </span>

          </Link>

          {/* HAMBURGER */}

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

            <span></span>
            <span></span>
            <span></span>

          </button>

        </div>

      </div>

      {/* =====================================================
          CATEGORY BAR
      ===================================================== */}

      <div className="shop-categorybar">

        <Link
          to="/"
          className="shop-category active-category"
        >
          <span className="category-icon">
            <House
              size={20}
              strokeWidth={1.7}
            />
          </span>

          <small>
            {t.home}
          </small>
        </Link>

        <Link
          to="/products?category=Fashion"
          className="shop-category"
        >
          <span className="category-icon">
            <Shirt
              size={20}
              strokeWidth={1.7}
            />
          </span>

          <small>
            {t.fashion}
          </small>
        </Link>

        <Link
          to="/products?category=Accessories"
          className="shop-category"
        >
          <span className="category-icon">
            <Watch
              size={20}
              strokeWidth={1.7}
            />
          </span>

          <small>
            {t.accessories}
          </small>
        </Link>

        <Link
          to="/products?category=Footwear"
          className="shop-category"
        >
          <span className="category-icon">
            <Footprints
              size={20}
              strokeWidth={1.7}
            />
          </span>

          <small>
            {t.footwear}
          </small>
        </Link>

        <Link
          to="/new-arrivals"
          className="shop-category"
        >
          <span className="category-icon">
            <Sparkles
              size={20}
              strokeWidth={1.7}
            />
          </span>

          <small>
            {t.newArrivals}
          </small>
        </Link>

        <Link
          to="/products"
          className="shop-category"
        >
          <span className="category-icon">
            <Star
              size={20}
              strokeWidth={1.7}
            />
          </span>

          <small>
            {t.bestSellers}
          </small>
        </Link>

        <Link
          to="/products"
          className="shop-category"
        >
          <span className="category-icon">
            <Heart
              size={20}
              strokeWidth={1.7}
            />
          </span>

          <small>
            {t.collections}
          </small>
        </Link>

        <Link
          to="/about"
          className="shop-category"
        >
          <span className="category-icon">
            <Info
              size={20}
              strokeWidth={1.7}
            />
          </span>

          <small>
            {t.about}
          </small>
        </Link>

      </div>

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      {menuOpen && (
        <div className="shop-mobile-menu">

          <Link
            to="/"
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
            to="/products?category=Fashion"
            onClick={closeMenu}
          >
            {t.fashion}
          </Link>

          <Link
            to="/products?category=Accessories"
            onClick={closeMenu}
          >
            {t.accessories}
          </Link>

          <Link
            to="/products?category=Footwear"
            onClick={closeMenu}
          >
            {t.footwear}
          </Link>

          <Link
            to="/new-arrivals"
            onClick={closeMenu}
          >
            {t.newArrivals}
          </Link>

          <Link
            to="/products"
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
              ♙ {t.login}
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