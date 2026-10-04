
import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import About from "./pages/About";
import Footer from "./components/Footer";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import Orders from "./pages/Orders";
import TrackOrder from "./pages/TrackOrder";
import NewArrivals from "./pages/NewArrivals";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkout" element={<Checkout />} />
 <Route path="/order-success" element={<OrderSuccess />} />
<Route path="/about" element={<About />} />
<Route path="/contact" element={<Contact />} />
<Route path="/help" element={<Help />} />
<Route path="/orders" element={<Orders />} />
<Route path="/track-order" element={<TrackOrder />} />
<Route path="/new-arrivals" element={<NewArrivals />} />
<Route path="/admin" element={<AdminDashboard />} />
<Route path="/profile" element={<Profile />} />
      </Routes>


  <Footer />
    </BrowserRouter>
  );
}

export default App;