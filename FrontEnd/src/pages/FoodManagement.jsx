import React, { useState, useEffect } from "react";
import { Edit, Trash2, MapPin } from "lucide-react";

const FoodManagement = () => {
  const [foods, setFoods] = useState([]);
  const [locations, setLocations] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    category: "",
    price: "",
    description: "",
    location: "",
    restaurant: "",
    image: null,
    imagePreview: null,
  });
  const [restaurantForm, setRestaurantForm] = useState({
    id: null,
    name: "",
    location: "",
    description: "",
    contactNumber: "",
    email: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingRestaurant, setIsEditingRestaurant] = useState(false);
  const [activeTab, setActiveTab] = useState("foods");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const categories = ["Snacks", "Beverages", "Desserts", "Main Course"];
  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchFoods();
    fetchLocations();
    fetchRestaurants();
  }, []);

  // ✅ Clear messages after a delay (like in NowPlayingAdmin)
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage('');
        setError('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/foods`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched foods:', data);
      setFoods(data);
    } catch (error) {
      console.error("Error fetching foods:", error);
      setError('❌ Failed to fetch foods.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fixed: Fetch locations with authentication headers (same pattern as NowPlayingAdmin)
  const fetchLocations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/locations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched locations:', data);
      setLocations(data);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setError('❌ Failed to fetch locations.');
    }
  };

  const fetchRestaurants = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/restaurants`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched restaurants:', data);
      setRestaurants(data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setError('❌ Failed to fetch restaurants.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRestaurantInputChange = (e) => {
    const { name, value } = e.target;
    setRestaurantForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imagePreview = URL.createObjectURL(file);
      setForm((prev) => ({
        ...prev,
        image: file,
        imagePreview,
      }));
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      category: "",
      price: "",
      description: "",
      location: "",
      restaurant: "",
      image: null,
      imagePreview: null,
    });
    setIsEditing(false);
    setMessage('');
    setError('');
  };

  const resetRestaurantForm = () => {
    setRestaurantForm({
      id: null,
      name: "",
      location: "",
      description: "",
      contactNumber: "",
      email: "",
    });
    setIsEditingRestaurant(false);
    setMessage('');
    setError('');
  };

  const handleSaveFood = async () => {
    if (!form.name || !form.category || !form.price || !form.description || !form.location || (!form.image && !isEditing)) {
      setError("❌ Please fill out all fields including location and upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("price", form.price);
    formData.append("description", form.description);
    formData.append("location", form.location);
formData.append("restaurant", form.restaurant || null);
    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = isEditing 
        ? `${API_BASE_URL}/foods/${form.id}`
        : `${API_BASE_URL}/foods`;
      
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setMessage(isEditing ? '✅ Food updated successfully!' : '✅ Food added successfully!');
        fetchFoods();
        resetForm();
      } else {
        throw new Error('Failed to save food');
      }
    } catch (error) {
      console.error("Error saving food:", error);
      setError('❌ Failed to save food.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRestaurant = async () => {
    if (!restaurantForm.name || !restaurantForm.location || !restaurantForm.contactNumber) {
      setError("❌ Please fill out all required fields (name, location, contact number).");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = isEditingRestaurant 
        ? `${API_BASE_URL}/restaurants/${restaurantForm.id}`
        : `${API_BASE_URL}/restaurants`;
      
      const response = await fetch(url, {
        method: isEditingRestaurant ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(restaurantForm),
      });

      if (response.ok) {
        setMessage(isEditingRestaurant ? '✅ Restaurant updated successfully!' : '✅ Restaurant added successfully!');
        fetchRestaurants();
        resetRestaurantForm();
      } else {
        throw new Error('Failed to save restaurant');
      }
    } catch (error) {
      console.error("Error saving restaurant:", error);
      setError('❌ Failed to save restaurant.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditFood = (food) => {
    setForm({
      id: food._id,
      name: food.name,
      category: food.category,
      price: food.price,
      description: food.description,
      location: food.location || "",
      restaurant: food.restaurant || "",
      image: null,
      imagePreview: food.image ? `http://localhost:5000/uploads/${food.image}` : null,
    });
    setIsEditing(true);
    setMessage('');
    setError('');
  };

  const handleEditRestaurant = (restaurant) => {
    setRestaurantForm({
      id: restaurant._id,
      name: restaurant.name,
      location: restaurant.location,
      description: restaurant.description,
      contactNumber: restaurant.contactNumber,
      email: restaurant.email,
    });
    setIsEditingRestaurant(true);
    setMessage('');
    setError('');
  };

  const handleDeleteFood = async (id) => {
    if (window.confirm("Are you sure you want to delete this food item?")) {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/foods/${id}`, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          setMessage('🗑️ Food deleted successfully.');
          fetchFoods();
        } else {
          throw new Error('Failed to delete food');
        }
      } catch (error) {
        console.error("Error deleting food:", error);
        setError('❌ Failed to delete food.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteRestaurant = async (id) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          setMessage('🗑️ Restaurant deleted successfully.');
          fetchRestaurants();
        } else {
          throw new Error('Failed to delete restaurant');
        }
      } catch (error) {
        console.error("Error deleting restaurant:", error);
        setError('❌ Failed to delete restaurant.');
      } finally {
        setLoading(false);
      }
    }
  };

  const getLocationName = (locationId) => {
    const location = locations.find(loc => loc._id === locationId);
    return location ? location.name : "Unknown Location";
  };

  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find(rest => rest._id === restaurantId);
    return restaurant ? restaurant.name : "No Restaurant";
  };

  return (
    <div className="p-8 text-white bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">Food & Restaurant Management</h2>
      
      {/* Loading and Message Display (like in NowPlayingAdmin) */}
      {loading && <p className="text-yellow-400 text-center mb-4">Loading...</p>}
      {message && <div className="text-green-400 mb-4 text-center">{message}</div>}
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      
      {/* Tab Navigation */}
      <div className="flex mb-6 border-b border-gray-700">
        <button
          onClick={() => setActiveTab("foods")}
          className={`px-4 py-2 mr-2 rounded-t-lg transition ${
            activeTab === "foods" 
              ? "bg-blue-600 text-white" 
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Food Management
        </button>
        <button
          onClick={() => setActiveTab("restaurants")}
          className={`px-4 py-2 rounded-t-lg transition ${
            activeTab === "restaurants" 
              ? "bg-green-600 text-white" 
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Restaurant Management
        </button>
      </div>

      {/* Food Management Tab */}
      {activeTab === "foods" && (
        <>
          <div className="bg-gray-800 p-6 rounded-xl mb-6 max-w-xl mx-auto">
            <h3 className="text-lg font-semibold mb-4">{isEditing ? "Edit Food" : "Add Food"}</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                name="name" 
                placeholder="Food Name" 
                value={form.name} 
                onChange={handleInputChange} 
                className="w-full p-2 rounded bg-gray-700 text-white" 
                required
              />
              <select 
                name="category" 
                value={form.category} 
                onChange={handleInputChange} 
                className="w-full p-2 rounded bg-gray-700 text-white"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>
              <input 
                type="number" 
                name="price" 
                placeholder="Price" 
                value={form.price} 
                onChange={handleInputChange} 
                className="w-full p-2 rounded bg-gray-700 text-white" 
                required
              />
              <select 
                name="location" 
                value={form.location} 
                onChange={handleInputChange} 
                className="w-full p-2 rounded bg-gray-700 text-white"
                required
              >
                <option value="">Select Location</option>
                {locations.map((location) => (
                  <option key={location._id} value={location._id}>{location.name}</option>
                ))}
              </select>
              <select 
                name="restaurant" 
                value={form.restaurant} 
                onChange={handleInputChange} 
                className="w-full p-2 rounded bg-gray-700 text-white"
              >
                <option value="">Select Restaurant (Optional)</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant._id} value={restaurant._id}>{restaurant.name}</option>
                ))}
              </select>
              <textarea 
                name="description" 
                placeholder="Description" 
                value={form.description} 
                onChange={handleInputChange} 
                className="w-full p-2 rounded bg-gray-700 text-white"
                required
              ></textarea>
              
              {/* Image Preview (like in NowPlayingAdmin) */}
              {form.imagePreview && (
                <div className="mb-2">
                  <p className="text-sm text-gray-400">Preview:</p>
                  <img src={form.imagePreview} alt="Preview" className="w-full h-40 object-cover rounded" />
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="w-full p-2 rounded bg-gray-700 text-white" 
              />
            </div>

            <div className="mt-6 flex space-x-4">
              <button 
                onClick={handleSaveFood} 
                className={`flex-1 px-4 py-2 rounded-lg font-bold ${isEditing ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"}`}
                disabled={loading}
              >
                {isEditing ? "Update" : "Add"}
              </button>
              {isEditing && (
                <button 
                  onClick={resetForm} 
                  className="flex-1 bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg"
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foods.map((food) => (
              <div key={food._id} className="bg-gray-800 rounded-lg p-4 shadow-md flex flex-col">
                <img 
                  src={`http://localhost:5000/uploads/${food.image}`} 
                  alt={food.name} 
                  className="h-40 object-cover rounded mb-4" 
                />
                <h4 className="text-xl font-bold">{food.name}</h4>
                <p className="text-sm text-blue-400 mb-1">{food.category}</p>
                <div className="flex items-center text-sm text-green-400 mb-1">
                  <MapPin className="mr-1 w-4 h-4" />
<p>{food.location?.name || 'Unknown Location'}</p>
                </div>
                {food.restaurant && (
                  <p className="text-sm text-purple-400 mb-1">
                    🍽️<p>{food.restaurant?.name || 'No Restaurant'}</p>

                  </p>
                )}
                <p className="text-gray-400 mb-2">{food.description}</p>
                <p className="font-semibold mb-4">₹ {food.price}</p>
                <div className="flex space-x-2 mt-auto">
                  <button 
                    onClick={() => handleEditFood(food)} 
                    className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteFood(food._id)} 
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Restaurant Management Tab */}
      {activeTab === "restaurants" && (
        <>
          <div className="bg-gray-800 p-6 rounded-xl mb-6 max-w-xl mx-auto">
            <h3 className="text-lg font-semibold mb-4">
              {isEditingRestaurant ? "Edit Restaurant" : "Add Restaurant"}
            </h3>
            <div className="space-y-4">
              <input 
                type="text" 
                name="name" 
                placeholder="Restaurant Name" 
                value={restaurantForm.name} 
                onChange={handleRestaurantInputChange} 
                className="w-full p-2 rounded bg-gray-700 text-white" 
                required
              />
              <select 
                name="location" 
                value={restaurantForm.location} 
                onChange={handleRestaurantInputChange} 
                className="w-full p-2 rounded bg-gray-700 text-white"
                required
              >
                <option value="">Select Location</option>
                {locations.map((location) => (
                  <option key={location._id} value={location._id}>{location.name}</option>
                ))}
              </select>
              <input 
                type="tel" 
                name="contactNumber" 
                placeholder="Contact Number" 
                value={restaurantForm.contactNumber} 
                onChange={handleRestaurantInputChange} 
                className="w-full p-2 rounded bg-gray-700 text-white" 
                required
              />
              <input 
                type="email" 
                name="email" 
                placeholder="Email (Optional)" 
                value={restaurantForm.email} 
                onChange={handleRestaurantInputChange} 
                className="w-full p-2 rounded bg-gray-700 text-white" 
              />
              <textarea 
                name="description" 
                placeholder="Restaurant Description" 
                value={restaurantForm.description} 
                onChange={handleRestaurantInputChange} 
                className="w-full p-2 rounded bg-gray-700 text-white"
              ></textarea>
            </div>

            <div className="mt-6 flex space-x-4">
              <button 
                onClick={handleSaveRestaurant} 
                className={`flex-1 px-4 py-2 rounded-lg font-bold ${isEditingRestaurant ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"}`}
                disabled={loading}
              >
                {isEditingRestaurant ? "Update" : "Add"}
              </button>
              {isEditingRestaurant && (
                <button 
                  onClick={resetRestaurantForm} 
                  className="flex-1 bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg"
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div key={restaurant._id} className="bg-gray-800 rounded-lg p-4 shadow-md flex flex-col">
                <div className="mb-4">
                  <h4 className="text-xl font-bold text-green-400">{restaurant.name}</h4>
                  <div className="flex items-center text-sm text-blue-400 mb-2">
                    <MapPin className="mr-1 w-4 h-4" />
                    {getLocationName(restaurant.location)}
                  </div>
                  <p className="text-gray-400 mb-2">{restaurant.description}</p>
                  <p className="text-sm text-yellow-400">📞 {restaurant.contactNumber}</p>
                  {restaurant.email && (
                    <p className="text-sm text-purple-400">✉️ {restaurant.email}</p>
                  )}
                </div>
                <div className="flex space-x-2 mt-auto">
                  <button 
                    onClick={() => handleEditRestaurant(restaurant)} 
                    className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteRestaurant(restaurant._id)} 
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FoodManagement;