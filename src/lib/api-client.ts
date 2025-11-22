import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export const authAPI = {
  register: (data: { username: string; email: string; password: string; phone?: string; nickname?: string }) =>
    apiClient.post('/auth/register', data),
  
  login: (data: { username: string; password: string }) =>
    apiClient.post('/auth/login', data),
  
  getProfile: () =>
    apiClient.get('/auth/profile'),
  
  updateProfile: (data: any) =>
    apiClient.put('/auth/profile', data),
};

export const productAPI = {
  getAll: () =>
    apiClient.get('/products'),
  
  getById: (id: string) =>
    apiClient.get(`/products/${id}`),
  
  create: (data: any) =>
    apiClient.post('/products', data),
  
  update: (id: string, data: any) =>
    apiClient.put(`/products/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete(`/products/${id}`),
  
  getLowStock: () =>
    apiClient.get('/products/low-stock'),
};

export const warehouseAPI = {
  getAll: () =>
    apiClient.get('/warehouses'),
  
  create: (data: any) =>
    apiClient.post('/warehouses', data),
  
  update: (id: string, data: any) =>
    apiClient.put(`/warehouses/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete(`/warehouses/${id}`),
};

export const categoryAPI = {
  getAll: () =>
    apiClient.get('/categories'),
  
  create: (data: any) =>
    apiClient.post('/categories', data),
  
  update: (id: string, data: any) =>
    apiClient.put(`/categories/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete(`/categories/${id}`),
};

export const stockAPI = {
  getLedger: (params?: any) =>
    apiClient.get('/stock/ledger', { params }),
  
  recordReceipt: (data: any) =>
    apiClient.post('/stock/receipt', data),
  
  recordDelivery: (data: any) =>
    apiClient.post('/stock/delivery', data),
  
  recordAdjustment: (data: any) =>
    apiClient.post('/stock/adjustment', data),
  
  getDashboard: () =>
    apiClient.get('/stock/dashboard'),
};

export default apiClient;
