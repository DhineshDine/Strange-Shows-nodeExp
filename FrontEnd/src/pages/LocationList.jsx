import { useEffect, useState } from "react";
import axios from "axios";

const LocationsList = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/locations");
      setLocations(res.data);
    } catch (err) {
      console.error("Fetch locations error:", err);
      setError("Unable to fetch locations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();

    const interval = setInterval(() => {
      fetchLocations();
    }, 10000); // Fetch every 10 sec

    return () => clearInterval(interval); // Cleanup
  }, []);

  const handleLocationSelect = (loc) => {
    if (loc.comingSoon) return;

    localStorage.setItem("selectedLocation", JSON.stringify(loc));
    alert(`Selected location: ${loc.name}`);
  };

  if (loading) return <p>Loading locations...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Select Your City</h2>
        <button
          onClick={fetchLocations}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh Locations
        </button>
      </div>

      {locations.length === 0 ? (
        <p>No locations found!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {locations.map((loc) => (
            <div
              key={loc._id}
              className={`p-4 border rounded cursor-pointer ${
                loc.comingSoon ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => handleLocationSelect(loc)}
            >
              <h3 className="text-lg font-semibold">{loc.name}</h3>
              <p className="text-sm text-gray-500">{loc.address}</p>
              {loc.comingSoon && (
                <span className="text-yellow-500">Coming Soon</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationsList;
