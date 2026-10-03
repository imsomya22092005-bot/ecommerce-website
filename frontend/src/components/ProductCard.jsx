import { Link } from "react-router-dom";

function ProductCard({ product }) {
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
        <p className="product-category">{product.category}</p>

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