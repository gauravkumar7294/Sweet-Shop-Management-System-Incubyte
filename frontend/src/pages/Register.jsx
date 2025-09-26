import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "", role: "CUSTOMER", adminSecretKey: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      window.location.href = "/login";
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-red-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-6">🎂 Register</h2>
        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded-lg"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded-lg"
          required
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded-lg"
        >
          <option value="CUSTOMER">Customer</option>
          <option value="ADMIN">Admin</option>
        </select>
        {form.role === "ADMIN" && (
          <input
            type="text"
            name="adminSecretKey"
            placeholder="Admin Secret Key"
            value={form.adminSecretKey}
            onChange={handleChange}
            className="w-full mb-4 px-3 py-2 border rounded-lg"
          />
        )}
        <button
          type="submit"
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg transition"
        >
          Register
        </button>
        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <a href="/login" className="text-pink-600 font-semibold">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
