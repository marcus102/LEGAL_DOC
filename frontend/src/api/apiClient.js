import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';
// const API_BASE_URL = 'https://945a-197-239-80-71.ngrok-free.app';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadDocument = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

export const getDocument = async (docId) => {
  try {
    const response = await apiClient.get(`/documents/${docId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch document:', error);
    throw error;
  }
};

export const listDocuments = async () => {
  try {
    const response = await apiClient.get('/documents/');
    return response.data;
  } catch (error) {
    console.error('Failed to list documents:', error);
    throw error;
  }
};

export const searchDocuments = async (query, docType) => {
  try {
    const params = new URLSearchParams();
    params.append('query', query);
    if (docType) {
      params.append('doc_type', docType);
    }
    
    const response = await apiClient.get(`/search/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Search failed:', error);
    throw error;
  }
};