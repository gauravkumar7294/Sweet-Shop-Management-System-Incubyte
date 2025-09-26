import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [sweets, setSweets] = useState([]);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");

  const fetchSweets = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sweets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSweets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async () => {
    if (!search) return fetchSweets();
    try {
      const res = await axios.get(`http://localhost:5000/api/sweets/search?q=${search}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSweets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-red-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🍭 Sweet Shop Dashboard</h1>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>

      <div className="flex mb-6">
        <input
          type="text"
          placeholder="Search sweets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-l-lg"
        />
        <button
          onClick={handleSearch}
          className="bg-pink-500 text-white px-4 rounded-r-lg"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sweets.map((sweet) => (
          <div key={sweet.id} className="bg-white p-4 rounded-2xl shadow hover:shadow-xl transition">
            <img
              src={sweet.imageUrl || "https://via.placeholder.com/200"}
              alt={sweet.name}
              className="w-full h-40 object-cover rounded-lg mb-3"
            />
            <h3 className="text-xl font-semibold">{sweet.name}</h3>
            <p className="text-gray-600">{sweet.category}</p>
            <p className="mt-2 font-bold text-pink-600">${sweet.price.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Stock: {sweet.quantity}</p>
            <button
              className="mt-3 w-full bg-yellow-400 hover:bg-yellow-500 text-white py-2 rounded-lg"
              onClick={async () => {
                try {
                  await axios.post(
                    `http://localhost:5000/api/sweets/${sweet.id}/purchase`,
                    { quantity: 1 },
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  fetchSweets();
                } catch (err) {
                  alert(err.response?.data?.message || "Purchase failed");
                }
              }}
            >
              Buy 1
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
