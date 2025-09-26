// --- API CONFIGURATION ---
const API_BASE_URL = 'http://localhost:3001/api'; // Ensure your backend is running on this port

// --- API SERVICE ---
// A centralized object to handle all API calls to the backend.
const apiService = {
  // A helper function to perform fetch requests, automatically adding the auth token.
  request: async (path, method = 'GET', data = null, token) => {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, options);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    if (response.status === 204 || method === 'DELETE') {
      return { success: true };
    }
    return response.json();
  },

  // Auth endpoints
  register: (email, password) => apiService.request('/auth/register', 'POST', { email, password }),
  login: (email, password) => apiService.request('/auth/login', 'POST', { email, password }),
  
  // Sweets endpoints
  getSweets: (token) => apiService.request('/sweets', 'GET', null, token),
  addSweet: (sweetData, token) => apiService.request('/sweets', 'POST', sweetData, token),
  updateSweet: (id, sweetData, token) => apiService.request(`/sweets/${id}`, 'PUT', sweetData, token),
  deleteSweet: (id, token) => apiService.request(`/sweets/${id}`, 'DELETE', null, token),
  
  // Inventory endpoints
  purchaseSweet: (id, quantity, token) => apiService.request(`/sweets/${id}/purchase`, 'POST', { quantity }, token),
};

export default apiService;