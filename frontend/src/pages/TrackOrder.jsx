import { useState } from "react";
import { useSearchParams } from "react-router-dom";

function TrackOrder() {
  const [searchParams] = useSearchParams();

  const orderFromUrl = searchParams.get("orderId") || "";

  const [orderId, setOrderId] = useState(orderFromUrl);
  const [searched, setSearched] = useState(false);
  const [foundOrder, setFoundOrder] = useState(null);

  const handleTrack = (e) => {
    e.preventDefault();

    const value = orderId.trim();

    if (!value) return;

    const orders =
      JSON.parse(localStorage.getItem("orders")) || [];

    const order = orders.find(
      (item) =>
        item.orderId?.toLowerCase() === value.toLowerCase()
    );

    setFoundOrder(order || null);
    setSearched(true);
  };

  return (
    <main className="track-page">

      <section className="track-hero">
        <p>ORDER TRACKING</p>

        <h1>Track Your Order</h1>

        <span>
          Enter your order ID to check your order status.
        </span>
      </section>

      <section className="track-content">

        <div className="track-form-card">

          <div className="track-icon">🚚</div>

          <h2>Where is my order?</h2>

          <p>
            Enter the order ID you received after placing your order.
          </p>

          <form onSubmit={handleTrack}>

            <label>Order ID</label>

            <input
              type="text"
              placeholder="Example: SS1001"
              value={orderId}
              onChange={(e) => {
                setOrderId(e.target.value);
                setSearched(false);
                setFoundOrder(null);
              }}
            />

            <button type="submit">
              Track Order →
            </button>

          </form>

          {searched && !foundOrder && (
            <div className="tracking-result">

              <div className="tracking-result-icon">
                !
              </div>

              <h3>Order Not Found</h3>

              <p>
                We couldn't find an order with ID{" "}
                <strong>#{orderId}</strong>.
              </p>

            </div>
          )}

          {searched && foundOrder && (
            <div className="tracking-result">

              <div className="tracking-result-icon">
                ✓
              </div>

              <h3>Order Found</h3>

              <p>
                Order <strong>#{foundOrder.orderId}</strong> is
                currently{" "}
                <strong>
                  {foundOrder.status || "Confirmed"}
                </strong>.
              </p>

              <div className="tracking-steps">

                <div className="tracking-step active">
                  <span>✓</span>

                  <div>
                    <strong>Order Confirmed</strong>

                    <small>
                      Your order has been confirmed.
                    </small>
                  </div>
                </div>

                <div className="tracking-step">
                  <span>2</span>

                  <div>
                    <strong>Preparing</strong>

                    <small>
                      Your order will be prepared soon.
                    </small>
                  </div>
                </div>

                <div className="tracking-step">
                  <span>3</span>

                  <div>
                    <strong>Shipped</strong>

                    <small>
                      Your package will be shipped.
                    </small>
                  </div>
                </div>

                <div className="tracking-step">
                  <span>4</span>

                  <div>
                    <strong>Delivered</strong>

                    <small>
                      Your order will arrive at your address.
                    </small>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </section>

    </main>
  );
}

export default TrackOrder;