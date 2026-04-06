import client from './client';

export const getEnquetes = () => client.get('/enquetes');
export const getEnquete = (id) => client.get(`/enquetes/${id}`);
export const createEnquete = (data) => client.post('/enquetes', data);
export const updateEnquete = (id, data) => client.put(`/enquetes/${id}`, data);
export const lancerEnquete = (id) => client.post(`/enquetes/${id}/lancer`);
export const cloturerEnquete = (id) => client.post(`/enquetes/${id}/cloturer`);
export const getReponses = (id) => client.get(`/enquetes/${id}/reponses`);
export const getStatistiques = (id) => client.get(`/enquetes/${id}/statistiques`);
export const getPublicEnquete = (token) => client.get(`/enquetes/public/${token}`);
export const submitEnquete = (token, reponses) =>
  client.post(`/enquetes/public/${token}`, { reponses });
