import { useState } from "react";
import ProductCard from "../components/ProductCard";

function Products() {
  const products = [
    {
      id: 1,
      name: "Classic Beige Jacket",
      price: 2499,
      category: "Fashion",
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 2,
      name: "Minimal Leather Bag",
      price: 1999,
      category: "Accessories",
      image:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 3,
      name: "Classic White Sneakers",
      price: 2999,
      category: "Footwear",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 4,
      name: "Everyday Wrist Watch",
      price: 3499,
      category: "Accessories",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80",
    },
  ];

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

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
      <section className="products-header">
        <p className="section-label">SHOPSPHERE COLLECTION</p>

        <h1>Discover Your Style</h1>

        <p>
          Explore our carefully selected collection of products
          designed for everyday elegance.
        </p>
      </section>

      {/* SEARCH + FILTERS */}

      <section className="product-controls">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Fashion">Fashion</option>
          <option value="Accessories">Accessories</option>
          <option value="Footwear">Footwear</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="default">Sort By</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
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
          <h2>No products found</h2>
          <p>Try another search or category.</p>
        </div>
      )}
    </main>
  );
}

export default Products;