import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function NewArrivals() {
  const { language } = useLanguage();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/products"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="new-arrivals-page">

      <section className="new-arrivals-page-header">

        <p className="section-label">
          {language === "Hindi"
            ? "अभी-अभी आया"
            : "JUST DROPPED"}
        </p>

        <h1>
          {language === "Hindi"
            ? "नए प्रोडक्ट्स"
            : "New Arrivals"}
        </h1>

        <p>
          {language === "Hindi"
            ? "हमारी नवीनतम कलेक्शन को एक्सप्लोर करें।"
            : "Explore the latest pieces added to the ShopSphere collection."}
        </p>

      </section>


      <section className="new-arrivals-page-content">

        {products.length === 0 ? (
          <div className="new-arrivals-empty">

            <div>✦</div>

            <h2>
              {language === "Hindi"
                ? "नए प्रोडक्ट्स जल्द आ रहे हैं"
                : "New arrivals are coming soon"}
            </h2>

            <p>
              {language === "Hindi"
                ? "कृपया थोड़ी देर बाद दोबारा देखें।"
                : "Please check back soon for our latest products."}
            </p>

          </div>
        ) : (
          <div className="new-arrivals-page-grid">

            {products.map((product) => {

              const productId =
                product._id || product.id;

              return (
                <Link
                  key={productId}
                  to={`/product/${productId}`}
                  className="new-arrival-product-card"
                >

                  <div className="new-arrival-product-image">

                    <img
                      src={product.image}
                      alt={product.name}
                    />

                    <span>
                      NEW
                    </span>

                  </div>

                  <div className="new-arrival-product-info">

                    <p>
                      {product.category}
                    </p>

                    <h3>
                      {product.name}
                    </h3>

                    <strong>
                      ₹{product.price}
                    </strong>

                  </div>

                </Link>
              );
            })}

          </div>
        )}

      </section>

    </main>
  );
}

export default NewArrivals;