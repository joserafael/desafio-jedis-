import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:4000/api', // Adjust this URL to match your backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authorization token
api.interceptors.request.use(
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

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};

// Posts API calls
export const postsAPI = {
  getAllPosts: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page);
    if (params.page_size) searchParams.append('page_size', params.page_size);
    if (params.title) searchParams.append('title', params.title);
    if (params.draft !== undefined) searchParams.append('draft', params.draft);
    if (params.user_id) searchParams.append('user_id', params.user_id);
    if (params.sort_by) searchParams.append('sort_by', params.sort_by);
    
    const queryString = searchParams.toString();
    return api.get(`/posts${queryString ? `?${queryString}` : ''}`);
  },
  getPostById: (id) => api.get(`/posts/${id}`),
  createPost: (postData) => api.post('/posts', postData),
  updatePost: (id, postData) => api.put(`/posts/${id}`, postData),
  deletePost: (id) => api.delete(`/posts/${id}`),
  getMyPosts: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page);
    if (params.page_size) searchParams.append('page_size', params.page_size);
    if (params.title) searchParams.append('title', params.title);
    if (params.draft !== undefined) searchParams.append('draft', params.draft);
    if (params.sort_by) searchParams.append('sort_by', params.sort_by);
    
    const queryString = searchParams.toString();
    return api.get(`/posts/my-posts${queryString ? `?${queryString}` : ''}`);
  },
  getPublishedPosts: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page);
    if (params.page_size) searchParams.append('page_size', params.page_size);
    if (params.title) searchParams.append('title', params.title);
    if (params.sort_by) searchParams.append('sort_by', params.sort_by);
    
    const queryString = searchParams.toString();
    return api.get(`/posts_published${queryString ? `?${queryString}` : ''}`);
  },
  getPublishedPostById: (id) => api.get(`/posts_published/${id}`),
};

// Users API calls
export const usersAPI = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export default api;
