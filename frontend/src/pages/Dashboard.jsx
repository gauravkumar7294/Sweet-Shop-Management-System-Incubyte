import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { apiService } from '../services/apiService';
import { styles } from '../styles/styles';
import SweetCard from '../components/SweetCard';
import SweetFormModal from '../components/SweetFormModal';

const Dashboard = () => {
    const { user, token, logout } = useContext(AuthContext);
    const [sweets, setSweets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSweet, setEditingSweet] = useState(null);

    const isAdmin = user?.role === 'ADMIN';

    // Function to fetch sweets from the backend
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

    // Fetch sweets when the component mounts or the token changes
    useEffect(() => {
      if (token) {
        fetchSweets();
      }
    }, [token]);

    const handlePurchase = async (sweetId) => {
        try {
            await apiService.purchaseSweet(sweetId, 1, token);
            alert('Purchase successful!');
            fetchSweets(); // Re-fetch to update the quantity
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
        fetchSweets(); // Refresh list after saving
    };

    const handleDeleteSweet = async (sweetId) => {
        if (window.confirm('Are you sure you want to delete this sweet?')) {
            try {
                await apiService.deleteSweet(sweetId, token);
                fetchSweets(); // Refresh the list
            } catch (error) {
                alert(`Deletion Error: ${error.message}`);
            }
        }
    };

    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className="text-4xl font-bold">Sweet Shop</h1>
          <div>
            <span className="mr-4">Welcome, {user?.email}!</span>
            <button onClick={logout} className="bg-white text-pink-500 hover:bg-pink-100 font-bold py-2 px-4 rounded-lg">
              Logout
            </button>
          </div>
        </header>

        {isAdmin && (
          <div className="mb-8 text-center">
            <button onClick={() => handleOpenModal()} className={styles.button}>
              + Add New Sweet
            </button>
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

export default Dashboard;