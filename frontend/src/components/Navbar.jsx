import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";


const translations = {
  English: {
    home: "HOME",
    shop: "SHOP",
    collections: "COLLECTIONS",
    newArrivals: "NEW ARRIVALS",
    about: "ABOUT US",
    search: "Search products...",
    searchButton: "SEARCH",
    logout: "LOGOUT",
  },

  Hindi: {
    home: "होम",
    shop: "शॉप",
    collections: "कलेक्शन",
    newArrivals: "नए प्रोडक्ट्स",
    about: "हमारे बारे में",
    search: "प्रोडक्ट खोजें...",
    searchButton: "खोजें",
    logout: "लॉगआउट",
  },
};

function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [userName, setUserName] = useState(
  localStorage.getItem("userName")
);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  
const { language, setLanguage } = useLanguage();
  const t = translations[language];

  const navigate = useNavigate();

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      const count = cart.reduce(
        (total, item) => total + item.quantity,
        0
      );

      setCartCount(count);
    };

    updateCartCount();

    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    const value = search.trim();

    if (!value) return;

    navigate(`/products?search=${encodeURIComponent(value)}`);

    setSearch("");
    setSearchOpen(false);
  };

  return (
    <header className="navbar">

      <Link to="/" className="logo">
        SHOPSPHERE
      </Link>

<nav className="nav-links">
  <Link to="/">{t.home}</Link>

  <Link to="/products">{t.shop}</Link>

  <Link to="/products?category=all">
    {t.collections}
  </Link>

  <Link to="/#new-arrivals">
    {t.newArrivals}
  </Link>

  <Link to="/about">
    {t.about}
  </Link>
</nav>

      <div className="nav-icons">

        <div className="language-selector">
  <span>🌐</span>

  <select
    value={language}
    onChange={(e) => setLanguage(e.target.value)}
  >
    <option value="English">English</option>
    <option value="Hindi">हिंदी</option>
  </select>
</div>

        <button
          className="search-button"
          aria-label="Search"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          ⌕
        </button>


       {userName ? (
  <>
    <span className="user-greeting">
      Hello, {userName} 👋
    </span>

    <button
      className="logout-button"
      onClick={() => {
        localStorage.removeItem("userName");
        setUserName(null);
      }}
    >
      {t.logout}

    </button>
  </>
) : (
  <Link to="/login" aria-label="Account">
    ♙
  </Link>
)}


        <Link to="/wishlist" aria-label="Wishlist">
          ♡
        </Link>


        <Link
          to="/cart"
          className="cart-icon"
          aria-label="Cart"
        >
          🛍

          {cartCount > 0 && (
            <span className="cart-count">
              {cartCount}
            </span>
          )}
        </Link>

      </div>


      {searchOpen && (
        <form
          className="navbar-search"
          onSubmit={handleSearch}
        >
          <input
  type="text"
  placeholder={t.search}
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  autoFocus
/>

          <button type="submit">{t.searchButton}</button>
        </form>
      )}

    </header>
  );
}

export default Navbar;