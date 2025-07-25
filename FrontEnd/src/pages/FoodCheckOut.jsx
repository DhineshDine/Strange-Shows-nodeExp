import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart || [];

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    try {
      const orderData = {
        items: cart.map(({ id, quantity }) => ({ foodId: id, quantity })),
        totalAmount,
      };

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include JWT token here if needed
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      const result = await response.json();
      alert("Order placed successfully!");
      navigate("/"); // Back to home or order confirmation page
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place the order. Try again later.");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h2 className="text-2xl">Your cart is empty</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center bg-white p-4 rounded shadow"
          >
            <div>
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-gray-600">Quantity: {item.quantity}</p>
            </div>
            <div className="text-lg font-bold">
              ₹{item.price * item.quantity}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Total: ₹{totalAmount}</h2>
        <button
          onClick={placeOrder}
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
