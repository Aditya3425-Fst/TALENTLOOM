import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

const api = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:4000":"/",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  signup: async (data) => {
    const response = await api.post('/api/auth/signup', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  login: async (data) => {
    const response = await api.post('/api/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/api/auth/logout');
    localStorage.removeItem('token');
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};

// Posts API
export const postsAPI = {
  createPost: async (data) => {
    const response = await api.post('/api/posts', data);
    return response.data;
  },

  getPosts: async (params = {}) => {
    const response = await api.get('/api/posts', { params });
    return response.data;
  },

  getPostById: async (id) => {
    const response = await api.get(`/api/posts/${id}`);
    return response.data;
  },

  upvotePost: async (id) => {
    const response = await api.post(`/api/posts/${id}/upvote`);
    return response.data;
  },

  createReply: async (postId, data) => {
    const response = await api.post(`/api/posts/${postId}/replies`, data);
    return response.data;
  },

  updatePost: async (postId, data) => {
    const response = await api.put(`/api/posts/${postId}`, data);
    return response.data;
  },

  deletePost: async (postId) => {
    const response = await api.delete(`/api/posts/${postId}`);
    return response.data;
  },

  updateReply: async (replyId, data) => {
    const response = await api.put(`/api/posts/replies/${replyId}`, data);
    return response.data;
  },

  deleteReply: async (replyId) => {
    const response = await api.delete(`/api/posts/replies/${replyId}`);
    return response.data;
  },
};

export default api;


