import React, { useEffect, useState } from "react";
import axios from "axios";

const FoodOrdering = () => {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/foods");
      setFoods(response.data);
    } catch (error) {
      console.error("Error fetching food items:", error);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 min-h-screen">
      <h2 className="text-4xl font-bold mb-6 text-center text-yellow-500">🍽 Available Food Items</h2>

      {foods.length === 0 ? (
        <p className="text-center text-gray-500">No food items available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foods.map((food) => (
            <div
              key={food._id}
              className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex flex-col"
            >
              <img
                src={`http://localhost:5000/uploads/${food.image}`}
                alt={food.name}
                className="h-40 w-full object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-yellow-400">{food.name}</h3>
              <p className="text-sm text-blue-300">{food.category}</p>
              <p className="text-gray-400 mt-2">{food.description}</p>
              <p className="text-lg font-bold mt-3 text-yellow-500">₹ {food.price}</p>
              <button className="mt-auto bg-green-600 px-4 py-2 rounded-lg text-center hover:bg-green-700 transition">
                Order Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodOrdering;
