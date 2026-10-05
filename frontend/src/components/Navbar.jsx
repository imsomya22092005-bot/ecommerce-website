import { Link, useNavigate } from "react-router-dom";

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

import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";

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

    search: "Search for Products, Brands and More",
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
    adminDashboard: "Admin Dashboard",

    wishlist: "Wishlist",
    cart: "Cart",

    premium: "✨ Premium Shopping",

    menu: "Toggle menu",
    close: "Close",
  },

  Hindi: {
    home: "होम",
    shop: "शॉप",
    fashion: "फैशन",
    accessories: "एक्सेसरीज़",
    footwear: "फुटवियर",
    newArrivals: "नए प्रोडक्ट्स",
    bestSellers: "बेस्ट सेलर्स",
    collections: "कलेक्शंस",
    about: "हमारे बारे में",

    search: "प्रोडक्ट, ब्रांड और बहुत कुछ खोजें",
    searchButton: "खोजें",

    login: "लॉगिन",
    logout: "लॉगआउट",
    hello: "नमस्ते",
    more: "और",

    contact: "संपर्क करें",
    help: "मदद और सहायता",
    orders: "मेरे ऑर्डर्स",
    trackOrder: "ऑर्डर ट्रैक करें",
    profile: "मेरी प्रोफाइल",
    adminDashboard: "एडमिन डैशबोर्ड",

    wishlist: "विशलिस्ट",
    cart: "कार्ट",

    premium: "✨ प्रीमियम शॉपिंग",

    menu: "मेन्यू खोलें",
    close: "बंद करें",
  },
};

/* =========================================================
   NAVBAR
========================================================= */

function Navbar() {
  const { language, setLanguage } = useLanguage();

  const t = translations[language];

  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);

  const [userName, setUserName] = useState(
    localStorage.getItem("userName")
  );

  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole")
  );

  const [search, setSearch] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);

  const [moreOpen, setMoreOpen] = useState(false);

  /* =========================================================
     CART COUNT
  ========================================================= */

  useEffect(() => {
    const updateCartCount = () => {
      const cart =
        JSON.parse(
          localStorage.getItem("cart")
        ) || [];

      const count = cart.reduce(
        (total, item) =>
          total +
          Number(item.quantity || 0),
        0
      );

      setCartCount(count);
    };

    updateCartCount();

    window.addEventListener(
      "cartUpdated",
      updateCartCount
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        updateCartCount
      );
    };
  }, []);

  /* =========================================================
     USER UPDATE
  ========================================================= */

  useEffect(() => {
    const updateUser = () => {
      setUserName(
        localStorage.getItem("userName")
      );

      setUserRole(
        localStorage.getItem("userRole")
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

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearch = (e) => {
    e.preventDefault();

    const value =
      search.trim();

    if (!value) return;

    navigate(
      `/products?search=${encodeURIComponent(
        value
      )}`
    );

    setSearch("");
    setMenuOpen(false);
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem(
      "userName"
    );

    localStorage.removeItem(
      "authToken"
    );

    localStorage.removeItem(
      "userRole"
    );

    setUserName(null);
    setUserRole(null);

    window.dispatchEvent(
      new Event("userUpdated")
    );

    setMenuOpen(false);
    setMoreOpen(false);

    navigate("/");
  };

  /* =========================================================
     CLOSE MOBILE MENU
  ========================================================= */

  const closeMenu = () => {
    setMenuOpen(false);
  };

  /* =========================================================
     MORE DROPDOWN
  ========================================================= */

  const handleMoreToggle = () => {
    setMoreOpen(
      (prev) => !prev
    );
  };

  const closeMore = () => {
    setMoreOpen(false);
  };

  /* =========================================================
     ADMIN CHECK
  ========================================================= */

  const isAdmin =
    userRole === "admin";

  /* =========================================================
     UI
  ========================================================= */

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
          MAIN NAVBAR
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

        {/* =================================================
            SEARCH
        ================================================= */}

        <form
          className="shop-search"
          onSubmit={handleSearch}
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

        {/* =================================================
            RIGHT ACTIONS
        ================================================= */}

        <div className="shop-actions">

          {/* =================================================
              LOGIN / ACCOUNT
          ================================================= */}

          {userName ? (

            <div className="shop-account">

              <span className="account-icon">
                ♙
              </span>

              <span className="account-text">
                {t.hello}, {userName}
              </span>

              <button
                className="logout-small"
                onClick={handleLogout}
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

                {/* CLOSE */}

                <button
                  className="dropdown-close"
                  onClick={closeMore}
                  aria-label={t.close}
                  title={t.close}
                  type="button"
                >
                  ×
                </button>

                {/* CONTACT */}

                <Link
                  to="/contact"
                  onClick={closeMore}
                >
                  📞 {t.contact}
                </Link>

                {/* HELP */}

                <Link
                  to="/help"
                  onClick={closeMore}
                >
                  ❓ {t.help}
                </Link>

                {/* ORDERS */}

                <Link
                  to="/orders"
                  onClick={closeMore}
                >
                  📋 {t.orders}
                </Link>

                {/* TRACK ORDER */}

                <Link
                  to="/track-order"
                  onClick={closeMore}
                >
                  🚚 {t.trackOrder}
                </Link>

<Link
  to="/profile"
  onClick={closeMore}
>
  👤 {t.profile}
</Link>

                {/* =================================================
                    ADMIN DASHBOARD
                ================================================= */}

                {isAdmin && (

                  <Link
                    to="/admin"
                    onClick={closeMore}
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
              WISHLIST
          ================================================= */}

          <Link
            to="/wishlist"
            className="wishlist-nav"
            aria-label={t.wishlist}
            title={t.wishlist}
          >
            ♡
          </Link>

          {/* =================================================
              CART
          ================================================= */}

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
                (prev) => !prev
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

        {/* HOME */}

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

        {/* FASHION */}

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

        {/* ACCESSORIES */}

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

        {/* FOOTWEAR */}

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

        {/* NEW ARRIVALS */}

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

        {/* BEST SELLERS */}

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

        {/* COLLECTIONS */}

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

        {/* ABOUT */}

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

          {/* HOME */}

          <Link
            to="/"
            onClick={closeMenu}
          >
            {t.home}
          </Link>

          {/* SHOP */}

          <Link
            to="/products"
            onClick={closeMenu}
          >
            {t.shop}
          </Link>

          {/* FASHION */}

          <Link
            to="/products?category=Fashion"
            onClick={closeMenu}
          >
            {t.fashion}
          </Link>

          {/* ACCESSORIES */}

          <Link
            to="/products?category=Accessories"
            onClick={closeMenu}
          >
            {t.accessories}
          </Link>

          {/* FOOTWEAR */}

          <Link
            to="/products?category=Footwear"
            onClick={closeMenu}
          >
            {t.footwear}
          </Link>

          {/* NEW ARRIVALS */}

          <Link
            to="/new-arrivals"
            onClick={closeMenu}
          >
            {t.newArrivals}
          </Link>

          {/* BEST SELLERS */}

          <Link
            to="/products"
            onClick={closeMenu}
          >
            {t.bestSellers}
          </Link>

          {/* COLLECTIONS */}

          <Link
            to="/products"
            onClick={closeMenu}
          >
            {t.collections}
          </Link>

          {/* WISHLIST */}

          <Link
            to="/wishlist"
            onClick={closeMenu}
          >
            ♡ {t.wishlist}
          </Link>

          {/* CART */}

          <Link
            to="/cart"
            onClick={closeMenu}
          >
            🛒 {t.cart}
          </Link>

          {/* ABOUT */}

          <Link
            to="/about"
            onClick={closeMenu}
          >
            {t.about}
          </Link>

          {/* CONTACT */}

          <Link
            to="/contact"
            onClick={closeMenu}
          >
            📞 {t.contact}
          </Link>

          {/* HELP */}

          <Link
            to="/help"
            onClick={closeMenu}
          >
            ❓ {t.help}
          </Link>

          {/* ORDERS */}

          <Link
            to="/orders"
            onClick={closeMenu}
          >
            📋 {t.orders}
          </Link>

          {/* TRACK ORDER */}

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

          {/* =================================================
              ADMIN DASHBOARD - MOBILE
          ================================================= */}

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

          {/* LOGIN */}

          {!userName && (

            <Link
              to="/login"
              onClick={closeMenu}
            >
              ♙ {t.login}
            </Link>

          )}

          {/* LOGOUT */}

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