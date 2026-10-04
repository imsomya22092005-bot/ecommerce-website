import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function ProductCard({ product }) {
  const { language } = useLanguage();

  const productId = product._id || product.id;

  const handleAddToCart = () => {
    const existingCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = existingCart.find(
      (item) =>
        (item._id || item.id) === productId
    );

    let updatedCart;

    if (existingItem) {
      updatedCart = existingCart.map((item) =>
        (item._id || item.id) === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      );
    } else {
      updatedCart = [
        ...existingCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };

  return (
    <article className="product-card">

      <Link
        to={`/product/${productId}`}
        className="product-image-wrapper"
      >
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />
      </Link>

      <div className="product-info">

        <p className="product-category">
          {language === "Hindi"
            ? product.category === "Fashion"
              ? "फैशन"
              : product.category === "Accessories"
              ? "एक्सेसरीज़"
              : product.category === "Footwear"
              ? "फुटवियर"
              : product.category
            : product.category}
        </p>

        <Link
          to={`/product/${productId}`}
          className="product-name"
        >
          {product.name}
        </Link>

        <p className="product-price">
          ₹{product.price}
        </p>

        <button
          className="product-add-btn"
          onClick={handleAddToCart}
        >
          {language === "Hindi"
            ? "कार्ट में जोड़ें"
            : "ADD TO CART"}
        </button>

      </div>

    </article>
  );
}

export default ProductCard;