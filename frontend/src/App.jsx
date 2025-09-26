/*
import React, { useState, useContext } from 'react';
import { AuthProvider, AuthContext } from './contexts/AuthContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import Dashboard from './pages/Dashboard.jsx';

// This component decides which page to show based on the user's login state.
const MainContent = () => {
  const { user } = useContext(AuthContext);
  const [isRegistering, setIsRegistering] = useState(false);

  // If the user is not logged in, show either the Login or Register page.
  if (!user) {
    return isRegistering 
      ? <RegisterPage onSwitchToLogin={() => setIsRegistering(false)} /> 
      : <LoginPage onSwitchToRegister={() => setIsRegistering(true)} />;
  }
  
  // If the user is logged in, show the main dashboard.
  return <Dashboard />;
};


// This is the root component of your application.
function App() {
  return (
    // The AuthProvider wraps the entire application, making user data
    // available to all components.
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

export default App;

*/

import React, { useState, useEffect, createContext, useContext } from 'react';

// --- STYLING CONSTANTS ---
// Using an object for styles to keep everything self-contained.
const styles = {
  container: `container mx-auto p-4 md:p-8`,
  header: `bg-pink-500 text-white p-6 shadow-md rounded-lg mb-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left`,
  card: `bg-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:scale-105`,
  button: `bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed`,
  input: `w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-shadow`,
  modalOverlay: `fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4`,
  modalContent: `bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md m-4 transform transition-all`,
};

// --- API CONFIGURATION ---
const API_BASE_URL = 'http://localhost:3001/api'; // Ensure your backend is running on this port

// --- AUTHENTICATION CONTEXT ---
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: payload.userId, email: payload.email, role: payload.role });
      } catch (e) {
        console.error("Invalid token:", e);
        logout();
      }
    } else {
        setUser(null);
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- API SERVICE ---
const apiService = {
  request: async (path, method = 'GET', data = null, token) => {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;
    if (data) options.body = JSON.stringify(data);

    const response = await fetch(`${API_BASE_URL}${path}`, options);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    if (response.status === 204 || method === 'DELETE') return { success: true };
    return response.json();
  },
  register: (email, password) => apiService.request('/auth/register', 'POST', { email, password }),
  login: (email, password) => apiService.request('/auth/login', 'POST', { email, password }),
  getSweets: (token) => apiService.request('/sweets', 'GET', null, token),
  addSweet: (sweetData, token) => apiService.request('/sweets', 'POST', sweetData, token),
  updateSweet: (id, sweetData, token) => apiService.request(`/sweets/${id}`, 'PUT', sweetData, token),
  deleteSweet: (id, token) => apiService.request(`/sweets/${id}`, 'DELETE', null, token),
  purchaseSweet: (id, quantity, token) => apiService.request(`/sweets/${id}/purchase`, 'POST', { quantity }, token),
};

// --- UI COMPONENTS ---

const LoginPage = ({ onSwitchToRegister }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await apiService.login(email, password);
      login(data.token);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-100">
      <div className={`${styles.modalContent} space-y-6`}>
        <h2 className="text-3xl font-bold text-center text-pink-500">Welcome Back!</h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.input} required />
          <button type="submit" className={`${styles.button} w-full`}>Login</button>
        </form>
        <p className="text-center">
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister} className="text-pink-500 hover:underline font-semibold">Register</button>
        </p>
      </div>
    </div>
  );
};

const RegisterPage = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await apiService.register(email, password);
      setMessage('Registration successful! Please log in.');
      setTimeout(onSwitchToLogin, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-100">
      <div className={`${styles.modalContent} space-y-6`}>
        <h2 className="text-3xl font-bold text-center text-pink-500">Create Your Account</h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center">{error}</p>}
        {message && <p className="bg-green-100 text-green-700 p-3 rounded-lg text-center">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.input} required />
          <button type="submit" className={`${styles.button} w-full`}>Register</button>
        </form>
        <p className="text-center">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="text-pink-500 hover:underline font-semibold">Login</button>
        </p>
      </div>
    </div>
  );
};

const SweetCard = ({ sweet, onPurchase, isAdmin, onEdit, onDelete }) => (
  <div className={styles.card}>
    <img src={sweet.imageUrl || `https://placehold.co/600x400/f871b6/ffffff?text=${encodeURIComponent(sweet.name)}`} alt={sweet.name} className="w-full h-48 object-cover" />
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-2 truncate">{sweet.name}</h3>
      <p className="text-gray-600 mb-1">Category: {sweet.category}</p>
      <p className="text-lg font-semibold text-pink-500 mb-2">${parseFloat(sweet.price).toFixed(2)}</p>
      <p className={`text-sm mb-4 font-medium ${sweet.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
        {sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Out of Stock'}
      </p>
      <div className="flex items-center justify-between">
        <button onClick={() => onPurchase(sweet.id)} disabled={sweet.quantity === 0} className={styles.button}>Purchase</button>
        {isAdmin && (
          <div className="flex space-x-2">
            <button onClick={() => onEdit(sweet)} className="text-blue-500 hover:text-blue-700 font-semibold">Edit</button>
            <button onClick={() => onDelete(sweet.id)} className="text-red-500 hover:text-red-700 font-semibold">Delete</button>
          </div>
        )}
      </div>
    </div>
  </div>
);

const SweetFormModal = ({ sweet, onClose, onSave }) => {
    const { token } = useContext(AuthContext);
    const [formData, setFormData] = useState({ name: '', category: '', price: '', quantity: '', imageUrl: '', ...sweet });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const dataToSave = { ...formData, price: parseFloat(formData.price), quantity: parseInt(formData.quantity, 10) };
        await onSave(dataToSave, token);
        onClose();
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    };
  
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h2 className="text-2xl font-bold mb-6">{sweet?.id ? 'Edit Sweet' : 'Add New Sweet'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Sweet Name" className={styles.input} required />
            <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" className={styles.input} required />
            <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} placeholder="Price" className={styles.input} required />
            <input name="quantity" type="number" value={formData.quantity} onChange={handleChange} placeholder="Quantity" className={styles.input} required />
            <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL" className={styles.input} />
            <div className="flex justify-end space-x-4 pt-4">
              <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
              <button type="submit" className={styles.button}>Save</button>
            </div>
          </form>
        </div>
      </div>
    );
};

const Dashboard = () => {
    const { user, token, logout } = useContext(AuthContext);
    const [sweets, setSweets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSweet, setEditingSweet] = useState(null);
  
    const isAdmin = user?.role === 'ADMIN';
  
    const fetchSweets = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await apiService.getSweets(token);
        setSweets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      if (token) fetchSweets();
    }, [token]);

    const handlePurchase = async (sweetId) => {
        try {
            await apiService.purchaseSweet(sweetId, 1, token);
            alert('Purchase successful!');
            fetchSweets();
        } catch (error) {
            alert(`Purchase Error: ${error.message}`);
        }
    };

    const handleOpenModal = (sweet = null) => {
        setEditingSweet(sweet);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSweet(null);
    };

    const handleSaveSweet = async (sweetData, authToken) => {
        const action = sweetData.id 
            ? apiService.updateSweet(sweetData.id, sweetData, authToken)
            : apiService.addSweet(sweetData, authToken);
        await action;
        fetchSweets();
    };

    const handleDeleteSweet = async (sweetId) => {
        if (window.confirm('Are you sure you want to delete this sweet?')) {
            try {
                await apiService.deleteSweet(sweetId, token);
                fetchSweets();
            } catch (error) {
                alert(`Deletion Error: ${error.message}`);
            }
        }
    };
  
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className="text-4xl font-bold mb-4 md:mb-0">Sweet Shop</h1>
          <div className="mt-4 md:mt-0">
            <span className="mr-4">Welcome, {user?.email}!</span>
            <button onClick={logout} className="bg-white text-pink-500 hover:bg-pink-100 font-bold py-2 px-4 rounded-lg">Logout</button>
          </div>
        </header>
  
        {isAdmin && (
          <div className="mb-8 text-center">
            <button onClick={() => handleOpenModal()} className={styles.button}>+ Add New Sweet</button>
          </div>
        )}
        
        {isLoading && <p className="text-center text-xl">Loading sweets...</p>}
        {error && <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>}
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {!isLoading && sweets.map(sweet => (
            <SweetCard 
              key={sweet.id} 
              sweet={sweet} 
              onPurchase={handlePurchase}
              isAdmin={isAdmin}
              onEdit={handleOpenModal}
              onDelete={handleDeleteSweet}
            />
          ))}
        </div>

        {isModalOpen && (
            <SweetFormModal
                sweet={editingSweet}
                onClose={handleCloseModal}
                onSave={handleSaveSweet}
            />
        )}
      </div>
    );
};

// --- MAIN APP COMPONENT ---

const MainContent = () => {
  const { user } = useContext(AuthContext);
  const [isRegistering, setIsRegistering] = useState(false);

  if (!user) {
    return isRegistering 
      ? <RegisterPage onSwitchToLogin={() => setIsRegistering(false)} /> 
      : <LoginPage onSwitchToRegister={() => setIsRegistering(true)} />;
  }
  
  return <Dashboard />;
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
