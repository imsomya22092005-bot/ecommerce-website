import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";
import ProductCard from "../components/ProductCard";

function Products() {
  const { language } = useLanguage();

  const products = [
    {
      id: 1,
      name:
        language === "Hindi"
          ? "क्लासिक बेज जैकेट"
          : "Classic Beige Jacket",
      price: 2499,
      category: "Fashion",
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      name:
        language === "Hindi"
          ? "मिनिमल लेदर बैग"
          : "Minimal Leather Bag",
      price: 1999,
      category: "Accessories",
      image:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      name:
        language === "Hindi"
          ? "क्लासिक व्हाइट स्नीकर्स"
          : "Classic White Sneakers",
      price: 2999,
      category: "Footwear",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      name:
        language === "Hindi"
          ? "एवरीडे कलाई घड़ी"
          : "Everyday Wrist Watch",
      price: 3499,
      category: "Accessories",
      image:
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
    },
  ];
  console.log(language, products);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get("search");

    if (searchQuery) {
      setSearch(searchQuery);
    }
  }, []);

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        product.category === category;

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
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">
            {language === "Hindi"
              ? "सभी कैटेगरी"
              : "All Categories"}
          </option>

          <option value="Fashion">
            {language === "Hindi"
              ? "फैशन"
              : "Fashion"}
          </option>

          <option value="Accessories">
            {language === "Hindi"
              ? "एक्सेसरीज़"
              : "Accessories"}
          </option>

          <option value="Footwear">
            {language === "Hindi"
              ? "फुटवियर"
              : "Footwear"}
          </option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="default">
            {language === "Hindi"
              ? "क्रम से देखें"
              : "Sort By"}
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
            {language === "Hindi"
              ? "नाम: A से Z"
              : "Name: A to Z"}
          </option>
        </select>
      </section>

      {/* PRODUCTS */}

      {filteredProducts.length > 0 ? (
        <section className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </section>
      ) : (
        <div className="no-products">
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
        </div>
      )}
    </main>
  );
}

export default Products;