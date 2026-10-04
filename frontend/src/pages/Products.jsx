import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";
import ProductCard from "../components/ProductCard";


function Products() {
  const { language } = useLanguage();

  const [searchParams, setSearchParams] = useSearchParams();

  const categoryFromURL = searchParams.get("category");

  const initialCategory =
    categoryFromURL && categoryFromURL !== "all"
      ? categoryFromURL
      : "All";

  const initialSearch = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:3000/api/products");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(
          language === "Hindi"
            ? "प्रोडक्ट्स लोड नहीं हो सके।"
            : "Unable to load products."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [language]);

  

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sort === "low") {
        return a.price - b.price;
      }

      if (sort === "high") {
        return b.price - a.price;
      }

      if (sort === "name") {
        return a.name.localeCompare(b.name);
      }

      return 0;
    });

  return (
    <main className="products-page">
      <section className="products-header" id="new-arrivals">
        <p className="section-label">
          {language === "Hindi"
            ? "SHOPSPHERE कलेक्शन"
            : "SHOPSPHERE COLLECTION"}
        </p>

        <h1>
          {language === "Hindi"
            ? "अपनी स्टाइल खोजें"
            : "Discover Your Style"}
        </h1>

        <p>
          {language === "Hindi"
            ? "हमारे खास चुने गए प्रोडक्ट्स का कलेक्शन देखें, जो रोज़मर्रा की खूबसूरती के लिए डिज़ाइन किए गए हैं।"
            : "Explore our carefully selected collection of products designed for everyday elegance."}
        </p>
      </section>

      {/* SEARCH + FILTERS */}

      <section className="product-controls">
        <input
          type="text"
          placeholder={
            language === "Hindi"
              ? "प्रोडक्ट खोजें..."
              : "Search products..."
          }
          value={search}
          onChange={(e) => {
  const value = e.target.value;
  setSearch(value);

  setSearchParams({
    search: value,
    ...(category !== "All" && { category }),
  });
}}
        />

        <select
          value={category}
          onChange={(e) => {
  const value = e.target.value;
  setCategory(value);

  setSearchParams({
    ...(search && { search }),
    ...(value !== "All" && { category: value }),
  });
}}
        >
          <option value="All">
            {language === "Hindi" ? "सभी कैटेगरी" : "All Categories"}
          </option>

          <option value="Fashion">
            {language === "Hindi" ? "फैशन" : "Fashion"}
          </option>

          <option value="Accessories">
            {language === "Hindi" ? "एक्सेसरीज़" : "Accessories"}
          </option>

          <option value="Footwear">
            {language === "Hindi" ? "फुटवियर" : "Footwear"}
          </option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="default">
            {language === "Hindi" ? "क्रम से देखें" : "Sort By"}
          </option>

          <option value="low">
            {language === "Hindi"
              ? "कीमत: कम से अधिक"
              : "Price: Low to High"}
          </option>

          <option value="high">
            {language === "Hindi"
              ? "कीमत: अधिक से कम"
              : "Price: High to Low"}
          </option>

          <option value="name">
            {language === "Hindi" ? "नाम: A से Z" : "Name: A to Z"}
          </option>
        </select>

        <button
  className="clear-filters-btn"
  onClick={() => {
    setSearch("");
    setCategory("All");
    setSort("default");
    setSearchParams({});
  }}
>
  {language === "Hindi"
    ? "फ़िल्टर साफ़ करें"
    : "Clear Filters"}
</button>

      </section>

      {/* LOADING */}

      {loading && (
        <div className="no-products">
          <h2>
            {language === "Hindi"
              ? "प्रोडक्ट्स लोड हो रहे हैं..."
              : "Loading products..."}
          </h2>
        </div>
      )}

      {/* ERROR */}

      {!loading && error && (
        <div className="no-products">
          <h2>{error}</h2>

          <p>
            {language === "Hindi"
              ? "कृपया बाद में दोबारा कोशिश करें।"
              : "Please try again later."}
          </p>
        </div>
      )}

      {/* PRODUCTS */}

      {!loading && !error && filteredProducts.length > 0 ? (
        <section className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
            />
          ))}
        </section>
      ) : (
        !loading &&
        !error && (
          <div className="no-products">
  <div className="no-products-icon">⌕</div>

  <h2>
    {language === "Hindi"
      ? "कोई प्रोडक्ट नहीं मिला"
      : "No products found"}
  </h2>

  <p>
    {language === "Hindi"
      ? "कोई दूसरा सर्च या कैटेगरी ट्राय करें।"
      : "Try another search or category."}
  </p>

  <button
    className="clear-filters-btn"
    onClick={() => {
      setSearch("");
      setCategory("All");
      setSort("default");
      setSearchParams({});
    }}
  >
    {language === "Hindi"
      ? "फ़िल्टर साफ़ करें"
      : "Clear Filters"}
  </button>
</div>
        )
      )}
    </main>
  );
}

export default Products;