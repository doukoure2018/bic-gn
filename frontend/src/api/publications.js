import client from './client';

export const getPublications = (params) => client.get('/publications', { params });
export const getPublication = (id) => client.get(`/publications/${id}`);
export const createPublication = (data) => client.post('/publications', data);
export const updatePublication = (id, data) => client.put(`/publications/${id}`, data);
export const deletePublication = (id) => client.delete(`/publications/${id}`);
export const publierPublication = (id) => client.post(`/publications/${id}/publier`);
