import client from './client';

export const getActualites = (params) => client.get('/actualites', { params });
export const getActualite = (slug) => client.get(`/actualites/${slug}`);
export const createActualite = (data) => client.post('/actualites', data);
export const updateActualite = (id, data) => client.put(`/actualites/${id}`, data);
export const deleteActualite = (id) => client.delete(`/actualites/${id}`);
export const publierActualite = (id) => client.post(`/actualites/${id}/publier`);
