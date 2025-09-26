import React from 'react';
import { styles } from '../styles/styles.js';

const SweetCard = ({ sweet, onPurchase, isAdmin, onEdit, onDelete }) => (
  <div className={styles.card}>
    <img 
      src={sweet.imageUrl || `https://placehold.co/600x400/f871b6/ffffff?text=${encodeURIComponent(sweet.name)}`} 
      alt={sweet.name} 
      className="w-full h-48 object-cover" 
      // Add a fallback in case the image link is broken
      onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/f871b6/ffffff?text=Image+Not+Found`; }}
    />
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-2 truncate">{sweet.name}</h3>
      <p className="text-gray-600 mb-1">Category: {sweet.category}</p>
      <p className="text-lg font-semibold text-pink-500 mb-2">${parseFloat(sweet.price).toFixed(2)}</p>
      <p className={`text-sm mb-4 font-medium ${sweet.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
        {sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Out of Stock'}
      </p>
      <div className="flex items-center justify-between">
        <button 
          onClick={() => onPurchase(sweet.id)} 
          disabled={sweet.quantity === 0} 
          className={styles.button}
        >
          Purchase
        </button>
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

export default SweetCard;
