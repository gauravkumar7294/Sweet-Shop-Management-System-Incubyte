import React, { useState, useContext } from 'react';
import { styles } from '../styles/styles.js';
import { AuthContext } from '../contexts/AuthContext';

const SweetFormModal = ({ sweet, onClose, onSave }) => {
    // Get the auth token from context to pass with the save request
    const { token } = useContext(AuthContext);
    
    // Initialize form state. If we are editing a sweet, pre-fill the form with its data.
    const [formData, setFormData] = useState({ 
        name: '', 
        category: '', 
        price: '', 
        quantity: '', 
        imageUrl: '', 
        ...sweet 
    });
  
    // Update state when any form field changes
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  
    // Handle the form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        // Ensure price and quantity are numbers before saving
        const dataToSave = { 
            ...formData, 
            price: parseFloat(formData.price), 
            quantity: parseInt(formData.quantity, 10) 
        };
        // Call the onSave function passed down from the Dashboard
        await onSave(dataToSave, token);
        onClose(); // Close the modal on success
      } catch (error) {
        // Show an alert if saving fails
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
            <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL (optional)" className={styles.input} />
            <div className="flex justify-end space-x-4 pt-4">
              <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
              <button type="submit" className={styles.button}>Save</button>
            </div>
          </form>
        </div>
      </div>
    );
};

export default SweetFormModal;

