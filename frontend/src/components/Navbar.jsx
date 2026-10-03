import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const [cartCount, setCartCount] = useState(0);

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

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        SHOPSPHERE
      </Link>

      <nav className="nav-links">
        <Link to="/">HOME</Link>
        <Link to="/products">SHOP</Link>
        <Link to="/products">COLLECTIONS</Link>
        <Link to="/products">NEW ARRIVALS</Link>
        <Link to="/login">ABOUT US</Link>
      </nav>

      <div className="nav-icons">
        <button aria-label="Search">⌕</button>

        <Link to="/login" aria-label="Account">
          ♙
        </Link>

       <Link to="/wishlist" aria-label="Wishlist">
  ♡
</Link>

        <Link to="/cart" className="cart-icon" aria-label="Cart">
          🛍
          {cartCount > 0 && (
            <span className="cart-count">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}

export default Navbar;