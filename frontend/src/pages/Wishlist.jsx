import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  const loadWishlist = () => {
    const savedWishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    setWishlist(savedWishlist);
  };

  useEffect(() => {
    loadWishlist();

    window.addEventListener("wishlistUpdated", loadWishlist);

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        loadWishlist
      );
    };
  }, []);

  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter(
      (item) => item.id !== id
    );

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updatedWishlist)
    );

    setWishlist(updatedWishlist);
  };

  return (
    <main className="wishlist-page">
      <div className="wishlist-header">
        <p className="section-label">SHOPSPHERE</p>

        <h1>Your Wishlist</h1>

        <p>
          Save the pieces you love and come back to them
          whenever you want.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="empty-wishlist">
          <div className="empty-heart">♡</div>

          <h2>Your wishlist is empty</h2>

          <p>
            Start exploring and save your favorite products.
          </p>

          <Link to="/products" className="continue-shopping">
            EXPLORE PRODUCTS
          </Link>
        </div>
      ) : (
        <section className="wishlist-grid">
          {wishlist.map((product) => (
            <article
              className="wishlist-card"
              key={product.id}
            >
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                />
              </Link>

              <div className="wishlist-info">
                <p className="product-category">
                  {product.category}
                </p>

                <h2>{product.name}</h2>

                <p>₹{product.price}</p>

                <button
                  onClick={() =>
                    removeFromWishlist(product.id)
                  }
                >
                  REMOVE
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default Wishlist;