import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";

const translations = {
  English: {
    home: "Home",
    shop: "Shop",
    collections: "Collections",
    newArrivals: "New Arrivals",
    about: "About Us",
    search: "Search for Products, Brands and More",
    login: "Login",
    logout: "Logout",
    more: "More",
    wishlist: "Wishlist",
    cart: "Cart",
  },

  Hindi: {
    home: "होम",
    shop: "शॉप",
    collections: "कलेक्शन",
    newArrivals: "नए प्रोडक्ट्स",
    about: "हमारे बारे में",
    search: "प्रोडक्ट, ब्रांड और बहुत कुछ खोजें",
    login: "लॉगिन",
    logout: "लॉगआउट",
    more: "और",
    wishlist: "विशलिस्ट",
    cart: "कार्ट",
  },
};

function Navbar() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);
  const [userName, setUserName] = useState(
    localStorage.getItem("userName")
  );
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    const updateCartCount = () => {
      const cart =
        JSON.parse(localStorage.getItem("cart")) || [];

      const count = cart.reduce(
        (total, item) => total + item.quantity,
        0
      );

      setCartCount(count);
    };

    updateCartCount();

    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener(
        "cartUpdated",
        updateCartCount
      );
    };
  }, []);

  useEffect(() => {
    const updateUser = () => {
      setUserName(localStorage.getItem("userName"));
    };

    updateUser();

    window.addEventListener("userUpdated", updateUser);

    return () => {
      window.removeEventListener(
        "userUpdated",
        updateUser
      );
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    const value = search.trim();

    if (!value) return;

    navigate(
      `/products?search=${encodeURIComponent(value)}`
    );

    setSearch("");
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("userName");

    setUserName(null);

    window.dispatchEvent(new Event("userUpdated"));

    setMenuOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="shop-navbar">

      {/* TOP BAR */}
      <div className="shop-topbar">
        <div className="shop-topbar-left">
          <Link to="/" className="top-active">
            ShopSphere
          </Link>

          <Link to="/products">
            {t.shop}
          </Link>

          <Link to="/#new-arrivals">
            {t.newArrivals}
          </Link>

          <Link to="/about">
            {t.about}
          </Link>
        </div>

        <div className="shop-topbar-right">
          <span>✨ Premium Shopping</span>

          <select
            value={language}
            onChange={(e) =>
              setLanguage(e.target.value)
            }
          >
            <option value="English">English</option>
            <option value="Hindi">हिंदी</option>
          </select>
        </div>
      </div>


      {/* MAIN NAVBAR */}
      <div className="shop-mainbar">

        {/* LOGO */}
        <Link
          to="/"
          className="shop-logo"
          onClick={closeMenu}
        >
          SHOPSPHERE
        </Link>


        {/* SEARCH */}
        <form
          className="shop-search"
          onSubmit={handleSearch}
        >
          <span className="search-symbol">⌕</span>

          <input
            type="text"
            placeholder={t.search}
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <button type="submit">
            Search
          </button>
        </form>


        {/* RIGHT ACTIONS */}
        <div className="shop-actions">

          {userName ? (
            <div className="shop-account">
              <span className="account-icon">
                ♙
              </span>

              <span className="account-text">
                Hello, {userName}
              </span>

              <button
                className="logout-small"
                onClick={handleLogout}
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

          <div className="more-wrapper">
  <button
    className="more-button"
    onClick={() => setMoreOpen(!moreOpen)}
  >
    {t.more} ▾
  </button>

  {moreOpen && (
    <div className="more-dropdown">

      <Link
        to="/contact"
        onClick={() => setMoreOpen(false)}
      >
        📞 Contact Us
      </Link>

      <Link
        to="/help"
        onClick={() => setMoreOpen(false)}
      >
        ❓ Help & Support
      </Link>

      <Link
        to="/orders"
        onClick={() => setMoreOpen(false)}
      >
        📋 My Orders
      </Link>

      <Link
        to="/track-order"
        onClick={() => setMoreOpen(false)}
      >
        🚚 Track Order
      </Link>

    </div>
  )}
</div>
          <Link
            to="/wishlist"
            className="wishlist-nav"
            aria-label={t.wishlist}
          >
            ♡
          </Link>

          <Link
            to="/cart"
            className="shop-cart"
            aria-label={t.cart}
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

          <button
            className={`shop-hamburger ${
              menuOpen ? "active" : ""
            }`}
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        </div>
      </div>


      {/* CATEGORY BAR */}
      <div className="shop-categorybar">

        <Link
          to="/products"
          className="shop-category active-category"
        >
          <span>⌂</span>
          <small>{t.home}</small>
        </Link>

        <Link
          to="/products?category=Fashion"
          className="shop-category"
        >
          <span>♧</span>
          <small>Fashion</small>
        </Link>

        <Link
          to="/products?category=Accessories"
          className="shop-category"
        >
          <span>◉</span>
          <small>Accessories</small>
        </Link>

        <Link
          to="/products?category=Footwear"
          className="shop-category"
        >
          <span>♢</span>
          <small>Footwear</small>
        </Link>

        <Link
          to="/#new-arrivals"
          className="shop-category"
        >
          <span>✦</span>
          <small>New Arrivals</small>
        </Link>

        <Link
          to="/products"
          className="shop-category"
        >
          <span>★</span>
          <small>Best Sellers</small>
        </Link>

        <Link
          to="/products"
          className="shop-category"
        >
          <span>♡</span>
          <small>Collections</small>
        </Link>

        <Link
          to="/about"
          className="shop-category"
        >
          <span>◌</span>
          <small>About Us</small>
        </Link>

      </div>


      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="shop-mobile-menu">

          <Link to="/" onClick={closeMenu}>
            {t.home}
          </Link>

          <Link to="/products" onClick={closeMenu}>
            {t.shop}
          </Link>

          <Link
            to="/products?category=Fashion"
            onClick={closeMenu}
          >
            Fashion
          </Link>

          <Link
            to="/products?category=Accessories"
            onClick={closeMenu}
          >
            Accessories
          </Link>

          <Link
            to="/products?category=Footwear"
            onClick={closeMenu}
          >
            Footwear
          </Link>

          <Link
            to="/wishlist"
            onClick={closeMenu}
          >
            ♡ {t.wishlist}
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

          {userName && (
            <button
              className="mobile-logout-shop"
              onClick={handleLogout}
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