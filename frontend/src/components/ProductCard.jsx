import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function ProductCard({ product }) {
  const { language } = useLanguage();
  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-image-wrapper">
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
          to={`/product/${product.id}`}
          className="product-name"
        >
          {product.name}
        </Link>

        <p className="product-price">₹{product.price}</p>
      </div>
    </article>
  );
}

export default ProductCard;