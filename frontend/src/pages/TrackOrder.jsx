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

  /* =========================
     CURRENT STATUS
  ========================= */

  const getStatusStep = (status) => {
    const value = (status || "Confirmed")
      .toLowerCase()
      .trim();

    if (value.includes("delivered")) return 5;

    if (value.includes("out for delivery")) return 4;

    if (
      value.includes("in transit") ||
      value.includes("transit")
    ) {
      return 3;
    }

    if (
      value.includes("shipped") ||
      value.includes("dispatch")
    ) {
      return 2;
    }

    if (
      value.includes("packed") ||
      value.includes("preparing")
    ) {
      return 1;
    }

    return 0;
  };

  const trackingSteps = [
    {
      title: "Order Confirmed",
      location: "Delhi Order Center",
      message:
        "Your order has been confirmed and is being processed.",
      time: "Order placed",
    },
    {
      title: "Packed",
      location: "Delhi Warehouse",
      message:
        "Your package has been packed and is ready for dispatch.",
      time: "Package packed",
    },
    {
      title: "Shipped",
      location: "Delhi Dispatch Hub",
      message:
        "Your shipment has left the Delhi warehouse.",
      time: "Shipment dispatched",
    },
    {
      title: "In Transit",
      location: "Noida Sorting Hub",
      message:
        "Your shipment has reached the Noida sorting hub and is moving ahead.",
      time: "Shipment in transit",
    },
    {
      title: "Out for Delivery",
      location: "Local Delivery Center",
      message:
        "Your package is with the delivery partner and is out for delivery.",
      time: "On the way to you",
    },
    {
      title: "Delivered",
      location: "Your Delivery Address",
      message:
        "Your package has been delivered successfully.",
      time: "Package delivered",
    },
  ];

  return (
    <main
      className="track-page"
      style={{
        minHeight: "100vh",
      }}
    >

      {/* ==================================================
          PAGE STYLE
      ================================================== */}

      <style>{`
        .track-page {
          background: #f6f1e9;
        }

        .track-content {
          padding-bottom: 80px;
        }

        .track-form-card {
          max-width: 760px !important;
        }

        .tracking-result {
          margin-top: 35px;
        }

        .shipment-history {
          margin-top: 35px;
          padding: 25px 10px 5px;
          border-top: 1px solid #e5d9ca;
        }

        .shipment-history-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 30px;
        }

        .shipment-history-header h4 {
          margin: 0;
          color: #211e1b;
          font-family: "Playfair Display", serif;
          font-size: 22px;
          font-weight: 600;
        }

        .shipment-history-header span {
          padding: 7px 10px;
          border: 1px solid #e1d4c5;
          border-radius: 20px;
          color: #8a6245;
          background: #fffdf9;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .shipment-timeline {
          position: relative;
          width: 100%;
        }

        .shipment-item {
          position: relative;
          display: flex;
          gap: 18px;
          min-height: 115px;
        }

        .shipment-marker-area {
          position: relative;
          width: 36px;
          min-width: 36px;
          display: flex;
          justify-content: center;
        }

        .shipment-marker {
          position: relative;
          z-index: 3;

          width: 32px;
          height: 32px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 1px solid #d7cab9;
          border-radius: 50%;

          background: #fffdf9;
          color: #aaa095;

          font-size: 11px;
          font-weight: 700;

          transition: all 0.25s ease;
        }

        .shipment-line {
          position: absolute;
          z-index: 1;

          top: 32px;
          bottom: 0;
          left: 50%;

          width: 2px;

          transform: translateX(-50%);

          background: #ded2c4;
        }

        .shipment-info {
          flex: 1;
          padding: 0 0 32px;
        }

        .shipment-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
        }

        .shipment-info h5 {
          margin: 2px 0 5px;

          color: #a69a8d;
          font-size: 15px;
          font-weight: 700;
        }

        .shipment-location {
          display: block;

          color: #b1a59a;

          font-size: 11px;
          line-height: 1.5;
        }

        .shipment-info p {
          max-width: 520px;
          margin: 8px 0 0;

          color: #afa49a;

          font-size: 11px;
          line-height: 1.7;
        }

        .shipment-time {
          padding-top: 3px;

          color: #a99d92;

          font-size: 10px;
          white-space: nowrap;
        }


        /* =========================
           COMPLETED
        ========================= */

        .shipment-item.completed .shipment-marker {
          border-color: #7d9473;
          background: #7d9473;
          color: #ffffff;

          box-shadow: 0 0 0 4px rgba(125, 148, 115, 0.10);
        }

        .shipment-item.completed .shipment-line {
          background: #7d9473;
        }

        .shipment-item.completed .shipment-info h5 {
          color: #211e1b;
        }

        .shipment-item.completed .shipment-location {
          color: #8a6245;
        }

        .shipment-item.completed .shipment-info p {
          color: #6f665e;
        }


        /* =========================
           CURRENT
        ========================= */

        .shipment-item.current .shipment-marker {
          border-color: #c96f5b;
          background: #c96f5b;
          color: #ffffff;

          box-shadow:
            0 0 0 5px rgba(201, 111, 91, 0.12);
        }

        .shipment-item.current .shipment-info h5 {
          color: #c96f5b;
          font-size: 16px;
        }

        .shipment-item.current .shipment-location {
          color: #8a6245;
        }

        .shipment-item.current .shipment-info p {
          color: #6f665e;
        }

        .shipment-current-label {
          display: inline-block;

          margin-top: 11px;
          padding: 6px 10px;

          border-radius: 20px;

          background: #f3ddd7;
          color: #a75645;

          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1px;
        }


        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 600px) {

          .shipment-history {
            padding-left: 0;
            padding-right: 0;
          }

          .shipment-history-header {
            margin-bottom: 25px;
          }

          .shipment-history-header h4 {
            font-size: 18px;
          }

          .shipment-history-header span {
            font-size: 9px;
          }

          .shipment-item {
            gap: 12px;
            min-height: 120px;
          }

          .shipment-marker-area {
            width: 30px;
            min-width: 30px;
          }

          .shipment-marker {
            width: 28px;
            height: 28px;
          }

          .shipment-line {
            top: 28px;
          }

          .shipment-info {
            padding-bottom: 30px;
          }

          .shipment-top {
            gap: 8px;
          }

          .shipment-info h5 {
            font-size: 13px;
          }

          .shipment-location {
            font-size: 10px;
          }

          .shipment-info p {
            font-size: 10px;
            line-height: 1.6;
          }

          .shipment-time {
            font-size: 9px;
          }
        }
      `}</style>


      {/* =========================
          HERO
      ========================= */}

      <section className="track-hero">

        <p>ORDER TRACKING</p>

        <h1>
          Track Your Order
        </h1>

        <span>
          Enter your order ID to check your order status.
        </span>

      </section>


      {/* =========================
          CONTENT
      ========================= */}

      <section className="track-content">

        <div className="track-form-card">

          <div className="track-icon">
            🚚
          </div>

          <h2>
            Where is my order?
          </h2>

          <p>
            Enter the order ID you received after placing your order.
          </p>


          {/* SEARCH */}

          <form onSubmit={handleTrack}>

            <label>
              Order ID
            </label>

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


          {/* =========================
              NOT FOUND
          ========================= */}

          {searched && !foundOrder && (
            <div className="tracking-result">

              <div className="tracking-result-icon">
                !
              </div>

              <h3>
                Order Not Found
              </h3>

              <p>
                We couldn't find an order with ID{" "}
                <strong>
                  #{orderId}
                </strong>.
              </p>

            </div>
          )}


          {/* =========================
              FOUND ORDER
          ========================= */}

          {searched && foundOrder && (
            <div className="tracking-result">

              <div className="tracking-result-icon">
                ✓
              </div>

              <h3>
                Order Found
              </h3>

              <p>
                Order{" "}
                <strong>
                  #{foundOrder.orderId}
                </strong>{" "}
                is currently{" "}
                <strong>
                  {foundOrder.status || "Confirmed"}
                </strong>.
              </p>


              {/* =========================
                  SHIPMENT HISTORY
              ========================= */}

              <div className="shipment-history">

                <div className="shipment-history-header">

                  <h4>
                    Shipment History
                  </h4>

                  <span>
                    #{foundOrder.orderId}
                  </span>

                </div>


                {/* TIMELINE */}

                <div className="shipment-timeline">

                  {trackingSteps.map((step, index) => {

                    const currentStep =
                      getStatusStep(
                        foundOrder.status
                      );

                    const completed =
                      index < currentStep;

                    const current =
                      index === currentStep;

                    return (
                      <div
                        key={step.title}
                        className={`shipment-item ${
                          completed
                            ? "completed"
                            : ""
                        } ${
                          current
                            ? "current"
                            : ""
                        }`}
                      >

                        {/* MARKER */}

                        <div className="shipment-marker-area">

                          <span className="shipment-marker">

                            {completed
                              ? "✓"
                              : current
                              ? "●"
                              : index + 1}

                          </span>

                          {index <
                            trackingSteps.length - 1 && (
                            <span className="shipment-line"></span>
                          )}

                        </div>


                        {/* DETAILS */}

                        <div className="shipment-info">

                          <div className="shipment-top">

                            <div>

                              <h5>
                                {step.title}
                              </h5>

                              <span className="shipment-location">
                                📍 {step.location}
                              </span>

                            </div>

                            {(completed ||
                              current) && (
                              <span className="shipment-time">
                                {step.time}
                              </span>
                            )}

                          </div>


                          <p>
                            {step.message}
                          </p>


                          {current && (
                            <span className="shipment-current-label">
                              CURRENT STATUS
                            </span>
                          )}

                        </div>

                      </div>
                    );
                  })}

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