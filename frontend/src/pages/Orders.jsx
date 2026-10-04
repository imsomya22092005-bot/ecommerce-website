import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function Orders() {
  const { language } = useLanguage();

  const orders =
    JSON.parse(localStorage.getItem("orders")) || [];

  return (
    <main className="orders-page">

      <section className="orders-header">
        <p>
          {language === "Hindi"
            ? "मेरा अकाउंट"
            : "MY ACCOUNT"}
        </p>

        <h1>
          {language === "Hindi"
            ? "मेरे ऑर्डर्स"
            : "My Orders"}
        </h1>

        <span>
          {language === "Hindi"
            ? "अपने सभी हाल के ऑर्डर्स देखें।"
            : "View your recent orders and their details."}
        </span>
      </section>

      <section className="orders-content">

        {orders.length === 0 ? (
          <div className="orders-empty">

            <div className="orders-empty-icon">
              📦
            </div>

            <h2>
              {language === "Hindi"
                ? "अभी कोई ऑर्डर नहीं है"
                : "No orders yet"}
            </h2>

            <p>
              {language === "Hindi"
                ? "आपने अभी तक कोई ऑर्डर नहीं किया है।"
                : "You haven't placed any orders yet."}
            </p>

            <Link
              to="/products"
              className="orders-shop-btn"
            >
              {language === "Hindi"
                ? "शॉपिंग शुरू करें →"
                : "Start Shopping →"}
            </Link>

          </div>
        ) : (
          <div className="orders-list">

            {orders.map((order, index) => {

              const itemCount = (order.items || []).reduce(
                (total, item) =>
                  total + (item.quantity || 0),
                0
              );

              return (
                <div
                  className="order-card"
                  key={order.orderId || index}
                >

                  <div className="order-card-top">

                    <div>
                      <p className="order-label">
                        {language === "Hindi"
                          ? "ऑर्डर आईडी"
                          : "ORDER ID"}
                      </p>

                      <h3>
                        #{order.orderId}
                      </h3>
                    </div>

                    <span className="order-status">
                      {order.status || "Confirmed"}
                    </span>

                  </div>


                  <div className="order-details">

                    <p>
                      <strong>
                        {language === "Hindi"
                          ? "नाम:"
                          : "Name:"}
                      </strong>{" "}
                      {order.customer?.name || "Customer"}
                    </p>

                    <p>
                      <strong>
                        {language === "Hindi"
                          ? "तारीख:"
                          : "Date:"}
                      </strong>{" "}
                      {order.date}
                    </p>

                    <p>
                      <strong>
                        {language === "Hindi"
                          ? "आइटम:"
                          : "Items:"}
                      </strong>{" "}
                      {itemCount}
                    </p>

                    <p>
                      <strong>
                        {language === "Hindi"
                          ? "भुगतान:"
                          : "Payment:"}
                      </strong>{" "}
                      {language === "Hindi"
                        ? "कैश ऑन डिलीवरी"
                        : "Cash on Delivery"}
                    </p>

                  </div>


                  <div className="order-products">

                    {(order.items || []).map((item) => {

                      const productId =
                        item._id || item.id;

                      return (
                        <div
                          className="order-product"
                          key={productId}
                        >

                          <img
                            src={item.image}
                            alt={item.name}
                          />

                          <div>
                            <strong>
                              {item.name}
                            </strong>

                            <span>
                              {item.quantity} × ₹
                              {item.price}
                            </span>
                          </div>

                        </div>
                      );
                    })}

                  </div>


                  <div className="order-card-bottom">

                    <strong>
                      ₹{order.total}
                    </strong>

                    <Link
                      to={`/track-order?orderId=${order.orderId}`}
                      className="track-order-btn"
                    >
                      {language === "Hindi"
                        ? "ऑर्डर ट्रैक करें →"
                        : "Track Order →"}
                    </Link>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </section>

    </main>
  );
}

export default Orders;